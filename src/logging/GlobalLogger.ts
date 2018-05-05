export class LoggerFactory {
    static Get(type: string) {
        // TODO: Fetch log level from config file.
        return new GlobalLogger(type, LogLevel.Debug);
    }
}

export class GlobalLogger {
    // TODO: Make logging async?

    private _type: string;
    private _level: LogLevel;
    constructor(type: string, level: LogLevel) {
        this._type = type;
        this._level = level;
    }
    Log(level: LogLevel, message: string): void {
        if (true) {//this._level >= level) {
            console.log(this.GetTimestamp() + " - " + level + " - " + this._type + " - " + message);
        }
    }
    LogDebug(message: string): void {
        this.Log(LogLevel.Debug, message);
    }
    LogInfo(message: string): void {
        this.Log(LogLevel.Info, message);
    }
    LogWarn(message: string): void {
        this.Log(LogLevel.Warn, message);
    }
    LogError(message: string): void {
        this.Log(LogLevel.Error, message);
    }
    LogFatal(message: string): void {
        this.Log(LogLevel.Fatal, message);
    }

    GetTimestamp(): string {
        var today = new Date();
        var year = today.getFullYear();
        var month = today.getMonth() + 1;
        var day = today.getDate();
        var hour = today.getHours();
        var minute = today.getMinutes();
        var second = today.getSeconds();
        var milliSecond = today.getMilliseconds();

        return this.PadLeftWithZeros(year, 4) + "-"
            + this.PadLeftWithZeros(month, 2) + "-"
            + this.PadLeftWithZeros(day, 2) + " @ "
            + this.PadLeftWithZeros(hour, 2) + ":"
            + this.PadLeftWithZeros(minute, 2) + ":"
            + this.PadLeftWithZeros(second, 2) + "."
            + this.PadLeftWithZeros(milliSecond, 3);
    }

    PadLeftWithZeros(s: string | number, size: number): string {
        s = s + "";
        while (s.length < size) {
            s = "0" + s;
        }
        return s;
    }
}

enum LogLevel {
    Debug = "DEBUG",
    Info = "INFO",
    Warn = "WARN",
    Error = "ERROR",
    Fatal = "FATAL"
}