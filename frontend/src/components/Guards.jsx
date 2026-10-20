import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

/** Pages that need a logged in citizen (or admin). Sends guests to /login and back again afterwards. */
export function RequireLogin({ children }) {
  const { user } = useAuth();
  const location = useLocation();
  if (!user) return <Navigate to="/login" replace state={{ from: location.pathname + location.search }} />;
  return children;
}

export function RequireAdmin({ children }) {
  const { user, isAdmin } = useAuth();
  if (!user || !isAdmin) return <Navigate to="/login" replace />;
  return children;
}

/** Login-first entry: the home page needs a session or "continue without login". */
export function EntryGate({ children }) {
  const { user, guest } = useAuth();
  if (!user && !guest) return <Navigate to="/login" replace />;
  return children;
}
