import { Strategy } from 'passport-jwt';
import { AuthService } from '../auth.service';
import { AdminJwtPayload } from '../interfaces/admin-jwt-payload.interface';
import { type Account } from '../../account/schemas/accounts';
declare const AdminJwtStrategy_base: new (...args: [opt: import("passport-jwt").StrategyOptionsWithRequest] | [opt: import("passport-jwt").StrategyOptionsWithoutRequest]) => Strategy & {
    validate(...args: any[]): unknown;
};
export declare class AdminJwtStrategy extends AdminJwtStrategy_base {
    private readonly authService;
    constructor(authService: AuthService);
    validate(payload: AdminJwtPayload): Promise<Account>;
}
export {};
