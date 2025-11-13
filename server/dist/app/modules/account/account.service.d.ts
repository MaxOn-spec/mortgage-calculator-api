import { type Account } from './schemas/accounts';
import { Database } from '../../../database/schema';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
export declare class AccountService {
    private readonly db;
    constructor(db: Database);
    create(dto: CreateAccountDto): Promise<Account>;
    update(id: string, dto: UpdateAccountDto): Promise<number>;
    findAll(): Promise<Account[]>;
    findById(id: string): Promise<Account | null>;
    findByLogin(login: string): Promise<Account | null>;
    validateAccount(login: string, password: string): Promise<Account>;
    findAllPaginated(page?: number, limit?: number, search?: string): Promise<{
        accounts: Account[];
        total: number;
    }>;
    remove(id: string): Promise<void>;
}
