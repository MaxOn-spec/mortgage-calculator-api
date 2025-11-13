import { AccountService } from './account.service';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { type Account } from './schemas/accounts';
export declare class AccountController {
    private readonly accountService;
    constructor(accountService: AccountService);
    findAll(page?: number, limit?: number, search?: string): Promise<{
        accounts: Account[];
        total: number;
    }>;
    findOne(id: string): Promise<Account>;
    create(createAccountDto: CreateAccountDto): Promise<Account>;
    update(id: string, updateAccountDto: UpdateAccountDto): Promise<Account>;
    remove(id: string): Promise<void>;
    checkLogin(body: {
        login: string;
    }): Promise<{
        exists: boolean;
    }>;
}
