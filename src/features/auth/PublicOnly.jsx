import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";

export default function PublicOnly({ children }) {
  const jwt = useSelector((s) => s.auth.jwt);
  const loc = useLocation();
  if (jwt) {
    // если уже залогинен — уводим туда, откуда пришёл, или в лобби
    const next = loc.state?.from?.pathname || "/lobby";
    return <Navigate to={next} replace />;
  }
  return children;
}
