export declare const BROADCAST_CONFIG: {
    readonly CONCURRENCY: 25;
    readonly BATCH_SIZE: 5000;
    readonly MAX_ATTEMPTS: 3;
    readonly BACKOFF_DELAY: 2000;
    readonly MAX_RETRY_ATTEMPTS: 3;
    readonly RETRY_BUFFER_SECONDS: 5;
    readonly REMOVE_ON_COMPLETE: 100;
    readonly REMOVE_ON_FAIL: 50;
    readonly STALLED_INTERVAL: number;
    readonly MAX_STALLED_COUNT: 1;
};
