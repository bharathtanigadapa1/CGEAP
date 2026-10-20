import { useLang } from '../context/LangContext.jsx';

export default function Footer() {
  const { t } = useLang();
  return (
    <footer>
      <p>{t('🌿 CEAGAP — Community Environmental Awareness & Green Action Program', '🌿 CEAGAP — సమాజ పర్యావరణ అవగాహన & హరిత చర్య కార్యక్రమం')}</p>
      <p>{t('Building greener communities together.', 'పచ్చని సమాజాలను కలిసి నిర్మిద్దాం.')}</p>
    </footer>
  );
}
