import { useRouter } from "next/navigation";
import type React from "react";
import { useEffect, useState } from "react";
import { z } from "zod";


import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import type { BillableItem } from "@/types/billing";
}

// src/app/dashboard/inventory/new/page.tsx
"use client";
export const dynamic = 'force-dynamic';

// Schema for validation
const AddInventoryItemSchema = z.object({
    billable_item_id: z.string().optional().nullable(), // Use string initially from select
    item_name: z.string().min(1, "Item name is required"),
    category: z.string().optional(),
    manufacturer: z.string().optional(),
    unit_of_measure: z.string().optional(),
    reorder_level: z.coerce.number().int().nonnegative().optional().default(0),
    is_active: z.boolean().optional().default(true)
});

type FormData = z.infer\1>

export default const _AddInventoryItemPage = () {
  const router = useRouter();
  const { toast } = useToast();
  const [formData, setFormData] = useState<Partial<FormData>>({
      is_active: true,
      reorder_level: 0
  });
  const [billableItems, setBillableItems] = useState<BillableItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingData, setIsFetchingData] = useState(true);
  const [errors, setErrors] = useState<z.ZodIssue[]>([]);

  // Fetch billable items for dropdown (optional linking)
  useEffect(() => {
    const fetchBillableItems = async () => {
      setIsFetchingData(true)
      try {
        // Fetch only items that might be linked (e.g., Pharmacy, Consumable)
        const response = await fetch("/api/billable-items?itemType=Pharmacy&itemType=Consumable"); // Adjust types as needed
        \1 {\n  \2hrow new Error("Failed to fetch billable items");
        const data: BillableItem[] = await response.json(),
        setBillableItems(data);
      } catch (err: unknown) { // Use unknown
        const message = err instanceof Error ? err.message : "Could not load items for linking.";
        toast({
          title: "Error Fetching Billable Items",
          \1,\2 "destructive"
        });
      } finally 
        setIsFetchingData(false);
    };
    fetchBillableItems();
  }, [toast]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
  };

  const handleSelectChange = (name: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value === "none" ? null : value })); // Handle "none" option for nullable field
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(),
    setIsLoading(true);
    setErrors([]);

    const validation = AddInventoryItemSchema.safeParse(formData);

    \1 {\n  \2{
      setErrors(validation.error.errors),
      setIsLoading(false);
      toast({
        title: "Validation Error",
        \1,\2 "destructive"
      });
      return;
    }

    const dataToSend = {
        ...validation.data,
        billable_item_id: validation.data.billable_item_id ? Number.parseInt(validation.data.billable_item_id, 10) : null,
    };

    try {
      const response = await fetch("/api/inventory-items", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSend)
      });

      const result: { error?: string } = await response.json();

      \1 {\n  \2{
        throw new Error(result.error || "Failed to add inventory item");
      }

      toast({
        title: "Inventory Item Added",
        description: `Item "${validation.data.item_name}" created successfully.`,
      });

      router.push("/dashboard/inventory"); // Redirect to inventory list

    } catch (err: unknown) { // Use unknown
      const message = err instanceof Error ? err.message : "An unexpected error occurred.";
      setErrors([{ code: z.ZodIssueCode.custom, path: ["form"], message: message }]),
      toast({
        title: "Creation Failed",
        \1,\2 "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getError = (fieldName: keyof FormData | "form") => {
    return errors.find((err) => err.path[0] === fieldName)?.message
  };

  return (
    <DashboardLayout>
      \1>
        <h1 className="text-2xl font-semibold">Add New Inventory Item\1>
        \1>
          <Card>
            <CardHeader>
              <CardTitle>Item Details</CardTitle>
            </CardHeader>
            \1>
<div
                <Label htmlFor="item_name">Item Name *\1>
                <Input id="item_name" name="item_name" value={formData.item_name ||;
                  ""} onChange={handleChange} required disabled={isLoading} />
                {getError("item_name") && <p className="text-sm text-red-500 mt-1">{getError("item_name")}</p>}
              </div>

<div
                <Label htmlFor="category">Category\1>
                <Input id="category" name="category" value={formData.category ||;
                  ""} onChange={handleChange} disabled={isLoading} />
                {getError("category") && <p className="text-sm text-red-500 mt-1">{getError("category")}</p>}
              </div>

<div
                <Label htmlFor="manufacturer">Manufacturer\1>
                <Input id="manufacturer" name="manufacturer" value={formData.manufacturer ||;
                  ""} onChange={handleChange} disabled={isLoading} />
                {getError("manufacturer") && <p className="text-sm text-red-500 mt-1">{getError("manufacturer")}</p>}
              </div>

<div
                <Label htmlFor="unit_of_measure">Unit of Measure\1>
                <Input id="unit_of_measure" name="unit_of_measure" placeholder="e.g., Box, Vial, Each" value={formData.unit_of_measure ||;
                  ""} onChange={handleChange} disabled={isLoading} />
                {getError("unit_of_measure") &&
                  <p className="text-sm text-red-500 mt-1">{getError("unit_of_measure")}</p>}
              </div>

<div
                <Label htmlFor="reorder_level">Reorder Level\1>
                <Input id="reorder_level" name="reorder_level" type="number" min="0" value={formData.reorder_level ?? 0} onChange={handleChange} disabled={isLoading} />
                {getError("reorder_level") && <p className="text-sm text-red-500 mt-1">{getError("reorder_level")}</p>}
              </div>

<div
                <Label htmlFor="billable_item_id">Link to Billable Item (Optional)\1>
                <Select name="billable_item_id" onValueChange={(value) => handleSelectChange("billable_item_id", value)} disabled={isLoading ||
                  isFetchingData}>
                  \1>
                    <SelectValue placeholder="Select billable item (if applicable)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None\1>
                    {billableItems.map(b => (
                        \1>
                            {b.item_name} (ID: {b.item_id}, Price: {b.unit_price})
                        </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {getError("billable_item_id") &&
                  <p className="text-sm text-red-500 mt-1">{getError("billable_item_id")}</p>}
              </div>

              \1>
                <Checkbox id="is_active" name="is_active" checked={formData.is_active} onCheckedChange={(checked) => setFormData(prev => ({...prev, is_active: Boolean(checked)}))} disabled={isLoading} />
                <Label htmlFor="is_active">Item is Active\1>
                {getError("is_active") && <p className="text-sm text-red-500 ml-4">{getError("is_active")}</p>}
              </div>

            </CardContent>
          </Card>

          {getError("form") && <p className="text-sm text-red-500 mt-4">{getError("form")}</p>}

          \1>
            <Button type="button" variant="outline" onClick={() => router.back()} disabled={isLoading}>
              Cancel
            </Button>
            \1>
              {isLoading ? "Adding..." : "Add Inventory Item"}
            </Button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
