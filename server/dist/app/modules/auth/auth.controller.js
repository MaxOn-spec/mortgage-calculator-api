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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const auth_service_1 = require("./auth.service");
const create_token_dto_1 = require("./dto/create-token.dto");
const refresh_token_dto_1 = require("./dto/refresh-token.dto");
const admin_login_dto_1 = require("./dto/admin-login.dto");
const jwt_auth_decorator_1 = require("../../decorators/jwt-auth.decorator");
let AuthController = class AuthController {
    constructor(authService) {
        this.authService = authService;
    }
    setAdminCookies(res, tokenResponse) {
        res.cookie('admin_access_token', tokenResponse.accessToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'strict',
            maxAge: 2 * 60 * 60 * 1000,
            path: '/'
        });
        res.cookie('admin_refresh_token', tokenResponse.refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'strict',
            maxAge: 30 * 24 * 60 * 60 * 1000,
            path: '/api/auth/admin'
        });
    }
    clearAdminCookies(res) {
        res.clearCookie('admin_access_token', { path: '/' });
        res.clearCookie('admin_refresh_token', { path: '/api/auth/admin' });
    }
    async createToken(createTokenDto, req) {
        return this.authService.createToken(createTokenDto, req);
    }
    async refreshToken(refreshTokenDto, req) {
        return this.authService.refreshToken(refreshTokenDto, req);
    }
    async logout(req) {
        await this.authService.removeAllUserTokens(req.user.tgId);
    }
    async adminLogin(adminLoginDto, req, res) {
        const tokenResponse = await this.authService.adminLogin(adminLoginDto, req);
        this.setAdminCookies(res, tokenResponse);
        return {
            accountId: tokenResponse.accountId,
            login: tokenResponse.login,
            message: 'Успешная авторизация'
        };
    }
    async adminRefreshToken(req, res) {
        const refreshToken = req.cookies?.admin_refresh_token;
        if (!refreshToken) {
            throw new Error('Refresh token не найден в cookies');
        }
        const tokenResponse = await this.authService.adminRefreshToken({ refreshToken }, req);
        this.setAdminCookies(res, tokenResponse);
        return {
            accountId: tokenResponse.accountId,
            login: tokenResponse.login,
            message: 'Токены обновлены'
        };
    }
    async adminLogout(res) {
        this.clearAdminCookies(res);
        return { message: 'Успешный выход' };
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, common_1.Post)('token/create'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_token_dto_1.CreateTokenDto, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "createToken", null);
__decorate([
    (0, common_1.Post)('token/refresh'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [refresh_token_dto_1.RefreshTokenDto, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "refreshToken", null);
__decorate([
    (0, common_1.Delete)('logout'),
    (0, jwt_auth_decorator_1.JwtAuth)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "logout", null);
__decorate([
    (0, common_1.Post)('admin/login'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [admin_login_dto_1.AdminLoginDto, Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "adminLogin", null);
__decorate([
    (0, common_1.Post)('admin/refresh'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "adminRefreshToken", null);
__decorate([
    (0, common_1.Post)('admin/logout'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "adminLogout", null);
exports.AuthController = AuthController = __decorate([
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [auth_service_1.AuthService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map