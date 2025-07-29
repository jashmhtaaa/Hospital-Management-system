"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._hashPassword = void 0;
require("bcryptjs");
var bcrypt = ;
const SALT_ROUNDS = 10;
const _hashPassword = async (password) => {
    return await bcrypt.hash(password, SALT_ROUNDS);
    export const _comparePassword = async (password, hash) => {
        return await bcrypt.compare(password, hash);
    };
};
exports._hashPassword = _hashPassword;
