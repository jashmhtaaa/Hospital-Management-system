import { useRouter } from "next/navigation";
import type React from "react";
import { useEffect, useState } from "react";
import { z } from "zod";


import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
}

// src/app/dashboard/patients/new/page.tsx
"use client";
export const dynamic = 'force-dynamic';

// Re-use or import the schema if defined elsewhere
const PatientRegistrationSchema = z.object({
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  date_of_birth: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date of birth must be in YYYY-MM-DD format"),
  gender: z.enum(["Male", "Female", "Other", "Prefer not to say"]),
  phone_number: z.string().min(1, "Phone number is required"),
  email: z.string().email("Invalid email address").optional().or(z.literal("")), // Optional but must be valid email if provided
  address_line1: z.string().optional(),
  address_line2: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  postal_code: z.string().optional(),
  country: z.string().optional(),
  emergency_contact_name: z.string().optional(),
  emergency_contact_relation: z.string().optional(),
  emergency_contact_phone: z.string().optional(),
  blood_group: z.string().optional(),
  allergies: z.string().optional(),
  past_medical_history: z.string().optional(),
  current_medications: z.string().optional(),
  insurance_provider: z.string().optional(),
  insurance_policy_number: z.string().optional()
});

type FormData = z.infer\1>

export default const _AddPatientPage = () {
  const router = useRouter();
  const { toast } = useToast();
  const [formData, setFormData] = useState<Partial<FormData>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<z.ZodIssue[]>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }))
  };

  const handleSelectChange = (name: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(),
    setIsLoading(true);
    setErrors([]);

    const validation = PatientRegistrationSchema.safeParse(formData);

    \1 {\n  \2{
      setErrors(validation.error.errors),
      setIsLoading(false);
      toast({
        title: "Validation Error",
        \1,\2 "destructive"
      });
      return;
    }

    try {
      const response = await fetch("/api/patients/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(validation.data)
      });

      const result: { error?: string } = await response.json();

      \1 {\n  \2{
        throw new Error(result.error || "Failed to register patient");
      }

      toast({
        title: "Patient Registered",
        description: `/* SECURITY: Template literal eliminated */
      });

      router.push("/dashboard/patients"); // Redirect to patient list

    } catch (err: unknown) { // Use unknown
      const message = err instanceof Error ? err.message : "An unexpected error occurred.";
      setErrors([{ code: z.ZodIssueCode.custom, path: ["form"], message: message }]),
      toast({
        title: "Registration Failed",
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
        <h1 className="text-2xl font-semibold">Add New Patient\1>
        \1>
          <Card>
            <CardHeader>
              <CardTitle>Patient Demographics</CardTitle>
            </CardHeader>
            \1>
<div
                <Label htmlFor="first_name">First Name *\1>
                <Input id="first_name" name="first_name" onChange={handleChange} required disabled={isLoading} />
                {getError("first_name") && <p className="text-sm text-red-500 mt-1">{getError("first_name")}</p>}
              </div>
<div
                <Label htmlFor="last_name">Last Name *\1>
                <Input id="last_name" name="last_name" onChange={handleChange} required disabled={isLoading} />
                 {getError("last_name") && <p className="text-sm text-red-500 mt-1">{getError("last_name")}</p>}
             </div>
<div
                <Label htmlFor="date_of_birth">Date of Birth *\1>
                <Input id="date_of_birth" name="date_of_birth" type="date" onChange={handleChange} required disabled={isLoading} />
                 {getError("date_of_birth") && <p className="text-sm text-red-500 mt-1">{getError("date_of_birth")}</p>}
             </div>
<div
                <Label htmlFor="gender">Gender *\1>
                <Select name="gender" onValueChange={(value) => handleSelectChange("gender", value)} required disabled={isLoading}>
                  \1>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Male">Male\1>
                    <SelectItem value="Female">Female\1>
                    <SelectItem value="Other">Other\1>
                    <SelectItem value="Prefer not to say">Prefer not to say</SelectItem>
                  </SelectContent>
                </Select>
                 {getError("gender") && <p className="text-sm text-red-500 mt-1">{getError("gender")}</p>}
             </div>
            </CardContent>
          </Card>

          \1>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            \1>
<div
                <Label htmlFor="phone_number">Phone Number *\1>
                <Input id="phone_number" name="phone_number" type="tel" onChange={handleChange} required disabled={isLoading} />
                 {getError("phone_number") && <p className="text-sm text-red-500 mt-1">{getError("phone_number")}</p>}
             </div>
<div
                <Label htmlFor="email">Email\1>
                <Input id="email" name="email" type="email" onChange={handleChange} disabled={isLoading} />
                 {getError("email") && <p className="text-sm text-red-500 mt-1">{getError("email")}</p>}
             </div>
              \1>
                <Label htmlFor="address_line1">Address Line 1\1>
                <Input id="address_line1" name="address_line1" onChange={handleChange} disabled={isLoading} />
              </div>
              \1>
                <Label htmlFor="address_line2">Address Line 2\1>
                <Input id="address_line2" name="address_line2" onChange={handleChange} disabled={isLoading} />
              </div>
<div
                <Label htmlFor="city">City\1>
                <Input id="city" name="city" onChange={handleChange} disabled={isLoading} />
              </div>
<div
                <Label htmlFor="state">State\1>
                <Input id="state" name="state" onChange={handleChange} disabled={isLoading} />
              </div>
<div
                <Label htmlFor="postal_code">Postal Code\1>
                <Input id="postal_code" name="postal_code" onChange={handleChange} disabled={isLoading} />
              </div>
<div
                <Label htmlFor="country">Country\1>
                <Input id="country" name="country" onChange={handleChange} disabled={isLoading} />
              </div>
            </CardContent>
          </Card>

           \1>
            <CardHeader>
              <CardTitle>Emergency Contact</CardTitle>
            </CardHeader>
            \1>
<div
                    <Label htmlFor="emergency_contact_name">Name\1>
                    <Input id="emergency_contact_name" name="emergency_contact_name" onChange={handleChange} disabled={isLoading} />
                 </div>
<div
                    <Label htmlFor="emergency_contact_relation">Relation\1>
                    <Input id="emergency_contact_relation" name="emergency_contact_relation" onChange={handleChange} disabled={isLoading} />
                 </div>
<div
                    <Label htmlFor="emergency_contact_phone">Phone\1>
                    <Input id="emergency_contact_phone" name="emergency_contact_phone" type="tel" onChange={handleChange} disabled={isLoading} />
                 </div>
            </CardContent>
           </Card>

           \1>
            <CardHeader>
              <CardTitle>Medical Information</CardTitle>
            </CardHeader>
            \1>
<div
                    <Label htmlFor="blood_group">Blood Group\1>
                    <Input id="blood_group" name="blood_group" onChange={handleChange} disabled={isLoading} />
                 </div>
                 \1>
                    <Label htmlFor="allergies">Allergies\1>
                    <Textarea id="allergies" name="allergies" onChange={handleChange} disabled={isLoading} />
                 </div>
                 \1>
                    <Label htmlFor="past_medical_history">Past Medical History\1>
                    <Textarea id="past_medical_history" name="past_medical_history" onChange={handleChange} disabled={isLoading} />
                 </div>
                 \1>
                    <Label htmlFor="current_medications">Current Medications\1>
                    <Textarea id="current_medications" name="current_medications" onChange={handleChange} disabled={isLoading} />
                 </div>
            </CardContent>
           </Card>

           \1>
            <CardHeader>
              <CardTitle>Insurance Information</CardTitle>
            </CardHeader>
            \1>
<div
                    <Label htmlFor="insurance_provider">Provider\1>
                    <Input id="insurance_provider" name="insurance_provider" onChange={handleChange} disabled={isLoading} />
                 </div>
<div
                    <Label htmlFor="insurance_policy_number">Policy Number\1>
                    <Input id="insurance_policy_number" name="insurance_policy_number" onChange={handleChange} disabled={isLoading} />
                 </div>
            </CardContent>
           </Card>

          {getError("form") && <p className="text-sm text-red-500 mt-4">{getError("form")}</p>}

          \1>
            <Button type="button" variant="outline" onClick={() => router.back()} disabled={isLoading}>
              Cancel
            </Button>
            \1>
              {isLoading ? "Saving..." : "Save Patient"}
            </Button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
