declare class LoggerImpl {
    private padLength;
    private getPrefix;
    private print;
    debug(...text: any): void;
    info(...text: Array<any>): void;
    warn(...text: Array<any>): void;
    error(...text: Array<any>): void;
}
export declare const Logger: LoggerImpl;
export type LogType = "error" | "warn" | "debug" | "info";
export {};
