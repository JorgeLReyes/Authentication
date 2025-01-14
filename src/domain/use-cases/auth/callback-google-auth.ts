import { NextFunction, Request, Response } from "express";
import { GoogleAuthService } from "../../../presentation/services/auth/google.service";

export class HandleGoogleAuthCallback {
  execute(service: GoogleAuthService) {
    return async (req: Request, res: Response, next: NextFunction) => {
      service.authenticateWithGoogle(req, res, next);
    };
  }
}
