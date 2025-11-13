"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var AdminJwtAuthGuard_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminJwtAuthGuard = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const common_2 = require("@nestjs/common");
let AdminJwtAuthGuard = AdminJwtAuthGuard_1 = class AdminJwtAuthGuard extends (0, passport_1.AuthGuard)('admin-jwt') {
    constructor() {
        super(...arguments);
        this.logger = new common_2.Logger(AdminJwtAuthGuard_1.name);
    }
    canActivate(context) {
        return super.canActivate(context);
    }
    handleRequest(err, user, info) {
        if (err || !user) {
            throw err || new common_1.UnauthorizedException('Необходима авторизация администратора');
        }
        return user;
    }
};
exports.AdminJwtAuthGuard = AdminJwtAuthGuard;
exports.AdminJwtAuthGuard = AdminJwtAuthGuard = AdminJwtAuthGuard_1 = __decorate([
    (0, common_1.Injectable)()
], AdminJwtAuthGuard);
//# sourceMappingURL=admin-jwt-auth.guard.js.map