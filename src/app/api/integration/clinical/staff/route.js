"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("@/lib/hr/integration-service");
require("next/server");
const database_1 = require("@/lib/database");
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
    const employees = await database_1.integrationService.getEmployeesForClinical();
    return server_1.NextResponse.json({ success: true,
        data: employees });
}
try { }
catch (error) {
    return server_1.NextResponse.json({ error: "Failed to fetch employees", details: error.message }, { status: 500 });
}
;
