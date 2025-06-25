"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GET = void 0;
const server_1 = require("next/server");
// FHIR API endpoint
const GET = async (request) => {
    try {
        // Implementation here
        return server_1.NextResponse.json({ message: "FHIR endpoint" });
    }
    catch (error) {
        return server_1.NextResponse.json({ error: "FHIR operation failed" }, { status: 500 });
    }
};
exports.GET = GET;
