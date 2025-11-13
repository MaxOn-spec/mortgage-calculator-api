"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseUtils = void 0;
const constants_1 = require("./constants");
class DatabaseUtils {
    static validatePaginationParams(page, limit) {
        const validPage = Math.max(constants_1.PAGINATION_CONSTANTS.DEFAULT_PAGE, page || constants_1.PAGINATION_CONSTANTS.DEFAULT_PAGE);
        const validLimit = Math.min(Math.max(1, limit || constants_1.PAGINATION_CONSTANTS.DEFAULT_LIMIT), constants_1.PAGINATION_CONSTANTS.MAX_LIMIT);
        return { page: validPage, limit: validLimit };
    }
    static calculateOffset(page, limit) {
        return (page - 1) * limit;
    }
    static createPaginationResult(data, total, page, limit) {
        const totalPages = Math.ceil(total / limit);
        return {
            data,
            total,
            page,
            limit,
            totalPages,
            hasNext: page < totalPages,
            hasPrev: page > 1,
        };
    }
    static sanitizeSearchTerm(search) {
        if (!search || typeof search !== 'string') {
            return undefined;
        }
        return search.trim().toLowerCase();
    }
    static validateId(id) {
        if (!id || typeof id !== 'string') {
            return false;
        }
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
        return uuidRegex.test(id);
    }
}
exports.DatabaseUtils = DatabaseUtils;
//# sourceMappingURL=utils.js.map