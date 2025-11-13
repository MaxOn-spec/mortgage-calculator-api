export declare class CreateMortgageCalculationDto {
    tgId?: string;
    propertyPrice: number;
    propertyType: 'apartment_in_new_building' | 'apartment_in_secondary_building' | 'house' | 'house_with_land_plot' | 'land_plot' | 'other';
    downPaymentAmount: number;
    matCapitalAmount?: number;
    matCapitalIncluded: boolean;
    loanTermYears: number;
    interestRate: number;
}
export declare class MortgageCalculationResponseDto {
    monthlyPayment: number;
    totalPayment: number;
    totalOverpaymentAmount: number;
    possibleTaxDeduction: number;
    savingsDueMotherCapital: number;
    recommendedIncome: number;
    mortgagePaymentSchedule: MortgagePaymentSchedule;
}
export type MortgagePaymentSchedule = {
    [year: string]: MonthlyPayments;
};
export type MonthlyPayments = {
    [month: string]: MortgagePayment;
};
export type MortgagePayment = {
    totalPayment: number;
    repaymentOfMortgageBody: number;
    repaymentOfMortgageInterest: number;
    mortgageBalance: number;
};
