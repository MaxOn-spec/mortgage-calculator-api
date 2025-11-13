"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mortgageCalculationsRelations = exports.mortgageCalculations = void 0;
const mysql_core_1 = require("drizzle-orm/mysql-core");
const mortgage_profiles_1 = require("./mortgage-profiles");
const users_1 = require("../../user/schemas/users");
const drizzle_orm_1 = require("drizzle-orm");
exports.mortgageCalculations = (0, mysql_core_1.mysqlTable)('mortgage_calculations', {
    id: (0, mysql_core_1.int)('id').primaryKey().autoincrement(),
    userId: (0, mysql_core_1.varchar)('user_id', { length: 255 }).notNull(),
    mortgageProfileId: (0, mysql_core_1.int)('mortgage_profile_id').notNull(),
    monthlyPayment: (0, mysql_core_1.decimal)('monthly_payment', { precision: 15, scale: 2 }).notNull(),
    totalPayment: (0, mysql_core_1.decimal)('total_payment', { precision: 15, scale: 2 }).notNull(),
    totalOverpaymentAmount: (0, mysql_core_1.decimal)('total_overpayment_amount', { precision: 15, scale: 2 }).notNull(),
    possibleTaxDeduction: (0, mysql_core_1.decimal)('possible_tax_deduction', { precision: 15, scale: 2 }).notNull(),
    savingsDueMotherCapital: (0, mysql_core_1.decimal)('savings_due_mother_capital', { precision: 15, scale: 2 }).notNull(),
    recommendedIncome: (0, mysql_core_1.decimal)('recommended_income', { precision: 15, scale: 2 }).notNull(),
    paymentSchedule: (0, mysql_core_1.text)('payment_schedule').notNull(),
}, (table) => ({
    userIdIdx: (0, mysql_core_1.index)('mortgage_user_id_idx').on(table.userId),
    profileIdIdx: (0, mysql_core_1.index)('mortgage_profile_id_idx').on(table.mortgageProfileId),
}));
exports.mortgageCalculationsRelations = (0, drizzle_orm_1.relations)(exports.mortgageCalculations, ({ one }) => ({
    mortgageProfile: one(mortgage_profiles_1.mortgageProfiles, {
        fields: [exports.mortgageCalculations.mortgageProfileId],
        references: [mortgage_profiles_1.mortgageProfiles.id],
    }),
    user: one(users_1.users, {
        fields: [exports.mortgageCalculations.userId],
        references: [users_1.users.tgId],
    }),
}));
//# sourceMappingURL=mortgage-calculations.js.map