import { SendEmailInputSchema } from "../types/email.js";
const promptSendEmail = `
You are about to send an email with the following details:

Tone: {{tone}}
To: {{to}}
Subject: {{subject}}
Body: {{body}}
`;
export function registerEmailPrompts(server) {
    server.registerPrompt("send-email", {
        title: "Send email",
        description: "Send an email to a specified recipient with a subject and body content.",
        argsSchema: SendEmailInputSchema.shape,
    }, ({ tone, to, subject, body }) => {
        const prompt = promptSendEmail
            .replace("{{tone}}", tone)
            .replace("{{to}}", to)
            .replace("{{subject}}", subject)
            .replace("{{body}}", body);
        return {
            messages: [
                {
                    role: "user",
                    content: {
                        type: "text",
                        text: prompt,
                    },
                },
            ],
        };
    });
}
//# sourceMappingURL=email.js.map
