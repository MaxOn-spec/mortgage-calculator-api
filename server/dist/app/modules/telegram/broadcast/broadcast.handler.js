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
var BroadcastHandler_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.BroadcastHandler = void 0;
const common_1 = require("@nestjs/common");
const users_service_1 = require("../../user/users.service");
const broadcast_service_1 = require("./broadcast.service");
const helper_1 = require("../../../classes/helper");
let BroadcastHandler = BroadcastHandler_1 = class BroadcastHandler {
    constructor(usersService, broadcastService) {
        this.usersService = usersService;
        this.broadcastService = broadcastService;
        this.logger = new common_1.Logger(BroadcastHandler_1.name);
    }
    async handleBroadcast(ctx, userType) {
        if (!ctx.chat?.id || !ctx.from?.id)
            return;
        if (!this.usersService.isAdmin(ctx.from.id.toString())) {
            await ctx.reply('У вас нет прав администратора.');
            return;
        }
        if (!ctx.message?.reply_to_message) {
            await ctx.reply('Пожалуйста, используйте эту команду в ответ на сообщение, которое хотите разослать.');
            return;
        }
        await ctx.reply('🚀 Рассылка запущена. Я сообщу о прогрессе.');
        try {
            const broadcastId = `${helper_1.Helper.getClearDateNow()}-${helper_1.Helper.getRandomString(6)}`;
            const adminId = ctx.from.id;
            const report = await this.broadcastService.start(ctx.message.reply_to_message, broadcastId, adminId, userType);
            if (report.total > 0) {
                await ctx.reply(`✅ Рассылка поставлена в очередь для ${report.total} пользователей.`);
            }
        }
        catch (error) {
            await ctx.reply(`⚠️ Ошибка запуска рассылки: ${error.message}`);
            this.logger.error('Broadcast failed to start:', error);
        }
    }
    async handleBroadcastRetry(ctx) {
        if (!ctx.chat?.id || !ctx.from?.id)
            return;
        if (!this.usersService.isAdmin(ctx.from.id.toString())) {
            await ctx.reply('У вас нет прав администратора.');
            return;
        }
        const messageText = ctx.message?.text;
        if (!messageText)
            return;
        const match = messageText.match(/^\/broadcast_retry_(.+)$/);
        if (!match) {
            await ctx.reply('❌ Неверный формат команды. Используйте: /broadcast_retry_BROADCAST_ID\n\nПример: /broadcast_retry_2025-07-01 17:57:24-nn5ktn');
            return;
        }
        const broadcastId = match[1];
        await ctx.reply('🔄 Запускаю повторную рассылку для пользователей с ошибками...');
        try {
            const adminId = ctx.from.id;
            const report = await this.broadcastService.startRetryBroadcast(broadcastId, adminId);
            if (report.total > 0) {
                await ctx.reply(`✅ Повторная рассылка запущена для ${report.total} пользователей с ошибками из рассылки ${broadcastId}.`);
            }
            else {
                await ctx.reply(`ℹ️ Нет активных пользователей для повторной рассылки из ${broadcastId}.`);
            }
        }
        catch (error) {
            await ctx.reply(`⚠️ Ошибка запуска повторной рассылки: ${error.message}`);
            this.logger.error('Retry broadcast failed to start:', error);
        }
    }
};
exports.BroadcastHandler = BroadcastHandler;
exports.BroadcastHandler = BroadcastHandler = BroadcastHandler_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        broadcast_service_1.BroadcastService])
], BroadcastHandler);
//# sourceMappingURL=broadcast.handler.js.map