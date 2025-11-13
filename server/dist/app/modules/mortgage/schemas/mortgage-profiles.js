"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mortgageProfilesRelations = exports.mortgageProfiles = void 0;
const mysql_core_1 = require("drizzle-orm/mysql-core");
const users_1 = require("../../user/schemas/users");
const drizzle_orm_1 = require("drizzle-orm");
exports.mortgageProfiles = (0, mysql_core_1.mysqlTable)('mortgage_profiles', {
    id: (0, mysql_core_1.int)('id').primaryKey().autoincrement(),
    userId: (0, mysql_core_1.varchar)('user_id', { length: 255 }).notNull(),
    propertyPrice: (0, mysql_core_1.decimal)('property_price', { precision: 15, scale: 2 }).notNull(),
    propertyType: (0, mysql_core_1.varchar)('property_type', { length: 50 }).notNull(),
    downPaymentAmount: (0, mysql_core_1.decimal)('down_payment_amount', { precision: 15, scale: 2 }).notNull(),
    matCapitalAmount: (0, mysql_core_1.decimal)('mat_capital_amount', { precision: 15, scale: 2 }),
    matCapitalIncluded: (0, mysql_core_1.boolean)('mat_capital_included').notNull().default(false),
    loanTermYears: (0, mysql_core_1.int)('loan_term_years').notNull(),
    interestRate: (0, mysql_core_1.decimal)('interest_rate', { precision: 5, scale: 3 }).notNull(),
}, (table) => ({
    userIdIdx: (0, mysql_core_1.index)('user_id_idx').on(table.userId),
}));
exports.mortgageProfilesRelations = (0, drizzle_orm_1.relations)(exports.mortgageProfiles, ({ one }) => ({
    user: one(users_1.users, {
        fields: [exports.mortgageProfiles.userId],
        references: [users_1.users.tgId],
    }),
}));
//# sourceMappingURL=mortgage-profiles.js.map