import { Request, Response } from "express";
import redis from "../../../database/redis.js";
import { getUserFromToken } from "../../../modules/user.js";

export default async function (
  req: Request,
  res: Response,
  route: { [key: string]: string }
) {
  const token = req.session.token;

  if (!token)
    return res.status(401).json({ status: 401, message: "Not logged in" });

  const cached_user = await redis.get(`user:${req.session.user_id}`); // Check if user is cached
  if (cached_user) {
    return res.status(200).json(JSON.parse(cached_user)); // Return cached user
  }

  try {
    const user_data = await getUserFromToken(token);

    if (!user_data)
      return res
        .status(500)
        .json({ status: 500, message: "Failed to fetch user data" });

    return res.status(200).json(user_data); // Return user data
  } catch {
    return res
      .status(500)
      .json({ status: 500, message: "Internal Server Error" });
  }
}
