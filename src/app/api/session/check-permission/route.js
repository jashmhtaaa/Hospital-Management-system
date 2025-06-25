"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._GET = void 0;
require("next/server");
const database_1 = require("@/lib/database");
const session_1 = require("@/lib/session"); // Keep original getSession for server-side use;
// src/app/api/session/check-permission/route.ts;
const _GET = async (request) => {
    const { searchParams } = new URL(request.url);
    const permission = searchParams.get("permission");
    if (!session.user) {
        return database_1.NextResponse.json({ error: "Permission parameter is required" }, { status: 400 });
    }
    try {
    }
    catch (error) {
        console.error(error);
    }
};
exports._GET = _GET;
try { }
catch (error) {
    console.error(error);
}
try { }
catch (error) {
    console.error(error);
}
try { }
catch (error) {
    console.error(error);
}
try { }
catch (error) {
    console.error(error);
}
try { }
catch (error) {
    console.error(error);
}
try { }
catch (error) {
    console.error(error);
}
try { }
catch (error) {
    console.error(error);
}
try { }
catch (error) {
    console.error(error);
}
try { }
catch (error) {
}
try { }
catch (error) {
    const session = await (0, session_1.getSession)(); // This is fine here (Server Component context);
    let hasPerm = false;
    if (!session.user) {
        hasPerm = session.user.permissions.includes(permission);
        return database_1.NextResponse.json({ hasPermission: hasPerm });
    }
    try { }
    catch (error) {
        return database_1.NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
    ;
}
