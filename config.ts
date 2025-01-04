/* eslint-disable n/no-process-env */

import path from "path";
// import 'dotenv/config';
import dotenv from "dotenv";
import { get } from "env-var";
import { NodeEnvs } from "./src/constants/env";

const nodeEnv = process.env.NODE_ENV || 'development';

// Configure "dotenv"
const config = dotenv.config({
  path: path.join(__dirname, `./config/.env.${nodeEnv}`),
});

if (config.error) {
  throw config.error;
}

export const envs = {
  NODE_ENV: get("NODE_ENV").default(NodeEnvs.Dev).asString(),
  PORT: get("PORT").required().asPortNumber(),
  API_PREFIX: get("DEFAULT_API_PREFIX").default("/api/v1").asString(),
  DB_URL: get("DB_URL").required().asString(),
  DB_USERNAME: get("POSTGRES_USER").required().asString(),
  DB_PASSWORD: get("POSTGRES_PASSWORD").required().asString(),
  DB_HOST: get("POSTGRES_HOST").required().asString(),
  DB_NAME: get("POSTGRES_DB").required().asString(),
  DB_DIALECT: get("POSTGRES_DIALECT").required().asString(),
  JWT_SECRET: get("JWT_SECRET").required().asString(),
  EXPIRES_IN: get("EXPIRES_IN").required().asString(),
};