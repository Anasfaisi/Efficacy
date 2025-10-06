import express, { Express } from 'express';
import cookieParser from 'cookie-parser';

import cors from 'cors';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import { container } from './config/inversify.config';
import { PaymentController } from './controllers/payment.controller';
import { TYPES } from './types/inversify-key.types';
export function applyMiddlewares(app: Express) {
    const corsOptions = {
        origin: 'http://localhost:5173',
        credentials: true,
        methods: ['GET', 'POST', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization'],
    };

    app.use(cors(corsOptions));
    app.use(morgan('dev'));
    const paymentController = container.get<PaymentController>(
        TYPES.PaymentController
    );
    app.post(
        '/api/payments/webhook',
        bodyParser.raw({ type: 'application/json' }),
        paymentController.handleWebhook
    );
    app.use(express.json());
    app.use(cookieParser());
}
