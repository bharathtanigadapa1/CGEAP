import { useState } from 'react';
import { api } from '../lib/api.js';
import { useAuth } from '../context/AuthContext.jsx';
import { useLang } from '../context/LangContext.jsx';
import Message from '../components/Message.jsx';

const TYPES = ['Activity Suggestion', 'Village Environmental Concern', 'Partnership / Collaboration', 'Volunteer Opportunity',
  'Awareness Program Request', 'Technical Issue', 'Quiz Feedback', 'Website Suggestion', 'Other'];

export default function Contact() {
  const { t } = useLang();
  const { user } = useAuth();
  const empty = { name: user?.name || '', email: user?.email || '', mobile: user?.mobile || '', village: user?.village || '', type: '', message: '' };
  const [f, setF] = useState(empty);
  const [msg, setMsg] = useState(null);
  const [busy, setBusy] = useState(false);
  const set = k => e => setF({ ...f, [k]: e.target.value });

  const submit = async e => {
    e.preventDefault();
    setBusy(true);
    try {
      await api('/api/messages', { method: 'POST', body: f });
      setMsg({ text: t('Message sent successfully. Thank you!', 'సందేశం విజయవంతంగా పంపబడింది. ధన్యవాదాలు!') });
      setF({ ...empty, type: '', message: '' });
    } catch (err) { setMsg({ text: err.message, error: true }); }
    setBusy(false);
  };

  return (
    <div className="grid-2">
      <div className="info-card">
        <h1>{t('📞 Get in Touch', '📞 మమ్మల్ని సంప్రదించండి')}</h1>
        <p><b>Email:</b> support@ceagap.org</p>
        <p><b>Phone:</b> +91 90000 00000</p>
        <p><b>Address:</b> Community Environmental Awareness Centre</p>
        <p>{t('We welcome questions, suggestions and community participation.', 'మీ ప్రశ్నలు, సూచనలు మరియు సమాజ భాగస్వామ్యాన్ని మేము స్వాగతిస్తున్నాము.')}</p>
        <div className="info-box">
          <strong>{t('Useful suggestions you can send us', 'మీరు పంపగల ఉపయోగకరమైన సూచనలు')}</strong>
          <p>• New environmental activity ideas<br />• Village environmental concerns<br />• Partnership/collaboration ideas<br />• Volunteer opportunities<br />• Awareness program requests<br />• Technical issues<br />• Quiz feedback<br />• Website improvement suggestions</p>
        </div>
      </div>
      <div className="info-card">
        <h2>{t('Send a Message', 'సందేశం పంపండి')}</h2>
        <form onSubmit={submit}>
          <label>Name</label><input value={f.name} onChange={set('name')} required />
          <label>Email</label><input type="email" value={f.email} onChange={set('email')} />
          <label>Mobile</label><input type="tel" value={f.mobile} onChange={set('mobile')} />
          <label>Village</label><input value={f.village} onChange={set('village')} />
          <label>Message Type</label>
          <select value={f.type} onChange={set('type')} required>
            <option value="">Select type</option>
            {TYPES.map(x => <option key={x}>{x}</option>)}
          </select>
          <label>Message</label><textarea value={f.message} onChange={set('message')} required />
          <button className="btn" disabled={busy}>{t('Send Message', 'సందేశం పంపండి')}</button>
        </form>
        <Message msg={msg} />
      </div>
    </div>
  );
}
