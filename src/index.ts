import { envs } from "./config/envs";
import { AppRouter } from "./presentation/routes/routes";
import { Server } from "./presentation/server";
const init = () => {
  const server = new Server(envs.PORT, AppRouter.routes);
  server.start();
};

(() => {
  init();
})();
