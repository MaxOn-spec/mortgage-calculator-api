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
exports.AccountController = void 0;
const common_1 = require("@nestjs/common");
const account_service_1 = require("./account.service");
const create_account_dto_1 = require("./dto/create-account.dto");
const update_account_dto_1 = require("./dto/update-account.dto");
const admin_jwt_auth_decorator_1 = require("../../decorators/admin-jwt-auth.decorator");
let AccountController = class AccountController {
    constructor(accountService) {
        this.accountService = accountService;
    }
    async findAll(page = 1, limit = 10, search) {
        const accounts = await this.accountService.findAllPaginated(Number(page), Number(limit), search);
        return accounts;
    }
    async findOne(id) {
        const account = await this.accountService.findById(id);
        if (!account) {
            throw new Error('Аккаунт не найден');
        }
        return account;
    }
    async create(createAccountDto) {
        return this.accountService.create(createAccountDto);
    }
    async update(id, updateAccountDto) {
        await this.accountService.update(id, updateAccountDto);
        const updatedAccount = await this.accountService.findById(id);
        if (!updatedAccount) {
            throw new Error('Аккаунт не найден после обновления');
        }
        return updatedAccount;
    }
    async remove(id) {
        await this.accountService.remove(id);
    }
    async checkLogin(body) {
        const account = await this.accountService.findByLogin(body.login);
        return { exists: !!account };
    }
};
exports.AccountController = AccountController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __param(2, (0, common_1.Query)('search')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, String]),
    __metadata("design:returntype", Promise)
], AccountController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AccountController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_account_dto_1.CreateAccountDto]),
    __metadata("design:returntype", Promise)
], AccountController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_account_dto_1.UpdateAccountDto]),
    __metadata("design:returntype", Promise)
], AccountController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AccountController.prototype, "remove", null);
__decorate([
    (0, common_1.Post)('check-login'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AccountController.prototype, "checkLogin", null);
exports.AccountController = AccountController = __decorate([
    (0, common_1.Controller)('accounts'),
    (0, admin_jwt_auth_decorator_1.AdminJwtAuth)(),
    __metadata("design:paramtypes", [account_service_1.AccountService])
], AccountController);
//# sourceMappingURL=account.controller.js.map