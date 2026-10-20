import { Link, Navigate, useParams } from 'react-router-dom';
import { learnTopics } from '../data/learnTopics.js';
import { useLang } from '../context/LangContext.jsx';

export default function LearnTopic() {
  const { topic } = useParams();
  const { t, pick } = useLang();
  const d = learnTopics[topic];
  if (!d) return <Navigate to="/learn" replace />;
  return (
    <>
      <div className="title"><h1>{pick(d.title)}</h1><p>{pick(d.subtitle)}</p></div>
      <img className="learn-hero" src={d.hero} alt={d.title.en} />
      <div className="info-card"><h2>{pick(d.whyHeading)}</h2><p>{pick(d.why)}</p></div>
      <div className="info-card"><h2>{pick(d.howHeading)}</h2><p>{pick(d.how)}</p></div>
      <div className="title"><h2>{t('Gallery', 'చిత్రమాలిక')}</h2></div>
      <div className="grid">
        {d.gallery.map(g => <img key={g.src} className="gallery-img" src={g.src} alt={g.alt} />)}
      </div>
      <div style={{ textAlign: 'center', marginTop: 35 }}>
        <Link to="/actions" className="btn">{t('Record This Action', 'ఈ చర్యను నమోదు చేయండి')}</Link>{' '}
        <Link to="/learn" className="btn orange">{t('← Back to Learn', '← నేర్చుకోండికి తిరిగి వెళ్ళండి')}</Link>
      </div>
    </>
  );
}
