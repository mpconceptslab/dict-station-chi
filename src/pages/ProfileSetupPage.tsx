import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { usePrefs } from '../context/PrefsContext';
import type { TKey } from '../i18n';
import {
  HK_SCHOOL_DISTRICTS,
  HK_SCHOOLS,
  type School,
} from '../data/schoolList';

const GRADES: string[] = [
  '小一',
  '小二',
  '小三',
  '小四',
  '小五',
  '小六',
  '中一',
  '中二',
  '中三',
  '中四',
  '中五',
  '中六',
];

/** Maps each stored grade VALUE (kept stable in Chinese) to its display label key. */
const GRADE_KEYS: Record<string, TKey> = {
  '小一': 'profile.grade.p1',
  '小二': 'profile.grade.p2',
  '小三': 'profile.grade.p3',
  '小四': 'profile.grade.p4',
  '小五': 'profile.grade.p5',
  '小六': 'profile.grade.p6',
  '中一': 'profile.grade.s1',
  '中二': 'profile.grade.s2',
  '中三': 'profile.grade.s3',
  '中四': 'profile.grade.s4',
  '中五': 'profile.grade.s5',
  '中六': 'profile.grade.s6',
};

/**
 * ProfileSetupPage — collected once on first use.
 * Kid's name + school (chosen from the built-in HK school list) + grade.
 * Saving here logs the child in automatically for every future launch.
 */
export default function ProfileSetupPage() {
  const { setupProfile } = useAuth();
  const navigate = useNavigate();
  const { t } = usePrefs();

  const [kidName, setKidName] = useState('');
  const [district, setDistrict] = useState('');
  const [nature, setNature] = useState('');
  const [schoolName, setSchoolName] = useState('');
  const [grade, setGrade] = useState('');
  const [error, setError] = useState('');

  // Natures actually present for the chosen district.
  const natureOptions = useMemo<string[]>(() => {
    if (!district) return [];
    return Object.keys(HK_SCHOOLS[district] || {});
  }, [district]);

  // Schools for the chosen district + nature.
  const schoolOptions = useMemo<School[]>(() => {
    if (!district || !nature) return [];
    return HK_SCHOOLS[district]?.[nature] || [];
  }, [district, nature]);

  function handleDistrictChange(value: string) {
    setDistrict(value);
    setNature('');
    setSchoolName('');
  }

  function handleNatureChange(value: string) {
    setNature(value);
    setSchoolName('');
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    if (!kidName.trim()) {
      setError(t('profile.errName'));
      return;
    }
    if (!schoolName) {
      setError(t('profile.errSchool'));
      return;
    }
    if (!grade) {
      setError(t('profile.errGrade'));
      return;
    }

    setupProfile({ kidName: kidName.trim(), kidSchool: schoolName, kidGrade: grade });
    navigate('/home', { replace: true });
  }

  return (
    <div className="page login-page">
      <div className="login-container">
        <div style={{ textAlign: 'center' }}>
          <div className="app-logo" style={{ marginBottom: '24px', display: 'inline-block' }}>{t('app.name')}</div>
        </div>
        <p className="login-subtitle">{t('profile.subtitle')}</p>

        <form onSubmit={handleSubmit} className="login-form profile-form">
          <div className="form-group">
            <label>{t('profile.name')}</label>
            <input
              type="text"
              value={kidName}
              onChange={(e) => setKidName(e.target.value)}
              placeholder={t('profile.namePlaceholder')}
              autoComplete="off"
            />
          </div>

          <div className="form-group">
            <label>{t('profile.district')}</label>
            <select value={district} onChange={(e) => handleDistrictChange(e.target.value)}>
              <option value="">{t('profile.districtPlaceholder')}</option>
              {HK_SCHOOL_DISTRICTS.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>{t('profile.nature')}</label>
            <select
              value={nature}
              onChange={(e) => handleNatureChange(e.target.value)}
              disabled={!district}
            >
              <option value="">{t('profile.naturePlaceholder')}</option>
              {natureOptions.map((n) => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>{t('profile.school')}</label>
            <select
              value={schoolName}
              onChange={(e) => setSchoolName(e.target.value)}
              disabled={!nature}
            >
              <option value="">{t('profile.schoolPlaceholder')}</option>
              {schoolOptions.map((s, i) => (
                <option key={`${s.name}-${i}`} value={s.name}>{s.name}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>{t('profile.grade')}</label>
            <select value={grade} onChange={(e) => setGrade(e.target.value)}>
              <option value="">{t('profile.gradePlaceholder')}</option>
              {GRADES.map((g) => (
                <option key={g} value={g}>{t(GRADE_KEYS[g])}</option>
              ))}
            </select>
          </div>

          {error && <div className="login-error">{error}</div>}

          <button type="submit" className="btn btn-primary btn-large">
            {t('profile.start')}
          </button>
        </form>
      </div>
    </div>
  );
}
