import { type User } from './schemas/users';
import { Database } from '../../../database/schema';
import { CreateUserDto } from './dto/create-user.dto';
export declare class UsersService {
    private readonly db;
    private readonly adminIds;
    constructor(db: Database);
    findOrCreate(dto: CreateUserDto): Promise<User>;
    findByTgId(tgId: string): Promise<User | null>;
    activateUser(tgId: string): Promise<void>;
    deactivateUser(tgId: string): Promise<void>;
    getIdsBatch(offset: number, limit: number, userIds?: string[]): Promise<string[]>;
    isAdmin(tgId: string): boolean;
    getAdminIds(): string[];
    getStats(): Promise<{
        totalUsers: number;
        activeUsers: number;
        inactiveUsers: number;
        usersByLangCode: Record<string, number>;
    }>;
}
