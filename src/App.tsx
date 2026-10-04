import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useRef } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { PrefsProvider } from './context/PrefsContext';
import AdBanner from './components/AdBanner';
import BottomNavBar from './components/BottomNavBar';
import Toast from './components/Toast';
import Confetti from './components/Confetti';
import ProfileSetupPage from './pages/ProfileSetupPage';
import HomePage from './pages/HomePage';
import ImportPage from './pages/ImportPage';
import WordListPage from './pages/WordListPage';
import DictationPage from './pages/DictationPage';
import PreDictationPage from './pages/PreDictationPage';
import MarkingPage from './pages/MarkingPage';
import CorrectionPage from './pages/CorrectionPage';
import RevisionPage from './pages/RevisionPage';
import SyllabusPage from './pages/SyllabusPage';
import WordListDetailPage from './pages/WordListDetailPage';
import StudyPage from './pages/StudyPage';
import RecordsPage from './pages/RecordsPage';
import SettingsPage from './pages/SettingsPage';
import UpgradePage from './pages/UpgradePage';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { currentUser } = useAuth();
  const dockRef = useRef<HTMLDivElement>(null);

  // Keep the scrollable content clear of the fixed bottom dock (ad + nav),
  // adapting to the ad's presence and the device safe-area.
  useEffect(() => {
    const dock = dockRef.current;
    if (!dock) return;
    const apply = () => {
      document.documentElement.style.setProperty('--dock-h', `${dock.offsetHeight}px`);
    };
    apply();
    const ro = new ResizeObserver(apply);
    ro.observe(dock);
    return () => {
      ro.disconnect();
      document.documentElement.style.removeProperty('--dock-h');
    };
  });

  if (!currentUser) {
    return <Navigate to="/profile" replace />;
  }
  return (
    <div className="page-wrapper">
      <div className="app-content">
        {children}
      </div>
      {/* Fixed bottom dock: ad bar (hidden for Pro) sits above the bottom nav. */}
      <div className="bottom-dock" ref={dockRef}>
        <AdBanner />
        <BottomNavBar />
      </div>
    </div>
  );
}

// Sends the user to the profile setup on first run, otherwise straight to home.
function RootRedirect() {
  const { currentUser } = useAuth();
  return <Navigate to={currentUser ? '/home' : '/profile'} replace />;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<RootRedirect />} />
      <Route path="/profile" element={<ProfileSetupPage />} />
      <Route path="/home" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
      <Route path="/import" element={<ProtectedRoute><ImportPage /></ProtectedRoute>} />
      <Route path="/word-lists" element={<ProtectedRoute><WordListPage /></ProtectedRoute>} />
      <Route path="/dictation/:listId" element={<ProtectedRoute><DictationPage /></ProtectedRoute>} />
      <Route path="/pre-dictation/:listId" element={<ProtectedRoute><PreDictationPage /></ProtectedRoute>} />
      <Route path="/marking/:sessionId" element={<ProtectedRoute><MarkingPage /></ProtectedRoute>} />
      <Route path="/correction/:sessionId" element={<ProtectedRoute><CorrectionPage /></ProtectedRoute>} />
      <Route path="/revision/:listId" element={<ProtectedRoute><RevisionPage /></ProtectedRoute>} />
      <Route path="/syllabus" element={<ProtectedRoute><SyllabusPage /></ProtectedRoute>} />
      <Route path="/syllabus/:listId" element={<ProtectedRoute><WordListDetailPage /></ProtectedRoute>} />
      <Route path="/study/:listId" element={<ProtectedRoute><StudyPage /></ProtectedRoute>} />
      <Route path="/records" element={<ProtectedRoute><RecordsPage /></ProtectedRoute>} />
      <Route path="/upgrade" element={<ProtectedRoute><UpgradePage /></ProtectedRoute>} />
      <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
      <Route path="*" element={<RootRedirect />} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <PrefsProvider>
        <BrowserRouter>
          <AppRoutes />
          <Toast />
          <Confetti />
        </BrowserRouter>
      </PrefsProvider>
    </AuthProvider>
  );
}

export default App;
