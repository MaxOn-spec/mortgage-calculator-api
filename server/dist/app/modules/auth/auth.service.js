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
var AuthService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const admin_jwt_service_1 = require("./services/admin-jwt.service");
const users_service_1 = require("../user/users.service");
const crypto = __importStar(require("crypto"));
const account_service_1 = require("../account/account.service");
const account_token_service_1 = require("../account-token/account-token.service");
const refresh_token_service_1 = require("../refresh-token/refresh-token.service");
let AuthService = AuthService_1 = class AuthService {
    constructor(db, usersService, jwtService, adminJwtService, accountService, accountTokenService, refreshTokenService) {
        this.db = db;
        this.usersService = usersService;
        this.jwtService = jwtService;
        this.adminJwtService = adminJwtService;
        this.accountService = accountService;
        this.accountTokenService = accountTokenService;
        this.refreshTokenService = refreshTokenService;
        this.logger = new common_1.Logger(AuthService_1.name);
        this.refreshTokenExpiresIn = 30 * 24 * 60 * 60 * 1000;
        if (!process.env.TELEGRAM_BOT_TOKEN) {
            throw new Error('Auth service env is empty. Please set in ENV');
        }
        this.botToken = process.env.TELEGRAM_BOT_TOKEN;
    }
    validateTelegramInitData(initDataRaw) {
        try {
            const initData = new URLSearchParams(initDataRaw);
            const dataCheckString = Object.entries(Object.fromEntries(initData.entries()))
                .filter(([key]) => key !== 'hash')
                .sort(([a], [b]) => a.localeCompare(b))
                .map(([key, value]) => `${key}=${value}`)
                .join('\n');
            const secretKey = crypto.createHmac('sha256', 'WebAppData').update(this.botToken).digest();
            const hash = crypto.createHmac('sha256', secretKey).update(dataCheckString).digest('hex');
            return hash === initData.get('hash');
        }
        catch (error) {
            this.logger.error(`Error validating Telegram init data: ${error.message}`);
            return false;
        }
    }
    extractUserIdFromInitData(initDataRaw) {
        try {
            const initData = new URLSearchParams(initDataRaw);
            const user = JSON.parse(initData.get('user') || '{}');
            return user?.id?.toString() || null;
        }
        catch (error) {
            this.logger.error(`Error extracting user ID from init data: ${error.message}`);
            return null;
        }
    }
    async createToken(dto, req) {
        if (!this.validateTelegramInitData(dto.initDataRaw)) {
            throw new common_1.UnauthorizedException('Невалидные данные инициализации Telegram');
        }
        const tgId = this.extractUserIdFromInitData(dto.initDataRaw);
        if (!tgId) {
            throw new common_1.UnauthorizedException('Не удалось получить идентификатор пользователя');
        }
        let user;
        try {
            const initData = new URLSearchParams(dto.initDataRaw);
            const userData = JSON.parse(initData.get('user') || '{}');
            user = await this.usersService.findOrCreate({
                tgId,
                username: userData.username || null,
                firstName: userData.first_name || null,
                lastName: userData.last_name || null,
                langCode: userData.language_code || null,
                invitedBy: null,
            });
            if (!user.isActive) {
                await this.usersService.activateUser(tgId);
            }
        }
        catch (error) {
            this.logger.error(`Error creating/finding user: ${error.stack}`);
            throw new common_1.UnauthorizedException('Ошибка при создании/поиске пользователя');
        }
        return this.generateTokens(user, dto.ip, req?.headers['user-agent']);
    }
    async refreshToken(dto, req) {
        const refreshTokenRecord = await this.refreshTokenService.findByToken(dto.refreshToken);
        if (!refreshTokenRecord) {
            throw new common_1.UnauthorizedException('Невалидный или истекший refresh token');
        }
        const user = await this.usersService.findByTgId(refreshTokenRecord.userId);
        if (!user) {
            await this.refreshTokenService.removeByToken(dto.refreshToken);
            throw new common_1.UnauthorizedException('Пользователь не найден');
        }
        if (!user.isActive) {
            await this.usersService.activateUser(user.tgId);
        }
        await this.refreshTokenService.removeByToken(dto.refreshToken);
        return this.generateTokens(user, req?.ip, req?.headers['user-agent']);
    }
    async removeAllUserTokens(userId) {
        await this.refreshTokenService.removeByUserId(userId);
        this.logger.log(`Удалено refresh токенов для пользователя ${userId}`);
    }
    async generateTokens(user, ip, userAgent) {
        const payload = { sub: user.tgId, username: user.username || user.tgId };
        const accessToken = this.jwtService.sign(payload);
        const refreshToken = crypto.randomBytes(40).toString('hex');
        const expiresAt = new Date(Date.now() + this.refreshTokenExpiresIn);
        await this.refreshTokenService.create({
            userId: user.tgId,
            token: refreshToken,
            expiresAt,
            ip,
            userAgent
        });
        return { accessToken, refreshToken };
    }
    async validateJwtPayload(payload) {
        return this.usersService.findByTgId(payload.sub);
    }
    async adminLogin(dto, req) {
        const account = await this.accountService.validateAccount(dto.login, dto.password);
        return this.generateAdminTokens(account, dto.ip, req?.headers['user-agent']);
    }
    async adminRefreshToken(dto, req) {
        const tokenRecord = await this.accountTokenService.findByToken(dto.refreshToken);
        if (!tokenRecord) {
            throw new common_1.UnauthorizedException('Невалидный или истекший refresh token');
        }
        const account = await this.accountService.findById(tokenRecord.accountId);
        if (!account) {
            await this.accountTokenService.removeByToken(dto.refreshToken);
            throw new common_1.UnauthorizedException('Аккаунт не найден');
        }
        await this.accountTokenService.removeByToken(dto.refreshToken);
        return this.generateAdminTokens(account, req?.ip, req?.headers['user-agent']);
    }
    async generateAdminTokens(account, ip, userAgent) {
        const payload = {
            sub: account.id,
            login: account.login,
            type: 'admin'
        };
        const accessToken = this.adminJwtService.sign(payload);
        const refreshToken = crypto.randomBytes(40).toString('hex');
        const expiresAt = new Date(Date.now() + this.refreshTokenExpiresIn);
        await this.accountTokenService.removeByAccountId(account.id);
        await this.accountTokenService.create({
            accountId: account.id,
            token: refreshToken,
            expiresAt,
            ip,
            userAgent
        });
        return {
            accessToken,
            refreshToken,
            accountId: account.id,
            login: account.login
        };
    }
    async validateAdminJwtPayload(payload) {
        if (payload.type !== 'admin') {
            return null;
        }
        const account = await this.accountService.findById(payload.sub);
        return account;
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = AuthService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)('DATABASE')),
    __metadata("design:paramtypes", [Object, users_service_1.UsersService,
        jwt_1.JwtService,
        admin_jwt_service_1.AdminJwtService,
        account_service_1.AccountService,
        account_token_service_1.AccountTokenService,
        refresh_token_service_1.RefreshTokenService])
], AuthService);
//# sourceMappingURL=auth.service.js.map