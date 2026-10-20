import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../lib/api.js';
import { useLang } from '../context/LangContext.jsx';
import Message from '../components/Message.jsx';

export default function Activities() {
  const { t } = useLang();
  const [list, setList] = useState([]);
  const [err, setErr] = useState('');
  useEffect(() => { api('/api/activities').then(setList).catch(e => setErr(e.message)); }, []);
  return (
    <>
      <div className="title">
        <h1>{t('🌱 Community Activities', '🌱 సమాజ కార్యక్రమాలు')}</h1>
        <p>{t('Choose an activity you want to participate in.', 'మీరు పాల్గొనాలనుకునే కార్యక్రమాన్ని ఎంచుకోండి.')}</p>
      </div>
      <Message msg={err && { text: err, error: true }} />
      <div className="grid">
        {list.map(x => (
          <div className="activity-card" key={x.id}>
            <h2>{x.icon} <span>{x.title}</span></h2>
            <p className="activity-date">{x.date}</p>
            <p>{x.description}</p>
            <Link className="btn" to={`/actions?activity=${encodeURIComponent(x.name)}`}>{t('Participate', 'పాల్గొనండి')}</Link>{' '}
            <Link className="btn orange" to={`/feedback?activity=${encodeURIComponent(x.name)}`}>{t('Feedback', 'అభిప్రాయం')}</Link>
          </div>
        ))}
      </div>
    </>
  );
}
