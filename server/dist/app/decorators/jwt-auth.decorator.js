"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JwtAuth = JwtAuth;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../guards/jwt-auth.guard");
function JwtAuth() {
    return (0, common_1.applyDecorators)((0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard));
}
//# sourceMappingURL=jwt-auth.decorator.js.map