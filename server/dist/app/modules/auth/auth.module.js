"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthModule = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
const passport_1 = require("@nestjs/passport");
const auth_service_1 = require("./auth.service");
const auth_controller_1 = require("./auth.controller");
const admin_jwt_service_1 = require("./services/admin-jwt.service");
const users_module_1 = require("../user/users.module");
const account_module_1 = require("../account/account.module");
const account_token_module_1 = require("../account-token/account-token.module");
const refresh_token_module_1 = require("../refresh-token/refresh-token.module");
const jwt_strategy_1 = require("./strategies/jwt.strategy");
const admin_jwt_strategy_1 = require("./strategies/admin-jwt.strategy");
const cache_manager_1 = require("@nestjs/cache-manager");
let AuthModule = class AuthModule {
};
exports.AuthModule = AuthModule;
exports.AuthModule = AuthModule = __decorate([
    (0, common_1.Module)({
        imports: [
            users_module_1.UsersModule,
            account_module_1.AccountModule,
            account_token_module_1.AccountTokenModule,
            refresh_token_module_1.RefreshTokenModule,
            passport_1.PassportModule,
            cache_manager_1.CacheModule.register({
                ttl: 15 * 60 * 1000,
                max: 1000,
            }),
            jwt_1.JwtModule.registerAsync({
                imports: [config_1.ConfigModule],
                inject: [config_1.ConfigService],
                useFactory: (configService) => ({
                    secret: configService.get('USER_JWT_SECRET'),
                    signOptions: { expiresIn: '15m' },
                }),
            }),
        ],
        controllers: [auth_controller_1.AuthController],
        providers: [auth_service_1.AuthService, admin_jwt_service_1.AdminJwtService, jwt_strategy_1.JwtStrategy, admin_jwt_strategy_1.AdminJwtStrategy],
        exports: [auth_service_1.AuthService, admin_jwt_service_1.AdminJwtService, jwt_1.JwtModule],
    })
], AuthModule);
//# sourceMappingURL=auth.module.js.map