
import { ConfigService } from "@nestjs/config";
import { createLogger, Logger, format, transports } from "winston";


export class AppLogger {
    private context?: string;
    private logger: Logger

    public setContext(context: string): void {
        this.context = context
    }

    constructor(
        private readonly configService: ConfigService) {

        this.logger = createLogger({
            level: process.env.LOGGER_LEVEL,
            format: format.combine(
                format.timestamp(),
                format.prettyPrint()
            ),
            transports: [
                new transports.File({ filename: 'logs/error.log', level: 'error' }),
                new transports.File({ filename: 'logs/combined.log' }),
                new transports.Console()
            ]
        })
    }

    error(ctx: any,
        message: string,
        meta?: Record<string, any>
    ): Logger {
        return this.logger.error({
            message,
            contextName: this.context,
            ctx,
            ...meta
        })
    }

    warn(ctx: any,
        message: string,
        meta?: Record<string, any>
    ): Logger {
        return this.logger.warn({
            message,
            contextName: this.context,
            ctx,
            ...meta
        })
    }

    debug(ctx: any,
        message: string,
        meta?: Record<string, any>
    ): Logger {
        return this.logger.debug({
            message,
            contextName: this.context,
            ctx,
            ...meta
        })
    }

    info(ctx: any,
        message: string,
        meta?: Record<string, any>
    ): Logger {
        return this.logger.info({
            message,
            contextName: this.context,
            ctx,
            ...meta
        })
    }

}
