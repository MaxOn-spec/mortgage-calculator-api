"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BROADCAST_CONFIG = void 0;
exports.BROADCAST_CONFIG = {
    CONCURRENCY: 25,
    BATCH_SIZE: 5000,
    MAX_ATTEMPTS: 3,
    BACKOFF_DELAY: 2000,
    MAX_RETRY_ATTEMPTS: 3,
    RETRY_BUFFER_SECONDS: 5,
    REMOVE_ON_COMPLETE: 100,
    REMOVE_ON_FAIL: 50,
    STALLED_INTERVAL: 30 * 1000,
    MAX_STALLED_COUNT: 1,
};
//# sourceMappingURL=broadcast.config.js.map