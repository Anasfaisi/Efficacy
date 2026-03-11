import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import morgan from 'morgan';

const { combine, timestamp, json, printf, colorize, align, errors } =
    winston.format;

const consoleFormat = combine(
    errors({ stack: true }),
    colorize({ all: true }),
    timestamp({ format: 'YYYY-MM-DD hh:mm:ss A' }),
    align(),
    printf((info) => {
        const stack = info.stack ? `\n${info.stack}` : '';
        return `[${info.timestamp}] ${info.level}: ${info.message} ${stack}`;
    })
);

const fileFormat = combine(
    errors({ stack: true }),
    timestamp({ format: 'YYYY-MM-DD hh:mm:ss.SSS A' }),
    json()
);

export const logger = winston.createLogger({
    level: process.env.LOG_LEVEL,
    format: fileFormat,
    transports: [
        new winston.transports.Console({
            format: consoleFormat,
        }),

        new DailyRotateFile({
            filename: 'logs/error-%DATE%.log',
            datePattern: 'YYYY-MM-DD',
            level: 'error',
            maxFiles: '2d',
            format: fileFormat,
        }),

        new DailyRotateFile({
            filename: 'logs/combined-%DATE%.log',
            datePattern: 'YYYY-MM-DD',
            maxFiles: '2d',
            format: fileFormat,
        }),
    ],
});

export const morganMiddleware = morgan(
    (tokens, req, res) => {
        return JSON.stringify({
            timestamp: tokens.date(req, res, 'iso'),
            method: tokens.method(req, res),
            url: tokens.url(req, res),
            status: tokens.status(req, res),
            content_length: tokens.res(req, res, 'content-length'),
            response_time: tokens['response-time'](req, res),
        });
    },
    {
        stream: {
            write: (message) => {
                const data = JSON.parse(message);
                logger.http(
                    `Request: ${data.method} ${data.url} ${data.status} - ${data.response_time}ms`
                );
            },
        },
    }
);
