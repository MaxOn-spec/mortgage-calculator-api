export declare class Helper {
    static timeZone: number;
    static sleep(sec: number): Promise<void>;
    static getRandomId(): number;
    static getRandomNumber(offset: number): number;
    static generateRandomText(length?: number): string;
    static getRangeRandomNumber(min: number, max: number): number;
    static writeToFile(fileName: string, content: string): void;
    static appendToFile(filePath: string, content: string): void;
    static getClearDate(date: string): string;
    static getDateNow(): string;
    static getClearDateNow(): string;
    static getDateWithAddedTime(minutes: number): string;
    static getClearDateWithAddedTime(minutes: number): string;
    static getStartDate(): string;
    static getClearStartDate(): string;
    static getEndDate(): string;
    static getClearEndDate(): string;
    static replaceAt(string: string, index: number, replacement: string): string;
    static getRandomString(offset: number): string;
    static uint8ArrayToNumber(uint8Array: Uint8Array): number;
    static uint8ArrayToBigInt(uint8Array: Uint8Array): bigint;
    static int256ToBytes(int: bigint): Buffer;
    static isEmpty(array: any[] | undefined): boolean;
    static getDayAndMonth(): {
        day: string | number;
        month: string | number;
    };
    static getHourAndMinutesInDate(date: Date): {
        hour: string | number;
        minutes: string | number;
    };
    static isValueInEnum(value: string, enumType: any): boolean;
    static getKeyByValue(object: Record<string, string>, valueToFind: string): string | undefined;
    static chunkArray(array: any[], chunk: number): any[][];
    static chunkMap<Key, Value>(map: Map<Key, Value>, chunkSize: number): Map<Key, Value>[];
    static isUuid4(uuid: string): boolean;
    static getValuesByKeys(array: any[], keys: string[]): [];
    static slugify(str: string): string;
    static groupBy<T extends Record<K, any>, K extends keyof T>(arr: T[], key: K): Record<T[K], T[]>;
    static isValidRegex(pattern: string): boolean;
}
