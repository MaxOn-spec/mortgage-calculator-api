"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.accountTokens = void 0;
const mysql_core_1 = require("drizzle-orm/mysql-core");
exports.accountTokens = (0, mysql_core_1.mysqlTable)('AccountTokens', {
    id: (0, mysql_core_1.char)('id', { length: 36 }).primaryKey(),
    accountId: (0, mysql_core_1.char)('accountId', { length: 36 }).notNull(),
    token: (0, mysql_core_1.text)('token').notNull(),
    expiresAt: (0, mysql_core_1.timestamp)('expiresAt').notNull(),
    ip: (0, mysql_core_1.varchar)('ip', { length: 255 }),
    userAgent: (0, mysql_core_1.varchar)('userAgent', { length: 255 }),
    createdAt: (0, mysql_core_1.timestamp)('createdAt').defaultNow().notNull(),
    updatedAt: (0, mysql_core_1.timestamp)('updatedAt').defaultNow().onUpdateNow().notNull(),
});
//# sourceMappingURL=account-tokens.js.map