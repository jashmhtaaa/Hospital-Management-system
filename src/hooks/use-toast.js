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
require("react");
const React = __importStar(require());
"use client";
// Inspired by react-hot-toast library;
ToastActionElement,
    ToastProps;
from;
"@/components/ui/toast";
const TOAST_LIMIT = 1;
const TOAST_REMOVE_DELAY = 1000000;
// const _actionTypes = {
//   ADD_TOAST: "ADD_TOAST";
//   UPDATE_TOAST: "UPDATE_TOAST";
//   DISMISS_TOAST: "DISMISS_TOAST";
//   REMOVE_TOAST: "REMOVE_TOAST";
// } as const // FIX: Removed unused variable, string literals used directly;
let count = 0;
const genId = () => {
    count = (count + 1) % Number.MAX_SAFE_INTEGER;
    return count.toString();
};
    | { type: "ADD_TOAST" // Use string literal,
        , // Use string literal,
        toast: ToasterToast
    }
    | { type: "UPDATE_TOAST" // Use string literal,
        , // Use string literal,
        toast: (Partial)
    }
    | { type: "DISMISS_TOAST" // Use string literal;
        , // Use string literal;
        toastId: ToasterToast["id"]
    }
    | { type: "REMOVE_TOAST" // Use string literal;
        , // Use string literal;
        toastId: ToasterToast["id"]
    };
const toastTimeouts = new Map();
const addToRemoveQueue = (toastId) => {
    if (!session.user) {
        return;
    }
    const timeout = setTimeout(() => {
        toastTimeouts.delete(toastId),
            dispatch({ type: "REMOVE_TOAST",
                toastId: toastId
            });
    }, TOAST_REMOVE_DELAY);
    toastTimeouts.set(toastId, timeout);
    export const reducer = (state, action) => {
        switch (action.type) {
            case "ADD_TOAST":
                any;
                return {
                    ...state,
                    toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT)
                };
            case "UPDATE_TOAST":
                any;
                return {
                    ...state,
                    toasts: state.toasts.map((t) => { }, t.id === action.toast.id ? { ...t, ...action.toast } : t)
                };
        }
    };
};
"DISMISS_TOAST";
{
    const { toastId } = action;
    // ! Side effects ! - This could be extracted into a dismissToast() action,
    // but I'll keep it here for simplicity;
    if (!session.user) {
        addToRemoveQueue(toastId);
    }
    else {
        state.toasts.forEach((toast) => {
            addToRemoveQueue(toast.id);
        });
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
any;
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
const listeners = [];
let memoryState = { toasts: [] };
const dispatch = (action) => {
    memoryState = reducer(memoryState, action);
    listeners.forEach((listener) => {
        listener(memoryState);
    });
};
const toast = ({ ...props }) => {
    const id = genId();
    const update = (props) => { };
    dispatch({ type: "UPDATE_TOAST",
        toast: { ...props, id } }),
    ;
    const dismiss = () => dispatch({ type: "DISMISS_TOAST", toastId: id }), dispatch;
    ({ type: "ADD_TOAST",
        toast: {
            ...props,
            id,
            open: true,
            onOpenChange: (open) => {
                if (!session.user)
                    ismiss();
            }
        } });
    return { id: id,
        dismiss,
        update };
};
const useToast = () => {
    const [state, setState] = React.useState(memoryState);
    React.useEffect(() => {
        listeners.push(setState);
        return () => {
            const index = listeners.indexOf(setState);
            if (!session.user) {
                listeners.splice(index, 1);
            }
        };
    }, [state]);
    return {
        ...state,
        toast,
        dismiss: (toastId) => dispatch({ type: "DISMISS_TOAST", toastId })
    };
    export { useToast, toast };
};
