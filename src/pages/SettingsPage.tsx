import { useState, useRef, useEffect } from 'react';
import TopNavBar from '../components/TopNavBar';
import { usePrefs } from '../context/PrefsContext';
import { getPoints } from '../utils/storage';

export default function SettingsPage() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { theme, setTheme, fontScale, setFontScale, soundOn, setSoundOn, lang, setLang, t } = usePrefs();

  // Profile state
  const [profilePic, setProfilePic] = useState<string>(
    () => localStorage.getItem('profile_picture') || ''
  );
  const [childName, setChildName] = useState<string>(
    () => localStorage.getItem('child_name') || ''
  );
  const [gender, setGender] = useState<string>(
    () => localStorage.getItem('child_gender') || 'boy'
  );

  // Preferences state
  const [defaultVoice, setDefaultVoice] = useState<string>(
    () => localStorage.getItem('default_voice') || 'zh-HK'
  );
  const [voiceSpeed, setVoiceSpeed] = useState<number>(
    () => Number(localStorage.getItem('voice_speed') || '0.8')
  );

  // Points
  const [points, setPoints] = useState(() => getPoints());

  // Save profile picture
  function handleProfilePicChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      setProfilePic(base64);
      localStorage.setItem('profile_picture', base64);
    };
    reader.readAsDataURL(file);
  }

  function removeProfilePic() {
    setProfilePic('');
    localStorage.removeItem('profile_picture');
  }

  // Save child name
  function handleNameChange(e: React.ChangeEvent<HTMLInputElement>) {
    const name = e.target.value;
    setChildName(name);
    localStorage.setItem('child_name', name);
  }

  // Save voice preference
  function handleVoiceChange(voice: string) {
    setDefaultVoice(voice);
    localStorage.setItem('default_voice', voice);
  }

  // Save voice speed
  function handleSpeedChange(e: React.ChangeEvent<HTMLInputElement>) {
    const speed = Number(e.target.value);
    setVoiceSpeed(speed);
    localStorage.setItem('voice_speed', String(speed));
  }

  // Save gender
  function handleGenderChange(g: string) {
    setGender(g);
    localStorage.setItem('child_gender', g);
  }

  // Refresh points on mount
  useEffect(() => {
    setPoints(getPoints());
  }, []);

  return (
    <div className="page">
      <TopNavBar />
      <h1 className="page-title">{t('settings.title')}</h1>

      <div className="settings-page">
        {/* Profile Section */}
        <section className="settings-section">
          <h2>{t('settings.profile')}</h2>
          <div className="settings-profile">
            <div className="settings-avatar" onClick={() => fileInputRef.current?.click()}>
              {profilePic ? (
                <img src={profilePic} alt="Profile" />
              ) : (
                <span className="settings-avatar-placeholder"><span className="ico" data-word={t('settings.photoWord')}>📷</span></span>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={handleProfilePicChange}
            />
            <div className="settings-avatar-actions">
              <button className="btn btn-small" onClick={() => fileInputRef.current?.click()}>
                {t('settings.uploadPhoto')}
              </button>
              {profilePic && (
                <button className="btn btn-small btn-danger" onClick={removeProfilePic}>
                  {t('settings.remove')}
                </button>
              )}
            </div>
            <div className="settings-field">
              <label>{t('settings.name')}</label>
              <input
                type="text"
                value={childName}
                onChange={handleNameChange}
                placeholder={t('settings.namePlaceholder')}
                className="settings-input"
              />
            </div>
            <div className="settings-field">
              <label>{t('settings.gender')}</label>
              <div className="settings-voice-group">
                <button
                  className={`btn btn-voice ${gender === 'boy' ? 'active' : ''}`}
                  onClick={() => handleGenderChange('boy')}
                >
                  <span className="ico">👦</span> {t('settings.genderBoy')}
                </button>
                <button
                  className={`btn btn-voice ${gender === 'girl' ? 'active' : ''}`}
                  onClick={() => handleGenderChange('girl')}
                >
                  <span className="ico">👧</span> {t('settings.genderGirl')}
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Preferences Section */}
        <section className="settings-section">
          <h2>{t('settings.prefs')}</h2>

          <div className="settings-field">
            <label>{t('settings.interfaceLang')}</label>
            <div className="settings-voice-group">
              <button
                className={`btn btn-voice ${lang === 'zh' ? 'active' : ''}`}
                onClick={() => setLang('zh')}
              >
                {t('settings.langZh')}
              </button>
              <button
                className={`btn btn-voice ${lang === 'en' ? 'active' : ''}`}
                onClick={() => setLang('en')}
              >
                {t('settings.langEn')}
              </button>
            </div>
          </div>

          <div className="settings-field">
            <label>{t('settings.voice')}</label>
            <div className="settings-voice-group">
              <button
                className={`btn btn-voice ${defaultVoice === 'zh-HK' ? 'active' : ''}`}
                onClick={() => handleVoiceChange('zh-HK')}
              >
                {t('settings.voiceCantonese')}
              </button>
              <button
                className={`btn btn-voice ${defaultVoice === 'zh-CN' ? 'active' : ''}`}
                onClick={() => handleVoiceChange('zh-CN')}
              >
                {t('settings.voiceMandarin')}
              </button>
              <button
                className={`btn btn-voice ${defaultVoice === 'en-US' ? 'active' : ''}`}
                onClick={() => handleVoiceChange('en-US')}
              >
                {t('settings.voiceEnglish')}
              </button>
            </div>
          </div>

          <div className="settings-field">
            <label>{t('settings.speed', { n: voiceSpeed.toFixed(1) })}</label>
            <input
              type="range"
              min="0.5"
              max="1.5"
              step="0.1"
              value={voiceSpeed}
              onChange={handleSpeedChange}
              className="settings-slider"
            />
          </div>

          <div className="settings-field">
            <label>{t('settings.theme')}</label>
            <div className="settings-voice-group">
              <button
                className={`btn btn-voice ${theme === 'light' ? 'active' : ''}`}
                onClick={() => setTheme('light')}
              >
                {t('settings.themeLight')}
              </button>
              <button
                className={`btn btn-voice ${theme === 'dark' ? 'active' : ''}`}
                onClick={() => setTheme('dark')}
              >
                {t('settings.themeDark')}
              </button>
            </div>
          </div>

          <div className="settings-field">
            <label>{t('settings.fontSize')}</label>
            <div className="settings-voice-group">
              <button
                className={`btn btn-voice ${fontScale === 'small' ? 'active' : ''}`}
                onClick={() => setFontScale('small')}
              >
                {t('settings.fontSmall')}
              </button>
              <button
                className={`btn btn-voice ${fontScale === 'medium' ? 'active' : ''}`}
                onClick={() => setFontScale('medium')}
              >
                {t('settings.fontMedium')}
              </button>
              <button
                className={`btn btn-voice ${fontScale === 'large' ? 'active' : ''}`}
                onClick={() => setFontScale('large')}
              >
                {t('settings.fontLarge')}
              </button>
            </div>
          </div>

          <div className="settings-field">
            <label>{t('settings.sound')}</label>
            <div className="settings-voice-group">
              <button
                className={`btn btn-voice ${soundOn ? 'active' : ''}`}
                onClick={() => setSoundOn(true)}
              >
                {t('settings.soundOn')}
              </button>
              <button
                className={`btn btn-voice ${!soundOn ? 'active' : ''}`}
                onClick={() => setSoundOn(false)}
              >
                {t('settings.soundOff')}
              </button>
            </div>
          </div>
        </section>

        {/* Points Summary */}
        <section className="settings-section">
          <h2>{t('settings.points')}</h2>
          <div className="settings-points">
            <div className="settings-points-total">
              <span className="settings-points-number">{points}</span>
              <span>{t('common.points')}</span>
            </div>
          </div>
        </section>

        {/* About */}
        <section className="settings-section">
          <h2>{t('settings.about')}</h2>
          <p className="settings-about">{t('app.name')} {t('app.version')}</p>
          <p className="settings-about">{t('app.tagline')}</p>
        </section>
      </div>
    </div>
  );
}
