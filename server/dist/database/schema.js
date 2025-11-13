"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.databaseSchema = void 0;
const accounts_1 = require("../app/modules/account/schemas/accounts");
const account_tokens_1 = require("../app/modules/account-token/schemas/account-tokens");
const users_1 = require("../app/modules/user/schemas/users");
const refresh_tokens_1 = require("../app/modules/refresh-token/schemas/refresh-tokens");
const mortgage_profiles_1 = require("../app/modules/mortgage/schemas/mortgage-profiles");
const mortgage_calculations_1 = require("../app/modules/mortgage/schemas/mortgage-calculations");
exports.databaseSchema = {
    accounts: accounts_1.accounts,
    accountTokens: account_tokens_1.accountTokens,
    users: users_1.users,
    refreshTokens: refresh_tokens_1.refreshTokens,
    mortgageProfiles: mortgage_profiles_1.mortgageProfiles,
    mortgageCalculations: mortgage_calculations_1.mortgageCalculations,
};
//# sourceMappingURL=schema.js.map