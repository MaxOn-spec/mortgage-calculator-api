export interface PaginationOptions {
    page?: number;
    limit?: number;
    search?: string;
}
export interface PaginationResult<T> {
    data: T[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
}
export declare class DatabaseUtils {
    static validatePaginationParams(page?: number, limit?: number): {
        page: number;
        limit: number;
    };
    static calculateOffset(page: number, limit: number): number;
    static createPaginationResult<T>(data: T[], total: number, page: number, limit: number): PaginationResult<T>;
    static sanitizeSearchTerm(search?: string): string | undefined;
    static validateId(id: string): boolean;
}
