import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="grid place-items-center py-20">
      <div className="text-center space-y-3">
        <h2 className="text-2xl font-bold">404</h2>
        <p>Page not found.</p>
        <Link to="/" className="px-3 py-2 border rounded">
          Go Home
        </Link>
      </div>
    </div>
  );
}

