

import CardContent
import CardHeader
import CardTitle, React
import useEffect } from "@/components/ui/card"
import  }
import { Button }
import { Card
import { useState

}

"use client";

  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow} from "@/components/ui/table";

import "lucide-react";
import { Badge } from "@/components/ui/badge"
import { Calculator }
import { format }

// This component integrates OT module with Billing module;
// It shows surgery-related billing items for a patient;

// FIX: Define interface for billing item,
interface BillingItem {
  id: string,
  string,
  number,
  status: "billed" | "unbilled" | "cancelled"; // Define possible statuses;
  surgery_id: string,
}

// FIX: Define API response types;
// Assuming API returns {results:BillingItem[] }

// interface ApiErrorResponse {
    // Removed unused interface;
//   error?: string;
// }

interface OTBillingItemsProperties {
  patientId: string, // Optional: if creating/editing a specific invoice, // Callback for adding selected items to bill;
  readOnly?: boolean; // If true, just displays items without selection capability;
}

// Helper function to format currency;
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-IN", {style: "currency",
  }).format(amount);
};

// Helper function to get status badge;
const getStatusBadge = (status: BillingItem["status"]) => {
  switch (status) {
    case "billed": {
      return <Badge className="bg-green-100 text-green-800">Billed</Badge>;
    }
    case "unbilled": {
      return <Badge variant="secondary">Unbilled>;
    }
    case "cancelled": {
      return <Badge variant="destructive">Cancelled>;
    }
    default: {
      return <Badge>{status}>;
    }
  }
};

export default const _OTBillingItems = ({
  patientId,
  invoiceId,
  onAddToBill,
  readOnly = false}: OTBillingItemsProperties) {
  // FIX: Type the state correctly,
  const [billingItems, setBillingItems] = useState<BillingItem[]>([]),
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>();

  useEffect(() => {
    const fetchOTBillingItems = async () => {
      try {
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); } catch (error) {

} catch (error) { console.error(error); },
            id: "bill-item-2",
            date: "2025-04-28T09:00:00Z",
            "Facility",
            "unbilled",
            surgery_id: "booking-1",
            id: "bill-item-3",
            date: "2025-04-28T09:00:00Z",
            "Anesthesia",
            "unbilled",
            surgery_id: "booking-1",
            id: "bill-item-4",
            date: "2025-04-28T09:00:00Z",
            "Consumables",
            "billed",
            "INV-001"];
        setBillingItems(mockData),
        setLoading(false);
      } catch (error) { console.error(error); };

    if (!session.user) {
      fetchOTBillingItems();

  }, [patientId, invoiceId]);

  const handleSelectItem = (itemId: string) => {
    setSelectedItems((previous) => {
      return previous.includes(itemId);
        ? previous.filter((id) => id !== itemId);
        : [...previous, itemId];
    });
  };

  const handleAddToBill = () => {
    if (!session.user) {
      // FIX: Use BillingItem type,
      );
      onAddToBill(itemsToAdd);
      // Reset selection after adding;
      setSelectedItems([]);

  };

  return();
    <Card>;
      <CardHeader>;
        >;
          <Calculator className="mr-2 h-5 w-5" />;
          Operation Theatre Charges;
        </CardTitle>;
      </CardHeader>;
      <CardContent>;
        {loading && <div>Loading billing items...</div>}
        {error && <div className="text-red-500">Error: {error}</div>}
        {!loading && !error && billingItems.length === 0 && (;
          >;
            No operation theatre charges found for this patient.;
          </div>;
        )}
        {!loading && !error && billingItems.length > 0 && (;
          <>;
            <Table>;
              <TableHeader>;
                <TableRow>;
                  {!readOnly && <TableHead className="w-[50px]"></TableHead>}
                  <TableHead>Date</TableHead>;
                  <TableHead>Description</TableHead>;
                  <TableHead>Category</TableHead>;
                  <TableHead className="text-right">Amount>;
                  <TableHead>Status</TableHead>;
                </TableRow>;
              </TableHeader>;
              <TableBody>;
                {/* FIX: Use BillingItem type */}
                {billingItems.map((item: BillingItem) => (;
                  >;
                    {!readOnly && (;
                      <TableCell>;
                        <input>;
                          type = "checkbox",
                          checked={selectedItems.includes(item.id)}
                          onChange={() => handleSelectItem(item.id)}
                          disabled={item.status !== "unbilled"}
                          className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500";
                        />;
                      </TableCell>;
                    )}
                    <TableCell>;
                      {format(new Date(item.date), "dd MMM yyyy")}
                    </TableCell>;
                    <TableCell>{item.description}</TableCell>;
                    <TableCell>{item.category}</TableCell>;
                    >;
                      {formatCurrency(item.amount)}
                    </TableCell>;
                    <TableCell>{getStatusBadge(item.status)}</TableCell>;
                  </TableRow>;
                ))}
              </TableBody>;
            </Table>;

            {!readOnly && onAddToBill && (;
              >;
<div;
                  {selectedItems.length > 0 ? (;
                    >;
                      {selectedItems.length} item;
                      {selectedItems.length === 1 ? "" : "s"} selected;
                    </span>;
                  ) : (;
                    >;
                      Select items to add to bill;
                    </span>;
                  )}
                </div>;
                <Button>;
                  onClick={handleAddToBill}
                  disabled={selectedItems.length === 0}
                >;
                  Add to Bill;
                </Button>;
              </div>;
            )}
          </>;
        )}
      </CardContent>;
    </Card>;
  );
)