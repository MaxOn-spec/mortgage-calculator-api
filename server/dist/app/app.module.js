"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const bull_1 = require("@nestjs/bull");
const logger_1 = require("./classes/logger");
const users_module_1 = require("./modules/user/users.module");
const telegram_bots_module_1 = require("./modules/telegram/telegram.bots.module");
const schedule_1 = require("@nestjs/schedule");
const auth_module_1 = require("./modules/auth/auth.module");
const account_module_1 = require("./modules/account/account.module");
const account_token_module_1 = require("./modules/account-token/account-token.module");
const refresh_token_module_1 = require("./modules/refresh-token/refresh-token.module");
const database_module_1 = require("../database/database.module");
const mortgage_module_1 = require("./modules/mortgage/mortgage.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                envFilePath: '.env',
                isGlobal: true
            }),
            database_module_1.DatabaseModule,
            bull_1.BullModule.forRootAsync({
                useFactory: () => ({
                    redis: {
                        host: 'localhost',
                        port: 6379,
                    },
                }),
            }),
            schedule_1.ScheduleModule.forRoot(),
            telegram_bots_module_1.TelegramBotModule,
            account_module_1.AccountModule,
            account_token_module_1.AccountTokenModule,
            refresh_token_module_1.RefreshTokenModule,
            auth_module_1.AuthModule,
            users_module_1.UsersModule,
            mortgage_module_1.MortgageModule,
        ],
        controllers: [],
        providers: [
            logger_1.Logger,
        ]
    })
], AppModule);
//# sourceMappingURL=app.module.js.map