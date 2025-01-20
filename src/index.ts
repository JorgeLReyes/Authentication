import { envs } from "./config/envs";
import { AppRouter } from "./presentation/routes/routes";
import { Server } from "./presentation/server";
import { TokenRepositoryImpl } from "./infraestructure/repositories/token.repository";
import { TokenDatasourceImpl } from "./infraestructure/datasources/token.datasource";
import { CronService } from "./presentation/services/cron/cron.service";
const init = () => {
  const repositories = {
    token: new TokenRepositoryImpl(new TokenDatasourceImpl()),
  };

  const services = {
    cron: CronService,
  };

  const server = new Server(
    envs.PORT,
    AppRouter.routes,
    services,
    repositories
  );
  server.start();
};

(() => {
  init();
})();
