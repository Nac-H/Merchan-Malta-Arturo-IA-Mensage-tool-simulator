import { z } from "zod";
export declare const SendEmailType: z.ZodObject<{
    to: z.ZodString;
    subject: z.ZodString;
    body: z.ZodString;
    tone: import("@modelcontextprotocol/sdk/server/completable.js").Completable<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    to: string;
    subject: string;
    body: string;
    tone: string;
}, {
    to: string;
    subject: string;
    body: string;
    tone: string;
}>;
export type SendEmailType = z.infer<typeof SendEmailType>;
export declare const OutputSendEmailType: z.ZodObject<{
    success: z.ZodBoolean;
    error: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, "strip", z.ZodTypeAny, {
    success: boolean;
    error?: string | null | undefined;
}, {
    success: boolean;
    error?: string | null | undefined;
}>;
export type OutputSendEmailType = z.infer<typeof OutputSendEmailType>;
export declare const AuthEmailSchema: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
    clientType: z.ZodEnum<["gmail", "outlook", "yahoo"]>;
    port: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, "strip", z.ZodTypeAny, {
    email: string;
    password: string;
    clientType: "gmail" | "outlook" | "yahoo";
    port?: string | null | undefined;
}, {
    email: string;
    password: string;
    clientType: "gmail" | "outlook" | "yahoo";
    port?: string | null | undefined;
}>;
export type AuthEmailType = z.infer<typeof AuthEmailSchema>;
export declare const FetchEmailsInputSchema: z.ZodObject<{
    mailbox: z.ZodDefault<z.ZodString>;
    subject: z.ZodOptional<z.ZodString>;
    dateRange: z.ZodObject<{
        start: z.ZodOptional<z.ZodString>;
        end: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        start?: string | undefined;
        end?: string | undefined;
    }, {
        start?: string | undefined;
        end?: string | undefined;
    }>;
    senders: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
}, "strip", z.ZodTypeAny, {
    mailbox: string;
    dateRange: {
        start?: string | undefined;
        end?: string | undefined;
    };
    subject?: string | undefined;
    senders?: string[] | undefined;
}, {
    dateRange: {
        start?: string | undefined;
        end?: string | undefined;
    };
    subject?: string | undefined;
    mailbox?: string | undefined;
    senders?: string[] | undefined;
}>;
export type FetchEmailsInputType = z.infer<typeof FetchEmailsInputSchema>;
export declare const FetchEmailsOutputSchema: z.ZodObject<{
    emails: z.ZodOptional<z.ZodNullable<z.ZodArray<z.ZodObject<{
        id: z.ZodNumber;
        subject: z.ZodString;
        sender: z.ZodString;
        snippet: z.ZodString;
        date: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    }, "strip", z.ZodTypeAny, {
        subject: string;
        id: number;
        sender: string;
        snippet: string;
        date?: string | null | undefined;
    }, {
        subject: string;
        id: number;
        sender: string;
        snippet: string;
        date?: string | null | undefined;
    }>, "many">>>;
    error: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, "strip", z.ZodTypeAny, {
    error?: string | null | undefined;
    emails?: {
        subject: string;
        id: number;
        sender: string;
        snippet: string;
        date?: string | null | undefined;
    }[] | null | undefined;
}, {
    error?: string | null | undefined;
    emails?: {
        subject: string;
        id: number;
        sender: string;
        snippet: string;
        date?: string | null | undefined;
    }[] | null | undefined;
}>;
export type FetchEmailsOutputType = z.infer<typeof FetchEmailsOutputSchema>;
export declare const MarkEmailsAsReadInputSchema: z.ZodObject<{
    ids: z.ZodArray<z.ZodNumber, "many">;
    mailbox: z.ZodDefault<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    mailbox: string;
    ids: number[];
}, {
    ids: number[];
    mailbox?: string | undefined;
}>;
export type MarkEmailsAsReadInputType = z.infer<typeof MarkEmailsAsReadInputSchema>;
export declare const MarkEmailsAsReadOutputSchema: z.ZodObject<{
    success: z.ZodBoolean;
    error: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, "strip", z.ZodTypeAny, {
    success: boolean;
    error?: string | null | undefined;
}, {
    success: boolean;
    error?: string | null | undefined;
}>;
export type MarkEmailsAsReadOutputType = z.infer<typeof MarkEmailsAsReadOutputSchema>;
export declare const SendEmailInputSchema: z.ZodObject<{
    to: z.ZodString;
    subject: z.ZodString;
    body: z.ZodString;
    tone: import("@modelcontextprotocol/sdk/server/completable.js").Completable<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    to: string;
    subject: string;
    body: string;
    tone: string;
}, {
    to: string;
    subject: string;
    body: string;
    tone: string;
}>;
export type SendEmailInputType = z.infer<typeof SendEmailInputSchema>;
export declare const SendEmailOutputSchema: z.ZodObject<{
    success: z.ZodBoolean;
    error: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, "strip", z.ZodTypeAny, {
    success: boolean;
    error?: string | null | undefined;
}, {
    success: boolean;
    error?: string | null | undefined;
}>;
export type SendEmailOutputType = z.infer<typeof SendEmailOutputSchema>;
