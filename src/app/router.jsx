import { createBrowserRouter } from "react-router-dom";
import RootLayout from "./layout/RootLayout";
import Landing from "../pages/Landing";
import Auth from "../pages/Auth";
import Lobby from "../pages/Lobby";
import Arena from "../pages/Arena";
import Results from "../pages/Results";
import Leaderboard from "../pages/Leaderboard";
import Profile from "../pages/Profile";
import NotFound from "../pages/NotFound";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    errorElement: <NotFound />,
    children: [
      { index: true, element: <Landing /> },
      { path: "auth", element: <Auth /> },
      { path: "lobby", element: <Lobby /> },
      { path: "arena", element: <Arena /> },
      { path: "results", element: <Results /> },
      { path: "leaderboard", element: <Leaderboard /> },
      { path: "profile", element: <Profile /> },
    ],
  },
]);

