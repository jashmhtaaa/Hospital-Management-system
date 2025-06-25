"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GET = GET;
require("./pharmacy.ts");
// src/types/api.ts;
// Generic error response;
// Specific response for fetching administration records;
async function GET() {
    return new Response("OK");
}
