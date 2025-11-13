"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TelegramBotModule = void 0;
const common_1 = require("@nestjs/common");
const bull_1 = require("@nestjs/bull");
const telegram_bot_1 = require("./telegram.bot");
const telegram_controller_1 = require("./telegram.controller");
const users_module_1 = require("../../modules/user/users.module");
const broadcast_service_1 = require("./broadcast/broadcast.service");
const broadcast_processor_1 = require("./broadcast/broadcast.processor");
const broadcast_config_1 = require("./broadcast/broadcast.config");
const broadcast_handler_1 = require("./broadcast/broadcast.handler");
let TelegramBotModule = class TelegramBotModule {
};
exports.TelegramBotModule = TelegramBotModule;
exports.TelegramBotModule = TelegramBotModule = __decorate([
    (0, common_1.Module)({
        imports: [
            users_module_1.UsersModule,
            bull_1.BullModule.registerQueue({
                name: 'broadcast',
                defaultJobOptions: {
                    removeOnComplete: broadcast_config_1.BROADCAST_CONFIG.REMOVE_ON_COMPLETE,
                    removeOnFail: broadcast_config_1.BROADCAST_CONFIG.REMOVE_ON_FAIL,
                    attempts: broadcast_config_1.BROADCAST_CONFIG.MAX_ATTEMPTS,
                    backoff: {
                        type: 'exponential',
                        delay: broadcast_config_1.BROADCAST_CONFIG.BACKOFF_DELAY,
                    },
                },
                settings: {
                    stalledInterval: broadcast_config_1.BROADCAST_CONFIG.STALLED_INTERVAL,
                    maxStalledCount: broadcast_config_1.BROADCAST_CONFIG.MAX_STALLED_COUNT,
                },
            }),
        ],
        controllers: [telegram_controller_1.TelegramController],
        providers: [
            telegram_bot_1.TelegramBot,
            broadcast_handler_1.BroadcastHandler,
            broadcast_service_1.BroadcastService,
            broadcast_processor_1.BroadcastProcessor,
        ],
        exports: [telegram_bot_1.TelegramBot]
    })
], TelegramBotModule);
//# sourceMappingURL=telegram.bots.module.js.map