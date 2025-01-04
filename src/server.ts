import helmet from "helmet";
import express, { Request, Response, NextFunction } from "express";
import rateLimit from 'express-rate-limit';
import Paths from './routes/common/path';
import BaseRouter from "../src/routes/index";

// import Paths from "@src/routes/common/Paths";
import { NodeEnvs, ONE_HUNDRED, ONE_THOUSAND, SIXTY } from "./constants/env";
import logger from "./service/logger.service";
import { envs } from "../config";
import HttpStatusCodes from "./constants/httpStatusCodes";
import { RouteError } from "./common/route-errors";
import { ServerOptions } from "./types/server.type";
import morganMiddleware from "./middlewares/morgan.middleware";
import passport from "./config/passport";

export class Server {
  private readonly app = express();
  private readonly port: number;

  constructor(options: ServerOptions) {
    const { port } = options;
    this.port = port;
  }

  async start(): Promise<void> {
    // Basic middleware
    this.app.use(express.json()); // Parse json in request body (allow raw)
    this.app.use(express.urlencoded({ extended: true })); // Allow x-www-form-urlencoded
    this.app.use(morganMiddleware); // Log routes using morgan
    this.app.use(passport.initialize());

    // Security
    if (envs.NODE_ENV === NodeEnvs.Production.valueOf()) {
      this.app.use(helmet());
    }

    // Limit repeated requests to public APIs
    this.app.use(
      rateLimit({
        max: ONE_HUNDRED,
        windowMs: SIXTY * SIXTY * ONE_THOUSAND,
        message: 'Too many requests from this IP, please try again in one hour'
      })
    );

    // Add error handler
    this.app.use((err: Error, _: Request, res: Response, next: NextFunction) => {
    if (envs.NODE_ENV !== NodeEnvs.Test.valueOf()) {
      logger.error(err.message, true);
    }

    let status = HttpStatusCodes.BAD_REQUEST;
      if (err instanceof RouteError) {
        // status = err.status;
        res.status(status).json({ error: err.message });
      }
      return next(err);
    });

    // Add APIs, must be after middleware
    this.app.use(Paths.base, BaseRouter);

    this.app.listen(this.port, () => {
      console.log(`Server running on port ${this.port}...`);
    });
  }
}