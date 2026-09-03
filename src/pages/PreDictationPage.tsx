import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useSpeech } from '../hooks/useSpeech';
import { getWordList, saveSession, saveCorrection, generateId } from '../utils/storage';
import { selectRandomWords, wordsToParagraph } from '../utils/wordParser';
import { compareText } from '../utils/textComparison';

export default function PreDictationPage() {
  const navigate = useNavigate();
  const { listId } = useParams<{ listId: string }>();
  const [searchParams] = useSearchParams();
  const count = Number(searchParams.get('count') || 5);
  const { speakWordsSequentially, speakParagraph, isSpeaking, isPaused } = useSpeech();

  const [words, setWords] = useState<string[]>([]);
  const [paragraphText, setParagraphText] = useState('');
  const [hasParagraph, setHasParagraph] = useState(false);
  const [listName, setListName] = useState('');
  const [userText, setUserText] = useState('');
  const [started, setStarted] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [results, setResults] = useState<{
    comparison: ReturnType<typeof compareText>;
    paragraph: string;
  } | null>(null);

  const controllerRef = useRef<{
    start: () => void; pause: () => void; resume: () => void; stop: () => void;
    replayLast: () => void;
  } | null>(null);

  useEffect(() => {
    loadWords();
  }, [listId]);

  async function loadWords() {
    if (!listId) return;
    const list = await getWordList(listId);
    if (!list) {
      navigate('/');
      return;
    }
    setListName(list.name);

    // If we have stored paragraphs, use them for pre-dictation
    if (list.paragraphs && list.paragraphs.length > 0) {
      const fullParagraph = list.paragraphs.join(' ');
      setParagraphText(fullParagraph);
      setHasParagraph(true);
      // Extract words from the paragraph for comparison later
      const paraWords = fullParagraph.split(/\s+/).filter(w => w.length > 0);
      setWords(paraWords);
    } else {
      // Fall back to joining word list
      const selected = selectRandomWords(list.words, count);
      setWords(selected);
      setParagraphText(wordsToParagraph(selected));
      setHasParagraph(false);
    }
  }

  function handleStart() {
    setStarted(true);
    if (hasParagraph) {
      // Speak the full paragraph as continuous text
      const controller = speakParagraph(paragraphText);
      controllerRef.current = controller;
      controller.start();
    } else {
      // Speak individual words with gaps
      const controller = speakWordsSequentially(words, 0.7, 800);
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

  function handleSubmit() {
    controllerRef.current?.stop();
    setSubmitted(true);

    const comparison = compareText(userText, paragraphText);
    setResults({ comparison, paragraph: paragraphText });

    // Save session
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

  if (!started && words.length > 0) {
    return (
      <div className="page pre-dictation-page">
        <button className="back-btn" onClick={() => navigate('/')}>Home</button>
        <h1>Paragraph Dictation</h1>
        <p className="list-name">{listName}</p>

        <div className="pre-start">
          {hasParagraph ? (
            <>
              <p>A paragraph with <strong>{words.length} words</strong> will be read aloud.</p>
              <div className="instructions-box">
                <h3>How it works:</h3>
                <ol>
                  <li>Press <strong>Start</strong> to begin</li>
                  <li>Listen to the paragraph being spoken naturally</li>
                  <li>Press <strong>Pause</strong> when you need time to write</li>
                  <li>Press <strong>Replay Last</strong> to hear the last part again</li>
                  <li>Press <strong>Resume</strong> to continue listening</li>
                  <li>Write everything you hear in the text box</li>
                  <li>Press <strong>Submit</strong> when you're done</li>
                </ol>
              </div>
            </>
          ) : (
            <>
              <p>{words.length} words will be read aloud as a paragraph.</p>
              <div className="instructions-box">
                <h3>How it works:</h3>
                <ol>
                  <li>Press <strong>Start</strong> to begin</li>
                  <li>Listen to the words being spoken</li>
                  <li>Press <strong>Pause</strong> when you need time to write</li>
                  <li>Press <strong>Replay Last</strong> to hear the last part again</li>
                  <li>Press <strong>Resume</strong> to continue listening</li>
                  <li>Write everything you hear in the text box</li>
                  <li>Press <strong>Submit</strong> when you're done</li>
                </ol>
              </div>
            </>
          )}
          <button className="btn btn-primary btn-large" onClick={handleStart}>
            Start Dictation
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
        <button className="back-btn" onClick={() => navigate('/')}>Home</button>
        <h1>Results</h1>

        <div className="score-display">
          <div className={`score-circle ${percentage >= 80 ? 'great' : percentage >= 50 ? 'good' : 'try-again'}`}>
            <span className="score-number">{percentage}%</span>
          </div>
          <p>{comparison.score} out of {comparison.totalWords} words correct</p>
        </div>

        <div className="paragraph-review">
          <h3>Your Answer:</h3>
          <div className="paragraph-comparison">
            {comparison.results.map((r, i) => (
              <span key={i} className={`word-result ${r.correct ? 'correct' : 'wrong'}`}>
                {r.correct ? r.user : <>{r.user}<sub>{r.expected}</sub></>}
              </span>
            ))}
          </div>
        </div>

        <div className="action-buttons">
          <button className="btn btn-primary" onClick={() => navigate('/')}>Back to Home</button>
          {comparison.results.some(r => !r.correct) && (
            <button className="btn btn-secondary" onClick={() => navigate('/correction')}>
              Practice Wrong Words
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="page pre-dictation-page">
      <button className="back-btn" onClick={() => navigate('/')}>Home</button>
      <h1>Paragraph Dictation</h1>

      <div className="speech-controls">
        <div className={`speech-status ${isSpeaking ? 'speaking' : ''} ${isPaused ? 'paused' : ''}`}>
          {isSpeaking && !isPaused ? '🔊 Speaking...' :
           isPaused ? '⏸ Paused - Take your time!' :
           '⏹ Not speaking'}
        </div>

        <div className="control-buttons">
          {!isSpeaking && !isPaused ? (
            <button className="btn btn-primary" onClick={handleResume}>
              ▶ Resume
            </button>
          ) : isPaused ? (
            <>
              <button className="btn btn-primary" onClick={handleResume}>
                ▶ Resume
              </button>
              <button className="btn btn-accent" onClick={handleReplay}>
                🔁 Replay Last
              </button>
            </>
          ) : (
            <button className="btn btn-warning" onClick={handlePause}>
              ⏸ Pause
            </button>
          )}
          <button className="btn btn-outline" onClick={() => controllerRef.current?.stop()}>
            ⏹ Stop
          </button>
        </div>
      </div>

      <div className="writing-area">
        <textarea
          value={userText}
          onChange={(e) => setUserText(e.target.value)}
          placeholder="Type what you hear here..."
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
          Submit My Answer
        </button>
      </div>
    </div>
  );
}
