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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Helper = void 0;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const safe_timers_1 = require("safe-timers");
const uuid_1 = require("uuid");
const russian_to_english_map_1 = require("./assets/russian-to-english-map");
class Helper {
    static sleep(sec) {
        return new Promise(resolve => (0, safe_timers_1.setTimeout)(resolve, sec * 1000));
    }
    static getRandomId() {
        return (Math.ceil(Math.random() * 0xffffff) + Math.ceil(Math.random() * 0xffffff));
    }
    static getRandomNumber(offset) {
        return Math.floor(Math.random() * offset);
    }
    static generateRandomText(length = 6) {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        const charactersLength = characters.length;
        for (let i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    }
    static getRangeRandomNumber(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    static writeToFile(fileName, content) {
        fs.writeFile(path.resolve(`./${fileName}.txt`), content, error => {
            if (error) {
                throw error;
            }
        });
    }
    static appendToFile(filePath, content) {
        const dir = path.dirname(filePath);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        fs.appendFile(filePath, content + '\r\n', (error) => {
            if (error) {
                console.error(`Ошибка записи в файл ${filePath}:`, error);
            }
        });
    }
    static getClearDate(date) {
        return date
            .replace('"', '')
            .replace(/T/, ' ')
            .replace(/\..+|\+.+/, '');
    }
    static getDateNow() {
        const timestamp = Date.now() + Helper.timeZone * 60 * 1000;
        return new Date(timestamp).toISOString();
    }
    static getClearDateNow() {
        return this.getClearDate(this.getDateNow());
    }
    static getDateWithAddedTime(minutes) {
        const timestamp = Date.now() + (Helper.timeZone + minutes) * 60 * 1000;
        return new Date(timestamp).toISOString();
    }
    static getClearDateWithAddedTime(minutes) {
        return this.getClearDate(this.getDateWithAddedTime(minutes));
    }
    static getStartDate() {
        const date = new Date();
        date.setUTCHours(0, 0, 0, 0);
        return date.toISOString();
    }
    static getClearStartDate() {
        const date = new Date();
        date.setUTCHours(0, 0, 0, 0);
        return this.getClearDate(date.toISOString());
    }
    static getEndDate() {
        const date = new Date();
        date.setUTCHours(23, 59, 59, 999);
        return date.toISOString();
    }
    static getClearEndDate() {
        const date = new Date();
        date.setUTCHours(23, 59, 59, 999);
        return this.getClearDate(date.toISOString());
    }
    static replaceAt(string, index, replacement) {
        return (string.substring(0, index) +
            replacement +
            string.substring(index + replacement.length));
    }
    static getRandomString(offset) {
        const range = Math.ceil(offset / 8);
        let string = '';
        for (let i = 0; i < range; i++) {
            string += Math.random().toString(36).slice(-8);
        }
        return string.substring(0, offset);
    }
    static uint8ArrayToNumber(uint8Array) {
        const view = new DataView(uint8Array.buffer, 0);
        return view.getUint32(0, true);
    }
    static uint8ArrayToBigInt(uint8Array) {
        const hexString = Array.from(uint8Array)
            .map(byte => byte.toString(16).padStart(2, '0'))
            .join('');
        return BigInt('0x' + hexString);
    }
    static int256ToBytes(int) {
        const bytesArray = [];
        for (let i = 0; i < 32; i++) {
            let shift = int >> BigInt(8 * i);
            shift &= BigInt(255);
            bytesArray[i] = Number(String(shift));
        }
        return Buffer.from(bytesArray);
    }
    static isEmpty(array) {
        return array === undefined || array.length === 0;
    }
    static getDayAndMonth() {
        const date = new Date();
        const day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
        const month = date.getMonth() + 1 < 10
            ? '0' + (date.getMonth() + 1)
            : date.getMonth() + 1;
        return { day, month };
    }
    static getHourAndMinutesInDate(date) {
        const hour = date.getHours() < 10 ? '0' + date.getHours() : date.getHours();
        const minutes = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();
        return { hour, minutes };
    }
    static isValueInEnum(value, enumType) {
        return Object.values(enumType).includes(value);
    }
    static getKeyByValue(object, valueToFind) {
        return Object.keys(object).find(key => object[key] === valueToFind);
    }
    static chunkArray(array, chunk) {
        const newArray = [];
        for (let i = 0; i < array.length; i += chunk) {
            newArray.push(array.slice(i, i + chunk));
        }
        return newArray;
    }
    static chunkMap(map, chunkSize) {
        const chunks = [];
        let currentChunk = new Map();
        let index = 0;
        map.forEach((value, key) => {
            currentChunk.set(key, value);
            index++;
            if (index % chunkSize === 0) {
                chunks.push(currentChunk);
                currentChunk = new Map();
            }
        });
        if (currentChunk.size > 0) {
            chunks.push(currentChunk);
        }
        return chunks;
    }
    static isUuid4(uuid) {
        return (0, uuid_1.validate)(uuid);
    }
    static getValuesByKeys(array, keys) {
        return array.reduce((acc, item) => {
            keys.forEach(key => {
                if (item[key] !== undefined) {
                    acc.push(item[key]);
                }
            });
            return acc;
        }, []);
    }
    static slugify(str) {
        const slug = str.replace(/[^a-zA-Zа-яА-Я0-9]/g, '');
        const transliterated = slug.replace(/[а-яА-Я]/g, match => {
            return (russian_to_english_map_1.russianToEnglishMap[match.toLowerCase()] ||
                '');
        });
        const lowercased = transliterated.toLowerCase();
        return lowercased;
    }
    static groupBy(arr, key) {
        return arr.reduce((groups, obj) => {
            const keyValue = obj[key];
            const group = groups[keyValue] || [];
            group.push(obj);
            groups[keyValue] = group;
            return groups;
        }, {});
    }
    static isValidRegex(pattern) {
        try {
            new RegExp(pattern);
            return true;
        }
        catch (e) {
            return false;
        }
    }
}
exports.Helper = Helper;
Helper.timeZone = -new Date().getTimezoneOffset();
//# sourceMappingURL=helper.js.map