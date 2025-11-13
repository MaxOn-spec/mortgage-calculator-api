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
var TelegramBot_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TelegramBot = void 0;
const grammy_1 = require("grammy");
const bot_commands_1 = require("./bot.commands");
const common_1 = require("@nestjs/common");
const users_service_1 = require("../user/users.service");
const broadcast_handler_1 = require("./broadcast/broadcast.handler");
let TelegramBot = TelegramBot_1 = class TelegramBot {
    constructor(usersService, broadcastHandler) {
        this.usersService = usersService;
        this.broadcastHandler = broadcastHandler;
        this.logger = new common_1.Logger(TelegramBot_1.name);
        if (!process.env.TELEGRAM_BOT_TOKEN
            || !process.env.TELEGRAM_CHAT_ID
            || !process.env.TELEGRAM_ADMIN_IDS
            || !process.env.APP_URL) {
            throw new Error('Main telegram bot env is empty. Please set in ENV');
        }
        this.chatId = process.env.TELEGRAM_CHAT_ID;
        this.adminIds = (process.env.TELEGRAM_ADMIN_IDS || '').split(',').map(id => id.trim()).filter(Boolean);
        this.appUrl = process.env.APP_URL;
        this.bot = new grammy_1.Bot(process.env.TELEGRAM_BOT_TOKEN);
        this.initializeBot();
    }
    initializeBot() {
        this.userHandler();
        this.setupAdminHandlers();
        this.setupBroadcastHandlers();
        this.bot.start();
        this.bot.catch((err) => {
            const ctx = err.ctx;
            const error = err.error;
            if (error.error_code === 403 && error.description?.includes("bot was blocked")) {
                if (ctx?.from?.id) {
                    this.usersService.deactivateUser(ctx.from.id.toString());
                }
                this.logger.error(`User ${ctx?.from?.id} has blocked the bot.`);
            }
            else {
                this.logger.error(`An error occurred: ${err.stack}`);
            }
        });
    }
    userHandler() {
        this.bot.command(bot_commands_1.BOT_COMMANDS.START, async (context) => {
            await this.commandStart(context);
        });
    }
    setupAdminHandlers() {
        this.bot.command(bot_commands_1.BOT_COMMANDS.STATS, async (ctx) => {
            await this.commandStats(ctx);
        });
    }
    setupBroadcastHandlers() {
        this.bot.command(bot_commands_1.BOT_COMMANDS.BROADCAST, async (ctx) => {
            await this.broadcastHandler.handleBroadcast(ctx, 'all');
        });
        this.bot.on('message:text', async (ctx) => {
            if (ctx.message.text.startsWith('/broadcast_retry_')) {
                await this.broadcastHandler.handleBroadcastRetry(ctx);
            }
        });
    }
    async commandStart(context) {
        if (!context?.chatId) {
            return;
        }
        const invatedBy = this.extractRefCode(context.message?.text);
        const user = await this.getTgUser(context?.chatId, context, invatedBy);
        if (!user) {
            return;
        }
        if (!user.isActive) {
            await this.usersService.activateUser(user.tgId);
        }
        const message = `${user.firstName}, привет!`;
        const keyboard = new grammy_1.InlineKeyboard()
            .webApp('Открыть приложение', this.appUrl);
        await context.reply(message, { reply_markup: keyboard });
    }
    async commandStats(context) {
        if (!context?.from?.id) {
            return;
        }
        const userId = context.from.id.toString();
        if (!this.usersService.isAdmin(userId)) {
            await context.reply('У вас нет прав для выполнения этой команды.');
            return;
        }
        try {
            const stats = await this.usersService.getStats();
            const langCodeStatsText = Object.entries(stats.usersByLangCode)
                .map(([lang, count]) => `  - ${lang}: ${count}\n`)
                .join('\n');
            const message = `Статистика пользователей:`
                + `\nВсего пользователей: ${stats.totalUsers}`
                + `\n✅ Активных: ${stats.activeUsers}`
                + `\n❌ Неактивных: ${stats.inactiveUsers}`
                + `\nПо языкам:\n${langCodeStatsText || 'Нет данных'}`;
            await context.reply(message);
        }
        catch (error) {
            this.logger.error('Ошибка при получении статистики:', error);
            await context.reply('Произошла ошибка при получении статистики.');
        }
    }
    extractRefCode(message) {
        if (message && message.startsWith(`/${bot_commands_1.BOT_COMMANDS.START} `)) {
            return message.substring(7);
        }
        return '';
    }
    async getTgUser(chatId, context, invatedBy) {
        const user = context?.from;
        if (!user) {
            await this.bot.api.sendMessage(chatId, `Oops! You are hidden under masks of shadows. Please write from another account or device.`);
            await this.logger.error(`Error: Info about user (tgId: ${chatId}) is hidden.`);
            return null;
        }
        const dto = {
            tgId: user.id.toString(),
            username: user.username ?? null,
            firstName: user.first_name ?? null,
            lastName: user.last_name ?? null,
            langCode: user.language_code ?? null,
            invitedBy: invatedBy || null,
        };
        return await this.usersService.findOrCreate(dto);
    }
    getBotApi() {
        return this.bot.api;
    }
};
exports.TelegramBot = TelegramBot;
exports.TelegramBot = TelegramBot = TelegramBot_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        broadcast_handler_1.BroadcastHandler])
], TelegramBot);
//# sourceMappingURL=telegram.bot.js.map