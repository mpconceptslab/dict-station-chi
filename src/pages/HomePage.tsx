import { useNavigate } from 'react-router-dom';
import TopNavBar from '../components/TopNavBar';
import { useSound } from '../hooks/useSound';
import { usePrefs } from '../context/PrefsContext';
import logo from '../assets/dict-station-chi-logo.png';

export default function HomePage() {
  const navigate = useNavigate();
  const { tap } = useSound();
  const { t } = usePrefs();

  return (
    <div className="page home-page">
      <TopNavBar />
      <div className="hero-section hero-logo">
        <img className="app-logo-img" src={logo} alt={t('app.name')} />
      </div>

      <section className="section import-section">
        <button className="btn new-range-btn" onClick={() => { tap(); navigate('/import'); }}>
          {t('home.newRange')}
        </button>
        <button className="btn new-range-btn" onClick={() => { tap(); navigate('/syllabus'); }}>
          {t('home.chooseRange')}
        </button>
        <button className="btn new-range-btn" onClick={() => { tap(); navigate('/records'); }}>
          {t('home.recentRecords')}
        </button>
      </section>
    </div>
  );
}
