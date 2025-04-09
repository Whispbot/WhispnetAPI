import { Request, Response } from "express";
import { validateState } from "../../../modules/state-store.js";
import pool from "../../../database/postgres.js";
import redis from "../../../database/redis.js";
import productionValue from "../../../modules/production.js";

export default async function (
  req: Request,
  res: Response,
  route: { [key: string]: string }
) {
  const url: URL = new URL(
    req.protocol + "://" + req.get("host") + req.originalUrl
  ); // Format URL

  const state_param = url.searchParams.get("state"); // Make sure that Discord returned state
  const code_param = url.searchParams.get("code"); // Make sure that Discord returned code

  if (!state_param || !code_param) {
    return res.status(400).send("Invalid request");
  }

  const [validState, stateData] = await validateState(state_param); // Make sure that the state is valid
  if (!validState) return res.status(400).send("Invalid state");

  const token_data_request = await fetch(
    "https://discord.com/api/v10/oauth2/token", // Get token from Discord
    {
      method: "POST",
      body: new URLSearchParams({
        client_id: process.env.DISCORD_CLIENT_ID ?? "", // Env variable
        client_secret: process.env.DISCORD_CLIENT_SECRET ?? "", // Env variable
        code: code_param,
        grant_type: "authorization_code",
        redirect_uri: url.origin + url.pathname, // "http://localhost:3000" + "/auth/external/discord/redirect"
        scope: "identify"
      }).toString(),
      headers: {
        "Content-Type": "application/x-www-form-urlencoded" // Discord requirement
      }
    }
  );

  if (!token_data_request.ok) {
    return res.status(400).send("Invalid token request");
  }

  const token_data = await token_data_request.json();

  const user_data_request = await fetch(
    "https://discord.com/api/v10/users/@me", // Fetch user info & email from Discord
    {
      headers: {
        authorization: `${token_data.token_type} ${token_data.access_token}`
      }
    }
  );

  if (!user_data_request.ok) {
    return res.status(400).send("Invalid user request");
  }

  const user_data = await user_data_request.json(); // Get user data

  const {
    rows: [created_user]
  } = await pool.query(
    "INSERT INTO auth (user_id, username, avatar, access, type, refresh, ends) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *",
    [
      user_data.id,
      user_data.username,
      user_data.avatar,
      token_data.access_token,
      token_data.token_type,
      token_data.refresh_token,
      new Date(Date.now() + 1000 * token_data.expires_in) // 30 days
    ]
  );

  if (!created_user) {
    return res.status(400).send("Failed to save authorization data");
  }

  req.session.token = created_user.id; // Save user ID in session
  req.session.save();

  redis.setex(
    `auth:${created_user.id}`,
    60 * 60 * 24,
    JSON.stringify(created_user)
  ); // Save auth data in Redis
  redis.setex(
    `user:${created_user.user_id}`,
    60 * 60 * 24,
    JSON.stringify(user_data)
  ); // Save user data in Redis

  return res
    .status(200)
    .redirect(
      `${
        productionValue(process.env.WEBSITE_URL, "http://localhost:3001") ||
        "http://localhost:3001"
      }${stateData.redirect}`
    );
}
