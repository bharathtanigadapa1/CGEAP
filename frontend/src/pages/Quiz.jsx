import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../lib/api.js';
import { useLang } from '../context/LangContext.jsx';
import Message from '../components/Message.jsx';

const ICONS = { water: '💧', waste: '♻️', plastic: '🚫', trees: '🌳' };
const BADGES = {
  'Green Champion': '🏆 Green Champion', 'Eco Expert': '🌿 Eco Expert', 'Green Leader': '🥇 Green Leader',
  'Eco Learner': '🌱 Eco Learner', 'Eco Starter': '🍃 Eco Starter'
};
const PER_ATTEMPT = 5;

export default function Quiz() {
  const { t, lang } = useLang();
  const [types, setTypes] = useState([]);
  const [quiz, setQuiz] = useState(null);      // the current 5-question attempt
  const [answers, setAnswers] = useState({});  // questionId -> option idx
  const [result, setResult] = useState(null);
  const [msg, setMsg] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => { api('/api/quizzes/types').then(setTypes).catch(e => setMsg({ text: e.message, error: true })); }, []);

  // Every call returns 5 NEW random questions (options shuffled too) from the 50-question database bank.
  const start = async type => {
    setLoading(true); setMsg(null); setResult(null); setAnswers({});
    try {
      setQuiz(await api('/api/quizzes/' + type));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (e) { setMsg({ text: e.message, error: true }); }
    setLoading(false);
  };

  const submit = async e => {
    e.preventDefault();
    if (Object.keys(answers).length !== PER_ATTEMPT) {
      return setMsg({ text: t('Please answer all 5 questions.', 'దయచేసి మొత్తం 5 ప్రశ్నలకు సమాధానం ఇవ్వండి.'), error: true });
    }
    try {
      const d = await api(`/api/quizzes/${quiz.type}/submit`, { method: 'POST', body: { answers } });
      setResult(d); setMsg(null);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) { setMsg({ text: err.message, error: true }); }
  };

  const answered = Object.keys(answers).length;
  const reset = () => { setQuiz(null); setResult(null); setAnswers({}); setMsg(null); };

  return (
    <div className="container" style={{ padding: 0 }}>
      <div className="form-card">
        <div className="quiz-head">
          <h1>🧠 <span>{t('Environmental Quiz', 'పర్యావరణ క్విజ్')}</span></h1>
          <Link className="btn gray" to="/dashboard" style={{ marginTop: 0 }}>{t('Dashboard', 'డాష్‌బోర్డ్')}</Link>
        </div>

        {/* 1. choose a quiz */}
        {!quiz && (
          <>
            <p>{t('Choose one of the four major quizzes. Every quiz has 50 questions, and 5 different questions are randomly selected for each attempt.', 'నాలుగు ప్రధాన క్విజ్‌లలో ఒకదాన్ని ఎంచుకోండి. ప్రతి క్విజ్‌లో 50 ప్రశ్నలు ఉంటాయి మరియు ప్రతి ప్రయత్నానికి 5 వేర్వేరు ప్రశ్నలు యాదృచ్ఛికంగా ఎంచుకోబడతాయి.')}</p>
            <div className="grid-2" style={{ marginTop: 20 }}>
              {types.map(x => (
                <div className="card quiz-choice" key={x.id}>
                  <div className="icon">{ICONS[x.id] || '🧠'}</div>
                  <h3>{lang === 'te' ? x.titleTe : x.title}</h3>
                  <p>{x.description}</p>
                  <p><strong>{x.questionCount} {t('Questions', 'ప్రశ్నలు')}</strong> · 5 {t('Random', 'యాదృచ్ఛికం')}</p>
                  <button type="button" className="btn" disabled={loading} onClick={() => start(x.id)}>{t('Play Quiz', 'క్విజ్ ఆడండి')}</button>
                </div>
              ))}
            </div>
          </>
        )}

        {/* 2. answer 5 questions */}
        {quiz && !result && (
          <form onSubmit={submit}>
            <h2 style={{ marginTop: 10 }}>{lang === 'te' ? quiz.titleTe : quiz.title}</h2>
            <div className="quiz-progress"><span style={{ width: (answered / PER_ATTEMPT * 100) + '%' }} /></div>
            {quiz.questions.map((q, i) => (
              <div className="question-card" key={q.id}>
                <span className="question-number">{t('Question', 'ప్రశ్న')} {i + 1} {t('of', '/')} {PER_ATTEMPT}</span>
                <h3>{lang === 'te' ? q.te : q.en}</h3>
                {q.options.map(o => (
                  <label className="option" key={o.idx}>
                    <input type="radio" name={'q' + q.id} checked={answers[q.id] === o.idx}
                      onChange={() => setAnswers({ ...answers, [q.id]: o.idx })} />
                    <span>{lang === 'te' ? o.te : o.en}</span>
                  </label>
                ))}
              </div>
            ))}
            <button className="btn" type="submit">{t('Submit Quiz', 'క్విజ్ సమర్పించండి')}</button>{' '}
            <button className="btn gray" type="button" onClick={reset}>{t('Cancel', 'రద్దు చేయి')}</button>
          </form>
        )}

        {/* 3. result */}
        {result && (
          <div className="result-box">
            <div className="result-score">{result.score}/{result.total}</div>
            <p>{result.percentage}%</p>
            <div className="result-badge">{BADGES[result.badge] || result.badge}</div>
            <p>{t('Your result has been saved to your dashboard.', 'మీ ఫలితం మీ డాష్‌బోర్డ్‌లో సేవ్ చేయబడింది.')}</p>
            <button className="btn" onClick={() => start(quiz.type)}>{t('Play Again (5 new questions)', 'మళ్లీ ఆడండి (5 కొత్త ప్రశ్నలు)')}</button>{' '}
            <button className="btn gray" onClick={reset}>{t('Other Quizzes', 'ఇతర క్విజ్‌లు')}</button>{' '}
            <Link className="btn orange" to="/dashboard">{t('View Dashboard', 'డాష్‌బోర్డ్ చూడండి')}</Link>
          </div>
        )}
        <Message msg={msg} />
      </div>
    </div>
  );
}
