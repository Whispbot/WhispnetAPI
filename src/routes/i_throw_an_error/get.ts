import { Request, Response } from "express";

export default async function (
  req: Request,
  res: Response,
  route: { [key: string]: string }
) {
  throw new Error("Uh uh! This is a test error. :(");

  return res.status(200).json({ status: "ok" });
}
