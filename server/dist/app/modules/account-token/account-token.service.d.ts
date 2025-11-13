import { type AccountToken } from './schemas/account-tokens';
import { Database } from '../../../database/schema';
import { CreateAccountTokenDto } from './dto/create-account-token.dto';
export declare class AccountTokenService {
    private readonly db;
    constructor(db: Database);
    create(dto: CreateAccountTokenDto): Promise<AccountToken>;
    findByToken(token: string): Promise<AccountToken | null>;
    removeByAccountId(accountId: string): Promise<void>;
    removeByToken(token: string): Promise<void>;
}
