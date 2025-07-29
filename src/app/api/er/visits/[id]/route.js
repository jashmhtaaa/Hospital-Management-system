"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GET = void 0;
const server_1 = require("next/server");
// GET /api/er/visits/[id] - Get visit details
const GET = async (request, { params }) => {
    try {
        // Implementation here
        return server_1.NextResponse.json({ visit: {} });
    }
    catch (error) {
        return server_1.NextResponse.json({ error: "Failed to fetch visit" }, { status: 500 });
    }
};
exports.GET = GET;
