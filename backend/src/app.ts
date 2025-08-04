import express, { Application } from "express";
import cors from "cors";
import { RouteConfig } from "./types";
import { config } from "dotenv";
config();
import Database from "./database/db";
import { errorHandler } from "./modules/Application/application-error-handlers";
import { UserRouter } from "./modules/user";
import redisClient from "./services/redis-service";
import propertiesRouter from "./modules/properties/rest-api/properties-router";
import { createPropertyIndex } from "./services/elastic-search/setup";

class App {
  private static app: Application;
  private static port: number = parseInt(process.env.PORT || "8080");

  public static async startServer() {
    this.app = express();
    await Database.connect();
    await redisClient.connect();
    await createPropertyIndex()
    this.app.use(express.json());
    this.app.use(cors());

    this.app.use("/api", this.createApiServer());
    this.app.use(errorHandler as express.ErrorRequestHandler);

    this.app.get("/", (req, res) => {
      res.send("Welcome to the API!");
    });

    this.app.listen(this.port, () => {
      console.log(`Server is running on http://localhost:${this.port}`);
    });
  }

  private static createApiServer(): Application {
    const app: Application = express();
    const routes: RouteConfig[] = [
      {
        path: "/account",
        router: new UserRouter().router,
      },
      {
        path: "/property",
        router: new propertiesRouter().router,
      },
    ];

    routes.forEach((route) => {
      app.use(route.path, route.router);
    });
    return app;
  }
}

(async () => {
  try {
    await App.startServer();
  } catch (error) {
    console.error("Error starting server:", error);
  }
})();
