import { Strategy } from 'passport-jwt';
import { AuthService } from '../auth.service';
import { JwtPayload } from '../interfaces/jwt-payload.interface';
declare const JwtStrategy_base: new (...args: [opt: import("passport-jwt").StrategyOptionsWithRequest] | [opt: import("passport-jwt").StrategyOptionsWithoutRequest]) => Strategy & {
    validate(...args: any[]): unknown;
};
export declare class JwtStrategy extends JwtStrategy_base {
    private readonly authService;
    constructor(authService: AuthService);
    validate(payload: JwtPayload): Promise<{
        tgId: string;
        username: string | null;
        firstName: string | null;
        lastName: string | null;
        langCode: string | null;
        invitedBy: string | null;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
export {};
