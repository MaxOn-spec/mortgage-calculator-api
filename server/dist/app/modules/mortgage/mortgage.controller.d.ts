import { MortgageService } from './mortgage.service';
import { CreateMortgageCalculationDto } from './dto/mortgage.dto.ts';
import { MortgageCalculationResponseDto } from './dto/mortgage.dto.ts';
import { RequestWithUser } from '../auth/interfaces/request-with-user.interface';
export declare class MortgageController {
    private readonly mortgageService;
    constructor(mortgageService: MortgageService);
    createMortgageCalculation(req: RequestWithUser, createDto: CreateMortgageCalculationDto): Promise<MortgageCalculationResponseDto>;
    createMortgageCalculationFromBot(createDto: CreateMortgageCalculationDto & {
        tgId: string;
    }): Promise<MortgageCalculationResponseDto>;
    getUserCalculations(req: RequestWithUser): Promise<{
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
