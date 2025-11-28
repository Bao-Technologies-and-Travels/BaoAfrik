import { PrismaClient } from '../generated/client';
import logger from './logger';
import { PrismaPg } from '@prisma/adapter-pg';

const { Pool } = require('pg');

// Create PostgreSQL pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

// Create adapter
const adapter = new PrismaPg(pool);

declare global {
  var __prisma: PrismaClient | undefined;
}

// Prevent multiple instances of Prisma Client in development
const prisma = new PrismaClient({
  adapter: adapter,
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error']
});

if (process.env.NODE_ENV === 'development') {
  globalThis.__prisma = prisma;
}

export const connectDatabase = async (): Promise<void> => {
  try {
    await prisma.$connect();
    logger.info('Successfully connected to PostgreSQL database');
  } catch (error) {
    logger.error('Failed to connect to database:', error);
    throw error;
  }
};

export const disconnectDatabase = async (): Promise<void> => {
  try {
    await prisma.$disconnect();
    logger.info('Disconnected from PostgreSQL database');
  } catch (error) {
    logger.error('Error disconnecting from database:', error);
    throw error;
  }
};

// Health check function
export const isDatabaseConnected = async (): Promise<boolean> => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return true;
  } catch (error) {
    logger.error('Database health check failed:', error);
    return false;
  }
};

export default prisma;
