import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOCR } from '../hooks/useOCR';
import { saveWordList, generateId } from '../utils/storage';

export default function ImportPage() {
  const navigate = useNavigate();
  const { recognizeText, isProcessing, progress, error } = useOCR();
  const [step, setStep] = useState<'upload' | 'review'>('upload');
  const [rawText, setRawText] = useState('');
  const [words, setWords] = useState<string[]>([]);
  const [paragraphs, setParagraphs] = useState<string[]>([]);
  const [listName, setListName] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [language, setLanguage] = useState('english');
  const [voice, setVoice] = useState('zh-CN'); // Mandarin default for Chinese
  const [selectedWords, setSelectedWords] = useState<string[]>([]); // Words selected by highlighting
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const textContainerRef = useRef<HTMLDivElement>(null);

  async function handleImageSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    // Show image preview
    const previewUrl = URL.createObjectURL(file);
    setImagePreview(previewUrl);

    try {
      const text = await recognizeText(file, language);
      processText(text);
    } catch (err) {
      console.error('OCR failed:', err);
    }
    // Reset input so the same file can be re-selected
    e.target.value = '';
  }

  function processText(text: string) {
    setRawText(text);
    // Combine all text into paragraphs (merge into one block for highlighting)
    const cleanedText = text.replace(/\r\n/g, '\n').trim();
    const paragraphsList = cleanedText.split('\n\n').map(p => p.trim()).filter(p => p.length > 0);
    setParagraphs(paragraphsList);
    setListName(`List ${new Date().toLocaleDateString()}`);
    setStep('review');
  }

  function handleManualEntry() {
    setRawText('');
    setWords([]);
    setParagraphs([]);
    setSelectedWords([]);
    setListName(`List ${new Date().toLocaleDateString()}`);
    setStep('review');
  }

  function removeWord(index: number) {
    const newWords = words.filter((_, i) => i !== index);
    setWords(newWords);
  }

  function removeSelectedWord(index: number) {
    const newSelected = selectedWords.filter((_, i) => i !== index);
    setSelectedWords(newSelected);
  }

  // Handle text selection in the paragraph
  function handleTextSelection() {
    const selection = window.getSelection();
    if (!selection || selection.isCollapsed) return;
    
    const selectedText = selection.toString().trim();
    if (selectedText.length > 0) {
      // Add to selected words if not already there
      if (!selectedWords.includes(selectedText)) {
        setSelectedWords([...selectedWords, selectedText]);
      }
      // Clear selection
      selection.removeAllRanges();
    }
  }

  // Add all selected words to the word list
  function addSelectedWords() {
    const newWords = [...words];
    const existingSet = new Set(words.map(w => w.toLowerCase()));
    
    for (const word of selectedWords) {
      if (!existingSet.has(word.toLowerCase())) {
        newWords.push(word);
        existingSet.add(word.toLowerCase());
      }
    }
    
    setWords(newWords);
    setSelectedWords([]); // Clear selected words after adding
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
      language,
      voice,
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

          <div className="form-group language-selector">
            <label>Language:</label>
            <div className="language-options">
              <button
                className={`lang-btn ${language === 'english' ? 'active' : ''}`}
                onClick={() => setLanguage('english')}
              >
                🇬🇧 English
              </button>
              <button
                className={`lang-btn ${language === 'chinese' ? 'active' : ''}`}
                onClick={() => setLanguage('chinese')}
              >
                🇨🇳 简体中文
              </button>
              <button
                className={`lang-btn ${language === 'chinese_trad' ? 'active' : ''}`}
                onClick={() => setLanguage('chinese_trad')}
              >
                🇹🇼 繁體中文
              </button>
              <button
                className={`lang-btn ${language === 'english_chinese' ? 'active' : ''}`}
                onClick={() => setLanguage('english_chinese')}
              >
                🇬🇧🇨🇳 Eng + 简中
              </button>
            </div>
          </div>

          {/* Voice/Dialect selector - shows when Chinese is selected */}
          {(language === 'chinese' || language === 'chinese_trad' || language === 'english_chinese') && (
            <div className="form-group language-selector">
              <label>Chinese Voice / 中文聲線:</label>
              <div className="language-options">
                <button
                  className={`lang-btn ${voice === 'zh-CN' ? 'active' : ''}`}
                  onClick={() => setVoice('zh-CN')}
                >
                  🗣️ 普通話 (Mandarin)
                </button>
                <button
                  className={`lang-btn ${voice === 'zh-HK' ? 'active' : ''}`}
                  onClick={() => setVoice('zh-HK')}
                >
                  🗣️ 廣東話 (Cantonese)
                </button>
                <button
                  className={`lang-btn ${voice === 'zh-TW' ? 'active' : ''}`}
                  onClick={() => setVoice('zh-TW')}
                >
                  🗣️ 台灣國語 (Taiwanese)
                </button>
              </div>
            </div>
          )}

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

          {/* Instructions */}
          <div className="instructions" style={{ background: '#f0f9ff', padding: '16px', borderRadius: '12px', marginBottom: '20px' }}>
            <h3 style={{ margin: '0 0 8px 0', fontSize: '16px' }}>📝 How to Select Words:</h3>
            <p style={{ margin: 0, fontSize: '14px' }}>
              1. <strong>Highlight text</strong> in the paragraph below by clicking and dragging<br/>
              2. Selected words will appear in the "Selected Words" section<br/>
              3. Click <strong>"Add to Word List"</strong> to save them for dictation<br/>
              4. You can select words of any length (1 character or multiple characters)
            </p>
          </div>

          {/* Selected Words Section */}
          {selectedWords.length > 0 && (
            <div className="form-group">
              <label>
                Selected Words ({selectedWords.length})
                <span className="label-hint">Words you've highlighted from the text</span>
              </label>
              <div className="word-tags" style={{ marginBottom: '12px' }}>
                {selectedWords.map((word, i) => (
                  <span key={i} className="word-tag removable" onClick={() => removeSelectedWord(i)} title="Tap to remove">
                    {word} <span className="remove-x">&times;</span>
                  </span>
                ))}
              </div>
              <button className="btn btn-primary" onClick={addSelectedWords}>
                Add to Word List ({selectedWords.length} words)
              </button>
            </div>
          )}

          {/* Word List Section */}
          {words.length > 0 && (
            <div className="form-group">
              <label>
                Word List for Dictation ({words.length} words)
                <span className="label-hint">Tap a word to remove it</span>
              </label>
              <div className="word-tags">
                {words.map((word, i) => (
                  <span key={i} className="word-tag removable" onClick={() => removeWord(i)} title="Tap to remove">
                    {word} <span className="remove-x">&times;</span>
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Paragraph Text for Highlighting */}
          {paragraphs.length > 0 && (
            <div className="form-group">
              <label>
                Paragraph Text
                <span className="label-hint">Click and drag to highlight words you want to study</span>
              </label>
              <div
                ref={textContainerRef}
                className="paragraph-highlight-area"
                onMouseUp={handleTextSelection}
                onTouchEnd={handleTextSelection}
                style={{
                  background: '#fff',
                  border: '2px solid #e0e0e0',
                  borderRadius: '12px',
                  padding: '20px',
                  fontSize: '18px',
                  lineHeight: '1.8',
                  minHeight: '200px',
                  userSelect: 'text',
                  cursor: 'text',
                }}
              >
                {paragraphs.map((p, i) => (
                  <p key={i} style={{ marginBottom: '16px' }}>{p}</p>
                ))}
              </div>
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
              disabled={words.length === 0 && paragraphs.length === 0}
            >
              Save ({words.length} keywords{paragraphs.length > 0 ? `, ${paragraphs.length} paragraphs` : ''})
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
