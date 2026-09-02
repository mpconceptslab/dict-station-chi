import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ImportPage from './pages/ImportPage';
import WordListPage from './pages/WordListPage';
import DictationPage from './pages/DictationPage';
import PreDictationPage from './pages/PreDictationPage';
import CorrectionPage from './pages/CorrectionPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/import" element={<ImportPage />} />
        <Route path="/word-lists" element={<WordListPage />} />
        <Route path="/dictation/:listId" element={<DictationPage />} />
        <Route path="/pre-dictation/:listId" element={<PreDictationPage />} />
        <Route path="/correction" element={<CorrectionPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
