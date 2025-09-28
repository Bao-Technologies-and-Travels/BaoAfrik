"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addRequestId = void 0;
const winston_1 = __importDefault(require("winston"));
const path_1 = __importDefault(require("path"));
const logLevel = process.env.LOG_LEVEL || 'info';
const logDir = 'logs';
const logFormat = winston_1.default.format.combine(winston_1.default.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), winston_1.default.format.errors({ stack: true }), winston_1.default.format.json(), winston_1.default.format.prettyPrint());
const consoleFormat = winston_1.default.format.combine(winston_1.default.format.colorize(), winston_1.default.format.timestamp({ format: 'HH:mm:ss' }), winston_1.default.format.printf(({ level, message, timestamp, stack }) => {
    return `${timestamp} [${level}]: ${stack || message}`;
}));
const transports = [];
if (process.env.NODE_ENV !== 'production') {
    transports.push(new winston_1.default.transports.Console({
        level: logLevel,
        format: consoleFormat,
    }));
}
if (process.env.NODE_ENV === 'production' || process.env.LOG_FILE_PATH) {
    transports.push(new winston_1.default.transports.File({
        filename: path_1.default.join(logDir, 'combined.log'),
        level: logLevel,
        format: logFormat,
        maxsize: 10485760,
        maxFiles: 5,
    }));
    transports.push(new winston_1.default.transports.File({
        filename: path_1.default.join(logDir, 'error.log'),
        level: 'error',
        format: logFormat,
        maxsize: 10485760,
        maxFiles: 5,
    }));
}
const logger = winston_1.default.createLogger({
    level: logLevel,
    format: logFormat,
    defaultMeta: {
        service: 'baoafrik-api',
        environment: process.env.NODE_ENV || 'development',
    },
    transports,
    exitOnError: false,
});
if (process.env.NODE_ENV === 'production') {
    logger.exceptions.handle(new winston_1.default.transports.File({
        filename: path_1.default.join(logDir, 'exceptions.log'),
        format: logFormat,
    }));
    logger.rejections.handle(new winston_1.default.transports.File({
        filename: path_1.default.join(logDir, 'rejections.log'),
        format: logFormat,
    }));
}
const addRequestId = (requestId) => {
    return logger.child({ requestId });
};
exports.addRequestId = addRequestId;
exports.default = logger;
//# sourceMappingURL=logger.js.map