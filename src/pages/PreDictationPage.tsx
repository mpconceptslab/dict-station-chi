import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useSpeech } from '../hooks/useSpeech';
import { getWordList, saveSession, saveCorrection, generateId, markWordsAsStudied, getVoiceSpeed } from '../utils/storage';
import { selectRandomWords, wordsToParagraph } from '../utils/wordParser';
import { compareText } from '../utils/textComparison';
import TopNavBar from '../components/TopNavBar';
import SpeedButton from '../components/SpeedButton';
import { usePrefs } from '../context/PrefsContext';

export default function PreDictationPage() {
  const navigate = useNavigate();
  const { t } = usePrefs();
  const { listId } = useParams<{ listId: string }>();
  const [searchParams] = useSearchParams();
  const count = Number(searchParams.get('count') || 5);
  const mode = searchParams.get('mode') || '';
  const pageTitle = mode === 'paragraphs' ? t('pre.titleWriteParagraph') : t('pre.titleParagraphDictation');
  const { speakWordsSequentially, speakParagraph, isSpeaking, isPaused } = useSpeech();

  const [words, setWords] = useState<string[]>([]);
  const [paragraphText, setParagraphText] = useState('');
  const [hasParagraph, setHasParagraph] = useState(false);
  const [listName, setListName] = useState('');
  const [voice, setVoice] = useState<string | undefined>();
  const [readingLang, setReadingLang] = useState<string>('');
  const [userText, setUserText] = useState('');
  const [started, setStarted] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [showReviewDialog, setShowReviewDialog] = useState(true);
  const [showReview, setShowReview] = useState(false);
  const [results, setResults] = useState<{
    comparison: ReturnType<typeof compareText>;
    paragraph: string;
  } | null>(null);

  const controllerRef = useRef<{
    start: () => void; pause: () => void; resume: () => void; stop: () => void;
    replayLast: () => void;
  } | null>(null);

  const previewControllerRef = useRef<{
    start: () => void; pause: () => void; resume: () => void; stop: () => void;
    replayLast: () => void;
  } | null>(null);

  useEffect(() => {
    loadWords();
  }, [listId]);

  // For paragraph mode, skip review dialog and go straight to dictation once content is loaded
  useEffect(() => {
    if (mode === 'paragraphs' && words.length > 0 && !started) {
      setShowReviewDialog(false);
      setShowReview(false);
      setStarted(true);
      const lang = readingLang || voice;
      if (hasParagraph) {
        const controller = speakParagraph(paragraphText, getVoiceSpeed(), lang);
        controllerRef.current = controller;
        controller.start();
      } else {
        const controller = speakWordsSequentially(words, getVoiceSpeed(), 800, lang);
        controllerRef.current = controller;
        controller.start();
      }
    }
  }, [mode, words.length]);

  // Set a sensible default reading language once content is loaded.
  useEffect(() => {
    const sample = `${paragraphText} ${words.join(' ')}`;
    if (!sample.trim()) return;
    const hChinese = /[\u4e00-\u9fff\u3400-\u4dbf]/.test(sample);
    const hEnglish = /[a-zA-Z]/.test(sample);
    setReadingLang(prev => {
      if (prev) return prev;
      if (hEnglish && !hChinese) return 'en-US';
      if (voice === 'zh-CN') return 'zh-CN';
      return 'zh-HK';
    });
  }, [words, paragraphText, voice]);

  async function loadWords() {
    if (!listId) return;
    const list = await getWordList(listId);
    if (!list) {
      navigate('/home');
      return;
    }
    setListName(list.name);
    setVoice(list.voice);

    // Check if specific paragraphs were passed via URL
    const paragraphsParam = searchParams.get('paragraphs');
    if (paragraphsParam) {
      try {
        const passedParagraphs: string[] = JSON.parse(decodeURIComponent(paragraphsParam));
        if (passedParagraphs.length > 0) {
          const fullParagraph = passedParagraphs.join(' ');
          setParagraphText(fullParagraph);
          setHasParagraph(true);
          const paraWords = fullParagraph.split(/\s+/).filter(w => w.length > 0);
          setWords(paraWords);
          return;
        }
      } catch (e) {
        console.error('Failed to parse paragraphs parameter:', e);
      }
    }

    if (list.paragraphs && list.paragraphs.length > 0) {
      const fullParagraph = list.paragraphs.join(' ');
      setParagraphText(fullParagraph);
      setHasParagraph(true);
      const paraWords = fullParagraph.split(/\s+/).filter(w => w.length > 0);
      setWords(paraWords);
    } else {
      const selected = selectRandomWords(list.words, count);
      setWords(selected);
      setParagraphText(wordsToParagraph(selected));
      setHasParagraph(false);
    }
  }

  function handleStartWithReview() {
    setShowReviewDialog(false);
    setShowReview(true);
  }

  function handleStartDirect() {
    setShowReviewDialog(false);
    setShowReview(false);
    setStarted(true);
    const lang = readingLang || voice;
    if (hasParagraph) {
      const controller = speakParagraph(paragraphText, getVoiceSpeed(), lang);
      controllerRef.current = controller;
      controller.start();
    } else {
      const controller = speakWordsSequentially(words, getVoiceSpeed(), 800, lang);
      controllerRef.current = controller;
      controller.start();
    }
  }

  function handleStartAfterReview() {
    previewControllerRef.current?.stop();
    setShowReview(false);
    setStarted(true);
    const lang = readingLang || voice;
    if (hasParagraph) {
      const controller = speakParagraph(paragraphText, getVoiceSpeed(), lang);
      controllerRef.current = controller;
      controller.start();
    } else {
      const controller = speakWordsSequentially(words, getVoiceSpeed(), 800, lang);
      controllerRef.current = controller;
      controller.start();
    }
  }

  function handlePause() {
    controllerRef.current?.pause();
  }

  function handleResume() {
    controllerRef.current?.resume();
  }

  function handleReplay() {
    controllerRef.current?.replayLast();
  }

  function handlePreviewRead() {
    previewControllerRef.current?.stop();
    const lang = readingLang || voice;
    const controller = hasParagraph
      ? speakParagraph(paragraphText, getVoiceSpeed(), lang)
      : speakWordsSequentially(words, getVoiceSpeed(), 800, lang);
    previewControllerRef.current = controller;
    controller.start();
  }

  function handleSubmit() {
    controllerRef.current?.stop();
    setSubmitted(true);

    const comparison = compareText(userText, paragraphText);
    setResults({ comparison, paragraph: paragraphText });

    const wrongIndices = comparison.results
      .map((r, i) => r.correct ? -1 : i)
      .filter(i => i >= 0);

    const session = {
      id: generateId(),
      wordListId: listId || '',
      wordListName: listName,
      mode: 'pre-dictation' as const,
      words,
      userAnswers: [userText],
      correctAnswers: [paragraphText],
      wrongIndices,
      score: comparison.score,
      totalWords: comparison.totalWords,
      timestamp: Date.now(),
    };
    saveSession(session);

    // Mark words as studied
    if (listId) {
      markWordsAsStudied(listId, words);
    }

    if (wrongIndices.length > 0) {
      const correction = {
        id: generateId(),
        dictationSessionId: session.id,
        wrongWords: wrongIndices.map(i => ({
          word: comparison.results[i].expected,
          userAnswer: comparison.results[i].user,
        })),
        practiceRounds: wrongIndices.map(i => ({ wordIndex: i, attempts: [] })),
      };
      saveCorrection(correction);
    }
  }

  // Determine which reading-language options apply to the content.
  const contentSample = `${paragraphText} ${words.join(' ')}`;
  const hasChinese = /[\u4e00-\u9fff\u3400-\u4dbf]/.test(contentSample);
  const hasEnglish = /[a-zA-Z]/.test(contentSample);
  const showChineseOpts = hasChinese || !hasEnglish; // 廣東話 + 普通話
  const showEnglishOpt = hasEnglish;                 // English

  // Show review dialog first
  if (showReviewDialog && words.length > 0) {
    return (
      <div className="page pre-dictation-page">
        <TopNavBar />
        <h1>{pageTitle}</h1>
        <p className="list-name">{listName}</p>

        <div className="pre-start">
          <p>{t('pre.reviewPrompt')}</p>
          <div className="action-buttons">
            <button className="btn btn-primary btn-large" onClick={handleStartWithReview}>
              {t('pre.reviewYes')}
            </button>
            <button className="btn btn-secondary btn-large" onClick={handleStartDirect}>
              {t('pre.reviewNo')}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Show review content
  if (showReview && words.length > 0) {
    return (
      <div className="page pre-dictation-page">
        <TopNavBar />
        <h1>{mode === 'paragraphs' ? t('pre.titleWriteParagraph') : t('pre.titleReviewParagraph')}</h1>
        <p className="list-name">{listName}</p>

        <div className="review-content">
          <div className="paragraph-display">
            {hasParagraph ? (
              <p>{paragraphText}</p>
            ) : (
              <p>{words.join('、')}</p>
            )}
          </div>

          <div className="language-selection">
            <p className="language-label">{t('pre.langLabel')}</p>
            <div className="language-options">
              {showChineseOpts && (
                <button
                  className={`lang-btn ${readingLang === 'zh-HK' ? 'active' : ''}`}
                  onClick={() => setReadingLang('zh-HK')}
                >
                  {t('lang.cantonese')}
                </button>
              )}
              {showChineseOpts && (
                <button
                  className={`lang-btn ${readingLang === 'zh-CN' ? 'active' : ''}`}
                  onClick={() => setReadingLang('zh-CN')}
                >
                  {t('lang.mandarin')}
                </button>
              )}
              {showEnglishOpt && (
                <button
                  className={`lang-btn ${readingLang === 'en-US' ? 'active' : ''}`}
                  onClick={() => setReadingLang('en-US')}
                >
                  {t('lang.english')}
                </button>
              )}
            </div>
            <button className="btn btn-secondary listen-btn" onClick={handlePreviewRead}>
              <span className="ico">🔊</span> {t('pre.listen')}
            </button>
            <div className="speed-bar">
              <SpeedButton />
            </div>
          </div>

          <button className="btn btn-primary btn-large" onClick={handleStartAfterReview}>
            {t('pre.startAfterReview')}
          </button>
        </div>
      </div>
    );
  }

  if (submitted && results) {
    const { comparison } = results;
    const percentage = Math.round((comparison.score / comparison.totalWords) * 100);

    return (
      <div className="page results-page">
        <TopNavBar />
        <h1>{t('pre.resultTitle')}</h1>

        <div className="score-display">
          <div className={`score-circle ${percentage >= 80 ? 'great' : percentage >= 50 ? 'good' : 'try-again'}`}>
            <span className="score-number">{percentage}%</span>
          </div>
          <p>{t('pre.resultScore', { score: comparison.score, total: comparison.totalWords })}</p>
        </div>

        <div className="paragraph-review">
          <h3>{t('pre.yourAnswer')}</h3>
          <div className="paragraph-comparison">
            {comparison.results.map((r, i) => (
              <span key={i} className={`word-result ${r.correct ? 'correct' : 'wrong'}`}>
                {r.correct ? r.user : <>{r.user}<sub>{r.expected}</sub></>}
              </span>
            ))}
          </div>
        </div>

        <div className="action-buttons">
          <button className="btn btn-primary" onClick={() => navigate('/home')}>{t('pre.backHome')}</button>
          {comparison.results.some(r => !r.correct) && (
            <button className="btn btn-secondary" onClick={() => navigate('/correction')}>
              {t('pre.redoWrong')}
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="page pre-dictation-page">
      <TopNavBar />
      <h1>{pageTitle}</h1>
            
      <div className="language-selection">
        <p className="language-label">{t('pre.langLabel')}</p>
        <div className="language-options">
          {showChineseOpts && (
            <button
              className={`lang-btn ${readingLang === 'zh-HK' ? 'active' : ''}`}
              onClick={() => setReadingLang('zh-HK')}
            >
              {t('lang.cantonese')}
            </button>
          )}
          {showChineseOpts && (
            <button
              className={`lang-btn ${readingLang === 'zh-CN' ? 'active' : ''}`}
              onClick={() => setReadingLang('zh-CN')}
            >
              {t('lang.mandarin')}
            </button>
          )}
          {showEnglishOpt && (
            <button
              className={`lang-btn ${readingLang === 'en-US' ? 'active' : ''}`}
              onClick={() => setReadingLang('en-US')}
            >
              {t('lang.english')}
            </button>
          )}
        </div>
      </div>

      <div className="speed-bar">
        <SpeedButton />
      </div>
      
      <div className="speech-controls">
        <div className={`speech-status ${isSpeaking ? 'speaking' : ''} ${isPaused ? 'paused' : ''}`}>
          {isSpeaking && !isPaused ? <><span className="ico">🔊</span> {t('speech.reading')}</> :
           isPaused ? <><span className="ico">⏸</span> {t('speech.paused')}</> :
           <><span className="ico">⏹</span> {t('speech.notStarted')}</>}
        </div>

        <div className="control-buttons">
          {!isSpeaking && !isPaused ? (
            <button className="btn btn-primary" onClick={handleResume}>
              <span className="ico">▶</span> {t('speech.resume')}
            </button>
          ) : isPaused ? (
            <>
              <button className="btn btn-primary" onClick={handleResume}>
                <span className="ico">▶</span> {t('speech.resume')}
              </button>
              <button className="btn btn-accent" onClick={handleReplay}>
                <span className="ico">🔁</span> {t('speech.replay')}
              </button>
            </>
          ) : (
            <button className="btn btn-warning" onClick={handlePause}>
               {t('speech.pause')}
            </button>
          )}
          <button className="btn btn-outline" onClick={() => controllerRef.current?.stop()}>
             {t('speech.stop')}
          </button>
        </div>
      </div>

      <div className="writing-area">
        <textarea
          value={userText}
          onChange={(e) => setUserText(e.target.value)}
          placeholder={t('speech.placeholder')}
          rows={8}
          autoFocus
        />
      </div>

      <div className="action-buttons">
        <button
          className="btn btn-primary btn-large"
          onClick={handleSubmit}
          disabled={!userText.trim()}
        >
          {t('speech.submit')}
        </button>
      </div>
    </div>
  );
}
