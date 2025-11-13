import { type RefreshToken } from './schemas/refresh-tokens';
import { Database } from '../../../database/schema';
import { CreateRefreshTokenDto } from './dto/create-refresh-token.dto';
export declare class RefreshTokenService {
    private readonly db;
    constructor(db: Database);
    create(dto: CreateRefreshTokenDto): Promise<RefreshToken>;
    findByToken(token: string): Promise<RefreshToken | null>;
    removeByUserId(userId: string): Promise<void>;
    removeByToken(token: string): Promise<void>;
    removeExpired(): Promise<void>;
}
