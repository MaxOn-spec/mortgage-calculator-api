"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const mysql2_1 = require("drizzle-orm/mysql2");
const promise_1 = __importDefault(require("mysql2/promise"));
const constants_1 = require("./constants");
const schema_1 = require("./schema");
let DatabaseModule = class DatabaseModule {
};
exports.DatabaseModule = DatabaseModule;
exports.DatabaseModule = DatabaseModule = __decorate([
    (0, common_1.Global)(),
    (0, common_1.Module)({
        imports: [config_1.ConfigModule],
        providers: [
            {
                provide: 'DATABASE',
                useFactory: async (configService) => {
                    const connection = promise_1.default.createPool({
                        host: configService.get('HOST'),
                        port: parseInt(configService.get('PORT') || '3306'),
                        user: configService.get('DB_USERNAME ') || 'root',
                        password: configService.get('PASSWORD') || undefined,
                        database: configService.get('DATABASE'),
                        timezone: constants_1.DATABASE_CONSTANTS.DEFAULT_TIMEZONE,
                        dateStrings: true,
                    });
                    return (0, mysql2_1.drizzle)(connection, {
                        schema: schema_1.databaseSchema,
                        mode: 'default'
                    });
                },
                inject: [config_1.ConfigService],
            },
        ],
        exports: ['DATABASE'],
    })
], DatabaseModule);
//# sourceMappingURL=database.module.js.map