import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { api, compressImage } from '../lib/api.js';
import { useAuth } from '../context/AuthContext.jsx';
import { useLang } from '../context/LangContext.jsx';
import Message from '../components/Message.jsx';

export default function Actions() {
  const { t } = useLang();
  const { user } = useAuth();
  const [params] = useSearchParams();
  const [activities, setActivities] = useState([]);
  const [recent, setRecent] = useState([]);
  const [f, setF] = useState({
    activity: params.get('activity') || '', name: user?.name || '', village: user?.village || '',
    date: new Date().toISOString().slice(0, 10), time: '', description: ''
  });
  const [photo, setPhoto] = useState('');
  const [fileKey, setFileKey] = useState(0);
  const [msg, setMsg] = useState(null);
  const [busy, setBusy] = useState(false);

  const loadRecent = () => api('/api/activities/recent').then(setRecent).catch(() => {});
  useEffect(() => {
    api('/api/activities').then(list => {
      setActivities(list);
      const pre = list.find(a => a.name === params.get('activity'));
      if (pre) setF(x => ({ ...x, description: pre.description }));
    }).catch(e => setMsg({ text: e.message, error: true }));
    loadRecent();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const selected = activities.find(a => a.name === f.activity);
  const set = k => e => setF({ ...f, [k]: e.target.value });
  const pickActivity = e => {
    const a = activities.find(x => x.name === e.target.value);
    setF({ ...f, activity: e.target.value, description: a ? a.description : f.description });
  };
  const onPhoto = async e => {
    const file = e.target.files[0];
    if (file) setPhoto(await compressImage(file)); else setPhoto('');
  };

  const submit = async e => {
    e.preventDefault();
    if (!photo) return setMsg({ text: t('Please upload a photo as proof.', 'దయచేసి ఆధారంగా ఫోటో అప్‌లోడ్ చేయండి.'), error: true });
    setBusy(true);
    try {
      await api('/api/actions', { method: 'POST', body: { ...f, photoData: photo } });
      setMsg({ text: t('Green action recorded successfully!', 'హరిత చర్య విజయవంతంగా నమోదు చేయబడింది!') });
      setF({ ...f, activity: '', time: '', description: '' });
      setPhoto(''); setFileKey(k => k + 1);
      loadRecent();
    } catch (err) { setMsg({ text: err.message, error: true }); }
    setBusy(false);
  };

  return (
    <>
      <div className="form-card">
        <h1>{t('🌱 Record Green Action', '🌱 హరిత చర్య నమోదు')}</h1>
        <p>{t('Record an environmental activity you completed in your community.', 'మీ సమాజంలో మీరు చేసిన పర్యావరణ కార్యకలాపాన్ని నమోదు చేయండి.')}</p>
        {selected && (
          <div className="info-card">
            <h3>{selected.icon} {selected.title}</h3>
            <p>{selected.description}</p>
            <p><strong>{t('Selected activity will be used for your participation record.', 'మీ పాల్గొనడం కోసం ఎంచుకున్న కార్యక్రమం నమోదు చేయబడుతుంది.')}</strong></p>
          </div>
        )}
        <form onSubmit={submit}>
          <label>{t('Activity', 'కార్యకలాపం')}</label>
          <select value={f.activity} onChange={pickActivity} required>
            <option value="">{t('Select activity', 'కార్యకలాపాన్ని ఎంచుకోండి')}</option>
            {activities.map(a => <option key={a.id} value={a.name}>{a.title}</option>)}
          </select>
          <label>{t('Full Name', 'పూర్తి పేరు')}</label>
          <input value={f.name} onChange={set('name')} required />
          <label>{t('Village', 'గ్రామం')}</label>
          <input value={f.village} onChange={set('village')} required />
          <label>{t('Date', 'తేదీ')}</label>
          <input type="date" value={f.date} onChange={set('date')} required />
          <label>{t('Time', 'సమయం')}</label>
          <input type="time" value={f.time} onChange={set('time')} required />
          <label>{t('Description', 'వివరణ')}</label>
          <textarea value={f.description} onChange={set('description')} required />
          <label>{t('Upload Photo Proof', 'ఫోటో ఆధారం అప్‌లోడ్ చేయండి')}</label>
          <input key={fileKey} type="file" accept="image/*" onChange={onPhoto} required />
          {photo && <img className="preview" style={{ display: 'block' }} src={photo} alt="preview" />}
          <button className="btn" disabled={busy}>{t('Submit Green Action', 'హరిత చర్యను సమర్పించండి')}</button>
        </form>
        <Message msg={msg} />
      </div>

      <div className="dashboard-card">
        <h2>{t('Recent Environmental Activities', 'ఇటీవలి పర్యావరణ కార్యకలాపాలు')}</h2>
        {recent.length === 0 && <p>{t('No activities recorded yet.', 'ఇంకా కార్యకలాపాలు నమోదు కాలేదు.')}</p>}
        {recent.map(x => (
          <div className="info-card" key={x.id}>
            <strong>🌱 {x.activity}</strong>
            <p>{x.description}</p>
            <small>{x.userId?.name || x.name} · {x.userId?.village || x.village} · {x.date}</small>
          </div>
        ))}
      </div>
    </>
  );
}
