import express from 'express';
import { Request } from 'express';

export interface RouteConfig {
    path: string;
    router: express.Router;
  }

export enum Role {
    ADMIN = 'admin',
    USER = 'user'
}

declare module 'express-serve-static-core' {
  interface Request {
    userId?: string;
    role: string;
  }
}