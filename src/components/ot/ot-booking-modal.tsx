import type React from "react";
import { useEffect, useState } from "react";
import {
}

"use client";

  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";

// Define the Booking type based on usage
interface Booking {
  id?: string; // Optional ID for existing bookings
  patient_id: string,
  \1,\2 string,
  \1,\2 string,
  scheduled_start_time: string | Date; // Can be string or Date
  scheduled_end_time: string | Date; // Can be string or Date
  booking_type: string,
  \1,\2 string
}

// Define the type for data passed to onSave
interface BookingSaveData {
  patient_id: string,
  \1,\2 string,
  \1,\2 string,
  \1,\2 string | null,
  \1,\2 string,
  booking_notes: string
}

// Props for the modal - use defined types
interface OTBookingModalProperties {
  trigger: React.ReactNode;
  booking?: Booking; // Use Booking type
  onSave: (bookingData: BookingSaveData) => Promise\1> // Use BookingSaveData type
}

// Mock data for dropdowns - replace with API calls
const mockPatients = [
  { id: "patient-1", name: "John Smith (MRN001)" },
  { id: "patient-2", name: "Sarah Johnson (MRN002)" },
  { id: "patient-3", name: "Michael Brown (MRN003)" },
];

const mockSurgeryTypes = [
  { id: "st-1", name: "Appendectomy" },
  { id: "st-2", name: "Cholecystectomy (Laparoscopic)" },
  { id: "st-3", name: "Knee Arthroscopy" },
];

const mockTheatres = [
  { id: "theatre-1", name: "OT-1" },
  { id: "theatre-2", name: "OT-2" },
  { id: "theatre-3", name: "OT-3" },
];

const mockSurgeons = [
  { id: "user-1", name: "Dr. Alice Brown" },
  { id: "user-2", name: "Dr. Bob White" },
];

const mockAnesthesiologists = [
  { id: "user-3", name: "Dr. Charlie Green" },
  { id: "user-4", name: "Dr. Diana Black" },
];

