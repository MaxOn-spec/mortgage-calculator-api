"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Logger = void 0;
const path = __importStar(require("path"));
const common_1 = require("@nestjs/common");
const helper_1 = require("./helper");
let Logger = class Logger extends common_1.ConsoleLogger {
    constructor() {
        super();
        this.logDir = path.resolve('./logs');
        this.basicContext = ['RouterExplorer', 'RoutesResolver', 'NestApplication'];
    }
    log(message, context) {
        if (this.basicContext.includes(context || '')) {
            return;
        }
        helper_1.Helper.appendToFile(path.join(this.logDir, 'log.txt'), `${super.getTimestamp()} # ${context}: ${message}\r\n`);
        super.log(message, context);
    }
    warn(message, ...optionalParams) {
        optionalParams = optionalParams.filter((item) => item);
        helper_1.Helper.appendToFile(path.join(this.logDir, 'warn.txt'), `${super.getTimestamp()} # ${optionalParams[0]}: ${message}\r\n`);
        super.warn(message, optionalParams);
    }
    async error(message, ...optionalParams) {
        optionalParams = optionalParams.filter((item) => item);
        helper_1.Helper.appendToFile(path.join(this.logDir, 'error.txt'), `${super.getTimestamp()} # ${optionalParams[0]}: ${message}\r\n`);
        super.error(message, optionalParams);
    }
};
exports.Logger = Logger;
exports.Logger = Logger = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], Logger);
//# sourceMappingURL=logger.js.map