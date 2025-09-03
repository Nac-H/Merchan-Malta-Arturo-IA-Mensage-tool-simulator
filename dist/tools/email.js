import { FetchEmailsInputSchema, FetchEmailsOutputSchema, OutputSendEmailType, SendEmailType } from "../types/email.js";
import { Logger } from "../utils/logger.js";
import { getResource } from "../utils/resource.js";
import { FETCH_EMAILS_PROMPT } from "../constants/email.js";
import EmailClient from "../models/email.js";
const parseResponsePrompt = (response, prompt) => {
    if (!response.emails || response.emails.length === 0) {
        return prompt.replace("{{emails}}", "[]");
    }
    const emailsContent = prompt.replace("{{emails}}", JSON.stringify(response.emails));
    return emailsContent;
};
export function registerEmailTools(server) {
    server.registerTool("fetch-emails", {
        title: "Fetch Emails",
        description: "Get emails from the user's inbox. Can specify the mailbox (INBOX by default), a subject (string), date range (ISO format: YYYY-MM-DDTHH:mm:ss), and sender emails (list of strings) to filter emails.",
        inputSchema: FetchEmailsInputSchema.shape,
        outputSchema: FetchEmailsOutputSchema.shape,
    }, async (params, { requestInfo }) => {
        const authEmail = {
            port: requestInfo?.headers["email-port"],
            email: requestInfo?.headers["email-username"],
            password: requestInfo?.headers["email-password"],
            clientType: requestInfo?.headers["email-client-type"],
        };
        const emailClient = new EmailClient(authEmail);
        const response = await emailClient.fetchEmails(params);
        if (response.error) {
            return {
                isError: true,
                content: [
                    {
                        type: "text",
                        text: response.error,
                    },
                ],
            };
        }
        const instructionsPromptSource = requestInfo?.headers["email-instructions"] ||
            process.env.EMAIL_INSTRUCTIONS ||
            FETCH_EMAILS_PROMPT;
        const instructionsPrompt = await getResource(instructionsPromptSource);
        const finalResponse = parseResponsePrompt(response, instructionsPrompt);
        return {
            content: [
                {
                    type: "text",
                    text: finalResponse,
                },
            ],
            structuredContent: response,
        };
    });
    server.registerTool("Send-Email", {
        title: "Send Email",
        description: "Send an email to a specified recipient.",
        annotations: {
            openWorldHint: true,
            examples: [
                {
                    input: {
                        to: "recipient@example.com",
                        subject: "Hello!",
                        body: "This is a test email.",
                        tone: "friendly",
                    },
                },
            ],
        },
        inputSchema: SendEmailType.shape,
        outputSchema: OutputSendEmailType.shape,
    }, async (params, { requestInfo }) => {
        const authEmail = {
            port: requestInfo?.headers["email-port"],
            email: requestInfo?.headers["email-username"],
            password: requestInfo?.headers["email-password"],
            clientType: requestInfo?.headers["email-client-type"]
        };
        const emailClient = new EmailClient(authEmail);
        const result = await emailClient.sendEmail(params);
        return {
            isError: !result,
            content: [
                {
                    type: "text",
                    text: result ? "Mensaje enviado" : "Error al enviar el mensaje"
                }
            ],
            structuredContent: { result }
        };
    });
    Logger.info("Email tools registered", Boolean(server));
}
//# sourceMappingURL=email.js.map
