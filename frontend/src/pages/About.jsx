import { useLang } from '../context/LangContext.jsx';

const MEMBERS = ['T. Bharath Kumar', 'B. Sajeev', 'V. Bindhu', 'U. Nava Deepika'];

export default function About() {
  const { t } = useLang();
  return (
    <>
      <div className="info-card">
        <h1>{t('🌿 About CEAGAP', '🌿 CEAGAP గురించి')}</h1>
        <p>{t('CEAGAP stands for Community Environmental Awareness & Green Action Program. It is a community-service platform designed to turn environmental awareness into practical local action.', 'CEAGAP అంటే Community Environmental Awareness & Green Action Program. పర్యావరణ అవగాహనను స్థానిక చర్యగా మార్చడానికి రూపొందించిన సమాజ సేవా వేదిక ఇది.')}</p>
        <p>{t('The program focuses on water conservation, waste segregation, tree and plant awareness, reducing plastic use, protecting local surroundings and building awareness about pollution and soil erosion.', 'ఈ కార్యక్రమం నీటి సంరక్షణ, వ్యర్థాల వేరు చేయడం, చెట్లు మరియు మొక్కల అవగాహన, ప్లాస్టిక్ వినియోగం తగ్గింపు, స్థానిక పరిసరాల పరిరక్షణ మరియు కాలుష్యం, నేల క్షీణతపై అవగాహనపై దృష్టి పెడుతుంది.')}</p>
      </div>
      <div className="info-card">
        <h2>{t('What the Website Does', 'వెబ్‌సైట్ ఏమి చేస్తుంది')}</h2>
        <p>🌱 <b>Green Actions:</b> Citizens record completed environmental activities with photo proof.</p>
        <p>💧 <b>Water Conservation:</b> Learn and participate in water-saving activities.</p>
        <p>♻️ <b>Waste Segregation:</b> Encourage correct household and community waste separation.</p>
        <p>🌳 <b>Tree Awareness:</b> Promote planting and protection of trees.</p>
        <p>🚫 <b>Plastic Reduction:</b> Encourage reusable choices and reduction of single-use plastic.</p>
        <p>🚨 <b>Issue Reporting:</b> Citizens can report local environmental concerns for admin follow-up.</p>
        <p>🧠 <b>Environmental Quizzes:</b> Four quiz areas help users test and improve their environmental knowledge.</p>
      </div>
      <div className="info-card">
        <h2>{t('Our Mission', 'మా లక్ష్యం')}</h2>
        <p>{t('To create environmentally aware communities where every citizen can take simple, meaningful and measurable actions to conserve natural resources and improve local surroundings.', 'ప్రతి పౌరుడు సహజ వనరులను సంరక్షించడానికి మరియు స్థానిక పరిసరాలను మెరుగుపరచడానికి సులభమైన, అర్థవంతమైన మరియు కొలవగల చర్యలు తీసుకునే పర్యావరణ అవగాహన కలిగిన సమాజాలను సృష్టించడం మా లక్ష్యం.')}</p>
      </div>
      <div className="info-card">
        <h2>{t('Our Vision', 'మా దృష్టి')}</h2>
        <p>{t('Greener villages, cleaner surroundings, responsible citizens and a sustainable future built through community participation and everyday environmental action.', 'సమాజ భాగస్వామ్యం మరియు రోజువారీ పర్యావరణ చర్యల ద్వారా పచ్చని గ్రామాలు, పరిశుభ్రమైన పరిసరాలు, బాధ్యతాయుతమైన పౌరులు మరియు స్థిరమైన భవిష్యత్తును నిర్మించడం మా దృష్టి.')}</p>
      </div>
      <div className="info-card">
        <h2>{t('Community Group Members', 'సమాజ బృంద సభ్యులు')}</h2>
        <div className="grid-2">
          {MEMBERS.map(m => <div className="card" key={m}><h3>{m}</h3><p>Community Group Member</p></div>)}
        </div>
      </div>
    </>
  );
}
