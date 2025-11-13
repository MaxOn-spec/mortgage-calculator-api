import { Injectable, Inject } from '@nestjs/common';
import { Database } from '../../../database/schema';
import { CreateMortgageCalculationDto, MortgageCalculationResponseDto } from './dto/mortgage.dto.ts';
import { NewMortgageProfile, mortgageProfiles } from './schemas/mortgage-profiles';
import { NewMortgageCalculation, mortgageCalculations } from './schemas/mortgage-calculations';
import { eq } from 'drizzle-orm';

@Injectable()
export class MortgageService {
    constructor(
        @Inject('DATABASE') private readonly database: Database
    ) {}

    async createMortgageCalculation(
        userId: string,
        createDto: CreateMortgageCalculationDto
    ): Promise<MortgageCalculationResponseDto> {
        // 1. Рассчитываем параметры ипотеки
        const calculationResult = this.calculateMortgage(createDto);
        
        // 2. Сохраняем профиль ипотеки
        const mortgageProfile: NewMortgageProfile = {
            userId,
            propertyPrice: createDto.propertyPrice.toString(),
            propertyType: createDto.propertyType,
            downPaymentAmount: createDto.downPaymentAmount.toString(),
            matCapitalAmount: createDto.matCapitalAmount?.toString() || null,
            matCapitalIncluded: createDto.matCapitalIncluded,
            loanTermYears: createDto.loanTermYears,
            interestRate: createDto.interestRate.toString(),
        };

        const [savedProfile] = await this.database
            .insert(mortgageProfiles)
            .values(mortgageProfile);

        // 3. Сохраняем расчет
        const mortgageCalculation: NewMortgageCalculation = {
            userId,
            mortgageProfileId: savedProfile.insertId,
            monthlyPayment: calculationResult.monthlyPayment.toString(),
            totalPayment: calculationResult.totalPayment.toString(),
            totalOverpaymentAmount: calculationResult.totalOverpaymentAmount.toString(),
            possibleTaxDeduction: calculationResult.possibleTaxDeduction.toString(),
            savingsDueMotherCapital: calculationResult.savingsDueMotherCapital.toString(),
            recommendedIncome: calculationResult.recommendedIncome.toString(),
            paymentSchedule: JSON.stringify(calculationResult.mortgagePaymentSchedule),
        };

        await this.database
            .insert(mortgageCalculations)
            .values(mortgageCalculation);

        return calculationResult;
    }

    private calculateMortgage(createDto: CreateMortgageCalculationDto): MortgageCalculationResponseDto {
        const {
            propertyPrice,
            downPaymentAmount,
            matCapitalAmount = 0,
            matCapitalIncluded,
            loanTermYears,
            interestRate,
        } = createDto;

        // 1. Сумма кредита
        const loanAmount = propertyPrice - downPaymentAmount - (matCapitalIncluded ? matCapitalAmount : 0);
        
        // 2. Общее количество месяцев
        const totalMonths = loanTermYears * 12;
        
        // 3. Месячная процентная ставка
        const monthlyInterestRate = interestRate / 12 / 100;
        
        // 4. Ежемесячный платеж (аннуитетный)
        const monthlyPayment = this.calculateMonthlyPayment(loanAmount, monthlyInterestRate, totalMonths);
        
        // 5. Общая сумма выплат
        const totalPayment = monthlyPayment * totalMonths;
        
        // 6. Переплата по кредиту
        const totalOverpaymentAmount = totalPayment - loanAmount;
        
        // 7. Налоговый вычет
        const possibleTaxDeduction = this.calculateTaxDeduction(propertyPrice, totalOverpaymentAmount);
        
        // 8. Экономия за счет мат. капитала
        const savingsDueMotherCapital = matCapitalIncluded ? matCapitalAmount : 0;
        
        // 9. Рекомендуемый доход (обычно платеж × 2)
        const recommendedIncome = monthlyPayment * 2;
        
        // 10. График платежей
        const mortgagePaymentSchedule = this.generatePaymentSchedule(
            loanAmount,
            monthlyInterestRate,
            monthlyPayment,
            totalMonths,
            loanTermYears
        );

        return {
            monthlyPayment: Math.round(monthlyPayment * 100) / 100,
            totalPayment: Math.round(totalPayment * 100) / 100,
            totalOverpaymentAmount: Math.round(totalOverpaymentAmount * 100) / 100,
            possibleTaxDeduction: Math.round(possibleTaxDeduction * 100) / 100,
            savingsDueMotherCapital: Math.round(savingsDueMotherCapital * 100) / 100,
            recommendedIncome: Math.round(recommendedIncome * 100) / 100,
            mortgagePaymentSchedule,
        };
    }

    private calculateMonthlyPayment(loanAmount: number, monthlyInterestRate: number, totalMonths: number): number {
        if (monthlyInterestRate === 0) {
            return loanAmount / totalMonths;
        }

        const coefficient = (monthlyInterestRate * Math.pow(1 + monthlyInterestRate, totalMonths)) / 
                           (Math.pow(1 + monthlyInterestRate, totalMonths) - 1);
        
        return loanAmount * coefficient;
    }

    private calculateTaxDeduction(propertyPrice: number, totalOverpayment: number): number {
        const purchaseDeduction = Math.min(propertyPrice, 2000000) * 0.13;
        const interestDeduction = Math.min(totalOverpayment, 3000000) * 0.13;
        
        return purchaseDeduction + interestDeduction;
    }

    private generatePaymentSchedule(
        loanAmount: number,
        monthlyInterestRate: number,
        monthlyPayment: number,
        totalMonths: number,
        loanTermYears: number
    ): any {
        const schedule: any = {};
        let remainingBalance = loanAmount;

        for (let year = 1; year <= loanTermYears; year++) {
            const monthlyPayments: { [month: string]: any } = {};

            for (let month = 1; month <= 12; month++) {
                const monthIndex = (year - 1) * 12 + month;
                if (monthIndex > totalMonths) break;

                const interestPayment = remainingBalance * monthlyInterestRate;
                const principalPayment = monthlyPayment - interestPayment;
                remainingBalance -= principalPayment;

                // Если остаток стал отрицательным, корректируем
                if (remainingBalance < 0) {
                    remainingBalance = 0;
                }

                monthlyPayments[`month_${month}`] = {
                    totalPayment: Math.round(monthlyPayment * 100) / 100,
                    repaymentOfMortgageBody: Math.round(principalPayment * 100) / 100,
                    repaymentOfMortgageInterest: Math.round(interestPayment * 100) / 100,
                    mortgageBalance: Math.round(remainingBalance * 100) / 100,
                };
            }

            schedule[`year_${year}`] = monthlyPayments;
        }

        return schedule;
    }

    async getUserMortgageCalculations(userId: string) {
        return await this.database
            .select()
            .from(mortgageCalculations)
            .leftJoin(mortgageProfiles, eq(mortgageCalculations.mortgageProfileId, mortgageProfiles.id))
            .where(eq(mortgageCalculations.userId, userId));
    }
}