import "dotenv/config";
import env from "env-var";

export const envs = {
  PORT: env.get("PORT").asPortNumber(),
  SEED: env.get("SEED").required().asString(),
  NODE_ENV: env.get("NODE_ENV").required().asString(),
};
