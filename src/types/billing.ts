// types/billing.ts;

export enum ItemType {
    Service = "Service",
    Procedure = "Procedure",
    Pharmacy = "Pharmacy",
    Consumable = "Consumable",
    EquipmentUsage = "EquipmentUsage",
    Package = "Package",
}

export interface BillableItem {
    item_id: number;
    item_code?: string | null;
    item_name: string;
    description?: string | null;
    item_type: ItemType; // Use enum;
    unit_price: number;
    department?: string | null;
    is_taxable: boolean;
    updated_at: string;
}

export enum InvoiceStatus {
    Draft = "Draft",
    Issued = "Issued",
    Paid = "Paid",
    PartiallyPaid = "PartiallyPaid",
    Overdue = "Overdue",
    Cancelled = "Cancelled",
}

export interface Invoice {
    id?: number;
    invoice_number: string;
    patient_id: number;
    visit_id?: number | null;
    appointment_id?: number | null;
    admission_id?: number | null;
    total_amount: number;
    due_date?: string | null;
    status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
    payment_status: 'unpaid' | 'partial' | 'paid' | 'refunded';
    notes?: string | null;
    created_by_user_id?: number | null;
    created_at: string;
    updated_at: string;
    
    patient?: { patient_id: number; name: string };
    items?: InvoiceItem[];
    payments?: Payment[];
}

export enum PaymentMethod {
    CASH = 'cash',
    CARD = 'card',
    BANK_TRANSFER = 'bank_transfer',
    UPI = 'upi',
    INSURANCE = 'insurance',
}

export interface InvoiceItem {
    id?: number;
    invoice_id: number;
    service_item_id: number;
    description: string;
    quantity: number;
    unit_price: number;
    discount: number;
    total: number;
}

export interface Payment {
    id?: number;
    invoice_id: number;
    amount: number;
    method: PaymentMethod;
    reference_number?: string;
    payment_date: string;
    notes?: string;
}