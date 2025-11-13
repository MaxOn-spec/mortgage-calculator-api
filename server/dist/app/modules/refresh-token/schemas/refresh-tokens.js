"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.refreshTokens = void 0;
const mysql_core_1 = require("drizzle-orm/mysql-core");
exports.refreshTokens = (0, mysql_core_1.mysqlTable)('RefreshTokens', {
    id: (0, mysql_core_1.char)('id', { length: 36 }).primaryKey(),
    token: (0, mysql_core_1.text)('token').notNull(),
    userId: (0, mysql_core_1.varchar)('userId', { length: 255 }).notNull(),
    expiresAt: (0, mysql_core_1.timestamp)('expiresAt').notNull(),
    ip: (0, mysql_core_1.varchar)('ip', { length: 255 }),
    userAgent: (0, mysql_core_1.varchar)('userAgent', { length: 255 }),
    createdAt: (0, mysql_core_1.timestamp)('createdAt').defaultNow().notNull(),
    updatedAt: (0, mysql_core_1.timestamp)('updatedAt').defaultNow().onUpdateNow().notNull(),
});
//# sourceMappingURL=refresh-tokens.js.map