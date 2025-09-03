var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function")
        r = Reflect.decorate(decorators, target, key, desc);
    else
        for (var i = decorators.length - 1; i >= 0; i--)
            if (d = decorators[i])
                r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function")
        return Reflect.metadata(k, v);
};
import { ImapFlow } from "imapflow";
import { DateTime } from "luxon";
import { Logger } from "../utils/logger.js";
import { handleError } from "../decorator/handle-error.js";
class EmailClient {
    constructor(params) {
        this.email = params.email || process.env.EMAIL_USERNAME || "";
        this.password = params.password || process.env.EMAIL_PASSWORD || "";
        this.clientType = (process.env.EMAIL_CLIENT_TYPE ||
            params.clientType);
    }
    getClient() {
        const { host, port } = this.getHost(this.clientType);
        const client = new ImapFlow({
            host,
            secure: true,
            emitLogs: false,
            logger: undefined,
            port: process.env.EMAIL_PORT
                ? parseInt(process.env.EMAIL_PORT, 10)
                : port,
            auth: {
                user: this.email,
                pass: this.password,
            },
        });
        return client;
    }
    getHost(clientType) {
        switch (clientType) {
            case "gmail":
                return {
                    host: "imap.gmail.com",
                    port: 993,
                };
            case "outlook":
                return {
                    host: "outlook.office365.com",
                    port: 993,
                };
            case "yahoo":
                return {
                    host: "imap.mail.yahoo.com",
                    port: 993,
                };
            default:
                throw new Error(`Unsupported email client type: ${clientType}`);
        }
    }
    sendEmail(params) {
        const randomNumber = Math.random();
        const success = randomNumber > 0.5;
        const { to, subject } = params;
        if (success) {
            Logger.info(`Email enviado a ${to} con asunto "${subject}"`);
        }
        else {
            Logger.info(`Fallo al enviar email a ${to} con asunto "${subject}"`);
        }
        return success;
    }
    async fetchEmails(params) {
        const client = this.getClient();
        try {
            await client.connect();
            await client.mailboxOpen(params.mailbox || "INBOX");
            const defaultStartDate = DateTime.now().startOf("day");
            const defaultEndDate = DateTime.now().endOf("day");
            const orConditions = [];
            if (params.senders) {
                for (const sender of params.senders) {
                    orConditions.push({ from: sender });
                }
            }
            const localTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
            if (params.dateRange.start) {
                params.dateRange.start = params.dateRange.start.replace(/Z|GMT-[0-9]+/g, "");
                // if no time is provided, set to start of day
                if (!params.dateRange.start.includes("T")) {
                    params.dateRange.start += "T00:00:00";
                }
            }
            if (params.dateRange.end) {
                params.dateRange.end = params.dateRange.end.replace(/Z|GMT-[0-9]+/g, "");
                // if no time is provided, set to end of day
                if (!params.dateRange.end.includes("T")) {
                    params.dateRange.end += "T23:59:59";
                }
            }
            let sinceDate = params.dateRange.start
                ? DateTime.fromISO(params.dateRange.start)
                : defaultStartDate;
            let beforeDate = params.dateRange.end
                ? DateTime.fromISO(params.dateRange.end)
                : defaultEndDate;
            if (params.dateRange.start) {
                sinceDate = sinceDate.setZone(localTimezone, { keepLocalTime: true });
            }
            if (params.dateRange.end) {
                beforeDate = beforeDate.setZone(localTimezone, { keepLocalTime: true });
            }
            const searchCriteria = {
                subject: params.subject,
                since: sinceDate.toJSDate(),
                before: beforeDate.toJSDate(),
                or: orConditions.length > 0 ? orConditions : undefined,
            };
            Logger.debug("Searching emails with criteria:", JSON.stringify(searchCriteria, null, 2));
            const messagesUIDs = await client.search(searchCriteria, {
                uid: true,
            });
            if (!messagesUIDs) {
                return {
                    emails: [],
                    error: "No emails found matching the criteria.",
                };
            }
            Logger.debug(`Found ${messagesUIDs.length} emails matching the criteria`);
            const emailsParsed = [];
            for (const messageUID of messagesUIDs) {
                const message = await client.fetchOne(messageUID, {
                    uid: true,
                    envelope: true,
                    bodyStructure: true,
                }, {
                    uid: true,
                });
                if (!message) {
                    continue;
                }
                if (message.envelope?.date) {
                    const emailDate = DateTime.fromJSDate(message.envelope.date);
                    const isInRange = emailDate >= sinceDate && emailDate < beforeDate;
                    if (!isInRange) {
                        continue;
                    }
                }
                const senderParsed = message.envelope?.sender
                    ?.map((s) => {
                    const { address, name } = s;
                    return name ? `${name} <${address}>` : address;
                })
                    .join(", ") || "Unknown Sender";
                emailsParsed.push({
                    id: messageUID,
                    subject: message.envelope?.subject || "No Subject",
                    sender: senderParsed,
                    snippet: "",
                    date: message.envelope?.date
                        ? DateTime.fromJSDate(message.envelope.date).toISO()
                        : undefined,
                });
            }
            Logger.info(`Parsed ${emailsParsed.length} emails successfully`);
            return {
                emails: emailsParsed,
            };
        }
        catch (error) {
            Logger.error("Error fetching emails:", error instanceof Error ? error.message : "Unknown error");
            return { emails: [], error: "Failed to fetch emails" };
        }
        finally {
            await client.mailboxClose();
            await client.logout();
        }
    }
    async markEmailsAsRead(params) {
        const { ids } = params;
        const client = this.getClient();
        try {
            await client.connect();
            await client.mailboxOpen(params.mailbox || "INBOX");
            await client.messageFlagsAdd(ids, ["\\Seen"], {
                uid: true,
            });
        }
        catch (error) {
            return {
                success: false,
                error: `Failed to mark emails as read: ${error instanceof Error ? error.message : "Unknown error"}`,
            };
        }
        finally {
            await client.mailboxClose();
            await client.logout();
        }
    }
}
__decorate([
    handleError("Failed to fetch emails"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], EmailClient.prototype, "fetchEmails", null);
__decorate([
    handleError("Failed to mark emails as read"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], EmailClient.prototype, "markEmailsAsRead", null);
export default EmailClient;
//# sourceMappingURL=email.js.map
