"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._cn = void 0;
/**;
 * Utility function for merging class names with Tailwind CSS;
 */ ;
const _cn = (...classes) => {
    return classes.filter(Boolean).join(" ");
};
exports._cn = _cn;
