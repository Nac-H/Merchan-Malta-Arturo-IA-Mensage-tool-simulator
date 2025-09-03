/* eslint-disable @typescript-eslint/no-explicit-any */
import chalk from "chalk";
import fs from "node:fs";
class LoggerImpl {
    constructor() {
        this.padLength = 8;
    }
    getPrefix() {
        return chalk.green("[MCP]");
    }
    print(type, info, texts) {
        const prefix = this.getPrefix();
        if (global.IS_STREAM_SERVER) {
            console[type](`${prefix} ${info}`, ...texts);
            return;
        }
        const logFilePath = process.env.DEBUG_LOG_FILE || "./server.log";
        const logMessage = `${new Date().toISOString()} ${info} ${texts.join(" ")}`;
        if (!fs.existsSync(logFilePath)) {
            fs.writeFileSync(logFilePath, "");
        }
        fs.appendFileSync(logFilePath, `${logMessage}\n`);
    }
    debug(...text) {
        if (global.IS_STREAM_SERVER) {
            this.print("debug", `${chalk.blueBright("[DEBUG]".padEnd(this.padLength))}${chalk.reset(" ")}`, text);
        }
        else {
            this.print("debug", `[DEBUG]`, text);
        }
    }
    info(...text) {
        if (global.IS_STREAM_SERVER) {
            this.print("info", `${chalk.cyanBright("[INFO]".padEnd(this.padLength))}${chalk.reset(" ")}`, text);
        }
        else {
            this.print("info", `[INFO]`, text);
        }
    }
    warn(...text) {
        if (global.IS_STREAM_SERVER) {
            this.print("warn", `${chalk.yellowBright("[WARN]".padEnd(this.padLength))}${chalk.reset(" ")}`, text);
        }
        else {
            this.print("warn", `[WARN]`, text);
        }
    }
    error(...text) {
        if (global.IS_STREAM_SERVER) {
            this.print("error", `${chalk.redBright("[ERROR]".padEnd(this.padLength))}${chalk.reset(" ")}`, text);
        }
        else {
            this.print("error", `[ERROR]`, text);
        }
    }
}
export const Logger = new LoggerImpl();
//# sourceMappingURL=logger.js.map