import { useState } from 'react';
import { api, compressImage } from '../lib/api.js';
import { useLang } from '../context/LangContext.jsx';
import Message from '../components/Message.jsx';

const CATEGORIES = ['Water Problem', 'Plastic Pollution', 'Waste Dumping', 'Air Pollution', 'Tree Cutting', 'Soil/Erosion', 'Other'];

export default function Report() {
  const { t } = useLang();
  const [f, setF] = useState({ category: '', location: '', description: '' });
  const [photo, setPhoto] = useState('');
  const [fileKey, setFileKey] = useState(0);
  const [msg, setMsg] = useState(null);
  const [busy, setBusy] = useState(false);
  const set = k => e => setF({ ...f, [k]: e.target.value });

  const submit = async e => {
    e.preventDefault();
    setBusy(true);
    try {
      const d = await api('/api/issues', { method: 'POST', body: { ...f, photoData: photo } });
      setMsg({ text: t('Report submitted successfully. Tracking ID: ', 'నివేదిక విజయవంతంగా సమర్పించబడింది. ట్రాకింగ్ ID: ') + d.trackingId });
      setF({ category: '', location: '', description: '' });
      setPhoto(''); setFileKey(k => k + 1);
    } catch (err) { setMsg({ text: err.message, error: true }); }
    setBusy(false);
  };

  return (
    <div className="form-card">
      <h1>{t('🚨 Report Environmental Issue', '🚨 పర్యావరణ సమస్యను నివేదించండి')}</h1>
      <p>{t('Report an environmental problem in your community. Your report will be reviewed by CEAGAP administrators.', 'మీ సమాజంలోని పర్యావరణ సమస్యను నివేదించండి. మీ నివేదికను CEAGAP అడ్మిన్లు పరిశీలిస్తారు.')}</p>
      <form onSubmit={submit}>
        <label>{t('Issue Category', 'సమస్య వర్గం')}</label>
        <select value={f.category} onChange={set('category')} required>
          <option value="">{t('Select category', 'వర్గాన్ని ఎంచుకోండి')}</option>
          {CATEGORIES.map(c => <option key={c}>{c}</option>)}
        </select>
        <label>{t('Location', 'స్థానం')}</label>
        <input value={f.location} onChange={set('location')} required />
        <label>{t('Description', 'వివరణ')}</label>
        <textarea value={f.description} onChange={set('description')} required />
        <label>{t('Upload Photo', 'ఫోటో అప్‌లోడ్ చేయండి')}</label>
        <input key={fileKey} type="file" accept="image/*" onChange={async e => setPhoto(e.target.files[0] ? await compressImage(e.target.files[0]) : '')} />
        {photo && <img className="preview" style={{ display: 'block' }} src={photo} alt="preview" />}
        <button className="btn orange" disabled={busy}>{t('Submit Report', 'నివేదికను సమర్పించండి')}</button>
      </form>
      <Message msg={msg} />
    </div>
  );
}
