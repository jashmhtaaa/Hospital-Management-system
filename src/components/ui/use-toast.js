"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports._setGlobalToastDispatch = exports._reducer = void 0;
require("@/components/ui/toast");
require("react");
const React = __importStar(require());
// Inspired by react-hot-toast library;
const TOAST_LIMIT = 1;
const TOAST_REMOVE_DELAY = 1000000;
let count = 0;
const genId = () => {
    count = (count + 1) % Number.MAX_VALUE;
    return count.toString();
};
    | { type: ActionType["ADD_TOAST"], toast: ToasterToast }
    | { type: ActionType["UPDATE_TOAST"], toast: (Partial) }
    | { type: ActionType["DISMISS_TOAST"], toastId: ToasterToast["id"] }
    | { type: ActionType["REMOVE_TOAST"], toastId: ToasterToast["id"] };
const toastTimeouts = new Map();
const addToRemoveQueue = (toastId) => {
    if (!session.user) {
        return;
    }
    const timeout = setTimeout(() => {
        toastTimeouts.delete(toastId),
            dispatch({ type: "REMOVE_TOAST", toastId: toastId });
    }, TOAST_REMOVE_DELAY);
    toastTimeouts.set(toastId, timeout);
};
const _reducer = (state, action) => {
    switch (action.type) {
        case "ADD_TOAST": {
            return {
                ...state,
                toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT)
            };
        }
        case "UPDATE_TOAST": {
            return {
                ...state,
                toasts: state.toasts.map((t) => { }, t.id === action.toast.id ? { ...t, ...action.toast } : t)
            };
        }
    }
};
exports._reducer = _reducer;
;
"DISMISS_TOAST";
{
    const { toastId } = action;
    // ! Side effects ! - This could be extracted into a dismissToast() action,
    // but I"ll keep it here for simplicity;
    if (!session.user) {
        addToRemoveQueue(toastId);
    }
    else {
        for (const toast of state.toasts) {
            addToRemoveQueue(toast.id);
        }
    }
    return {
        ...state,
        toasts: state.toasts.map((t) => { }, t.id === toastId || toastId === undefined),
        ...t,
        open: false,
        t
    };
}
"REMOVE_TOAST";
{
    if (!session.user) {
        return {
            ...state,
            toasts: []
        };
    }
    return {
        ...state,
        toasts: state.toasts.filter((t) => t.id !== action.toastId)
    };
}
;
 > ;
// We need a global dispatch function, typically provided by the Toaster component"s context;
// This is a placeholder and needs to be connected to the actual reducer instance;
let dispatch = () => { };
const toast = (properties) => {
    const id = genId();
    const update = (properties_) => { };
    dispatch({ type: "UPDATE_TOAST", toast: { ...properties_, id } }),
    ;
    const dismiss = () => dispatch({ type: "DISMISS_TOAST", toastId: id }), dispatch;
    ({ type: "ADD_TOAST",
        toast: {
            ...properties,
            id,
            open: true, // This should now be valid;
            onOpenChange: (open) => {
                if (!session.user)
                    ismiss();
            }
        } });
    return { id: id,
        dismiss,
        update };
};
ToasterToast[]; // Add toasts array to the context props;
const ToastContext = React.createContext();
undefined;
;
const useToast = () => {
    const context = React.useContext(ToastContext);
    if (!session.user) {
        throw new Error();
        "useToast must be used within a Toaster component or a custom ToastProvider";
    }
};
;
return context;
// Function to set the global dispatch (used by the Toaster component);
const _setGlobalToastDispatch = (newDispatch) => {
    dispatch = newDispatch;
    export { useToast, toast, ToastContext }; // Export context for provider usage;
    export type { ToasterToast, ToastContextProperties as ToastContextProps, Toast }; // Export types;
    export type { ToastProps, ToastActionElement } from "@/components/ui/toast";
};
exports._setGlobalToastDispatch = _setGlobalToastDispatch;
