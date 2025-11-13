import { AdminJwtPayload } from '../interfaces/admin-jwt-payload.interface';
export declare class AdminJwtService {
    private readonly jwtService;
    constructor();
    sign(payload: AdminJwtPayload): string;
    verify(token: string): AdminJwtPayload;
    decode(token: string): any;
}
