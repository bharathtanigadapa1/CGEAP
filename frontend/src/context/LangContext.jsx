import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

const LangContext = createContext(null);

export function LangProvider({ children }) {
  const [lang, setLangState] = useState(() => localStorage.getItem('ceagapLanguage') || 'en');

  useEffect(() => {
    document.documentElement.lang = lang === 'te' ? 'te' : 'en';
  }, [lang]);

  const setLang = useCallback(l => {
    localStorage.setItem('ceagapLanguage', l);
    setLangState(l);
  }, []);

  // t('English', 'తెలుగు') returns the text for the selected language
  const t = useCallback((en, te) => (lang === 'te' && te ? te : en), [lang]);
  // pick({en, te}) for objects that carry both languages
  const pick = useCallback(o => (o ? (lang === 'te' && o.te ? o.te : o.en) : ''), [lang]);

  const value = useMemo(() => ({ lang, setLang, t, pick }), [lang, setLang, t, pick]);
  return <LangContext.Provider value={value}>{children}</LangContext.Provider>;
}

export const useLang = () => useContext(LangContext);
