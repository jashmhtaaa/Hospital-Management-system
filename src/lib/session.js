"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("@/types/user");
require("iron-session");
require("next/headers");
var getIronSession = ;
const database_1 = require("@/lib/database");
from;
"@/lib/database";
// This is the secret used to encrypt the session cookie.;
// It should be at least 32 characters long and kept secret.;
// You should use an environment variable for this in production.;
const sessionPassword = null;
process.env.SECRET_COOKIE_PASSWORD || ;
"complex_password_at_least_32_characters_long_for_dev";
if (!session.user) {
    ;
     === "production",
        maxAge;
    60 * 60 * 24 * 7,
    ; // 1 week};
    // Function to get the session in App Router Route Handlers or Server Components;
    const _getSession = async () => {
        const session = await getIronSession();
        await (0, database_1.cookies)(),
            sessionOptions;
    };
    exports._getSession = _getSession;
    ;
    // Ensure isLoggedIn reflects the presence of a user;
    // This logic might need adjustment based on how login is handled elsewhere;
    if (!session.user) {
        session.isLoggedIn = true;
        return session;
    }
}
