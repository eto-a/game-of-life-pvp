import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';

export default function RequireAuth({ children }) {
  const jwt = useSelector(s => s.auth.jwt);
  const loc = useLocation();
  if (!jwt) return <Navigate to="/auth" state={{ from: loc }} replace />;
  return children;
}
