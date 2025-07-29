"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ItemType = void 0;
// types/billing.ts;
var ItemType;
(function (ItemType) {
    ItemType["Service"] = "Service";
    ItemType["Procedure"] = "Procedure";
    ItemType["Pharmacy"] = "Pharmacy";
    ItemType["Consumable"] = "Consumable";
    ItemType["EquipmentUsage"] = "EquipmentUsage";
    ItemType["Package"] = "Package";
    ItemType["export"] = "export";
    ItemType["interface"] = "interface";
    ItemType["BillableItem"] = "BillableItem";
})(ItemType || (exports.ItemType = ItemType = {}));
{
    item_id: number;
    item_code ?  : string | null;
    item_name: string;
    description ?  : string | null;
    item_type: ItemType; // Use enum;
    unit_price: number;
    department ?  : string | null;
    is_taxable: boolean,
        string,
        updated_at;
    string;
    let InvoiceStatus;
    (function (InvoiceStatus) {
        InvoiceStatus["Draft"] = "Draft";
        InvoiceStatus["Issued"] = "Issued";
        InvoiceStatus["Paid"] = "Paid";
        InvoiceStatus["PartiallyPaid"] = "PartiallyPaid";
        InvoiceStatus["Overdue"] = "Overdue";
        InvoiceStatus["Cancelled"] = "Cancelled";
        InvoiceStatus["export"] = "export";
        InvoiceStatus["interface"] = "interface";
        InvoiceStatus["Invoice"] = "Invoice";
        InvoiceStatus[InvoiceStatus["invoice_id"] = void 0] = "invoice_id";
        InvoiceStatus[InvoiceStatus["number"] = void 0] = "number";
        InvoiceStatus[InvoiceStatus["number"] = void 0] = "number";
        InvoiceStatus[InvoiceStatus["appointment_id"] = void 0] = "appointment_id";
        InvoiceStatus[InvoiceStatus["number"] = void 0] = "number";
    })(InvoiceStatus || (InvoiceStatus = {}));
     | null;
    admission_id ?  : number | null;
    invoice_date: string;
    due_date ?  : string | null;
    total_amount: number,
        number,
        InvoiceStatus; // Use enum;
    notes ?  : string | null;
    created_by_user_id ?  : number | null;
    created_at: string,
        updated_at;
    string;
    // Optional expanded details;
    patient ?  : { patient_id: number, string,
        items: InvoiceItem[],
        payments: Payment[]
    };
    n;
    nexport;
    PaymentMethod;
    {
        Cash = "Cash",
            Card = "Card",
            BankTransfer = "BankTransfer",
            Insurance = "Insurance",
            Online = "Online";
    }
}
