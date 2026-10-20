import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useLang } from '../context/LangContext.jsx';

export default function Navbar() {
  const { user, isAdmin, logout } = useAuth();
  const { lang, setLang, t } = useLang();
  const navigate = useNavigate();

  const links = [
    ['/', 'Home', 'హోమ్'],
    ['/learn', 'Learn', 'నేర్చుకోండి'],
    ['/actions', 'Green Actions', 'హరిత చర్యలు'],
    ['/pledge', 'Green Pledge', 'హరిత ప్రతిజ్ఞ'],
    ['/quiz', 'Quiz', 'క్విజ్'],
    ['/report', 'Report Issue', 'సమస్య నివేదించండి'],
    ['/dashboard', 'Dashboard', 'డాష్‌బోర్డ్'],
    ['/about', 'About', 'మా గురించి']
  ];

  return (
    <nav>
      <Link to="/" className="logo" style={{ color: 'white', textDecoration: 'none' }}>🌿 CEAGAP</Link>
      {links.map(([to, en, te]) => (
        <NavLink key={to} to={to} end={to === '/'}>{t(en, te)}</NavLink>
      ))}
      {isAdmin && <NavLink to="/admin">{t('Admin', 'అడ్మిన్')}</NavLink>}
      <div className="language-buttons">
        <button className={lang === 'en' ? 'active' : ''} onClick={() => setLang('en')}>EN</button>
        <button className={lang === 'te' ? 'active' : ''} onClick={() => setLang('te')}>తెలుగు</button>
      </div>
      {user ? (
        <>
          <span className="nav-user">{user.name}</span>
          <button className="navbtn" onClick={() => { logout(); navigate('/login'); }}>{t('Logout', 'లాగ్అవుట్')}</button>
        </>
      ) : (
        <Link className="navbtn" to="/login">{t('Login / Register', 'లాగిన్ / నమోదు')}</Link>
      )}
    </nav>
  );
}
