import { mysqlTable, int, varchar, decimal, boolean, text, index } from 'drizzle-orm/mysql-core';
import { users } from '../../user/schemas/users';
import { relations } from 'drizzle-orm';
import { InferInsertModel, InferSelectModel } from 'drizzle-orm';

export const mortgageProfiles = mysqlTable('mortgage_profiles', {
    id: int('id').primaryKey().autoincrement(),
    userId: varchar('user_id', { length: 255 }).notNull(), // Согласовано с users.tgId
    propertyPrice: decimal('property_price', { precision: 15, scale: 2 }).notNull(),
    propertyType: varchar('property_type', { length: 50 }).notNull(),
    downPaymentAmount: decimal('down_payment_amount', { precision: 15, scale: 2 }).notNull(),
    matCapitalAmount: decimal('mat_capital_amount', { precision: 15, scale: 2 }),
    matCapitalIncluded: boolean('mat_capital_included').notNull().default(false),
    loanTermYears: int('loan_term_years').notNull(),
    interestRate: decimal('interest_rate', { precision: 5, scale: 3 }).notNull(),
}, (table) => ({
    userIdIdx: index('user_id_idx').on(table.userId),
}));

export const mortgageProfilesRelations = relations(mortgageProfiles, ({ one }) => ({
    user: one(users, {
        fields: [mortgageProfiles.userId],
        references: [users.tgId],
    }),
}));

export type MortgageProfile = InferSelectModel<typeof mortgageProfiles>;
export type NewMortgageProfile = InferInsertModel<typeof mortgageProfiles>;