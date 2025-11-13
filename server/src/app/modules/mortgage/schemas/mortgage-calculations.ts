import { mysqlTable, int, varchar, decimal, text, index } from 'drizzle-orm/mysql-core';
import { mortgageProfiles } from './mortgage-profiles';
import { users } from '../../user/schemas/users';
import { relations } from 'drizzle-orm';
import { InferInsertModel, InferSelectModel } from 'drizzle-orm';

export const mortgageCalculations = mysqlTable('mortgage_calculations', {
    id: int('id').primaryKey().autoincrement(),
    userId: varchar('user_id', { length: 255 }).notNull(),
    mortgageProfileId: int('mortgage_profile_id').notNull(),
    monthlyPayment: decimal('monthly_payment', { precision: 15, scale: 2 }).notNull(),
    totalPayment: decimal('total_payment', { precision: 15, scale: 2 }).notNull(),
    totalOverpaymentAmount: decimal('total_overpayment_amount', { precision: 15, scale: 2 }).notNull(),
    possibleTaxDeduction: decimal('possible_tax_deduction', { precision: 15, scale: 2 }).notNull(),
    savingsDueMotherCapital: decimal('savings_due_mother_capital', { precision: 15, scale: 2 }).notNull(),
    recommendedIncome: decimal('recommended_income', { precision: 15, scale: 2 }).notNull(),
    paymentSchedule: text('payment_schedule').notNull(),
}, (table) => ({
    userIdIdx: index('mortgage_user_id_idx').on(table.userId),
    profileIdIdx: index('mortgage_profile_id_idx').on(table.mortgageProfileId),
}));

export const mortgageCalculationsRelations = relations(mortgageCalculations, ({ one }) => ({
    mortgageProfile: one(mortgageProfiles, {
        fields: [mortgageCalculations.mortgageProfileId],
        references: [mortgageProfiles.id],
    }),
    user: one(users, {
        fields: [mortgageCalculations.userId],
        references: [users.tgId],
    }),
}));

export type MortgageCalculation = InferSelectModel<typeof mortgageCalculations>;
export type NewMortgageCalculation = InferInsertModel<typeof mortgageCalculations>;