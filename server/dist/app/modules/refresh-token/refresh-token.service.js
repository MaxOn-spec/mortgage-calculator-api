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
exports.RefreshTokenService = void 0;
const common_1 = require("@nestjs/common");
const drizzle_orm_1 = require("drizzle-orm");
const refresh_tokens_1 = require("./schemas/refresh-tokens");
const users_1 = require("../user/schemas/users");
let RefreshTokenService = class RefreshTokenService {
    constructor(db) {
        this.db = db;
    }
    async create(dto) {
        const tokenData = {
            ...dto,
            id: crypto.randomUUID(),
        };
        await this.db.insert(refresh_tokens_1.refreshTokens).values(tokenData);
        const [token] = await this.db.select().from(refresh_tokens_1.refreshTokens)
            .where((0, drizzle_orm_1.eq)(refresh_tokens_1.refreshTokens.token, dto.token));
        return token;
    }
    async findByToken(token) {
        const [result] = await this.db
            .select()
            .from(refresh_tokens_1.refreshTokens)
            .innerJoin(users_1.users, (0, drizzle_orm_1.eq)(refresh_tokens_1.refreshTokens.userId, users_1.users.tgId))
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(refresh_tokens_1.refreshTokens.token, token), (0, drizzle_orm_1.gt)(refresh_tokens_1.refreshTokens.expiresAt, new Date())));
        return result ? result.RefreshTokens : null;
    }
    async removeByUserId(userId) {
        await this.db.delete(refresh_tokens_1.refreshTokens)
            .where((0, drizzle_orm_1.eq)(refresh_tokens_1.refreshTokens.userId, userId)).execute();
    }
    async removeByToken(token) {
        await this.db.delete(refresh_tokens_1.refreshTokens)
            .where((0, drizzle_orm_1.eq)(refresh_tokens_1.refreshTokens.token, token));
    }
    async removeExpired() {
        await this.db.delete(refresh_tokens_1.refreshTokens)
            .where((0, drizzle_orm_1.lt)(refresh_tokens_1.refreshTokens.expiresAt, new Date()));
    }
};
exports.RefreshTokenService = RefreshTokenService;
exports.RefreshTokenService = RefreshTokenService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)('DATABASE')),
    __metadata("design:paramtypes", [Object])
], RefreshTokenService);
//# sourceMappingURL=refresh-token.service.js.map