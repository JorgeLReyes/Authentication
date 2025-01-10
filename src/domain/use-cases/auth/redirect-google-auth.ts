import { NextFunction, Request, Response } from "express";
import passport from "passport";
import { CustomError } from "../../../config/error";

export class RedirectToGoogleAuth {
  execute(req: Request, res: Response, next: NextFunction) {
    return passport.authenticate("google", { scope: ["profile", "email"] })(
      req,
      res,
      next
    );
  }
}
