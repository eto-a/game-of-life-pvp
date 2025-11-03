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

import RequireAuth from "../features/auth/RequireAuth";
import PublicOnly from "../features/auth/PublicOnly";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    errorElement: <NotFound />,
    children: [
      { index: true, element: <Landing /> },

      // страница входа доступна только гостям
      { path: "auth", element: (
          <PublicOnly>
            <Auth />
          </PublicOnly>
        )
      },

      // приватные страницы
      { path: "lobby", element: (
          <RequireAuth>
            <Lobby />
          </RequireAuth>
        )
      },
      { path: "arena/:roomCode", element: (
          <RequireAuth>
            <Arena />
          </RequireAuth>
        )
      },
      { path: "results/:matchId", element: (
          <RequireAuth>
            <Results />
          </RequireAuth>
        )
      },
      { path: "profile", element: (
          <RequireAuth>
            <Profile />
          </RequireAuth>
        )
      },

      // публичная или приватная — на твой выбор.
      // Если хочешь публичной: оставь как есть.
      // Если приватной: оберни в <RequireAuth>.
      { path: "leaderboard", element: <Leaderboard /> },

      // явный NotFound на случай вложенных путей
      { path: "*", element: <NotFound /> },
    ],
  },
]);
