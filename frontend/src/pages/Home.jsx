import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../lib/api.js';
import { useLang } from '../context/LangContext.jsx';

const SLIDES = [
  'https://images.unsplash.com/photo-1497250681960-ef046c08a56e?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1538300342682-cf57afb97285?auto=format&fit=crop&w=1200&q=80'
];
const VIDEOS = [
  ['/videos/water-conservation.mp4', 'Water Conservation'],
  ['/videos/plastic-reduction.mp4', 'Plastic Reduction'],
  ['/videos/waste-segregation.mp4', 'Waste Segregation'],
  ['/videos/tree-plantation.mp4', 'Tree Plantation']
];

function Slider() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setI(n => (n + 1) % SLIDES.length), 5000);
    return () => clearInterval(id);
  }, []);
  return (
    <>
      <div className="slider">
        {SLIDES.map((src, n) => <img key={src} src={src} alt="" className={n === i ? 'active' : ''} />)}
      </div>
      <div className="dots">
        {SLIDES.map((_, n) => <span key={n} className={'dot' + (n === i ? ' active' : '')} onClick={() => setI(n)} />)}
      </div>
    </>
  );
}

function VideoBox() {
  const { t } = useLang();
  const [i, setI] = useState(0);
  const [missing, setMissing] = useState(false);
  const go = d => { setMissing(false); setI(n => (n + d + VIDEOS.length) % VIDEOS.length); };
  useEffect(() => {
    const id = setInterval(() => go(1), 30000);
    return () => clearInterval(id);
  }, []);
  return (
    <div className="video-box">
      {missing
        ? <p style={{ color: 'white', padding: '40px 10px', textAlign: 'center' }}>
            {t('Video not added yet. Place the .mp4 files inside frontend/public/videos/.', 'వీడియో ఇంకా జోడించబడలేదు. .mp4 ఫైళ్లను frontend/public/videos/ లో ఉంచండి.')}
          </p>
        : <video key={VIDEOS[i][0]} src={VIDEOS[i][0]} muted autoPlay playsInline controls onError={() => setMissing(true)} />}
      <div className="video-controls">
        <button onClick={() => go(-1)}>{t('❮ Previous', '❮ మునుపటి')}</button>
        <span>{VIDEOS[i][1]}</span>
        <button onClick={() => go(1)}>{t('Next ❯', 'తదుపరి ❯')}</button>
      </div>
    </div>
  );
}

