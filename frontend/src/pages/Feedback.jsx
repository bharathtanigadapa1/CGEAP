import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { api } from '../lib/api.js';
import { useLang } from '../context/LangContext.jsx';
import Message from '../components/Message.jsx';
import Stars from '../components/Stars.jsx';

export default function Feedback() {
  const { t } = useLang();
  const [params] = useSearchParams();
  const [activities, setActivities] = useState([]);
  const [activity, setActivity] = useState(params.get('activity') || '');
  const [rating, setRating] = useState(0);
  const [text, setText] = useState('');
  const [msg, setMsg] = useState(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => { api('/api/activities').then(setActivities).catch(e => setMsg({ text: e.message, error: true })); }, []);

  const submit = async e => {
    e.preventDefault();
    if (!rating) return setMsg({ text: t('Please select a rating.', 'దయచేసి రేటింగ్ ఎంచుకోండి.'), error: true });
    setBusy(true);
    try {
      await api('/api/feedback', { method: 'POST', body: { activity, rating, text } });
      setMsg({ text: t('Thank you! Your feedback has been submitted.', 'ధన్యవాదాలు! మీ అభిప్రాయం సమర్పించబడింది.') });
      setActivity(''); setRating(0); setText('');
    } catch (err) { setMsg({ text: err.message, error: true }); }
    setBusy(false);
  };

  return (
    <div className="form-card">
      <h1>{t('💬 Activity Feedback', '💬 కార్యక్రమ అభిప్రాయం')}</h1>
      <p>{t('Tell us about your experience with a CEAGAP activity.', 'CEAGAP కార్యక్రమంలో మీ అనుభవం గురించి మాకు చెప్పండి.')}</p>
      <form onSubmit={submit}>
        <label>{t('Activity', 'కార్యకలాపం')}</label>
        <select value={activity} onChange={e => setActivity(e.target.value)} required>
          <option value="">{t('Select activity', 'కార్యకలాపాన్ని ఎంచుకోండి')}</option>
          {activities.map(a => <option key={a.id} value={a.name}>{a.title}</option>)}
        </select>
        <label>{t('Rating', 'రేటింగ్')}</label>
        <Stars value={rating} onChange={setRating} />
        <label>{t('Feedback', 'అభిప్రాయం')}</label>
        <textarea value={text} onChange={e => setText(e.target.value)} required />
        <button className="btn" disabled={busy}>{t('Submit Feedback', 'అభిప్రాయాన్ని సమర్పించండి')}</button>
      </form>
      <Message msg={msg} />
    </div>
  );
}
