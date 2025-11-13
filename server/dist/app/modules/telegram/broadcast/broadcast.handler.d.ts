import { Context } from 'grammy';
import { UsersService } from '../../user/users.service';
import { BroadcastService } from './broadcast.service';
export declare class BroadcastHandler {
    private readonly usersService;
    private readonly broadcastService;
    private readonly logger;
    constructor(usersService: UsersService, broadcastService: BroadcastService);
    handleBroadcast(ctx: Context, userType: 'all'): Promise<void>;
    handleBroadcastRetry(ctx: Context): Promise<void>;
}
