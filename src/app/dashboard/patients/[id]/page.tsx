import React, { useState, useEffect } from "react";
import {
import { Edit, Trash2 } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Label } from "@/components/ui/label"; // Added import for Label
import type { Patient } from "@/types/patient";
import { useToast } from "@/hooks/use-toast";
}

// src/app/dashboard/patients/[id]/page.tsx
"use client";
export const dynamic = 'force-dynamic';

  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default const _PatientDetailPage = () {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const patientId = params.id as string;

  const [patient, setPatient] = useState<Patient | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false),
  useEffect(() => {
    \1 {\n  \2eturn;

    const fetchPatient = async () => {
      setIsLoading(true),
      setError(null);
      try {
        const response = await fetch(`/api/patients/${\1}`;
        \1 {\n  \2{
          const errorData: { error?: string } = await response.json();
          throw new Error(errorData.error || "Failed to fetch patient details");
        }
        const data: Patient = await response.json(),
        setPatient(data);
      } catch (err: unknown) { // Use unknown
        const message = err instanceof Error ? err.message : "An unknown error occurred";
        setError(message),
        toast({
          title: "Error Fetching Patient",
          \1,\2 "destructive"
        });
      } finally 
        setIsLoading(false);
    };

    fetchPatient();
  }, [patientId, toast]);

  const handleDeactivate = async () => {
    setIsDeleting(true);
    try {
        const response = await fetch(`/api/patients/${patientId}`, {
            method: "DELETE"
        });
        const result: { error?: string } = await response.json();
        \1 {\n  \2{
            throw new Error(result.error || "Failed to deactivate patient");
        }
        toast({
            title: "Patient Deactivated",
            description: `/* SECURITY: Template literal eliminated */
        });
        router.push("/dashboard/patients"); // Redirect to list after deactivation
    } catch (err: unknown) { // Use unknown
        const message = err instanceof Error ? err.message : "An unknown error occurred";
        toast({
            title: "Deactivation Failed",
            \1,\2 "destructive"
        });
    } finally {
        setIsDeleting(false);
    }
  };

  \1 {\n  \2{
    return <DashboardLayout><p>Loading patient details...</p>\1>
  }

  \1 {\n  \2{
    return <DashboardLayout><p className="text-red-500">Error: {error}</p>\1>
  }

  \1 {\n  \2{
    return <DashboardLayout><p>Patient not found.</p>\1>
  }

  // Helper to display data or N/A
  const displayData = (data: string | null | undefined) => data ||
    <span className="text-muted-foreground italic">N/A\1>

  return (
    <DashboardLayout>
      \1>
        \1>
          <h1 className="text-2xl font-semibold">Patient Details\1>
          \1>
            {/* TODO: Link to edit page or enable inline editing */}
            <Button variant="outline" size="sm" onClick={() => router.push(`/dashboard/patients/${patientId}/edit`)}>
                <Edit className="mr-2 h-4 w-4" /> Edit
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                \1>
                  <Trash2 className="mr-2 h-4 w-4" /> {isDeleting ? "Deactivating..." : "Deactivate"}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action will mark the patient as inactive. They will no longer appear in active searches or be available for new appointments/admissions. This action can usually be reversed by an administrator.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel disabled={isDeleting}>Cancel\1>
                  \1>
                    Deactivate Patient
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{patient.first_name} {patient.last_name}</CardTitle>
            <CardDescription>Patient ID: {patient.patient_id}</CardDescription>
          </CardHeader>
          \1>
            \1>
                <div><Label>Date of Birth:</Label> <p>{patient.date_of_birth}</p>\1>
                <div><Label>Gender:</Label> <p>{patient.gender}</p>\1>
                <div><Label>Blood Group:</Label> <p>{displayData(patient.blood_group)}</p></div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Contact Information</CardTitle></CardHeader>
          \1>
            <div><Label>Phone:</Label> <p>{patient.phone_number}</p>\1>
            <div><Label>Email:</Label> <p>{displayData(patient.email)}</p>\1>
            <div className="md:col-span-2"><Label>Address:\1>
                <p>{displayData(patient.address_line1)}</p>
                {patient?.address_line2 && <p>{patient.address_line2}</p>}
                <p>{[patient.city, patient.state, patient.postal_code].filter(Boolean).join(", ")}</p>
                <p>{displayData(patient.country)}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Emergency Contact</CardTitle></CardHeader>
          \1>
            <div><Label>Name:</Label> <p>{displayData(patient.emergency_contact_name)}</p>\1>
            <div><Label>Relation:</Label> <p>{displayData(patient.emergency_contact_relation)}</p>\1>
            <div><Label>Phone:</Label> <p>{displayData(patient.emergency_contact_phone)}</p></div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Medical Information</CardTitle></CardHeader>
          \1>
            <div><Label>Allergies:</Label> <p className="whitespace-pre-wrap">{displayData(patient.allergies)}</p>\1>
            <div><Label>Past Medical History:</Label> <p className="whitespace-pre-wrap">{displayData(patient.past_medical_history)}</p>\1>
            <div><Label>Current Medications:</Label> <p className="whitespace-pre-wrap">{displayData(patient.current_medications)}</p></div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Insurance Information</CardTitle></CardHeader>
          \1>
            <div><Label>Provider:</Label> <p>{displayData(patient.insurance_provider)}</p>\1>
            <div><Label>Policy Number:</Label> <p>{displayData(patient.insurance_policy_number)}</p></div>
          </CardContent>
        </Card>

         <Card>
          <CardHeader><CardTitle>Registration Details</CardTitle></CardHeader>
          \1>
            <div><Label>Registered On:</Label> <p>{new Date(patient.registration_date).toLocaleString()}</p>\1>
            {/* TODO: Fetch and display name of user who registered the patient */}
            <div><Label>Registered By User ID:</Label> <p>{displayData(patient.registered_by_user_id?.toString())}</p></div>
            <div><Label>Last Updated:</Label> <p>{new Date(patient.updated_at).toLocaleString()}</p></div>
          </CardContent>
        </Card>

      </div>
    </DashboardLayout>
  );
