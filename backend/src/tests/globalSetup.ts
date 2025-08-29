import * as dotenv from 'dotenv';
import * as path from 'path';

export default async (): Promise<void> => {
  // Load test environment variables
  dotenv.config({ path: path.resolve(__dirname, '../../.env.test') });
  
  // Set test environment
  process.env.NODE_ENV = 'test';
};
