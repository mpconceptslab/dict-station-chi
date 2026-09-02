import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useSpeech } from '../hooks/useSpeech';
import { getWordList, saveSession, saveCorrection, generateId } from '../utils/storage';
import { selectRandomWords } from '../utils/wordParser';
import { checkWord } from '../utils/textComparison';

export default function DictationPage() {
  const navigate = useNavigate();
  const { listId } = useParams<{ listId: string }>();
  const [searchParams] = useSearchParams();
  const count = Number(searchParams.get('count') || 5);
  const { speak, isSpeaking } = useSpeech();

  const [words, setWords] = useState<string[]>([]);
  const [listName, setListName] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [answers, setAnswers] = useState<{ word: string; answer: string; correct: boolean }[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [started, setStarted] = useState(false);

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
    const selected = selectRandomWords(list.words, count);
    setWords(selected);
  }

  const speakCurrentWord = useCallback(async () => {
    if (currentIndex < words.length) {
      await speak(words[currentIndex], 0.6);
    }
  }, [currentIndex, words, speak]);

  function handleCheck() {
    if (!userAnswer.trim()) return;

    const expected = words[currentIndex];
    const result = checkWord(userAnswer, expected);

    const newAnswers = [...answers, {
      word: expected,
      answer: userAnswer.trim(),
      correct: result.isCorrect,
    }];
    setAnswers(newAnswers);
    setFeedback(result.isCorrect ? 'correct' : 'wrong');

    setTimeout(() => {
      setFeedback(null);
      setUserAnswer('');

      if (currentIndex + 1 >= words.length) {
        setShowResult(true);
        finishSession(newAnswers);
      } else {
        setCurrentIndex(currentIndex + 1);
      }
    }, 1500);
  }

  async function finishSession(finalAnswers: typeof answers) {
    const wrongIndices = finalAnswers
      .map((a, i) => a.correct ? -1 : i)
      .filter(i => i >= 0);

    const session = {
      id: generateId(),
      wordListId: listId || '',
      wordListName: listName,
      mode: 'standard' as const,
      words,
      userAnswers: finalAnswers.map(a => a.answer),
      correctAnswers: words,
      wrongIndices,
      score: finalAnswers.filter(a => a.correct).length,
      totalWords: words.length,
      timestamp: Date.now(),
    };

    await saveSession(session);

    if (wrongIndices.length > 0) {
      const correction = {
        id: generateId(),
        dictationSessionId: session.id,
        wrongWords: wrongIndices.map(i => ({
          word: words[i],
          userAnswer: finalAnswers[i].answer,
        })),
        practiceRounds: wrongIndices.map(i => ({ wordIndex: i, attempts: [] })),
      };
      await saveCorrection(correction);
    }
  }

  const score = answers.filter(a => a.correct).length;
  const percentage = answers.length > 0 ? Math.round((score / words.length) * 100) : 0;

  if (!started && words.length > 0) {
    return (
      <div className="page dictation-page">
        <button className="back-btn" onClick={() => navigate('/')}>Home</button>
        <h1>Word Dictation</h1>
        <p className="list-name">{listName}</p>

        <div className="pre-start">
          <p>{words.length} words ready for you!</p>
          <p className="hint">The app will speak each word. Listen carefully, then type what you hear.</p>
          <button className="btn btn-primary btn-large" onClick={() => { setStarted(true); speakCurrentWord(); }}>
            Start Dictation
          </button>
        </div>
      </div>
    );
  }

  if (showResult) {
    return (
      <div className="page results-page">
        <button className="back-btn" onClick={() => navigate('/')}>Home</button>
        <h1>Results</h1>

        <div className="score-display">
          <div className={`score-circle ${percentage >= 80 ? 'great' : percentage >= 50 ? 'good' : 'try-again'}`}>
            <span className="score-number">{percentage}%</span>
          </div>
          <p>{score} out of {words.length} correct</p>
          <p className="encouragement">
            {percentage === 100 ? 'Perfect! Amazing job!' :
             percentage >= 80 ? 'Great work! Almost perfect!' :
             percentage >= 50 ? 'Good effort! Keep practicing!' :
             "Don't worry, practice makes perfect!"}
          </p>
        </div>

        <div className="answer-review">
          <h3>Word Review:</h3>
          {answers.map((a, i) => (
            <div key={i} className={`answer-item ${a.correct ? 'correct' : 'wrong'}`}>
              <span className="answer-word">{a.word}</span>
              {!a.correct && (
                <span className="answer-detail">
                  You wrote: <em>{a.answer}</em>
                </span>
              )}
              <span className="answer-icon">{a.correct ? '✓' : '✗'}</span>
            </div>
          ))}
        </div>

        <div className="action-buttons">
          <button className="btn btn-primary" onClick={() => navigate('/')}>
            Back to Home
          </button>
          {answers.some(a => !a.correct) && (
            <button className="btn btn-secondary" onClick={() => navigate('/correction')}>
              Practice Wrong Words
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="page dictation-page">
      <button className="back-btn" onClick={() => navigate('/')}>Home</button>
      <h1>Word Dictation</h1>

      <div className="progress-info">
        Word {currentIndex + 1} of {words.length}
      </div>

      <div className="dictation-area">
        <button
          className={`speak-btn ${isSpeaking ? 'speaking' : ''}`}
          onClick={speakCurrentWord}
        >
          {isSpeaking ? '🔊 Speaking...' : '🔊 Tap to Hear Word'}
        </button>

        <div className={`input-area ${feedback || ''}`}>
          <input
            type="text"
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleCheck()}
            placeholder="Type what you hear..."
            autoFocus
            autoComplete="off"
            autoCorrect="off"
            spellCheck={false}
          />
          <button className="btn btn-primary" onClick={handleCheck} disabled={!userAnswer.trim()}>
            Check
          </button>
        </div>

        {feedback === 'correct' && <div className="feedback correct">Correct! ✓</div>}
        {feedback === 'wrong' && (
          <div className="feedback wrong">
            Not quite. The word was: <strong>{words[currentIndex]}</strong>
          </div>
        )}
      </div>

      <div className="mini-progress">
        {words.map((_, i) => (
          <div
            key={i}
            className={`progress-dot ${i < answers.length ? (answers[i].correct ? 'correct' : 'wrong') : ''} ${i === currentIndex ? 'current' : ''}`}
          />
        ))}
      </div>
    </div>
  );
}
