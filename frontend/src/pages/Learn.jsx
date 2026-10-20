import { Link } from 'react-router-dom';
import { useLang } from '../context/LangContext.jsx';

const TOPICS = [
  ['water', '💧', 'Water Conservation', 'నీటి సంరక్షణ', 'https://images.unsplash.com/photo-1519692933481-e162a57d6721?auto=format&fit=crop&w=800&q=80',
    'Save water by repairing leaking taps, using water carefully, harvesting rainwater and avoiding unnecessary wastage.',
    'లీక్ అవుతున్న కుళాయిలను మరమ్మతు చేయడం, నీటిని జాగ్రత్తగా ఉపయోగించడం, వర్షపు నీటిని సేకరించడం మరియు అనవసరమైన వృథాను నివారించడం ద్వారా నీటిని ఆదా చేయండి.'],
  ['waste', '♻️', 'Waste Management', 'వ్యర్థాల నిర్వహణ', 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=800&q=80',
    'Separate wet waste, dry waste and recyclable materials. Compost organic waste whenever possible.',
    'తడి వ్యర్థాలు, పొడి వ్యర్థాలు మరియు పునర్వినియోగ పదార్థాలను వేరు చేయండి. సాధ్యమైనప్పుడు సేంద్రీయ వ్యర్థాలతో కంపోస్ట్ తయారు చేయండి.'],
  ['plastic', '🚫', 'Plastic Reduction', 'ప్లాస్టిక్ తగ్గింపు', 'https://images.unsplash.com/photo-1621451537084-482c73073a0f?auto=format&fit=crop&w=800&q=80',
    'Reduce single-use plastics by carrying reusable bags, bottles and containers.',
    'పునర్వినియోగ సంచులు, సీసాలు మరియు కంటైనర్లను ఉపయోగించడం ద్వారా ఒక్కసారి ఉపయోగించే ప్లాస్టిక్‌ను తగ్గించండి.'],
  ['tree', '🌳', 'Tree Plantation', 'చెట్ల పెంపకం', 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=800&q=80',
    'Plant suitable trees and care for them regularly. Trees improve air quality, provide shade and support biodiversity.',
    'తగిన చెట్లను నాటి వాటిని క్రమం తప్పకుండా సంరక్షించండి. చెట్లు గాలి నాణ్యతను మెరుగుపరుస్తాయి, నీడను అందిస్తాయి మరియు జీవవైవిధ్యానికి సహాయపడతాయి.']
];

export default function Learn() {
  const { t } = useLang();
  return (
    <>
      <div className="title">
        <h1>{t('🌍 Environmental Learning', '🌍 పర్యావరణ అభ్యాసం')}</h1>
        <p>{t('Learn simple ways to protect our environment and build sustainable communities.', 'మన పర్యావరణాన్ని రక్షించడానికి మరియు స్థిరమైన సమాజాలను నిర్మించడానికి సులభమైన మార్గాలను తెలుసుకోండి.')}</p>
      </div>
      <div className="grid-2">
        {TOPICS.map(([id, icon, en, te, img, den, dte]) => (
          <Link className="card-link" to={`/learn/${id}`} key={id}>
            <div className="card">
              <img className="learn-img" src={img} alt={en} />
              <div className="icon">{icon}</div>
              <h2>{t(en, te)}</h2>
              <p>{t(den, dte)}</p>
              <span className="btn">{t('Learn More', 'మరింత తెలుసుకోండి')}</span>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}
