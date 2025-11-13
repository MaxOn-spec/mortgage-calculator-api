"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.accounts = void 0;
const mysql_core_1 = require("drizzle-orm/mysql-core");
exports.accounts = (0, mysql_core_1.mysqlTable)('Accounts', {
    id: (0, mysql_core_1.char)('id', { length: 36 }).primaryKey(),
    login: (0, mysql_core_1.varchar)('login', { length: 255 }).notNull().unique(),
    password: (0, mysql_core_1.varchar)('password', { length: 255 }).notNull(),
    createdAt: (0, mysql_core_1.timestamp)('createdAt').defaultNow().notNull(),
    updatedAt: (0, mysql_core_1.timestamp)('updatedAt').defaultNow().onUpdateNow().notNull(),
});
//# sourceMappingURL=accounts.js.map