import "dotenv/config";
import env from "env-var";

export const envs = {
  PORT: env.get("PORT").asPortNumber(),
  SEED: env.get("SEED").required().asString(),
  NODE_ENV: env.get("NODE_ENV").required().asString(),
  GOOGLE_CLIENT_ID: env.get("GOOGLE_CLIENT_ID").required().asString(),
  GOOGLE_CLIENT_SECRET: env.get("GOOGLE_CLIENT_SECRET").required().asString(),
  GOOGLE_CALLBACK: env.get("GOOGLE_CALLBACK").required().asString(),
  DOMAIN: env.get("DOMAIN").required().asString(),
};
