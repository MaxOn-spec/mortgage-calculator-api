import { Database } from '../../../database/schema';
import { CreateMortgageCalculationDto, MortgageCalculationResponseDto } from './dto/mortgage.dto.ts';
export declare class MortgageService {
    private readonly database;
    constructor(database: Database);
    createMortgageCalculation(userId: string, createDto: CreateMortgageCalculationDto): Promise<MortgageCalculationResponseDto>;
    private calculateMortgage;
    private calculateMonthlyPayment;
    private calculateTaxDeduction;
    private generatePaymentSchedule;
    getUserMortgageCalculations(userId: string): Promise<{
        mortgage_profiles: {
            id: number;
            userId: string;
            propertyPrice: string;
            propertyType: string;
            downPaymentAmount: string;
            matCapitalAmount: string | null;
            matCapitalIncluded: boolean;
            loanTermYears: number;
            interestRate: string;
        } | null;
        mortgage_calculations: {
            id: number;
            userId: string;
            mortgageProfileId: number;
            monthlyPayment: string;
            totalPayment: string;
            totalOverpaymentAmount: string;
            possibleTaxDeduction: string;
            savingsDueMotherCapital: string;
            recommendedIncome: string;
            paymentSchedule: string;
        };
    }[]>;
}