export default function Home() {
  const { t, lang } = useLang();
  const [stats, setStats] = useState(null);
  const [pledges, setPledges] = useState([]);
  const [recent, setRecent] = useState(null);

  useEffect(() => {
    api('/api/stats').then(setStats).catch(() => {});
    api('/api/pledges').then(setPledges).catch(() => {});
    api('/api/activities/recent').then(setRecent).catch(() => setRecent([]));
  }, []);

  const s = stats || {};
  const statCards = [
    [s.registeredCitizens, 'Registered Citizens', 'నమోదైన పౌరులు'],
    [s.greenActions, 'Green Actions', 'హరిత చర్యలు'],
    [s.treesPlanted, 'Trees Planted', 'నాటిన చెట్లు'],
    [s.wasteReduced, 'Waste Actions', 'వ్యర్థాల చర్యలు'],
    [s.plasticAvoided, 'Plastic Reduction Actions', 'ప్లాస్టిక్ తగ్గింపు చర్యలు'],
    [s.communityActivities, 'Community Activities', 'సమాజ కార్యక్రమాలు'],
    [s.villagesReached, 'Villages Reached', 'చేరుకున్న గ్రామాలు'],
    [stats ? s.positiveFeedback + '%' : 0, 'Positive Feedback', 'సానుకూల అభిప్రాయం']
  ];

  const doCards = [
    ['📚', 'Learn', 'నేర్చుకోండి', 'Learn about environmental protection and sustainable living.', 'పర్యావరణ పరిరక్షణ మరియు స్థిరమైన జీవనం గురించి తెలుసుకోండి.', '/learn', 'Learn More', 'మరింత తెలుసుకోండి'],
    ['🌱', 'Green Pledge', 'హరిత ప్రతిజ్ఞ', 'Choose environmental promises and commit to them.', 'పర్యావరణ వాగ్దానాలను ఎంచుకుని వాటికి కట్టుబడి ఉండండి.', '/pledge', 'Pledge', 'ప్రతిజ్ఞ చేయండి'],
    ['♻️', 'Green Actions', 'హరిత చర్యలు', 'Record your environmental activities with photo proof.', 'ఫోటో ఆధారంతో మీ పర్యావరణ కార్యకలాపాలను నమోదు చేయండి.', '/actions', 'Record', 'నమోదు చేయండి'],
    ['🧠', 'Environmental Quiz', 'పర్యావరణ క్విజ్', 'Test your environmental knowledge.', 'మీ పర్యావరణ జ్ఞానాన్ని పరీక్షించుకోండి.', '/quiz', 'Start Quiz', 'క్విజ్ ప్రారంభించండి']
  ];

  return (
    <>
      <section className="hero">
        <div>
          <h1>{t('Every Citizen. Every Action. One Greener Community.', 'ప్రతి పౌరుడు. ప్రతి చర్య. ఒక పచ్చని సమాజం.')}</h1>
          <p>{t('Together we can protect water, reduce plastic, manage waste and create greener villages.', 'మనమందరం కలిసి నీటిని సంరక్షించి, ప్లాస్టిక్‌ను తగ్గించి, వ్యర్థాలను నిర్వహించి పచ్చని గ్రామాలను నిర్మించవచ్చు.')}</p>
          <Link to="/actions" className="btn">{t('Start Green Action', 'హరిత చర్య ప్రారంభించండి')}</Link>{' '}
          <Link to="/pledge" className="btn orange">{t('Take Green Pledge', 'హరిత ప్రతిజ్ఞ చేయండి')}</Link>
        </div>
        <div><Slider /></div>
      </section>

      <section>
        <div className="title">
          <h2>{t('Community Impact', 'సమాజ ప్రభావం')}</h2>
          <p>{t('Small actions create measurable environmental change.', 'చిన్న చర్యలు కొలవగల పర్యావరణ మార్పును సృష్టిస్తాయి.')}</p>
        </div>
        <div className="stats">
          {statCards.map(([v, en, te]) => (
            <div className="card stat" key={en}><h2>{v ?? 0}</h2><p>{t(en, te)}</p></div>
          ))}
        </div>
      </section>

      <section>
        <div className="title"><h2>{t('What You Can Do', 'మీరు ఏమి చేయగలరు')}</h2></div>
        <div className="grid-4">
          {doCards.map(([icon, en, te, den, dte, to, ben, bte]) => (
            <div className="card" key={to}>
              <div className="icon">{icon}</div>
              <h3>{t(en, te)}</h3>
              <p>{t(den, dte)}</p>
              <Link className="btn" to={to}>{t(ben, bte)}</Link>
            </div>
          ))}
        </div>
      </section>

      <section>
        <div className="title">
          <h2>{t('Community Green Pledges', 'సమాజ హరిత ప్రతిజ్ఞలు')}</h2>
          <p>{t('Choose a pledge and make it part of your everyday environmental action.', 'ఒక ప్రతిజ్ఞను ఎంచుకుని మీ రోజువారీ పర్యావరణ చర్యలో భాగం చేయండి.')}</p>
        </div>
        <div className="grid-2">
          {pledges.map(p => <div className="card" key={p.id}><div className="icon">🌱</div><p>{lang === 'te' ? p.te : p.en}</p></div>)}
        </div>
      </section>

      <section>
        <div className="title"><h2>{t('Recent Environmental Activities', 'ఇటీవలి పర్యావరణ కార్యకలాపాలు')}</h2></div>
        <div className="grid">
          {recent && recent.length === 0 && <div className="card"><p>{t('No activities recorded yet.', 'ఇంకా కార్యకలాపాలు నమోదు కాలేదు.')}</p></div>}
          {(recent || []).slice(0, 6).map(a => (
            <div className="card" key={a.id}>
              <div className="icon">🌿</div>
              <h3>{a.activity || 'Green Action'}</h3>
              <p>{a.description}</p>
              <small>{a.userId?.name || a.name} · {a.userId?.village || a.village} · {a.date}</small>
            </div>
          ))}
        </div>
      </section>

      <section>
        <div className="title"><h2>{t('Awareness Videos', 'అవగాహన వీడియోలు')}</h2></div>
        <VideoBox />
      </section>

      <section>
        <div className="title"><h2>{t('Quick Actions', 'త్వరిత చర్యలు')}</h2></div>
        <div className="quick">
          <div className="card"><h3>{t('🌿 Green Pledge', '🌿 హరిత ప్రతిజ్ఞ')}</h3><p>{t('Make your environmental commitment.', 'మీ పర్యావరణ నిబద్ధతను తీసుకోండి.')}</p><Link to="/pledge" className="btn">{t('Take Pledge', 'ప్రతిజ్ఞ చేయండి')}</Link></div>
          <div className="card"><h3>{t('📸 Record Action', '📸 చర్యను నమోదు చేయండి')}</h3><p>{t('Upload proof of your green activity.', 'మీ హరిత కార్యకలాపానికి ఆధారాన్ని అప్‌లోడ్ చేయండి.')}</p><Link to="/actions" className="btn">{t('Record Now', 'ఇప్పుడే నమోదు చేయండి')}</Link></div>
          <div className="card"><h3>{t('🚨 Report Issue', '🚨 సమస్యను నివేదించండి')}</h3><p>{t('Report environmental problems in your village.', 'మీ గ్రామంలోని పర్యావరణ సమస్యలను నివేదించండి.')}</p><Link to="/report" className="btn orange">{t('Report', 'నివేదించండి')}</Link></div>
        </div>
      </section>

      <section>
        <div className="title">
          <h2>{t('Stay Connected', 'అనుసంధానంలో ఉండండి')}</h2>
          <p>{t('Explore more ways to get involved and share your voice.', 'మరింత పాల్గొనడానికి మరియు మీ అభిప్రాయాన్ని పంచుకోవడానికి మార్గాలను అన్వేషించండి.')}</p>
        </div>
        <div className="grid">
          <div className="card"><div className="icon">🎉</div><h3>{t('Community Activities', 'సమాజ కార్యక్రమాలు')}</h3><p>{t('Discover upcoming clean-up drives, tree plantations and local events happening near you.', 'మీ సమీపంలో జరుగుతున్న క్లీన్-అప్ డ్రైవ్‌లు, మొక్కల నాటడం మరియు స్థానిక కార్యక్రమాలను తెలుసుకోండి.')}</p><Link className="btn" to="/activities">{t('Explore Activities', 'కార్యకలాపాలను చూడండి')}</Link></div>
          <div className="card"><div className="icon">💬</div><h3>{t('Share Your Feedback', 'మీ అభిప్రాయాన్ని పంచుకోండి')}</h3><p>{t("Tell us what's working and what's not — your feedback shapes a greener community for everyone.", 'ఏమి బాగుంది, ఏమి మెరుగుపరచాలో మాకు చెప్పండి — మీ అభిప్రాయం అందరికీ పచ్చని సమాజాన్ని రూపొందిస్తుంది.')}</p><Link className="btn" to="/feedback">{t('Give Feedback', 'అభిప్రాయం ఇవ్వండి')}</Link></div>
          <div className="card"><div className="icon">📞</div><h3>{t('Get in Touch', 'మమ్మల్ని సంప్రదించండి')}</h3><p>{t('Have a question or a suggestion? Our team is here to help you take the next green step.', 'ప్రశ్న లేదా సూచన ఉందా? తదుపరి హరిత అడుగు వేయడంలో మా బృందం మీకు సహాయం చేయడానికి సిద్ధంగా ఉంది.')}</p><Link className="btn orange" to="/contact">{t('Contact Us', 'మమ్మల్ని సంప్రదించండి')}</Link></div>
        </div>
      </section>
    </>
  );
}
