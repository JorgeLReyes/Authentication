import express, { Router } from "express";
import cookieParser from "cookie-parser";
import passport from "passport";
import cors from "cors";
import session from "express-session";
import { envs } from "../config/envs";

export class Server {
  public app = express();
  private serverListener?: any;

  constructor(private port: number = 3001, private routes: Router) {}

  public start() {
    this.configViewEngine();
    this.app.use(
      cors({
        origin: [envs.DOMAIN], // Revisa si necesitas permitir el origen exacto
        methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
        credentials: true, // Esto asegura que las cookies se compartan
        allowedHeaders: ["Content-Type", "Authorization"], // Agrega cabeceras necesarias
      })
    );
    this.app.use(express.json());
    this.app.use(cookieParser());
    this.app.use(
      session({
        secret: "your-secret-key",
        resave: false,
        saveUninitialized: true,
        // cookie: { httpOnly: true },
      })
    );
    this.app.use(passport.initialize());
    // this.app.use(passport.session());
    this.app.use((req, res, next) => {
      // res.header("Cross-Origin-Opener-Policy", "same-origin");
      // res.header("Cross-Origin-Embedder-Policy", "require-corp");
      next();
    });
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
