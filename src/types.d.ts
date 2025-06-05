import session from "express-session";

declare module "express-session" {
  interface SessionData {
    token?: string; // Add custom session property
    user_id?: string;
  }
}
