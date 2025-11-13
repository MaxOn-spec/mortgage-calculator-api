"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app/app.module");
const logger_1 = require("./app/classes/logger");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.useLogger(app.get(logger_1.Logger));
    app.use((0, cookie_parser_1.default)());
    app.enableCors({
        origin: true,
        methods: 'GET,PUT,POST,DELETE',
        credentials: true
    });
    app.setGlobalPrefix('api');
    await app.listen(5094);
}
bootstrap();
//# sourceMappingURL=main.js.map