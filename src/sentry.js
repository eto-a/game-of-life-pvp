import * as Sentry from "@sentry/react";

const dsn = import.meta.env.VITE_SENTRY_DSN;

if (dsn) {
  Sentry.init({
    dsn,
    sendDefaultPii: true,
    enableLogs: true,
    tracesSampleRate: 1.0,
    environment: import.meta.env.MODE,
  });
}
