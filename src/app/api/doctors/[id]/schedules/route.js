"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("@/lib/session");
require("next/server");
const ALLOWED_ROLES_MANAGE = ["Admin", "Doctor"];
const getDoctorId = (pathname) => {
    const parts = pathname.split("/");
    const idStr = parts[parts.length - 2];
    const id = Number.parseInt(idStr, 10);
    return Number.isNaN(id) ? null : id;
};