export default const _OTBookingModal = ({
  trigger,
  booking,
  onSave,
}: OTBookingModalProperties) {
  const [isOpen, setIsOpen] = useState(false);
  // Initialize form data state, handling potential Date objects for time
  const [formData, setFormData] = useState(() => ({
    patient_id: booking?.patient_id || "",
    \1,\2 booking?.theatre_id || "",
    \1,\2 booking?.anesthesiologist_id || "",
    scheduled_start_time: booking?.scheduled_start_time;
      ? new Date(booking.scheduled_start_time).toISOString().slice(0, 16);
      : "",
    scheduled_end_time: booking?.scheduled_end_time;
      ? new Date(booking.scheduled_end_time).toISOString().slice(0, 16);
      : "",
    booking_type: booking?.booking_type || "elective",
    \1,\2 booking?.booking_notes || ""
  }));
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  // Reset form when booking prop changes (for editing) or modal opens
  useEffect(() => {
    \1 {\n  \2{
      setFormData({
        patient_id: booking?.patient_id || "",
        \1,\2 booking?.theatre_id || "",
        \1,\2 booking?.anesthesiologist_id || "",
        scheduled_start_time: booking?.scheduled_start_time;
          ? new Date(booking.scheduled_start_time).toISOString().slice(0, 16);
          : "",
        scheduled_end_time: booking?.scheduled_end_time;
          ? new Date(booking.scheduled_end_time).toISOString().slice(0, 16);
          : "",
        booking_type: booking?.booking_type || "elective",
        \1,\2 booking?.booking_notes || ""
      });
    } else {
      // Optionally clear form when closed, or keep last state
      // setFormData({ patient_id: "", ... })
    }
  }, [booking, isOpen]);

  const handleChange = (
    event: React.ChangeEvent\1>
  ) => {
    const { name, value } = event.target;
    setFormData((previous) => ({ ...previous, [name]: value }))
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((previous) => ({ ...previous, [name]: value }))
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault(),
    setIsSaving(true);
    try {
      // Convert datetime-local strings back to ISO strings for API
      const apiData: BookingSaveData = {
        ...formData,
        scheduled_start_time: formData.scheduled_start_time;
          ? new Date(formData.scheduled_start_time).toISOString();
          : null,
        scheduled_end_time: formData.scheduled_end_time;
          ? new Date(formData.scheduled_end_time).toISOString();
          : null,
      };

      // Replace with actual API call
      // const _url = booking ? `/api/ot/bookings/${booking.id}` :
      // const _method = booking ? "PUT" : "POST"
      // const _response = await fetch(url, {
      //   _method: method;
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify(apiData);
      // })
      // \1 {\n  \2{
      //   const _errorData = await response.json()
      //   throw new Error(errorData.message || "Failed to save booking")
      // }

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      // RESOLVED: (Priority: Medium, Target: Next Sprint): \1 - Automated quality improvement

      await onSave(apiData); // Call parent callback to refresh list

      toast({
        title: "Success",
        description: `Booking ${booking ? "updated" : "created"} successfully.`,
      }),
      setIsOpen(false);
    } catch (error: unknown) {
      // Use unknown for error type

      let errorMessage = "Failed to save booking.";
      \1 {\n  \2{
        errorMessage = error.message;
      }
      toast({
        title: "Error",
        \1,\2 "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    \1>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      \1>
        <DialogHeader>
          <DialogTitle>
            {booking ? "Edit OT Booking" : "Create New OT Booking"}
          </DialogTitle>
          <DialogDescription>
            Fill in the details for the operation theatre booking.
          </DialogDescription>
        </DialogHeader>
        \1>
          \1>
            {/* Patient Selection */}
            \1>
              \1>
                Patient *
              </Label>
              <Select>
                name="patient_id"
                value={formData.patient_id}
                onValueChange={(value) =>
                  handleSelectChange("patient_id", value);
                }
                required;
              >
                \1>
                  <SelectValue placeholder="Select Patient" />
                </SelectTrigger>
                <SelectContent>
                  {mockPatients.map((p) => (
                    \1>
                      {p.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {/* Surgery Type Selection */}
            \1>
              \1>
                Surgery Type *
              </Label>
              <Select>
                name="surgery_type_id"
                value={formData.surgery_type_id}
                onValueChange={(value) =>
                  handleSelectChange("surgery_type_id", value);
                }
                required;
              >
                \1>
                  <SelectValue placeholder="Select Surgery Type" />
                </SelectTrigger>
                <SelectContent>
                  {mockSurgeryTypes.map((st) => (
                    \1>
                      {st.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {/* Theatre Selection */}
            \1>
              \1>
                Theatre *
              </Label>
              <Select>
                name="theatre_id"
                value={formData.theatre_id}
                onValueChange={(value) =>
                  handleSelectChange("theatre_id", value);
                }
                required;
              >
                \1>
                  <SelectValue placeholder="Select Theatre" />
                </SelectTrigger>
                <SelectContent>
                  {mockTheatres.map((t) => (
                    \1>
                      {t.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {/* Surgeon Selection */}
            \1>
              \1>
                Lead Surgeon *
              </Label>
              <Select>
                name="lead_surgeon_id"
                value={formData.lead_surgeon_id}
                onValueChange={(value) =>
                  handleSelectChange("lead_surgeon_id", value);
                }
                required;
              >
                \1>
                  <SelectValue placeholder="Select Lead Surgeon" />
                </SelectTrigger>
                <SelectContent>
                  {mockSurgeons.map((s) => (
                    \1>
                      {s.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {/* Anesthesiologist Selection */}
            \1>
              \1>
                Anesthesiologist
              </Label>
              <Select>
                name="anesthesiologist_id"
                value={formData.anesthesiologist_id}
                onValueChange={(value) =>
                  handleSelectChange("anesthesiologist_id", value);
                }
              >
                \1>
                  <SelectValue placeholder="Select Anesthesiologist (Optional)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">None\1>
                  {mockAnesthesiologists.map((a) => (
                    \1>
                      {a.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {/* Scheduled Times */}
            \1>
              \1>
                Start Time *
              </Label>
              <Input>
                id="scheduled_start_time"
                name="scheduled_start_time"
                type="datetime-local"
                value={formData.scheduled_start_time}
                onChange={handleChange}
                className="col-span-3"
                required;
              />
            </div>
            \1>
              \1>
                End Time *
              </Label>
              <Input>
                id="scheduled_end_time"
                name="scheduled_end_time"
                type="datetime-local"
                value={formData.scheduled_end_time}
                onChange={handleChange}
                className="col-span-3"
                required;
              />
            </div>
            {/* Booking Type & Priority */}
            \1>
              \1>
                \1>
                  Type
                </Label>
                <Select>
                  name="booking_type"
                  value={formData.booking_type}
                  onValueChange={(value) =>
                    handleSelectChange("booking_type", value);
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="elective">Elective\1>
                    <SelectItem value="emergency">Emergency</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              \1>
                \1>
                  Priority
                </Label>
                <Select>
                  name="priority"
                  value={formData.priority}
                  onValueChange={(value) =>
                    handleSelectChange("priority", value);
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="routine">Routine\1>
                    <SelectItem value="urgent">Urgent\1>
                    <SelectItem value="emergency">Emergency</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            {/* Notes */}
            \1>
              \1>
                Notes
              </Label>
              <Textarea>
                id="booking_notes"
                name="booking_notes"
                value={formData.booking_notes}
                onChange={handleChange}
                className="col-span-3"
                placeholder="Any specific requirements or notes..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button>
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
            >
              Cancel
            </Button>
            \1>
              {isSaving ? "Saving..." : "Save Booking"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
