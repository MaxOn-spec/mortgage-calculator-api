"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var BroadcastProcessor_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.BroadcastProcessor = void 0;
const bull_1 = require("@nestjs/bull");
const common_1 = require("@nestjs/common");
const telegram_bot_1 = require("../telegram.bot");
const broadcast_config_1 = require("./broadcast.config");
const users_service_1 = require("../../../modules/user/users.service");
const broadcast_service_1 = require("./broadcast.service");
let BroadcastProcessor = BroadcastProcessor_1 = class BroadcastProcessor {
    constructor(telegramBot, usersService, broadcastService) {
        this.telegramBot = telegramBot;
        this.usersService = usersService;
        this.broadcastService = broadcastService;
        this.logger = new common_1.Logger(BroadcastProcessor_1.name);
    }
    async handle(job) {
        const { tgId, payload, parsedMessage, broadcastId, retryCount = 0 } = job.data;
        this.logger.debug(`Processing job for user ${tgId}, broadcastId: ${broadcastId}, retryCount: ${retryCount}`);
        try {
            if (parsedMessage && parsedMessage.buttons.length > 0) {
                await this.sendMessageWithButtons(tgId, payload, parsedMessage);
            }
            else {
                await this.forwardMessage(tgId, payload);
            }
            this.logger.debug(`Successfully sent message to user ${tgId}, broadcastId: ${broadcastId}, retryCount: ${retryCount}`);
            return 'sent';
        }
        catch (error) {
            if (error.error_code === 403 || (error.error_code === 400 && error.description?.includes("chat not found"))) {
                await this.usersService.deactivateUser(tgId);
                const reason = error.error_code === 403 ? "blocked the bot" : "chat not found";
                this.logger.warn(`User ${tgId} ${reason}, deactivated. BroadcastId: ${broadcastId}, retryCount: ${retryCount}`);
                return 'blocked';
            }
            if (error.error_code === 429 && error.parameters?.retry_after) {
                const retryAfter = error.parameters.retry_after;
                const maxRetries = broadcast_config_1.BROADCAST_CONFIG.MAX_RETRY_ATTEMPTS;
                if (retryCount < maxRetries) {
                    const delayMs = (retryAfter + broadcast_config_1.BROADCAST_CONFIG.RETRY_BUFFER_SECONDS) * 1000;
                    this.logger.warn(`Rate limit hit for user ${tgId}, scheduling retry ${retryCount + 1}/${maxRetries} after ${retryAfter + broadcast_config_1.BROADCAST_CONFIG.RETRY_BUFFER_SECONDS}s. BroadcastId: ${broadcastId}`);
                    await this.broadcastService.scheduleRetry({
                        ...job.data,
                        retryCount: retryCount + 1
                    }, delayMs);
                    this.logger.debug(`Retry scheduled for user ${tgId}, broadcastId: ${broadcastId}, newRetryCount: ${retryCount + 1}`);
                    return 'retry_scheduled';
                }
                else {
                    this.logger.error(`Max retry attempts reached for user ${tgId}, giving up. BroadcastId: ${broadcastId}`);
                    throw new Error(`Max retry attempts (${maxRetries}) reached for RETRY_AFTER`);
                }
            }
            this.logger.error(`Failed to send message to ${tgId} (broadcastId: ${broadcastId}, retryCount: ${retryCount}):`, error);
            throw error;
        }
    }
    async sendMessageWithButtons(tgId, message, parsedMessage) {
        const botApi = this.telegramBot.getBotApi();
        const chatId = parseInt(tgId);
        const inlineKeyboard = this.createInlineKeyboard(parsedMessage.buttons);
        if (message.photo && message.photo.length > 0) {
            const photo = message.photo[message.photo.length - 1];
            await botApi.sendPhoto(chatId, photo.file_id, {
                caption: parsedMessage.cleanMessage || undefined,
                caption_entities: parsedMessage.captionEntities,
                reply_markup: { inline_keyboard: inlineKeyboard }
            });
        }
        else if (message.video) {
            await botApi.sendVideo(chatId, message.video.file_id, {
                caption: parsedMessage.cleanMessage || undefined,
                caption_entities: parsedMessage.captionEntities,
                reply_markup: { inline_keyboard: inlineKeyboard }
            });
        }
        else if (message.document) {
            await botApi.sendDocument(chatId, message.document.file_id, {
                caption: parsedMessage.cleanMessage || undefined,
                caption_entities: parsedMessage.captionEntities,
                reply_markup: { inline_keyboard: inlineKeyboard }
            });
        }
        else {
            await botApi.sendMessage(chatId, parsedMessage.cleanMessage, {
                entities: parsedMessage.entities,
                reply_markup: { inline_keyboard: inlineKeyboard }
            });
        }
    }
    createInlineKeyboard(buttons) {
        return buttons.map(button => [
            {
                text: button.button,
                url: button.link
            }
        ]);
    }
    async forwardMessage(tgId, message) {
        const botApi = this.telegramBot.getBotApi();
        const chatId = parseInt(tgId);
        await botApi.copyMessage(chatId, message.chat.id, message.message_id);
    }
};
exports.BroadcastProcessor = BroadcastProcessor;
__decorate([
    (0, bull_1.Process)({ name: 'send', concurrency: broadcast_config_1.BROADCAST_CONFIG.CONCURRENCY }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], BroadcastProcessor.prototype, "handle", null);
exports.BroadcastProcessor = BroadcastProcessor = BroadcastProcessor_1 = __decorate([
    (0, bull_1.Processor)('broadcast'),
    __param(2, (0, common_1.Inject)((0, common_1.forwardRef)(() => broadcast_service_1.BroadcastService))),
    __metadata("design:paramtypes", [telegram_bot_1.TelegramBot,
        users_service_1.UsersService,
        broadcast_service_1.BroadcastService])
], BroadcastProcessor);
//# sourceMappingURL=broadcast.processor.js.map