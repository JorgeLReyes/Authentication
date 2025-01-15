import express, { Router } from "express";
import cookieParser from "cookie-parser";
import passport from "passport";
import cors from "cors";
import { envs } from "../config/envs";
import session from "express-session";

export class Server {
  public app = express();
  private serverListener?: any;

  constructor(private port: number = 3001, private routes: Router) {}

  public start() {
    this.configViewEngine();
    this.app.use(
      cors({
        origin: [envs.DOMAIN, "http://localhost:3001"],
        methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
        credentials: true,
        allowedHeaders: ["Content-Type", "Authorization"],
      })
    );
    this.app.use(express.json());
    this.app.use(cookieParser());
    this.app.use(
      session({
        secret: envs.SEED_SESSION,
        resave: false,
        saveUninitialized: true,
      })
    );
    this.app.use(passport.initialize());
    this.app.use(passport.session());
    passport.serializeUser((user, done) => done(null, user));
    passport.deserializeUser((user, done) => done(null, user as any));

    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(this.routes);
    this.serverListener = this.app.listen(this.port, () => {
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
