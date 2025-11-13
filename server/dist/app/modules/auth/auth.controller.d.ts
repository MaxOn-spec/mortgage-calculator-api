import { AuthService } from './auth.service';
import { CreateTokenDto } from './dto/create-token.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { AdminLoginDto } from './dto/admin-login.dto';
import { TokenResponse } from './interfaces/token-response.interface';
import { Request, Response } from 'express';
import { RequestWithUser } from './interfaces/request-with-user.interface';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    private setAdminCookies;
    private clearAdminCookies;
    createToken(createTokenDto: CreateTokenDto, req: Request): Promise<TokenResponse>;
    refreshToken(refreshTokenDto: RefreshTokenDto, req: Request): Promise<TokenResponse>;
    logout(req: RequestWithUser): Promise<void>;
    adminLogin(adminLoginDto: AdminLoginDto, req: Request, res: Response): Promise<{
        accountId: string;
        login: string;
        message: string;
    }>;
    adminRefreshToken(req: Request, res: Response): Promise<{
        accountId: string;
        login: string;
        message: string;
    }>;
    adminLogout(res: Response): Promise<{
        message: string;
    }>;
}
