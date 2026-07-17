"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.morganMiddleware = exports.logger = void 0;
const winston_1 = __importDefault(require("winston"));
const winston_daily_rotate_file_1 = __importDefault(require("winston-daily-rotate-file"));
const morgan_1 = __importDefault(require("morgan"));
const { combine, timestamp, printf, colorize, align, errors } = winston_1.default.format;
const consoleFormat = combine(errors({ stack: true }), colorize({ all: true }), timestamp({ format: 'YYYY-MM-DD hh:mm:ss A' }), align(), printf((info) => {
    const stack = info.stack ? `\n${info.stack}` : '';
    return `[${info.timestamp}] ${info.level}: ${info.message} ${stack}`;
}));
const fileFormat = combine(errors({ stack: true }), timestamp({ format: 'YYYY-MM-DD hh:mm:ss.SSS A' }), align(), printf((info) => {
    const stack = info.stack ? `\n${info.stack}` : '';
    return `[${info.timestamp}] ${info.level}: ${info.message} ${stack}`;
}));
exports.logger = winston_1.default.createLogger({
    level: process.env.LOG_LEVEL,
    format: fileFormat,
    transports: [
        new winston_1.default.transports.Console({
            format: consoleFormat,
        }),
        new winston_daily_rotate_file_1.default({
            filename: 'logs/error-%DATE%.log',
            datePattern: 'YYYY-MM-DD',
            level: 'error',
            maxFiles: '2d',
            format: fileFormat,
        }),
        new winston_daily_rotate_file_1.default({
            filename: 'logs/combined-%DATE%.log',
            datePattern: 'YYYY-MM-DD',
            maxFiles: '2d',
            format: fileFormat,
        }),
    ],
});
exports.morganMiddleware = (0, morgan_1.default)((tokens, req, res) => {
    return JSON.stringify({
        timestamp: tokens.date(req, res, 'iso'),
        method: tokens.method(req, res),
        url: tokens.url(req, res),
        status: tokens.status(req, res),
        content_length: tokens.res(req, res, 'content-length'),
        response_time: tokens['response-time'](req, res),
    });
}, {
    stream: {
        write: (message) => {
            const data = JSON.parse(message);
            exports.logger.http(`Request: ${data.method} ${data.url} ${data.status} - ${data.response_time}ms`);
        },
    },
});
//# sourceMappingURL=logMiddlewares.js.map