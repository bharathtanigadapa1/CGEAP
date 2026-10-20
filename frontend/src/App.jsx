import { Navigate, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout.jsx';
import { EntryGate, RequireAdmin, RequireLogin } from './components/Guards.jsx';
import Home from './pages/Home.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Learn from './pages/Learn.jsx';
import LearnTopic from './pages/LearnTopic.jsx';
import Activities from './pages/Activities.jsx';
import Actions from './pages/Actions.jsx';
import Pledge from './pages/Pledge.jsx';
import Quiz from './pages/Quiz.jsx';
import Report from './pages/Report.jsx';
import Feedback from './pages/Feedback.jsx';
import Contact from './pages/Contact.jsx';
import About from './pages/About.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Admin from './pages/Admin.jsx';

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/admin" element={<RequireAdmin><Admin /></RequireAdmin>} />
      <Route element={<Layout />}>
        <Route path="/" element={<EntryGate><Home /></EntryGate>} />
        <Route path="/learn" element={<Learn />} />
        <Route path="/learn/:topic" element={<LearnTopic />} />
        <Route path="/activities" element={<Activities />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/actions" element={<RequireLogin><Actions /></RequireLogin>} />
        <Route path="/pledge" element={<RequireLogin><Pledge /></RequireLogin>} />
        <Route path="/quiz" element={<RequireLogin><Quiz /></RequireLogin>} />
        <Route path="/report" element={<RequireLogin><Report /></RequireLogin>} />
        <Route path="/feedback" element={<RequireLogin><Feedback /></RequireLogin>} />
        <Route path="/dashboard" element={<RequireLogin><Dashboard /></RequireLogin>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
