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
exports.AccountTokenService = void 0;
const common_1 = require("@nestjs/common");
const drizzle_orm_1 = require("drizzle-orm");
const account_tokens_1 = require("./schemas/account-tokens");
const accounts_1 = require("../account/schemas/accounts");
let AccountTokenService = class AccountTokenService {
    constructor(db) {
        this.db = db;
    }
    async create(dto) {
        const tokenData = {
            ...dto,
            id: crypto.randomUUID(),
        };
        await this.db.insert(account_tokens_1.accountTokens).values(tokenData);
        const [token] = await this.db.select().from(account_tokens_1.accountTokens).where((0, drizzle_orm_1.eq)(account_tokens_1.accountTokens.token, dto.token));
        return token;
    }
    async findByToken(token) {
        const [result] = await this.db
            .select()
            .from(account_tokens_1.accountTokens)
            .innerJoin(accounts_1.accounts, (0, drizzle_orm_1.eq)(account_tokens_1.accountTokens.accountId, accounts_1.accounts.id))
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(account_tokens_1.accountTokens.token, token), (0, drizzle_orm_1.gt)(account_tokens_1.accountTokens.expiresAt, new Date())));
        return result ? result.AccountTokens : null;
    }
    async removeByAccountId(accountId) {
        await this.db.delete(account_tokens_1.accountTokens).where((0, drizzle_orm_1.eq)(account_tokens_1.accountTokens.accountId, accountId));
    }
    async removeByToken(token) {
        await this.db.delete(account_tokens_1.accountTokens).where((0, drizzle_orm_1.eq)(account_tokens_1.accountTokens.token, token));
    }
};
exports.AccountTokenService = AccountTokenService;
exports.AccountTokenService = AccountTokenService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)('DATABASE')),
    __metadata("design:paramtypes", [Object])
], AccountTokenService);
//# sourceMappingURL=account-token.service.js.map