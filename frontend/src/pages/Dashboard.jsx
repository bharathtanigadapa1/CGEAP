import { useEffect, useState } from 'react';
import { api } from '../lib/api.js';
import { useLang } from '../context/LangContext.jsx';

export default function Dashboard() {
  const { t, lang } = useLang();
  const [d, setD] = useState(null);
  const [err, setErr] = useState('');

  useEffect(() => {
    Promise.all([api('/api/auth/me'), api('/api/actions/mine'), api('/api/issues/mine'), api('/api/pledges/mine'), api('/api/quizzes/results/mine')])
      .then(([me, actions, issues, pledge, quizzes]) => setD({ u: me.user, actions, issues, pledge, quizzes }))
      .catch(e => setErr(e.message));
  }, []);

  if (err) return <div className="message error">{err}</div>;
  if (!d) return <p>{t('Loading...', 'లోడ్ అవుతోంది...')}</p>;
  const { u, actions, issues, pledge, quizzes } = d;
  const pledges = pledge?.pledges || [];
  const stats = [['🌱', actions.length, 'Green Actions'], ['🚨', issues.length, 'Reports'], ['🤝', pledges.length, 'Pledges'], ['🧠', quizzes.length, 'Quiz Attempts']];

  return (
    <>
      <div className="title">
        <h1>{t('📊 My Dashboard', '📊 నా డాష్‌బోర్డ్')}</h1>
        <p>{u.name} — {u.village}</p>
      </div>
      <div className="dashboard-card">
        <h2>{t('My Profile', 'నా ప్రొఫైల్')}</h2>
        <div className="profile-grid" style={{ marginTop: 18 }}>
          <div className="profile-item"><small>Name</small><strong>{u.name}</strong></div>
          <div className="profile-item"><small>Mobile</small><strong>{u.mobile}</strong></div>
          <div className="profile-item"><small>Email</small><strong>{u.email || 'Not provided'}</strong></div>
          <div className="profile-item"><small>Village</small><strong>{u.village}</strong></div>
        </div>
      </div>
      <div className="stats" style={{ marginTop: 25 }}>
        {stats.map(([i, n, label]) => <div className="card stat" key={label}><div className="icon">{i}</div><h2>{n}</h2><p>{label}</p></div>)}
      </div>

      <div className="dashboard-card">
        <h2>🌱 {t('My Green Actions', 'నా హరిత చర్యలు')}</h2>
        {actions.length ? actions.map(x => (
          <div className="item" key={x.id}><strong>{x.activity}</strong> — {x.date} {x.time}<br />{x.description}</div>
        )) : <p>No green actions yet.</p>}
      </div>
      <div className="dashboard-card">
        <h2>🚨 {t('My Environmental Reports', 'నా పర్యావరణ నివేదికలు')}</h2>
        {issues.length ? issues.map(x => (
          <div className="item" key={x.id}>
            <strong>{x.trackingId}</strong> — <span className={'status-line status ' + (x.status || 'Pending').toLowerCase()}>{x.status}</span><br />
            {x.category} — {x.location}<br />{x.description}
          </div>
        )) : <p>No reports yet.</p>}
      </div>
      <div className="dashboard-card">
        <h2>🤝 {t('My Green Pledges', 'నా హరిత ప్రతిజ్ఞలు')}</h2>
        {pledges.length ? pledges.map(x => <div className="item" key={x.id}>🌱 {lang === 'te' && x.te ? x.te : x.en}</div>) : <p>No pledges yet.</p>}
      </div>
      <div className="dashboard-card">
        <h2>🧠 {t('My Quiz Performance', 'నా క్విజ్ పనితీరు')}</h2>
        {quizzes.length ? quizzes.map(x => (
          <div className="item" key={x.id}>
            <strong>{x.quizType}</strong> — {x.score}/{x.total} ({Math.round(x.score / x.total * 100)}%) — <span className="badge">{x.badge}</span><br />
            <small>{new Date(x.createdAt).toLocaleString()}</small>
          </div>
        )) : <p>No quiz results yet.</p>}
      </div>
    </>
  );
}
