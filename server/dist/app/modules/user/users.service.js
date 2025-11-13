"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const drizzle_orm_1 = require("drizzle-orm");
const users_1 = require("./schemas/users");
let UsersService = class UsersService {
    constructor(db) {
        this.db = db;
        if (!process.env.TELEGRAM_ADMIN_IDS) {
            throw new Error('Admin ids env is empty. Please set in ENV');
        }
        this.adminIds = process.env.TELEGRAM_ADMIN_IDS?.split(',') || [];
    }
    async findOrCreate(dto) {
        console.log('findOrCreate called with:', dto);
        try {
            const [existingUser] = await this.db.select().from(users_1.users).where((0, drizzle_orm_1.eq)(users_1.users.tgId, dto.tgId));
            console.log('Existing user:', existingUser);
            if (existingUser) {
                return existingUser;
            }
            console.log('Creating new user...');
            await this.db.insert(users_1.users).values(dto);
            const [newUser] = await this.db.select().from(users_1.users).where((0, drizzle_orm_1.eq)(users_1.users.tgId, dto.tgId));
            console.log('New user created:', newUser);
            return newUser;
        }
        catch (error) {
            console.error('Error in findOrCreate:', error);
            throw error;
        }
    }
    async findByTgId(tgId) {
        const [user] = await this.db.select().from(users_1.users).where((0, drizzle_orm_1.eq)(users_1.users.tgId, tgId));
        return user || null;
    }
    async activateUser(tgId) {
        await this.db.update(users_1.users)
            .set({ isActive: true })
            .where((0, drizzle_orm_1.eq)(users_1.users.tgId, tgId));
    }
    async deactivateUser(tgId) {
        await this.db.update(users_1.users)
            .set({ isActive: false })
            .where((0, drizzle_orm_1.eq)(users_1.users.tgId, tgId));
    }
    async getIdsBatch(offset, limit, userIds) {
        const conditions = [(0, drizzle_orm_1.eq)(users_1.users.isActive, true)];
        if (userIds && userIds.length > 0) {
            conditions.push((0, drizzle_orm_1.inArray)(users_1.users.tgId, userIds));
        }
        const result = await this.db.select({ tgId: users_1.users.tgId })
            .from(users_1.users)
            .where((0, drizzle_orm_1.and)(...conditions))
            .limit(limit)
            .offset(offset)
            .orderBy((0, drizzle_orm_1.asc)(users_1.users.tgId));
        return result.map((user) => user.tgId);
    }
    isAdmin(tgId) {
        return this.adminIds.includes(tgId);
    }
    getAdminIds() {
        return this.adminIds;
    }
    async getStats() {
        const [totalUsersResult, activeUsersResult, inactiveUsersResult, usersByLangCode] = await Promise.all([
            this.db.select({ count: (0, drizzle_orm_1.sql) `count(*)` }).from(users_1.users),
            this.db.select({ count: (0, drizzle_orm_1.sql) `count(*)` }).from(users_1.users).where((0, drizzle_orm_1.eq)(users_1.users.isActive, true)),
            this.db.select({ count: (0, drizzle_orm_1.sql) `count(*)` }).from(users_1.users).where((0, drizzle_orm_1.eq)(users_1.users.isActive, false)),
            this.db.select({
                langCode: users_1.users.langCode,
                count: (0, drizzle_orm_1.sql) `count(*)`
            })
                .from(users_1.users)
                .where((0, drizzle_orm_1.sql) `${users_1.users.langCode} IS NOT NULL`)
                .groupBy(users_1.users.langCode)
        ]);
        const langCodeStats = {};
        usersByLangCode.forEach((item) => {
            if (item.langCode && item.count) {
                langCodeStats[item.langCode] = parseInt(item.count.toString());
            }
        });
        return {
            totalUsers: totalUsersResult[0]?.count || 0,
            activeUsers: activeUsersResult[0]?.count || 0,
            inactiveUsers: inactiveUsersResult[0]?.count || 0,
            usersByLangCode: langCodeStats,
        };
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)('DATABASE')),
    __metadata("design:paramtypes", [Object])
], UsersService);
//# sourceMappingURL=users.service.js.map