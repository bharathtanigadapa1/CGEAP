import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useLang } from '../context/LangContext.jsx';
import Message from '../components/Message.jsx';
import { LangSwitch } from './Login.jsx';

export default function Register() {
  const { register } = useAuth();
  const { t } = useLang();
  const navigate = useNavigate();
  const [f, setF] = useState({ name: '', email: '', mobile: '', village: '', password: '', confirm: '' });
  const [msg, setMsg] = useState(null);
  const [busy, setBusy] = useState(false);
  const set = k => e => setF({ ...f, [k]: e.target.value });

  const submit = async e => {
    e.preventDefault();
    if (f.password !== f.confirm) return setMsg({ text: t('Passwords do not match.', 'పాస్‌వర్డ్‌లు సరిపోలడం లేదు.'), error: true });
    setBusy(true);
    try {
      const { confirm, ...body } = f;
      await register(body);
      navigate('/', { replace: true });
    } catch (err) { setMsg({ text: err.message, error: true }); }
    setBusy(false);
  };

  return (
    <div className="auth-page">
      <div className="register-wrapper">
        <div className="register-info">
          <div style={{ fontSize: 30 }}>🌿 CEAGAP</div>
          <h1>{t('Join the Green Community', 'హరిత సమాజంలో చేరండి')}</h1>
          <p>{t('Create your normal user account and take part in environmental actions, pledges, quizzes and community reporting.', 'మీ సాధారణ వినియోగదారు ఖాతాను సృష్టించి పర్యావరణ చర్యలు, ప్రతిజ్ఞలు, క్విజ్‌లు మరియు సమాజ నివేదికల్లో పాల్గొనండి.')}</p>
        </div>
        <div className="register-form">
          <LangSwitch />
          <h1>{t('Create Account', 'ఖాతాను సృష్టించండి')}</h1>
          <p style={{ textAlign: 'center' }}>{t('Normal users only', 'సాధారణ వినియోగదారులకు మాత్రమే')}</p>
          <form onSubmit={submit}>
            <label>{t('Full Name *', 'పూర్తి పేరు *')}</label>
            <input value={f.name} onChange={set('name')} required />
            <label>{t('Email (Optional)', 'ఇమెయిల్ (ఐచ్ఛికం)')}</label>
            <input type="email" value={f.email} onChange={set('email')} />
            <label>{t('Mobile Number *', 'మొబైల్ నంబర్ *')}</label>
            <input type="tel" value={f.mobile} onChange={set('mobile')} required />
            <label>{t('Village *', 'గ్రామం *')}</label>
            <input value={f.village} onChange={set('village')} required />
            <label>{t('Password *', 'పాస్‌వర్డ్ *')}</label>
            <input type="password" minLength={6} value={f.password} onChange={set('password')} required />
            <label>{t('Confirm Password *', 'పాస్‌వర్డ్ నిర్ధారించండి *')}</label>
            <input type="password" value={f.confirm} onChange={set('confirm')} required />
            <button className="btn" style={{ width: '100%' }} disabled={busy}>{t('Create Account', 'ఖాతాను సృష్టించండి')}</button>
          </form>
          <Message msg={msg} />
          <div className="auth-links"><Link to="/login">{t('Back to Login', 'లాగిన్‌కు తిరిగి వెళ్లండి')}</Link></div>
        </div>
      </div>
    </div>
  );
}
