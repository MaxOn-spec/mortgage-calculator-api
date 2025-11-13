"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MortgageService = void 0;
const common_1 = require("@nestjs/common");
const mortgage_profiles_1 = require("./schemas/mortgage-profiles");
const mortgage_calculations_1 = require("./schemas/mortgage-calculations");
const drizzle_orm_1 = require("drizzle-orm");
let MortgageService = class MortgageService {
    constructor(database) {
        this.database = database;
    }
    async createMortgageCalculation(userId, createDto) {
        const calculationResult = this.calculateMortgage(createDto);
        const mortgageProfile = {
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
            .insert(mortgage_profiles_1.mortgageProfiles)
            .values(mortgageProfile);
        const mortgageCalculation = {
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
            .insert(mortgage_calculations_1.mortgageCalculations)
            .values(mortgageCalculation);
        return calculationResult;
    }
    calculateMortgage(createDto) {
        const { propertyPrice, downPaymentAmount, matCapitalAmount = 0, matCapitalIncluded, loanTermYears, interestRate, } = createDto;
        const loanAmount = propertyPrice - downPaymentAmount - (matCapitalIncluded ? matCapitalAmount : 0);
        const totalMonths = loanTermYears * 12;
        const monthlyInterestRate = interestRate / 12 / 100;
        const monthlyPayment = this.calculateMonthlyPayment(loanAmount, monthlyInterestRate, totalMonths);
        const totalPayment = monthlyPayment * totalMonths;
        const totalOverpaymentAmount = totalPayment - loanAmount;
        const possibleTaxDeduction = this.calculateTaxDeduction(propertyPrice, totalOverpaymentAmount);
        const savingsDueMotherCapital = matCapitalIncluded ? matCapitalAmount : 0;
        const recommendedIncome = monthlyPayment * 2;
        const mortgagePaymentSchedule = this.generatePaymentSchedule(loanAmount, monthlyInterestRate, monthlyPayment, totalMonths, loanTermYears);
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
    calculateMonthlyPayment(loanAmount, monthlyInterestRate, totalMonths) {
        if (monthlyInterestRate === 0) {
            return loanAmount / totalMonths;
        }
        const coefficient = (monthlyInterestRate * Math.pow(1 + monthlyInterestRate, totalMonths)) /
            (Math.pow(1 + monthlyInterestRate, totalMonths) - 1);
        return loanAmount * coefficient;
    }
    calculateTaxDeduction(propertyPrice, totalOverpayment) {
        const purchaseDeduction = Math.min(propertyPrice, 2000000) * 0.13;
        const interestDeduction = Math.min(totalOverpayment, 3000000) * 0.13;
        return purchaseDeduction + interestDeduction;
    }
    generatePaymentSchedule(loanAmount, monthlyInterestRate, monthlyPayment, totalMonths, loanTermYears) {
        const schedule = {};
        let remainingBalance = loanAmount;
        for (let year = 1; year <= loanTermYears; year++) {
            const monthlyPayments = {};
            for (let month = 1; month <= 12; month++) {
                const monthIndex = (year - 1) * 12 + month;
                if (monthIndex > totalMonths)
                    break;
                const interestPayment = remainingBalance * monthlyInterestRate;
                const principalPayment = monthlyPayment - interestPayment;
                remainingBalance -= principalPayment;
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
    async getUserMortgageCalculations(userId) {
        return await this.database
            .select()
            .from(mortgage_calculations_1.mortgageCalculations)
            .leftJoin(mortgage_profiles_1.mortgageProfiles, (0, drizzle_orm_1.eq)(mortgage_calculations_1.mortgageCalculations.mortgageProfileId, mortgage_profiles_1.mortgageProfiles.id))
            .where((0, drizzle_orm_1.eq)(mortgage_calculations_1.mortgageCalculations.userId, userId));
    }
};
exports.MortgageService = MortgageService;
exports.MortgageService = MortgageService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)('DATABASE')),
    __metadata("design:paramtypes", [Object])
], MortgageService);
//# sourceMappingURL=mortgage.service.js.map