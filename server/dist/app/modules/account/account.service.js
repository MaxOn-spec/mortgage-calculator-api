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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountService = void 0;
const common_1 = require("@nestjs/common");
const drizzle_orm_1 = require("drizzle-orm");
const accounts_1 = require("./schemas/accounts");
const account_tokens_1 = require("../account-token/schemas/account-tokens");
const constants_1 = require("../../../database/constants");
const utils_1 = require("../../../database/utils");
const bcrypt = __importStar(require("bcrypt"));
let AccountService = class AccountService {
    constructor(db) {
        this.db = db;
    }
    async create(dto) {
        const existingAccount = await this.findByLogin(dto.login);
        if (existingAccount) {
            throw new common_1.ConflictException('Аккаунт с таким логином уже существует');
        }
        const hashedPassword = await bcrypt.hash(dto.password, constants_1.DATABASE_CONSTANTS.PASSWORD_SALT_ROUNDS);
        const accountData = {
            ...dto,
            id: crypto.randomUUID(),
            password: hashedPassword,
        };
        await this.db.insert(accounts_1.accounts).values(accountData);
        const [account] = await this.db.select().from(accounts_1.accounts).where((0, drizzle_orm_1.eq)(accounts_1.accounts.login, dto.login));
        return account;
    }
    async update(id, dto) {
        if (dto.login) {
            const existingAccount = await this.findByLogin(dto.login);
            if (existingAccount && existingAccount.id !== id) {
                throw new common_1.ConflictException('Аккаунт с таким логином уже существует');
            }
        }
        const updateData = { ...dto };
        if (dto.password) {
            updateData.password = await bcrypt.hash(dto.password, constants_1.DATABASE_CONSTANTS.PASSWORD_SALT_ROUNDS);
        }
        await this.db.update(accounts_1.accounts)
            .set(updateData)
            .where((0, drizzle_orm_1.eq)(accounts_1.accounts.id, id));
        return 1;
    }
    async findAll() {
        const accountsList = await this.db.select().from(accounts_1.accounts);
        return accountsList;
    }
    async findById(id) {
        const [account] = await this.db.select().from(accounts_1.accounts).where((0, drizzle_orm_1.eq)(accounts_1.accounts.id, id));
        return account || null;
    }
    async findByLogin(login) {
        const [account] = await this.db.select().from(accounts_1.accounts).where((0, drizzle_orm_1.eq)(accounts_1.accounts.login, login));
        return account || null;
    }
    async validateAccount(login, password) {
        const account = await this.findByLogin(login);
        if (!account) {
            throw new common_1.UnauthorizedException('Неверный логин или пароль');
        }
        const isPasswordValid = await bcrypt.compare(password, account.password);
        if (!isPasswordValid) {
            throw new common_1.UnauthorizedException('Неверный логин или пароль');
        }
        return account;
    }
    async findAllPaginated(page = constants_1.PAGINATION_CONSTANTS.DEFAULT_PAGE, limit = constants_1.PAGINATION_CONSTANTS.DEFAULT_LIMIT, search) {
        const { page: validPage, limit: validLimit } = utils_1.DatabaseUtils.validatePaginationParams(page, limit);
        const offset = utils_1.DatabaseUtils.calculateOffset(validPage, validLimit);
        const sanitizedSearch = utils_1.DatabaseUtils.sanitizeSearchTerm(search);
        const searchCondition = sanitizedSearch ? (0, drizzle_orm_1.like)(accounts_1.accounts.login, `%${sanitizedSearch}%`) : undefined;
        const [totalResult] = await this.db
            .select({ count: (0, drizzle_orm_1.sql) `count(*)` })
            .from(accounts_1.accounts)
            .where(searchCondition || undefined);
        const accountsList = await this.db
            .select()
            .from(accounts_1.accounts)
            .where(searchCondition || undefined)
            .limit(validLimit)
            .offset(offset)
            .orderBy((0, drizzle_orm_1.desc)(accounts_1.accounts.createdAt));
        const accountsWithoutPasswords = accountsList.map(({ password, ...account }) => account);
        return {
            accounts: accountsWithoutPasswords,
            total: totalResult.count
        };
    }
    async remove(id) {
        if (!utils_1.DatabaseUtils.validateId(id)) {
            throw new Error('Некорректный ID аккаунта');
        }
        const account = await this.findById(id);
        if (!account) {
            throw new Error('Аккаунт не найден');
        }
        await this.db.delete(account_tokens_1.accountTokens).where((0, drizzle_orm_1.eq)(account_tokens_1.accountTokens.accountId, id));
        await this.db.delete(accounts_1.accounts).where((0, drizzle_orm_1.eq)(accounts_1.accounts.id, id));
    }
};
exports.AccountService = AccountService;
exports.AccountService = AccountService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)('DATABASE')),
    __metadata("design:paramtypes", [Object])
], AccountService);
//# sourceMappingURL=account.service.js.map