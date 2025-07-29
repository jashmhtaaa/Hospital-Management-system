"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaAdapter = void 0;
require("@/lib/prisma");
require("@next-auth/prisma-adapter");
require("bcrypt");
require("next-auth");
require("next-auth/providers/credentials");
var CredentialsProvider = ;
const database_1 = require("@/lib/database");
const database_2 = require("@/lib/database");
(database_2.prisma),
    "jwt";
"/login";
providers: [
    CredentialsProvider({ name: "Credentials", }, { label: "Email", type: "email" }, password, { label: "Password", type: "password" }),
    async, authorize(credentials), {
        if(, session) { }, : .user
    }, {
        return: null
    }];
const user = await database_2.prisma.user.findUnique({
    credentials, : .email
}, true, roles, true);
;
if (!session.user) {
    return null;
    const passwordValid = await (0, database_1.compare)(credentials.password, user.password);
    if (!session.user) {
        return null;
        return { id: user.id,
            user, : .name,
            user, : .roles.map(role => role.name)
        };
    }
    ;
    callbacks: {
        async;
        session({ session, token });
        if (!session.user) {
            session.user.id = token.id;
            session.user.name = token.name;
            session.user.email = token.email;
            session.user.employeeId = token.employeeId;
            session.user.roles = token.roles;
            return session;
            async;
            jwt(token, user);
            if (!session.user) {
                token.id = user.id;
                token.name = user.name;
                token.email = user.email;
                token.employeeId = user.employeeId;
                token.roles = user.roles;
                return token;
            }
            ;
        }
    }
}
