import express, { Express } from 'express';
import cookieParser from 'cookie-parser';

import cors from 'cors';
import bodyParser from 'body-parser';
import { container } from './config/inversify.config';
import { PaymentController } from './controllers/payment.controller';
import { TYPES } from './config/inversify-key.types';
import path from 'path';

import { morganMiddleware } from './utils/logMiddlewares';
export function applyMiddlewares(app: Express) {
    const corsOptions = {
        origin: [process.env.FRONTEND_URL || 'https://efficacy.ddns.net'],
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization'],
    };

    app.use('/uploads', express.static(path.join(__dirname, '../uploads')));
    app.use(cors(corsOptions));
    app.use(morganMiddleware);
    const paymentController = container.get<PaymentController>(
        TYPES.PaymentController
    );
    app.post(
        '/api/payments/webhook',
        bodyParser.raw({ type: 'application/json' }),
        paymentController.handleWebhook.bind(paymentController)
    );
    app.use(express.json());
    app.use(cookieParser());
}
