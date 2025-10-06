import express from 'express';
import { applyMiddlewares } from './middleware';
import { applyRoutes } from './routes';

export function createApp() {
    const app = express();

    applyMiddlewares(app);

    applyRoutes(app);
    return app;
}
