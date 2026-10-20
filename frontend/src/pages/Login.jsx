import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useLang } from '../context/LangContext.jsx';
import Message from '../components/Message.jsx';

export function LangSwitch() {
  const { lang, setLang } = useLang();
  return (
    <div className="auth-language">
      <button className={lang === 'en' ? 'active' : ''} onClick={() => setLang('en')}>EN</button>
      <button className={lang === 'te' ? 'active' : ''} onClick={() => setLang('te')}>తెలుగు</button>
    </div>
  );
}

export default function Login() {
  const { login, adminLogin, continueAsGuest } = useAuth();
  const { t } = useLang();
  const navigate = useNavigate();
  const location = useLocation();
  const [tab, setTab] = useState('user');
  const [msg, setMsg] = useState(null);
  const [busy, setBusy] = useState(false);
  const [f, setF] = useState({ mobile: '', password: '', username: '', adminPassword: '' });
  const set = k => e => setF({ ...f, [k]: e.target.value });

  const submitUser = async e => {
    e.preventDefault();
    setBusy(true);
    setMsg({ text: t('Signing in...', 'లాగిన్ అవుతోంది...') });
    try {
      const u = await login(f.mobile, f.password);
      if (u.role !== 'user') throw new Error(t('Use Admin Login for an administrator account.', 'అడ్మిన్ ఖాతా కోసం Admin Login ఉపయోగించండి.'));
      navigate(location.state?.from || '/', { replace: true });
    } catch (err) { setMsg({ text: err.message, error: true }); }
    setBusy(false);
  };

  const submitAdmin = async e => {
    e.preventDefault();
    setBusy(true);
    setMsg({ text: t('Checking admin access...', 'అడ్మిన్ యాక్సెస్ తనిఖీ చేస్తోంది...') });
    try {
      await adminLogin(f.username, f.adminPassword);
      navigate('/admin', { replace: true });
    } catch (err) { setMsg({ text: err.message, error: true }); }
    setBusy(false);
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">🌿 CEAGAP</div>
        <LangSwitch />
        <h1>{t('Welcome', 'స్వాగతం')}</h1>
        <p style={{ textAlign: 'center' }}>{t('Choose how you want to enter CEAGAP.', 'మీరు CEAGAP లోకి ఎలా ప్రవేశించాలనుకుంటున్నారో ఎంచుకోండి.')}</p>
        <div className="auth-switch">
          <button className={tab === 'user' ? 'active' : ''} onClick={() => { setTab('user'); setMsg(null); }}>{t('Normal User', 'సాధారణ వినియోగదారు')}</button>
          <button className={tab === 'admin' ? 'active' : ''} onClick={() => { setTab('admin'); setMsg(null); }}>{t('Admin Login', 'అడ్మిన్ లాగిన్')}</button>
        </div>

        {tab === 'user' ? (
          <>
            <form onSubmit={submitUser}>
              <label>{t('Mobile Number', 'మొబైల్ నంబర్')}</label>
              <input type="tel" value={f.mobile} onChange={set('mobile')} required />
              <label>{t('Password', 'పాస్‌వర్డ్')}</label>
              <input type="password" value={f.password} onChange={set('password')} required />
              <button className="btn" style={{ width: '100%' }} disabled={busy}>{t('Login', 'లాగిన్')}</button>
            </form>
            <div className="auth-links"><Link to="/register">{t('Create a normal user account', 'సాధారణ వినియోగదారు ఖాతాను సృష్టించండి')}</Link></div>
            <div className="auth-note">{t('Normal users can register. Admin accounts are private and cannot be registered here.', 'సాధారణ వినియోగదారులు నమోదు చేసుకోవచ్చు. అడ్మిన్ ఖాతాలను ఇక్కడ నమోదు చేయలేరు.')}</div>
          </>
        ) : (
          <>
            <form onSubmit={submitAdmin}>
              <label>{t('Admin Username', 'అడ్మిన్ వినియోగదారు పేరు')}</label>
              <input value={f.username} onChange={set('username')} autoComplete="username" required />
              <label>{t('Password', 'పాస్‌వర్డ్')}</label>
              <input type="password" value={f.adminPassword} onChange={set('adminPassword')} autoComplete="current-password" required />
              <button className="btn orange" style={{ width: '100%' }} disabled={busy}>{t('Admin Login', 'అడ్మిన్ లాగిన్')}</button>
            </form>
            <div className="auth-note">{t('Authorized administrators only.', 'అధికారిక అడ్మిన్లకు మాత్రమే.')}</div>
          </>
        )}

        <Message msg={msg} />
        <div className="guest">
          <button onClick={() => { continueAsGuest(); navigate('/'); }}>{t('Continue Without Login', 'లాగిన్ లేకుండా కొనసాగండి')}</button>
        </div>
      </div>
    </div>
  );
}
