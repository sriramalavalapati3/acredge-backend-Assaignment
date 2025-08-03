import express, { Application } from 'express';
import cors from 'cors';
import { RouteConfig } from './types';
import { config } from 'dotenv';
config(); 
import Database from './database/db';

class App {
    private static app: Application;
    private static port: number = parseInt(process.env.PORT || '8080');

    public static async startServer(){
        this.app = express();
        await Database.connect();
        this.app.use(express.json());
        this.app.use(cors());

        this.app.use('/api', this.createApiServer())

        this.app.get('/', (req, res) => {
            res.send('Welcome to the API!');
        });

        this.app.listen(this.port, ()=>{
            console.log(`Server is running on http://localhost:${this.port}`);
        })

    }

     private static createApiServer(): Application {
    const app: Application = express();
    const routes: RouteConfig[] = [];

    routes.forEach(route => {
      app.use(route.path, route.router);
    });
    return app;
  }

}

(async () => {
    try {
        await App.startServer();
    } catch (error) {
        console.error('Error starting server:', error);
    }
})();