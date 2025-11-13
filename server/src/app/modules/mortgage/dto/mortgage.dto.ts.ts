import { IsNumber, IsString, IsBoolean, IsOptional, Min, Max } from 'class-validator';

export class CreateMortgageCalculationDto {
    @IsString()
    @IsOptional()
    tgId?: string;

    @IsNumber()
    @Min(100000)
    propertyPrice: number;

    @IsString()
    propertyType: 'apartment_in_new_building' | 'apartment_in_secondary_building' | 'house' | 'house_with_land_plot' | 'land_plot' | 'other';

    @IsNumber()
    @Min(0)
    downPaymentAmount: number;

    @IsNumber()
    @IsOptional()
    @Min(0)
    matCapitalAmount?: number;

    @IsBoolean()
    matCapitalIncluded: boolean;

    @IsNumber()
    @Min(1)
    @Max(30)
    loanTermYears: number;

    @IsNumber()
    @Min(1)
    @Max(20)
    interestRate: number;
}

export class MortgageCalculationResponseDto {
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