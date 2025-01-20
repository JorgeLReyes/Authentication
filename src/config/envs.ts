import "dotenv/config";
import env from "env-var";

export const envs = {
  PORT: env.get("PORT").asPortNumber(),
  SEED_ACCESS_TOKEN: env.get("SEED_ACCESS_TOKEN").required().asString(),
  SEED_REFRESH_TOKEN: env.get("SEED_REFRESH_TOKEN").required().asString(),
  SEED_SESSION: env.get("SEED_SESSION").required().asString(),
  NODE_ENV: env.get("NODE_ENV").required().asString(),
  GOOGLE_CLIENT_ID: env.get("GOOGLE_CLIENT_ID").required().asString(),
  GOOGLE_CLIENT_SECRET: env.get("GOOGLE_CLIENT_SECRET").required().asString(),
  GOOGLE_CALLBACK: env.get("GOOGLE_CALLBACK").required().asString(),
  DOMAIN: env.get("DOMAIN").required().asString(),
  ACCESS_TOKEN_EXPIRATION: env
    .get("ACCESS_TOKEN_EXPIRATION")
    .required()
    .asString(),
  REFRESH_TOKEN_EXPIRATION: env
    .get("REFRESH_TOKEN_EXPIRATION")
    .required()
    .asString(),
  ACCESS_COOKIE_EXPIRATION: env
    .get("ACCESS_COOKIE_EXPIRATION")
    .required()
    .asIntPositive(),
  REFRESH_COOKIE_EXPIRATION: env
    .get("REFRESH_COOKIE_EXPIRATION")
    .required()
    .asIntPositive(),
};
