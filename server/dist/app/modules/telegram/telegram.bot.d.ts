import { UsersService } from '../user/users.service';
import { BroadcastHandler } from './broadcast/broadcast.handler';
export declare class TelegramBot {
    private readonly usersService;
    private readonly broadcastHandler;
    private readonly logger;
    private readonly bot;
    private readonly chatId;
    private readonly adminIds;
    private readonly appUrl;
    constructor(usersService: UsersService, broadcastHandler: BroadcastHandler);
    private initializeBot;
    private userHandler;
    private setupAdminHandlers;
    private setupBroadcastHandlers;
    private commandStart;
    private commandStats;
    private extractRefCode;
    private getTgUser;
    getBotApi(): import("grammy").Api<import("grammy").RawApi>;
}
