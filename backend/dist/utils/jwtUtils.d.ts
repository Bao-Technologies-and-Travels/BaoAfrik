export type TokenPayload = {
    userId: string;
    email: string;
};
export interface TokenPair {
    accessToken: string;
    refreshToken: string;
}
export declare function signAccessToken(payload: TokenPayload): string;
export declare function signRefreshToken(payload: TokenPayload): string;
export declare const generateTokenPair: (userId: string, email: string) => TokenPair;
export declare function verifyAccessToken(token: string): TokenPayload;
export declare function verifyRefreshToken(token: string): TokenPayload;
export declare const generateSecureToken: () => string;
export declare const generateVerificationCode: () => string;
export declare function parseDurationToSeconds(input: string): number;
//# sourceMappingURL=jwtUtils.d.ts.map