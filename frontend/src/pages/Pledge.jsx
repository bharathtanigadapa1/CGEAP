import { useEffect, useState } from 'react';
import { api } from '../lib/api.js';
import { useLang } from '../context/LangContext.jsx';
import Message from '../components/Message.jsx';

export default function Pledge() {
  const { t, lang } = useLang();
  const [all, setAll] = useState([]);
  const [chosen, setChosen] = useState([]);
  const [reviewing, setReviewing] = useState(false);
  const [saved, setSaved] = useState(null);
  const [msg, setMsg] = useState(null);

  useEffect(() => {
    api('/api/pledges').then(setAll).catch(e => setMsg({ text: e.message, error: true }));
    // pre-select what the user already pledged before
    api('/api/pledges/mine').then(p => p?.pledges && setChosen(p.pledges.map(x => x.id))).catch(() => {});
  }, []);

  const toggle = id => setChosen(c => (c.includes(id) ? c.filter(x => x !== id) : [...c, id]));
  const text = p => (lang === 'te' ? p.te : p.en);

  const review = e => {
    e.preventDefault();
    if (!chosen.length) return setMsg({ text: t('Select at least one pledge.', 'కనీసం ఒక ప్రతిజ్ఞను ఎంచుకోండి.'), error: true });
    setMsg(null); setSaved(null); setReviewing(true);
  };

  const submit = async () => {
    try {
      const d = await api('/api/pledges', { method: 'POST', body: { pledges: chosen, confirmed: true } });
      setSaved(d.pledges); setReviewing(false); setMsg(null);
    } catch (err) { setMsg({ text: err.message, error: true }); }
  };

  return (
    <div className="form-card">
      <h1>{t('🌱 Green Pledge', '🌱 హరిత ప్రతిజ్ఞ')}</h1>
      <p>{t('Select all the promises you are ready to follow.', 'మీరు పాటించడానికి సిద్ధంగా ఉన్న అన్ని వాగ్దానాలను ఎంచుకోండి.')}</p>
      <form onSubmit={review}>
        {all.map(p => (
          <label className="pledge" key={p.id}>
            <input type="checkbox" checked={chosen.includes(p.id)} onChange={() => toggle(p.id)} />
            <span>{text(p)}</span>
          </label>
        ))}
        <button className="btn" type="submit">{t('Review My Pledge', 'నా ప్రతిజ్ఞను పరిశీలించండి')}</button>
      </form>

      {reviewing && (
        <div className="choice-preview">
          <h3>{t('Please review your selections', 'మీ ఎంపికలను పరిశీలించండి')}</h3>
          <ul>{all.filter(p => chosen.includes(p.id)).map(p => <li key={p.id}>{text(p)}</li>)}</ul>
          <p>{t('Do you want to change any selected option before submitting?', 'సమర్పించే ముందు ఏదైనా ఎంపికను మార్చాలనుకుంటున్నారా?')}</p>
          <button type="button" className="btn gray" onClick={() => setReviewing(false)}>{t('Change Selection', 'ఎంపిక మార్చండి')}</button>{' '}
          <button type="button" className="btn" onClick={submit}>{t('Confirm & Submit', 'నిర్ధారించి సమర్పించండి')}</button>
        </div>
      )}
      {saved && (
        <div className="message">
          <strong>{t('Your selected pledges:', 'మీరు ఎంచుకున్న ప్రతిజ్ఞలు:')}</strong>
          {saved.map(p => <div key={p.id}>🌱 {text(p)}</div>)}
        </div>
      )}
      <Message msg={msg} />
    </div>
  );
}
