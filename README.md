# 🧬 Game of Life PvP

**Game of Life PvP** — браузерное PvP-приложение, основанное на клеточном автомате Конвея.  
Два игрока подключаются к одной игровой сессии и управляют эволюцией клеточного поля в реальном времени.  

🔗 **Онлайн-версия:** [https://game-of-life.eto-art.ru](https://game-of-life.eto-art.ru)

## 🎯 Цель проекта
Реализовать многопользовательскую игру на основе клеточного автомата с использованием современных web-технологий,  
демонстрируя владение стеком React, WebSocket, Web Worker, CI/CD и аналитикой.

## 🧪 Запуск проекта

```bash
# Установка зависимостей
npm i

# Запуск фронтенда
npm run dev
# http://localhost:5173
```````

## Структура проекта


```
    game-of-life-pvp
├─ public/
│  └─ index.html
├─ src/
│  ├─ index.css
│  ├─ main.jsx
│  ├─ app/
│  │  ├─ store.js
│  │  ├─ router.jsx
│  │  └─ layout/
│  │     ├─ Navbar.jsx
│  │     └─ RootLayout.jsx
│  ├─ shared/
│  │  ├─ api/
│  │  │  └─ baseApi.js
│  │  └─ ui/
│  │     └─ Container.jsx
│  ├─ pages/
│  │  ├─ Landing.jsx
│  │  ├─ Auth.jsx
│  │  ├─ Lobby.jsx
│  │  ├─ Arena.jsx
│  │  ├─ Results.jsx
│  │  ├─ Leaderboard.jsx
│  │  ├─ Profile.jsx
│  │  └─ NotFound.jsx
│  └─ workers/
│     └─ simulation.worker.js
├─ package.json
└─ README.md
```
