import redis from "../database/redis.js";

type StateData = { timestamp: number; redirect: string };

export async function storeState(state: string, redirect?: string) {
  await redis.setex(
    `state:${state}`,
    60 * 10,
    JSON.stringify({
      timestamp: Date.now(),
      redirect: redirect || "/dashboard"
    })
  );
}

type StateValid = [true, StateData];
type StateInvalid = [false, null];

export async function validateState(
  state: string
): Promise<StateValid | StateInvalid> {
  const stored = await redis.get(`state:${state}`);
  if (!stored) return [false, null];

  const stored_json = JSON.parse(stored);
  await redis.del(`state:${state}`);
  return [true, stored_json];
}
