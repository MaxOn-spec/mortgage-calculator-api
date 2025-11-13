"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var BroadcastService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.BroadcastService = void 0;
const common_1 = require("@nestjs/common");
const bull_1 = require("@nestjs/bull");
const broadcast_config_1 = require("./broadcast.config");
const telegram_bot_1 = require("../telegram.bot");
const fs = __importStar(require("fs/promises"));
const fs_1 = require("fs");
const path = __importStar(require("path"));
const helper_1 = require("../../../classes/helper");
const users_service_1 = require("../../../modules/user/users.service");
let BroadcastService = BroadcastService_1 = class BroadcastService {
    constructor(usersService, queue, telegramBot) {
        this.usersService = usersService;
        this.queue = queue;
        this.telegramBot = telegramBot;
        this.logger = new common_1.Logger(BroadcastService_1.name);
        this.reportsDir = path.join(process.cwd(), 'broadcast-reports');
        this.broadcastReports = new Map();
        if (!(0, fs_1.existsSync)(this.reportsDir)) {
            (0, fs_1.mkdirSync)(this.reportsDir, { recursive: true });
        }
        this.listenToQueueEvents();
    }
    parseMessageForButtons(message) {
        if (!message.text && !message.caption) {
            return { cleanMessage: '', buttons: [] };
        }
        const text = message.text || message.caption || '';
        const isCaption = !message.text && !!message.caption;
        const match = text.match(BroadcastService_1.BUTTON_REGEX);
        if (!match) {
            return {
                cleanMessage: text,
                buttons: [],
                entities: isCaption ? undefined : message.entities,
                captionEntities: isCaption ? message.caption_entities : undefined
            };
        }
        try {
            let buttonsJson = `[${match[1]}]`;
            if (!/([{,]\s*)"\w+":/g.test(buttonsJson)) {
                buttonsJson = buttonsJson.replace(/([{,]\s*)(\w+):/g, '$1"$2":');
            }
            const buttons = JSON.parse(buttonsJson);
            const validButtons = buttons.filter(btn => btn && typeof btn.button === 'string' && typeof btn.link === 'string');
            const cleanMessage = text.replace(BroadcastService_1.BUTTON_REGEX, '').trim();
            const cleanMessageLength = cleanMessage.length;
            const originalEntities = isCaption ? message.caption_entities : message.entities;
            const filteredEntities = originalEntities?.filter(entity => entity.offset + entity.length <= cleanMessageLength);
            return {
                cleanMessage,
                buttons: validButtons,
                entities: isCaption ? undefined : filteredEntities,
                captionEntities: isCaption ? filteredEntities : undefined
            };
        }
        catch (error) {
            this.logger.warn(`Failed to parse buttons from message: ${error.message}, text: "${text}"`);
            return {
                cleanMessage: text,
                buttons: [],
                entities: isCaption ? undefined : message.entities,
                captionEntities: isCaption ? message.caption_entities : undefined
            };
        }
    }
    listenToQueueEvents() {
        this.queue.on('completed', (job, result) => {
            const { broadcastId, retryCount } = job.data;
            const report = this.broadcastReports.get(broadcastId);
            if (!report)
                return;
            if (result === 'sent') {
                report.sent++;
                if (retryCount && retryCount > 0) {
                    report.retrying = Math.max(0, (report.retrying || 0) - 1);
                }
            }
            else if (result === 'blocked') {
                report.blocked++;
                if (retryCount && retryCount > 0) {
                    report.retrying = Math.max(0, (report.retrying || 0) - 1);
                }
            }
            else if (result === 'retry_scheduled') {
                report.retrying = (report.retrying || 0) + 1;
                return;
            }
            this.checkProgress(report, broadcastId);
        });
        this.queue.on('failed', (job, error) => {
            const { broadcastId, tgId, retryCount } = job.data;
            const report = this.broadcastReports.get(broadcastId);
            if (!report)
                return;
            report.failed++;
            report.errors.push({ tgId, error: error.message });
            if (retryCount && retryCount > 0) {
                report.retrying = Math.max(0, (report.retrying || 0) - 1);
            }
            this.checkProgress(report, broadcastId);
        });
    }
    async checkProgress(report, broadcastId) {
        const processed = report.sent + report.failed + report.blocked;
        const activeRetries = report.retrying || 0;
        this.logger.debug(`Broadcast ${broadcastId} progress: processed=${processed}/${report.total}, active_retries=${activeRetries}, sent=${report.sent}, failed=${report.failed}, blocked=${report.blocked}`);
        if (processed > 0 && processed % 1000 === 0 && processed < report.total) {
            this.sendProgressUpdate(report);
        }
        if (processed === report.total && activeRetries === 0) {
            this.logger.log(`All tasks completed for broadcast ${broadcastId}, finalizing...`);
            await this.finalizeBroadcast(report, broadcastId);
        }
        else if (processed === report.total && activeRetries > 0) {
            this.logger.log(`Main tasks completed for broadcast ${broadcastId}, but ${activeRetries} retry tasks still active`);
            if (!report.mainTasksCompletedNotified) {
                await this.sendMainTasksCompletedNotification(report, activeRetries);
                report.mainTasksCompletedNotified = true;
            }
        }
    }
    async sendMainTasksCompletedNotification(report, activeRetries) {
        const message = `📊 Основные задачи рассылки завершены
        
Отправлено: ${report.sent}
Заблокировано: ${report.blocked}
Ошибок: ${report.failed}
⏳ Ожидаем завершения повторных попыток: ${activeRetries}

Финальный отчет будет отправлен после завершения всех повторных попыток.`;
        try {
            await this.telegramBot.getBotApi().sendMessage(report.adminId, message);
        }
        catch (error) {
            this.logger.error(`Failed to send main tasks completed notification for broadcast to admin ${report.adminId}`, error);
        }
    }
    async finalizeBroadcast(report, broadcastId) {
        report.status = 'completed';
        report.finishTime = helper_1.Helper.getClearDateNow();
        const reportJson = JSON.stringify(report);
        const reportPath = path.join(this.reportsDir, `${broadcastId}.json`);
        try {
            await fs.writeFile(reportPath, reportJson);
            this.logger.log(`Broadcast report ${broadcastId} saved to ${reportPath}`);
        }
        catch (error) {
            this.logger.error(`Failed to save broadcast report ${broadcastId}`, error);
        }
        let message = `✅ Рассылка завершена.
        
Отправлено: ${report.sent}
Заблокировано: ${report.blocked}
Ошибок: ${report.failed}
Всего: ${report.total}`;
        if (report.retrying && report.retrying > 0) {
            message += `\n⏳ Было запланировано повторов: ${report.retrying}`;
        }
        try {
            await this.telegramBot.getBotApi().sendMessage(report.adminId, message);
        }
        catch (error) {
            this.logger.error(`Failed to send final report for broadcast ${broadcastId} to admin ${report.adminId}`, error);
        }
        this.broadcastReports.delete(broadcastId);
    }
    sendProgressUpdate(report) {
        const processed = report.sent + report.failed + report.blocked;
        let message = `📈 Прогресс рассылки:
        
Обработано: ${processed} / ${report.total}
Отправлено: ${report.sent}
Заблокировано: ${report.blocked}
Ошибок: ${report.failed}`;
        if (report.retrying && report.retrying > 0) {
            message += `\nОжидают повтора: ${report.retrying}`;
        }
        try {
            this.telegramBot.getBotApi().sendMessage(report.adminId, message);
        }
        catch (error) {
            this.logger.error(`Failed to send progress update for broadcast to admin ${report.adminId}`, error);
        }
    }
    async start(message, broadcastId, adminId, userType) {
        const report = {
            total: 0,
            sent: 0,
            failed: 0,
            blocked: 0,
            adminId,
            message,
            errors: [],
            startTime: helper_1.Helper.getClearDateNow(),
            status: 'running',
            retrying: 0,
            mainTasksCompletedNotified: false,
        };
        this.broadcastReports.set(broadcastId, report);
        try {
            this.queueUsers(message, broadcastId, report, userType);
            return report;
        }
        catch (error) {
            this.logger.error(`Failed to start broadcast ${broadcastId}`, error);
            report.status = 'failed';
            throw error;
        }
    }
    async queueUsers(message, broadcastId, report, userType) {
        let offset = 0;
        let totalQueued = 0;
        try {
            const parsedMessage = this.parseMessageForButtons(message);
            for (;;) {
                let tgIds = await this.usersService.getIdsBatch(offset, broadcast_config_1.BROADCAST_CONFIG.BATCH_SIZE);
                if (!tgIds.length)
                    break;
                await this.queue.addBulk(tgIds.map((tgId) => ({
                    name: 'send',
                    data: {
                        tgId,
                        payload: message,
                        parsedMessage,
                        broadcastId,
                        adminId: report.adminId
                    },
                })));
                totalQueued += tgIds.length;
                offset += broadcast_config_1.BROADCAST_CONFIG.BATCH_SIZE;
                this.logger.log(`Queued batch of ${tgIds.length} users for broadcast ${broadcastId} (total: ${totalQueued})`);
            }
            report.total = totalQueued;
            if (totalQueued === 0) {
                await this.finalizeBroadcast(report, broadcastId);
            }
        }
        catch (error) {
            this.logger.error(`Failed during user queuing for broadcast ${broadcastId}`, error);
            report.status = 'failed';
        }
    }
    async getQueueStats() {
        const [waiting, active, completed, failed] = await Promise.all([
            this.queue.getWaiting(),
            this.queue.getActive(),
            this.queue.getCompleted(),
            this.queue.getFailed(),
        ]);
        return {
            waiting: waiting.length,
            active: active.length,
            completed: completed.length,
            failed: failed.length,
        };
    }
    async scheduleRetry(jobData, delayMs) {
        const { broadcastId } = jobData;
        try {
            await this.queue.add('send', jobData, {
                delay: delayMs,
                attempts: 1,
                removeOnComplete: broadcast_config_1.BROADCAST_CONFIG.REMOVE_ON_COMPLETE,
                removeOnFail: broadcast_config_1.BROADCAST_CONFIG.REMOVE_ON_FAIL,
            });
            this.logger.log(`Scheduled retry for user ${jobData.tgId} in broadcast ${broadcastId} with delay ${delayMs}ms`);
        }
        catch (error) {
            this.logger.error(`Failed to schedule retry for user ${jobData.tgId} in broadcast ${broadcastId}`, error);
            const report = this.broadcastReports.get(broadcastId);
            if (report) {
                report.failed++;
                report.errors.push({ tgId: jobData.tgId, error: `Failed to schedule retry: ${error.message}` });
                report.retrying = Math.max(0, (report.retrying || 0) - 1);
                this.checkProgress(report, broadcastId);
            }
        }
    }
    async loadBroadcastReport(broadcastId) {
        const reportPath = path.join(this.reportsDir, `${broadcastId}.json`);
        try {
            const reportData = await fs.readFile(reportPath, 'utf8');
            const report = JSON.parse(reportData);
            return report;
        }
        catch (error) {
            this.logger.error(`Failed to load broadcast report ${broadcastId}:`, error);
            return null;
        }
    }
    async startRetryBroadcast(originalBroadcastId, adminId) {
        const originalReport = await this.loadBroadcastReport(originalBroadcastId);
        if (!originalReport) {
            throw new Error(`Отчет рассылки ${originalBroadcastId} не найден`);
        }
        if (!originalReport.errors || originalReport.errors.length === 0) {
            throw new Error(`В рассылке ${originalBroadcastId} нет пользователей с ошибками`);
        }
        const retryBroadcastId = `retry-${originalBroadcastId}-${helper_1.Helper.getRandomString(6)}`;
        const message = Array.isArray(originalReport.message) ? originalReport.message[0] : originalReport.message;
        const report = {
            total: originalReport.errors.length,
            sent: 0,
            failed: 0,
            blocked: 0,
            adminId,
            message: message,
            errors: [],
            startTime: helper_1.Helper.getClearDateNow(),
            status: 'running',
            retrying: 0,
            mainTasksCompletedNotified: false,
        };
        this.broadcastReports.set(retryBroadcastId, report);
        try {
            await this.queueUsersWithErrors(originalReport, retryBroadcastId, report);
            return report;
        }
        catch (error) {
            this.logger.error(`Failed to start retry broadcast ${retryBroadcastId}`, error);
            report.status = 'failed';
            throw error;
        }
    }
    async queueUsersWithErrors(originalReport, retryBroadcastId, retryReport) {
        try {
            const message = Array.isArray(originalReport.message) ? originalReport.message[0] : originalReport.message;
            const parsedMessage = this.parseMessageForButtons(message);
            const tgIds = originalReport.errors.map(error => error.tgId);
            const activeTgIds = [];
            for (const tgId of tgIds) {
                const user = await this.usersService.findByTgId(tgId);
                if (user && user.isActive) {
                    activeTgIds.push(tgId);
                }
            }
            if (activeTgIds.length === 0) {
                this.logger.warn(`No active users found for retry broadcast ${retryBroadcastId}`);
                await this.finalizeBroadcast(retryReport, retryBroadcastId);
                return;
            }
            await this.queue.addBulk(activeTgIds.map((tgId) => ({
                name: 'send',
                data: {
                    tgId,
                    payload: message,
                    parsedMessage,
                    broadcastId: retryBroadcastId,
                    adminId: retryReport.adminId
                },
            })));
            retryReport.total = activeTgIds.length;
            this.logger.log(`Queued ${activeTgIds.length} users for retry broadcast ${retryBroadcastId} (original broadcast: ${originalReport.startTime})`);
        }
        catch (error) {
            this.logger.error(`Failed during user queuing for retry broadcast ${retryBroadcastId}`, error);
            retryReport.status = 'failed';
            throw error;
        }
    }
};
exports.BroadcastService = BroadcastService;
BroadcastService.BUTTON_REGEX = /\[(\{.*?\}(?:\s*,\s*\{.*?\})*)\]\s*$/s;
exports.BroadcastService = BroadcastService = BroadcastService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, bull_1.InjectQueue)('broadcast')),
    __param(2, (0, common_1.Inject)((0, common_1.forwardRef)(() => telegram_bot_1.TelegramBot))),
    __metadata("design:paramtypes", [users_service_1.UsersService, Object, telegram_bot_1.TelegramBot])
], BroadcastService);
//# sourceMappingURL=broadcast.service.js.map