
import { envs } from "../config";
import { Server } from "./server";
const { connectDatabase } = require("../src/models");

(() => {
  main();
})();

async function main() {
    
  const server = new Server({
    port: envs.PORT,
    apiPrefix: envs.API_PREFIX
  });

  void server.start();

  await connectDatabase()
}
