import express, { Express } from 'express';
import cookieParser from 'cookie-parser';

import cors from 'cors';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import { container } from './config/inversify.config';
import { PaymentController } from './controllers/payment.controller';
import { TYPES } from './config/inversify-key.types';
import path from 'path';
import { fileURLToPath } from 'url';
export function applyMiddlewares(app: Express) {
    const corsOptions = {
        origin: [
            'http://localhost:5173',
            'http://localhost:5174',
            'http://localhost:3000',
            process.env.FRONTEND_URL || 'http://localhost:5173',
        ],
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization'],
    };
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    function a() {
        console.log(__filename, __dirname);
        return 'hi';
    }
    app.use('/uploads', express.static(path.join(__dirname, '../uploads')));
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
