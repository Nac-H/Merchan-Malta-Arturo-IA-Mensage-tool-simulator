import { AuthEmailType, FetchEmailsInputType, MarkEmailsAsReadInputType, SendEmailType } from "../types/email.js";
declare class EmailClient {
    private email;
    private password;
    private clientType;
    constructor(params: AuthEmailType);
    private getClient;
    private getHost;
    sendEmail(params: SendEmailType): boolean;
    fetchEmails(params: FetchEmailsInputType): Promise<{
        emails: never[];
        error: string;
    } | {
        emails: {
            subject: string;
            id: number;
            sender: string;
            snippet: string;
            date?: string | null | undefined;
        }[];
        error?: undefined;
    }>;
    markEmailsAsRead(params: MarkEmailsAsReadInputType): Promise<{
        success: boolean;
        error: string;
    } | undefined>;
}
export default EmailClient;
