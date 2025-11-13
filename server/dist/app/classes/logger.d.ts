import { ConsoleLogger, LoggerService } from '@nestjs/common';
export declare class Logger extends ConsoleLogger implements LoggerService {
    constructor();
    private logDir;
    private basicContext;
    log(message: any, context?: string | undefined): void;
    warn(message: any, ...optionalParams: any[]): void;
    error(message: any, ...optionalParams: any[]): Promise<void>;
}
