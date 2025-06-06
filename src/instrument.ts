import * as Sentry from "@sentry/node";

const dsn = process.env.SENTRY_DSN;

if (!dsn) throw new Error("SENTRY_DSN environment variable is not set");

Sentry.init({
  dsn,
  // Setting this option to true will send default PII data to Sentry.
  // For example, automatic IP address collection on events
  sendDefaultPii: true
});
