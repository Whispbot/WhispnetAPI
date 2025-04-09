import { Request, Response } from "express";
import redis from "../../../database/redis.js";
import pool from "../../../database/postgres.js";

export default async function (
  req: Request,
  res: Response,
  route: { [key: string]: string }
) {
  const auth_token = req.session.token; // Get auth token from session

  try {
    const cached_auth = await redis.get(`auth:${auth_token}`); // Check if user is cached
    let auth = null;
    if (!cached_auth) {
      const {
        rows: [auth_data]
      } = await pool.query(
        "SELECT * FROM auth WHERE id = $1 AND ends > CURRENT_TIMESTAMP",
        [auth_token]
      );

      redis.setex(
        `auth:${auth_token}`,
        60 * 60 * 24,
        JSON.stringify(auth_data)
      ); // Cache auth data for 24 hours

      auth = auth_data;
    } else auth = JSON.parse(cached_auth); // Parse cached auth data

    if (!auth)
      return res
        .status(500)
        .json({ status: 500, message: "Internal Server Error" }); // If no auth data, return error

    const cached_user = await redis.get(`user:${auth.user_id}`); // Check if user is cached
    if (cached_user) {
      return res.status(200).json(JSON.parse(cached_user)); // Return cached user
    }

    const user_data_request = await fetch(
      "https://discord.com/api/v10/users/@me", // Fetch user info & email from Discord
      {
        headers: {
          authorization: `${auth.type} ${auth.access}`
        }
      }
    );

    if (!user_data_request.ok)
      return res.status(500).send("Invalid user request"); // If user data request fails, return error

    const user_data = await user_data_request.json(); // Get user data

    redis.setex(
      `user:${auth.user_id}`,
      60 * 60 * 24,
      JSON.stringify(user_data)
    ); // Cache user data for 24 hours

    return res.status(200).json(user_data); // Return user data
  } catch {
    return res
      .status(500)
      .json({ status: 500, message: "Internal Server Error" });
  }
}
