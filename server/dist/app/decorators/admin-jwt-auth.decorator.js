"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminJwtAuth = AdminJwtAuth;
const common_1 = require("@nestjs/common");
const admin_jwt_auth_guard_1 = require("../guards/admin-jwt-auth.guard");
function AdminJwtAuth() {
    return (0, common_1.applyDecorators)((0, common_1.UseGuards)(admin_jwt_auth_guard_1.AdminJwtAuthGuard));
}
//# sourceMappingURL=admin-jwt-auth.decorator.js.map