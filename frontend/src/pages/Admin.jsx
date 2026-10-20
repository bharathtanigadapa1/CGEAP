import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api, fetchImageUrl } from '../lib/api.js';
import { useAuth } from '../context/AuthContext.jsx';
import Message from '../components/Message.jsx';

const fmt = v => (v ? new Date(v).toLocaleDateString() : '-');
const who = u => (u ? `${u.name || u.username || '-'}${u.village ? ' (' + u.village + ')' : ''}` : '-');
const STATUSES = ['Pending', 'Ongoing', 'Completed', 'Rejected'];

function Table({ head, rows, empty = 'No records yet.' }) {
  return (
    <div className="dashboard-card">
      <div className="table-wrap">
        <table className="admin-table">
          <thead><tr>{head.map(h => <th key={h}>{h}</th>)}</tr></thead>
          <tbody>
            {rows.length ? rows : <tr><td colSpan={head.length} style={{ textAlign: 'center', color: '#718078' }}>{empty}</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function Admin() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [msg, setMsg] = useState(null);
  const [photo, setPhoto] = useState(null); // {title, url}

  const load = useCallback(async () => {
    try {
      const [overview, issues, actions, feedback, quizzes, users, pledges, messages] = await Promise.all([
        api('/api/admin/overview'), api('/api/admin/issues'), api('/api/admin/actions'), api('/api/admin/feedback'),
        api('/api/admin/quizzes'), api('/api/admin/users'), api('/api/admin/pledges'), api('/api/admin/messages')
      ]);
      setData({ overview, issues, actions, feedback, quizzes, users, pledges, messages });
      setMsg(null);
    } catch (e) { setMsg({ text: e.message, error: true }); }
  }, []);
  useEffect(() => { load(); }, [load]);

  const setStatus = async (id, status) => {
    try { await api('/api/admin/issues/' + id, { method: 'PATCH', body: { status } }); await load(); }
    catch (e) { setMsg({ text: e.message, error: true }); }
  };
  const showPhoto = async (kind, id, title) => {
    try { setPhoto({ title, url: await fetchImageUrl(`/api/admin/${kind}/${id}/photo`) }); }
    catch (e) { setMsg({ text: e.message, error: true }); }
  };
  const closePhoto = () => { if (photo) URL.revokeObjectURL(photo.url); setPhoto(null); };

  const o = data?.overview;
  const cards = o ? [
    ['👥', o.users, 'Users'], ['🌱', o.actions, 'Green Actions'], ['💬', o.feedbacks, 'Feedback'], ['🧠', o.quizzes, 'Quiz Attempts'],
    ['🚨', o.issues, 'Issues'], ['🤝', o.pledges, 'Pledges'], ['✉️', o.messages, 'Messages'], ['📊', o.averageQuiz + '/5', 'Average Quiz Score']
  ] : [];
  const totalIssues = Math.max(o?.issues || 0, 1);

  return (
    <div>
      <nav>
        <div className="logo">🌿 CEAGAP Admin</div>
        <span className="nav-user">{user?.name || user?.username}</span>
        <button className="navbtn" onClick={load}>Refresh</button>
        <button className="navbtn" onClick={() => { logout(); navigate('/login'); }}>Logout</button>
      </nav>

      <div className="admin-shell">
        <div className="admin-top">
          <div><h1>Admin Dashboard</h1><p>Community environmental activity, reports and engagement overview.</p></div>
        </div>
        <Message msg={msg} />
        {!data && !msg && <p>Loading...</p>}

        {data && (
          <>
            <div className="admin-stat-grid">
              {cards.map(([icon, v, label]) => (
                <div className="admin-stat" key={label}><div className="icon">{icon}</div><h2>{v}</h2><p>{label}</p></div>
              ))}
            </div>

            <h2 style={{ margin: '35px 0 15px' }}>Reported Environmental Issues</h2>
            <div className="admin-stat-grid">
              {STATUSES.map(s => {
                const n = o[s.toLowerCase()];
                return (
                  <div className="admin-stat" key={s}>
                    <h2>{n}</h2><span className={'status-line status ' + s.toLowerCase()}>{s}</span>
                    <div className="progress" style={{ marginTop: 10 }}><span style={{ width: (n / totalIssues * 100) + '%' }} /></div>
                  </div>
                );
              })}
            </div>
            <Table head={['User', 'Issue', 'Location', 'Date', 'Status', 'Manage']} rows={data.issues.map(i => (
              <tr key={i.id}>
                <td>{who(i.userId)}<br /><small>{i.userId?.mobile}</small></td>
                <td><strong>{i.trackingId}</strong><br />{i.category}<br />{i.description}
                  {i.hasPhoto && <><br /><span className="photo-link" onClick={() => showPhoto('issues', i.id, i.trackingId)}>View photo</span></>}</td>
                <td>{i.location}</td>
                <td>{fmt(i.createdAt)}</td>
                <td><span className={'status-line status ' + i.status.toLowerCase()}>{i.status}</span></td>
                <td className="table-action">
                  <select value={i.status} onChange={e => setStatus(i.id, e.target.value)} style={{ marginTop: 0 }}>
                    {STATUSES.map(s => <option key={s}>{s}</option>)}
                  </select>
                </td>
              </tr>
            ))} />

            <h2 style={{ margin: '35px 0 15px' }}>Green Actions</h2>
            <Table head={['User', 'Activity', 'Village', 'Date', 'Time', 'Photo']} rows={data.actions.map(a => (
              <tr key={a.id}>
                <td>{who(a.userId)}<br /><small>{a.userId?.mobile}</small></td>
                <td><strong>{a.activity}</strong><br />{a.description}</td>
                <td>{a.village}</td><td>{a.date}</td><td>{a.time}</td>
                <td>{a.hasPhoto ? <span className="photo-link" onClick={() => showPhoto('actions', a.id, a.activity)}>View photo</span> : '-'}</td>
              </tr>
            ))} />

            <h2 style={{ margin: '35px 0 15px' }}>Feedback</h2>
            <Table head={['User', 'Activity', 'Rating', 'Comments', 'Date']} rows={data.feedback.map(f => (
              <tr key={f.id}><td>{who(f.userId)}</td><td>{f.activity}</td><td>{'★'.repeat(f.rating)}{'☆'.repeat(5 - f.rating)}</td><td>{f.text}</td><td>{fmt(f.createdAt)}</td></tr>
            ))} />

            <h2 style={{ margin: '35px 0 15px' }}>Quiz Performance</h2>
            <Table head={['User', 'Quiz', 'Score', 'Percentage', 'Badge', 'Date']} rows={data.quizzes.map(q => (
              <tr key={q.id}><td>{who(q.userId)}</td><td>{q.quizType}</td><td>{q.score}/{q.total}</td><td>{Math.round(q.score / q.total * 100)}%</td><td><span className="badge">{q.badge}</span></td><td>{fmt(q.createdAt)}</td></tr>
            ))} />

            <h2 style={{ margin: '35px 0 15px' }}>Registered Users</h2>
            <Table head={['Name', 'Mobile', 'Email', 'Village', 'Joined']} rows={data.users.map(u => (
              <tr key={u.id}><td>{u.name}</td><td>{u.mobile}</td><td>{u.email || '-'}</td><td>{u.village}</td><td>{fmt(u.createdAt)}</td></tr>
            ))} />

            <h2 style={{ margin: '35px 0 15px' }}>Green Pledges</h2>
            <Table head={['User', 'Selected Pledges', 'Confirmed', 'Date']} rows={data.pledges.map(p => (
              <tr key={p.id}><td>{who(p.userId)}</td><td>{p.pledges.map(x => <div key={x.id}>🌱 {x.en}</div>)}</td><td>{p.confirmed ? 'Yes' : 'No'}</td><td>{fmt(p.createdAt)}</td></tr>
            ))} />

            <h2 style={{ margin: '35px 0 15px' }}>Contact Messages</h2>
            <Table head={['Name', 'Mobile', 'Village', 'Type', 'Message', 'Date']} rows={data.messages.map(m => (
              <tr key={m.id}><td>{m.name}<br /><small>{m.email}</small></td><td>{m.mobile || '-'}</td><td>{m.village || '-'}</td><td>{m.type}</td><td>{m.message}</td><td>{fmt(m.createdAt)}</td></tr>
            ))} />
          </>
        )}
      </div>

      {photo && (
        <div className="modal-backdrop" onClick={e => e.target === e.currentTarget && closePhoto()}>
          <div className="modal">
            <button className="btn" style={{ marginTop: 0 }} onClick={closePhoto}>Close</button>
            <h3 style={{ marginTop: 12 }}>{photo.title}</h3>
            <img src={photo.url} alt={photo.title} />
          </div>
        </div>
      )}
    </div>
  );
}
