import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOCR } from '../hooks/useOCR';
import { analyzeContent } from '../utils/wordParser';
import { saveWordList, generateId } from '../utils/storage';

export default function ImportPage() {
  const navigate = useNavigate();
  const { recognizeText, isProcessing, progress, error } = useOCR();
  const [step, setStep] = useState<'upload' | 'review'>('upload');
  const [rawText, setRawText] = useState('');
  const [words, setWords] = useState<string[]>([]);
  const [paragraphs, setParagraphs] = useState<string[]>([]);
  const [listName, setListName] = useState('');
  const [editableWords, setEditableWords] = useState('');
  const [editableParagraphs, setEditableParagraphs] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [detectedType, setDetectedType] = useState<'words' | 'paragraph' | 'mixed'>('words');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  async function handleImageSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    // Show image preview
    const previewUrl = URL.createObjectURL(file);
    setImagePreview(previewUrl);

    try {
      const text = await recognizeText(file);
      processText(text);
    } catch (err) {
      console.error('OCR failed:', err);
    }
    // Reset input so the same file can be re-selected
    e.target.value = '';
  }

  function processText(text: string) {
    setRawText(text);
    const { words: extractedWords, paragraphs: extractedParagraphs } = analyzeContent(text);

    setWords(extractedWords);
    setEditableWords(extractedWords.join('\n'));
    setParagraphs(extractedParagraphs);
    setEditableParagraphs(extractedParagraphs.join('\n\n'));

    // Determine content type
    if (extractedParagraphs.length > 0 && extractedWords.length > extractedParagraphs.length) {
      setDetectedType('mixed');
    } else if (extractedParagraphs.length > 0) {
      setDetectedType('paragraph');
    } else {
      setDetectedType('words');
    }

    setListName(`List ${new Date().toLocaleDateString()}`);
    setStep('review');
  }

  function handleManualEntry() {
    setRawText('');
    setWords([]);
    setParagraphs([]);
    setEditableWords('');
    setEditableParagraphs('');
    setDetectedType('words');
    setListName(`List ${new Date().toLocaleDateString()}`);
    setStep('review');
  }

  function updateWords(text: string) {
    setEditableWords(text);
    const parsed = text.split('\n').map(w => w.trim()).filter(w => w.length > 0);
    setWords(parsed);
  }

  function removeWord(index: number) {
    const newWords = words.filter((_, i) => i !== index);
    setWords(newWords);
    setEditableWords(newWords.join('\n'));
  }

  function updateParagraphs(text: string) {
    setEditableParagraphs(text);
    const parsed = text.split(/\n\s*\n|\n/).map(p => p.trim()).filter(p => p.length > 0);
    setParagraphs(parsed);
  }

  function handleAnalyzeParagraphs() {
    // Re-analyze: extract keywords from the current paragraph text
    const { words: newWords } = analyzeContent(editableParagraphs);
    if (newWords.length > 0) {
      // Merge with existing words
      const existingSet = new Set(words.map(w => w.toLowerCase()));
      const additionalWords = newWords.filter(w => !existingSet.has(w.toLowerCase()));
      const merged = [...words, ...additionalWords];
      setWords(merged);
      setEditableWords(merged.join('\n'));
    }
  }

  async function handleSave() {
    if (words.length === 0 && paragraphs.length === 0) return;

    await saveWordList({
      id: generateId(),
      name: listName || `List ${new Date().toLocaleDateString()}`,
      words,
      paragraphs,
      createdAt: Date.now(),
      rawText,
    });

    navigate('/word-lists');
  }

  const hasContent = words.length > 0 || paragraphs.length > 0;

  return (
    <div className="page import-page">
      <button className="back-btn" onClick={() => navigate(-1)}>Back</button>
      <h1>Import Study Material</h1>

      {step === 'upload' && (
        <div className="upload-section">
          <p className="instructions">
            Take a photo or upload any study material - word lists, paragraphs, stories, or anything!
            The app will understand the content and prepare it for both keyword and paragraph dictation.
          </p>

          <div className="upload-options">
            <button
              className="btn btn-primary btn-large upload-btn"
              onClick={() => cameraInputRef.current?.click()}
              disabled={isProcessing}
            >
              <span className="btn-icon">📷</span>
              Take a Photo
            </button>

            <button
              className="btn btn-secondary btn-large upload-btn"
              onClick={() => fileInputRef.current?.click()}
              disabled={isProcessing}
            >
              <span className="btn-icon">🖼️</span>
              Upload Image
            </button>

            <button
              className="btn btn-outline btn-large upload-btn"
              onClick={handleManualEntry}
              disabled={isProcessing}
            >
              <span className="btn-icon">✏️</span>
              Type Manually
            </button>
          </div>

          <input
            ref={cameraInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handleImageSelect}
            style={{ display: 'none' }}
          />
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageSelect}
            style={{ display: 'none' }}
          />

          {isProcessing && (
            <div className="processing-overlay">
              <div className="spinner"></div>
              <p>Reading your content... {progress}%</p>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${progress}%` }}></div>
              </div>
            </div>
          )}

          {imagePreview && (
            <div className="image-preview">
              <img src={imagePreview} alt="Uploaded" style={{ maxWidth: '100%', maxHeight: '200px', borderRadius: '12px', marginTop: '16px' }} />
            </div>
          )}

          {error && <p className="error-message">{error}</p>}
        </div>
      )}

      {step === 'review' && (
        <div className="review-section">
          <div className="form-group">
            <label>Study Material Name:</label>
            <input
              type="text"
              value={listName}
              onChange={(e) => setListName(e.target.value)}
              placeholder="e.g., Week 5 Spelling, Chapter 3 Vocabulary"
            />
          </div>

          {/* Content type indicator */}
          <div className="content-type-badge">
            {detectedType === 'words' && '📝 Word List Detected'}
            {detectedType === 'paragraph' && '📖 Paragraph/Story Detected'}
            {detectedType === 'mixed' && '📝📖 Mixed Content (Words + Paragraphs)'}
          </div>

          {/* Keywords Section */}
          <div className="form-group">
            <label>
              Keywords for Dictation ({words.length} words)
              <span className="label-hint">One word per line. These will be used for keyword dictation.</span>
            </label>
            <textarea
              value={editableWords}
              onChange={(e) => updateWords(e.target.value)}
              rows={8}
              placeholder="Type one word per line..."
            />
          </div>

          {words.length > 0 && (
            <div className="word-preview">
              <h3>Keywords Preview: <span className="hint">(tap a word to remove it)</span></h3>
              <div className="word-tags">
                {words.map((word, i) => (
                  <span key={i} className="word-tag removable" onClick={() => removeWord(i)} title="Tap to remove">
                    {word} <span className="remove-x">&times;</span>
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Paragraphs Section */}
          <div className="form-group">
            <label>
              Paragraphs for Full Dictation ({paragraphs.length} blocks)
              <span className="label-hint">Full text for paragraph dictation practice. Separate paragraphs with blank lines.</span>
            </label>
            <textarea
              value={editableParagraphs}
              onChange={(e) => updateParagraphs(e.target.value)}
              rows={6}
              placeholder="Paste or type paragraphs here for full dictation practice..."
            />
          </div>

          {paragraphs.length > 0 && (
            <div className="paragraph-preview">
              <h3>Paragraph Preview:</h3>
              {paragraphs.map((p, i) => (
                <div key={i} className="paragraph-block">
                  <span className="paragraph-number">Paragraph {i + 1}:</span>
                  <p>{p}</p>
                </div>
              ))}
            </div>
          )}

          {/* Extract keywords from paragraphs button */}
          {paragraphs.length > 0 && (
            <div className="extract-keywords-section">
              <button className="btn btn-outline" onClick={handleAnalyzeParagraphs}>
                Extract Keywords from Paragraphs
              </button>
              <p className="hint">This will find important words in the paragraphs and add them to the keyword list.</p>
            </div>
          )}

          {/* Raw text toggle */}
          {rawText && (
            <details className="raw-text-section">
              <summary>View Original OCR Text</summary>
              <pre className="raw-text-display">{rawText}</pre>
            </details>
          )}

          <div className="action-buttons">
            <button className="btn btn-outline" onClick={() => setStep('upload')}>
              Try Again
            </button>
            <button
              className="btn btn-primary btn-large"
              onClick={handleSave}
              disabled={!hasContent}
            >
              Save ({words.length} keywords{paragraphs.length > 0 ? `, ${paragraphs.length} paragraphs` : ''})
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
