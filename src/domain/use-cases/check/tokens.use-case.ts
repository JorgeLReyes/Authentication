import { CronService } from "../../../presentation/services/cron/cron.service";
import { TokenRepository } from "../../repositories/token.repository";

export class CheckTokensBlacklist {
  constructor(
    private repository: TokenRepository,
    private cron: typeof CronService
  ) {}

  execute() {
    this.cron.createJob("* 0 * * * *", () => {
      const today = Date.now();
      this.repository.delete(today);
    });
  }
}
