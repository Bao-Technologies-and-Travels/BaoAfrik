"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isDatabaseConnected = exports.disconnectDatabase = exports.connectDatabase = void 0;
const client_1 = require("@prisma/client");
const logger_1 = __importDefault(require("./logger"));
const prisma = globalThis.__prisma || new client_1.PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});
if (process.env.NODE_ENV === 'development') {
    globalThis.__prisma = prisma;
}
const connectDatabase = async () => {
    try {
        await prisma.$connect();
        logger_1.default.info('Successfully connected to PostgreSQL database');
    }
    catch (error) {
        logger_1.default.error('Failed to connect to database:', error);
        throw error;
    }
};
exports.connectDatabase = connectDatabase;
const disconnectDatabase = async () => {
    try {
        await prisma.$disconnect();
        logger_1.default.info('Disconnected from PostgreSQL database');
    }
    catch (error) {
        logger_1.default.error('Error disconnecting from database:', error);
        throw error;
    }
};
exports.disconnectDatabase = disconnectDatabase;
const isDatabaseConnected = async () => {
    try {
        await prisma.$queryRaw `SELECT 1`;
        return true;
    }
    catch (error) {
        logger_1.default.error('Database health check failed:', error);
        return false;
    }
};
exports.isDatabaseConnected = isDatabaseConnected;
exports.default = prisma;
//# sourceMappingURL=database.js.map