import { Queue } from "bull";
import { Message } from "grammy/types";
import { BroadcastJob, BroadcastReport } from "./types";
import { TelegramBot } from "../telegram.bot";
import { UsersService } from "../../../modules/user/users.service";
export declare class BroadcastService {
    private readonly usersService;
    private readonly queue;
    private readonly telegramBot;
    private readonly logger;
    private readonly reportsDir;
    readonly broadcastReports: Map<string, BroadcastReport>;
    private static readonly BUTTON_REGEX;
    constructor(usersService: UsersService, queue: Queue<BroadcastJob>, telegramBot: TelegramBot);
    private parseMessageForButtons;
    private listenToQueueEvents;
    private checkProgress;
    private sendMainTasksCompletedNotification;
    private finalizeBroadcast;
    private sendProgressUpdate;
    start(message: Message, broadcastId: string, adminId: number, userType: 'all'): Promise<BroadcastReport>;
    private queueUsers;
    getQueueStats(): Promise<{
        waiting: number;
        active: number;
        completed: number;
        failed: number;
    }>;
    scheduleRetry(jobData: BroadcastJob, delayMs: number): Promise<void>;
    loadBroadcastReport(broadcastId: string): Promise<BroadcastReport | null>;
    startRetryBroadcast(originalBroadcastId: string, adminId: number): Promise<BroadcastReport>;
    private queueUsersWithErrors;
}
