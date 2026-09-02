import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getRecentSessions, getCorrection, saveCorrection, type CorrectionSession } from '../utils/storage';
import { useSpeech } from '../hooks/useSpeech';

const REQUIRED_PRACTICE_COUNT = 3;

export default function CorrectionPage() {
  const navigate = useNavigate();
  const { speak } = useSpeech();
  const [correction, setCorrection] = useState<CorrectionSession | null>(null);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [input, setInput] = useState('');
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    loadLatestCorrection();
  }, []);

  async function loadLatestCorrection() {
    const sessions = await getRecentSessions(1);
    if (sessions.length === 0) return;

    const lastSession = sessions[0];
    // Find the correction session for this dictation
    const corr = await getCorrection(lastSession.id);
    if (corr) {
      setCorrection(corr);
    }
  }

  const currentWrong = correction?.wrongWords[currentWordIndex];
  const currentPractice = correction?.practiceRounds[currentWordIndex];
  const attemptsCount = currentPractice?.attempts.length || 0;

  function handleCheck() {
    if (!correction || !currentWrong || !input.trim()) return;

    const isCorrect = input.trim().toLowerCase() === currentWrong.word.toLowerCase();
    setFeedback(isCorrect ? 'correct' : 'wrong');

    if (isCorrect) {
      // Update practice rounds
      const updatedCorrection = { ...correction };
      updatedCorrection.practiceRounds[currentWordIndex] = {
        ...updatedCorrection.practiceRounds[currentWordIndex],
        attempts: [...updatedCorrection.practiceRounds[currentWordIndex].attempts, input.trim()],
      };
      setCorrection(updatedCorrection);

      setTimeout(() => {
        setFeedback(null);
        setInput('');

        if (attemptsCount + 1 >= REQUIRED_PRACTICE_COUNT) {
          // Move to next wrong word
          if (currentWordIndex + 1 >= correction.wrongWords.length) {
            // All words practiced
            updatedCorrection.completedAt = Date.now();
            saveCorrection(updatedCorrection);
            setCompleted(true);
          } else {
            setCurrentWordIndex(currentWordIndex + 1);
          }
        }
      }, 1000);
    } else {
      setTimeout(() => setFeedback(null), 1500);
    }
  }

  if (!correction || correction.wrongWords.length === 0) {
    return (
      <div className="page correction-page">
        <button className="back-btn" onClick={() => navigate('/')}>Home</button>
        <h1>Correction Practice</h1>
        <div className="empty-state">
          <p>No wrong words to practice! Great job on your last dictation!</p>
          <button className="btn btn-primary" onClick={() => navigate('/')}>Back to Home</button>
        </div>
      </div>
    );
  }

  if (completed) {
    return (
      <div className="page correction-page">
        <button className="back-btn" onClick={() => navigate('/')}>Home</button>
        <h1>Practice Complete!</h1>
        <div className="completion-message">
          <p className="big-emoji">🎉</p>
          <p>You've practiced all the words you got wrong!</p>
          <p>You'll remember them better next time!</p>
          <button className="btn btn-primary btn-large" onClick={() => navigate('/')}>
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="page correction-page">
      <button className="back-btn" onClick={() => navigate('/')}>Home</button>
      <h1>Correction Practice</h1>

      <div className="correction-progress">
        Word {currentWordIndex + 1} of {correction.wrongWords.length}
      </div>

      <div className="correction-card">
        <div className="wrong-answer-display">
          <p className="label">You wrote:</p>
          <p className="wrong-answer">{currentWrong?.userAnswer}</p>
        </div>

        <div className="correct-answer-display">
          <p className="label">Correct spelling:</p>
          <p className="correct-answer">{currentWrong?.word}</p>
          <button
            className="btn btn-outline speak-btn-small"
            onClick={() => speak(currentWrong!.word, 0.5)}
          >
            🔊 Hear it
          </button>
        </div>

        <div className="practice-input">
          <p className="practice-count">
            Practice: {attemptsCount} / {REQUIRED_PRACTICE_COUNT}
          </p>
          <div className="practice-dots">
            {Array.from({ length: REQUIRED_PRACTICE_COUNT }).map((_, i) => (
              <div key={i} className={`dot ${i < attemptsCount ? 'filled' : ''}`} />
            ))}
          </div>

          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleCheck()}
            placeholder={`Type "${currentWrong?.word}" correctly...`}
            autoFocus
            autoComplete="off"
            autoCorrect="off"
            spellCheck={false}
          />
          <button className="btn btn-primary" onClick={handleCheck} disabled={!input.trim()}>
            Check
          </button>

          {feedback === 'correct' && <div className="feedback correct">Correct! ✓</div>}
          {feedback === 'wrong' && <div className="feedback wrong">Try again! The word is: <strong>{currentWrong?.word}</strong></div>}
        </div>
      </div>
    </div>
  );
}
