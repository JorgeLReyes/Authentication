import express, { Router } from "express";
import cookieParser from "cookie-parser";
import passport from "passport";

export class Server {
  public app = express();
  private serverListener?: any;

  constructor(private port: number = 3001, private routes: Router) {}

  public start() {
    this.configViewEngine();
    this.app.use(express.json());
    this.app.use(cookieParser());
    this.app.use(passport.initialize());

    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(this.routes);
    this.app.listen(this.port, () => {
      console.log(`Server is running on port ${this.port}`);
    });
  }

  private configViewEngine() {
    this.app.set("view engine", "pug");
    this.app.set("views", __dirname + "/views");
  }

  public close() {
    this.serverListener?.close();
  }
}
