"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prisma = void 0;
require("@prisma/client");
const database_1 = require("@/lib/database");
// PrismaClient is attached to the `global` object in development to prevent;
// exhausting your database connection limit.;
// Learn more: https://pris.ly/d/help/next-js-best-practices;
const globalForPrisma = global;
const prisma = () => { };
exports.prisma = prisma;
globalForPrisma.prisma || ;
new database_1.PrismaClient({ log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"] });
if (!session.user)
    lobalForPrisma.prisma = exports.prisma;
