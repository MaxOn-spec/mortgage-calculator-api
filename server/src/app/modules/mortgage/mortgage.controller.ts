import { Controller, Post, Body, UseGuards, Request, Get, BadRequestException } from '@nestjs/common';
import { MortgageService } from './mortgage.service';
import { CreateMortgageCalculationDto } from './dto/mortgage.dto.ts';
import { MortgageCalculationResponseDto } from './dto/mortgage.dto.ts';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { RequestWithUser } from '../auth/interfaces/request-with-user.interface';

@Controller('mortgage-profiles')
export class MortgageController {
    constructor(private readonly mortgageService: MortgageService) {}

    // Для WebApp - получаем tgId из JWT токена
    @Post()
    @UseGuards(JwtAuthGuard)
    async createMortgageCalculation(
        @Request() req: RequestWithUser,
        @Body() createDto: CreateMortgageCalculationDto
    ): Promise<MortgageCalculationResponseDto> {
        return await this.mortgageService.createMortgageCalculation(
            req.user.tgId,
            createDto
        );
    }

    // Для бота - получаем tgId из тела запроса
    @Post('from-bot')
    async createMortgageCalculationFromBot(
        @Body() createDto: CreateMortgageCalculationDto & { tgId: string }
    ): Promise<MortgageCalculationResponseDto> {
        if (!createDto.tgId) {
            throw new BadRequestException('tgId is required');
        }
        
        return await this.mortgageService.createMortgageCalculation(
            createDto.tgId,
            createDto
        );
    }

    @Get()
    @UseGuards(JwtAuthGuard)
    async getUserCalculations(@Request() req: RequestWithUser) {
        return await this.mortgageService.getUserMortgageCalculations(req.user.tgId);
    }
}