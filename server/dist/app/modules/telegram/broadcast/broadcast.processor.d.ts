import { Job } from "bull";
import { TelegramBot } from "../telegram.bot";
import { BroadcastJob } from "./types";
import { UsersService } from "../../../modules/user/users.service";
import { BroadcastService } from "./broadcast.service";
export declare class BroadcastProcessor {
    private readonly telegramBot;
    private readonly usersService;
    private readonly broadcastService;
    private readonly logger;
    constructor(telegramBot: TelegramBot, usersService: UsersService, broadcastService: BroadcastService);
    handle(job: Job<BroadcastJob>): Promise<'sent' | 'blocked' | 'retry_scheduled'>;
    private sendMessageWithButtons;
    private createInlineKeyboard;
    private forwardMessage;
}
