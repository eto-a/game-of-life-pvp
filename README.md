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

# Или полный стек через Docker Compose
make run
```````

## 📂 Структура проекта

```bash
frontend/
  src/
    app/        # store, router, layout
    pages/      # страницы приложения
    shared/     # api, ui-компоненты
    workers/    # симуляция клеток
backend/
  src/
    modules/    # auth, rating, match, user
    ws/         # websocket gateway
    routes/     # REST endpoints
docker-compose.yml


```````