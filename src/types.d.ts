import session from "express-session";

declare module "express-session" {
  interface SessionData {
    token?: string; // Add custom session property
    jwt?: string; // User info as token
  }
}
