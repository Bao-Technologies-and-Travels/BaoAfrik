import { PrismaClient } from '@prisma/client';
declare global {
    var __prisma: PrismaClient | undefined;
}
declare const prisma: any;
export declare const connectDatabase: () => Promise<void>;
export declare const disconnectDatabase: () => Promise<void>;
export declare const isDatabaseConnected: () => Promise<boolean>;
export default prisma;
//# sourceMappingURL=database.d.ts.map