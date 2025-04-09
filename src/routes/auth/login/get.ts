import { Request, Response } from "express";
import { generateRandomKey } from "../../../modules/random.js";
import { storeState } from "../../../modules/state-store.js";
import { URL } from "url";
import productionValue from "../../../modules/production.js";

export default async function (
  req: Request,
  res: Response,
  route: { [key: string]: string }
) {
  const redirect_uri = req.query.redirect?.toString();
  const state = generateRandomKey();
  await storeState(state, redirect_uri);

  const uri = new URL(
    `https://discord.com/oauth2/authorize?client_id=1096501767597994154&response_type=code&redirect_uri=${productionValue(
      encodeURIComponent(`https://${process.env.RAILWAY_PUBLIC_DOMAIN}`),
      encodeURIComponent("http://localhost:3000")
    )}%2Fauth%2Fredirect&scope=identify+guilds`
  );

  uri.searchParams.append("state", state);

  res.redirect(uri.toString());
}
