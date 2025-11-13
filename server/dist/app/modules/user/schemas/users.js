"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.users = void 0;
const mysql_core_1 = require("drizzle-orm/mysql-core");
exports.users = (0, mysql_core_1.mysqlTable)('users', {
    tgId: (0, mysql_core_1.varchar)('tgId', { length: 255 }).primaryKey(),
    username: (0, mysql_core_1.varchar)('username', { length: 255 }),
    firstName: (0, mysql_core_1.varchar)('firstName', { length: 255 }),
    lastName: (0, mysql_core_1.varchar)('lastName', { length: 255 }),
    langCode: (0, mysql_core_1.varchar)('langCode', { length: 10 }),
    invitedBy: (0, mysql_core_1.varchar)('invitedBy', { length: 255 }),
    isActive: (0, mysql_core_1.boolean)('isActive').default(true).notNull(),
    createdAt: (0, mysql_core_1.timestamp)('createdAt').defaultNow().notNull(),
    updatedAt: (0, mysql_core_1.timestamp)('updatedAt').defaultNow().onUpdateNow().notNull(),
});
//# sourceMappingURL=users.js.map