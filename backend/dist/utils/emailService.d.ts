interface EmailOptions {
    to: string;
    subject: string;
    html: string;
    text?: string;
}
interface EmailTemplate {
    subject: string;
    html: string;
    text: string;
}
declare class EmailService {
    private transporter;
    constructor();
    private verifyConnection;
    private setupSendGrid;
    sendEmail(options: EmailOptions): Promise<boolean>;
    generateVerificationCode(): string;
    getVerificationEmailTemplate(name: string, verificationCode: string): EmailTemplate;
    getPasswordResetEmailTemplate(name: string, resetToken: string): EmailTemplate;
    sendVerificationEmail(email: string, name: string, verificationCode: string): Promise<boolean>;
    sendPasswordResetEmail(email: string, name: string, resetToken: string): Promise<boolean>;
    getWelcomeEmailTemplate(name: string): EmailTemplate;
    sendWelcomeEmail(email: string, name: string): Promise<boolean>;
    testEmailConnection(): Promise<boolean>;
}
declare const emailService: EmailService;
export declare const sendVerificationEmail: (email: string, name: string, verificationCode: string) => Promise<boolean>;
export declare const sendPasswordResetEmail: (email: string, name: string, resetToken: string) => Promise<boolean>;
export declare const sendWelcomeEmail: (email: string, name: string) => Promise<boolean>;
export declare const testEmailConnection: () => Promise<boolean>;
export default emailService;
//# sourceMappingURL=emailService.d.ts.map