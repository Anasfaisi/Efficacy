import express, { Express } from 'express';
import cookieParser from 'cookie-parser';

import cors from 'cors';
import morgan from 'morgan';
export function applyMiddlewares(app: Express) {
    const corsOptions = {
        origin: 'http://localhost:5173',
        credentials: true,
        methods: ['GET', 'POST', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization'],
    };

    app.use(cors(corsOptions));
    app.use(morgan('dev'));

    app.use(express.json());
    app.use(cookieParser());
}
