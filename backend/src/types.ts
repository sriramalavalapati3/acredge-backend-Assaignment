import express from 'express';

export interface RouteConfig {
    path: string;
    router: express.Router;
  }

export enum Role {
    ADMIN = 'admin',
    USER = 'user'
}