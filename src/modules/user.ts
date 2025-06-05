import pool from "../database/postgres.js";
import redis from "../database/redis.js";

export async function getUserIdFromToken(
  token: string
): Promise<string | undefined> {
  const cached_data = await redis.get(`auth:${token}`);
  if (cached_data) return JSON.parse(cached_data).user_id;

  const {
    rows: [{ user_id }]
  } = await pool.query(
    "SELECT * FROM auth WHERE id = $1 AND ends > CURRENT_TIMESTAMP",
    [token]
  );

  return user_id;
}

export async function getAuthFromToken(token: string) {
  const cached_data = await redis.get(`auth:${token}`);
  if (cached_data) return JSON.parse(cached_data);

  const {
    rows: [data]
  } = await pool.query(
    "SELECT * FROM auth WHERE id = $1 AND ends > CURRENT_TIMESTAMP",
    [token]
  );

  return data;
}

export async function getUserFromToken(token: string) {
  const auth = await getAuthFromToken(token);

  const cached_user = await redis.get(`user:${auth.user_id}`);
  if (cached_user) return JSON.parse(cached_user);

  const user_data_request = await fetch(
    "https://discord.com/api/v10/users/@me", // Fetch user info & email from Discord
    {
      headers: {
        authorization: `${auth.type} ${auth.access}`
      }
    }
  );

  if (!user_data_request.ok) return undefined; // Failed to get user data

  const user_data = await user_data_request.json();

  redis.setex(`user:${auth.user_id}`, 60 * 60 * 24, JSON.stringify(user_data)); // 1 day

  return user_data;
}
