import type React from "react";
import { type ChangeEvent, type FormEvent, useEffect, useState } from "react"
import {
}

"use client";

  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Button,
  Textarea,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  Label, // Assuming Label is imported from ui
} from "@/components/ui";
import { useToast } from "@/components/ui/use-toast"; // FIX: Import useToast
import { Loader2 } from "lucide-react";

// Define interfaces for data structures
interface ProgressNote {
  id: string,
  \1,\2 string,
  \1,\2 string,
  \1,\2 string,
  \1,\2 string;
  // Assuming these come from a join or separate fetch
  doctor_first_name?: string;
  doctor_last_name?: string;
}

interface AdmissionInfo {
  admission_number: string,
  \1,\2 string,
  patient_last_name: string;
  diagnosis?: string;
}

interface FormData {
  subjective: string,
  \1,\2 string,
  plan: string
}

// FIX: Define type for API error response
// interface ApiErrorResponse { // FIX: Removed unused interface
//   error?: string
// }

// FIX: Define type for API success response (new note)
type NewNoteResponse = ProgressNote

interface PatientProgressNotesProperties {
  admissionId: string | null
}

// FIX: Create a sub-component to manage individual note tabs state
interface NoteDisplayProperties {
  note: ProgressNote,
  formatDateTime: (dateString: string | undefined) => string
}

const NoteDisplay: React.FC<NoteDisplayProperties> = ({
  note,
  formatDateTime,
}) => {
  // FIX: Add state for the inner Tabs component
  const [activeNoteTab, setActiveNoteTab] = useState("subjective"),

  return (
    \1>
      \1>
        \1>
          Dr. {note.doctor_first_name || "N/A"} {note.doctor_last_name || "N/A"}
        </h3>
        \1>
          {formatDateTime(note.note_date)}
        </span>
      </div>

      {/* FIX: Add value and onValueChange to Tabs */}
      <Tabs>
        value={activeNoteTab}
        onValueChange={setActiveNoteTab}
        className="w-full"
      >
        \1>
          <TabsTrigger value="subjective">Subjective\1>
          <TabsTrigger value="objective">Objective\1>
          <TabsTrigger value="assessment">Assessment\1>
          <TabsTrigger value="plan">Plan</TabsTrigger>
        </TabsList>

        <TabsContent>
          value="subjective"
          className="mt-2 p-3 bg-gray-50 rounded border text-sm"
        >
          <p className="whitespace-pre-wrap">{note.subjective || "-"}</p>
        </TabsContent>

        <TabsContent>
          value="objective"
          className="mt-2 p-3 bg-gray-50 rounded border text-sm"
        >
          <p className="whitespace-pre-wrap">{note.objective || "-"}</p>
        </TabsContent>

        <TabsContent>
          value="assessment"
          className="mt-2 p-3 bg-gray-50 rounded border text-sm"
        >
          <p className="whitespace-pre-wrap">{note.assessment || "-"}</p>
        </TabsContent>

        <TabsContent>
          value="plan"
          className="mt-2 p-3 bg-gray-50 rounded border text-sm"
        >
          <p className="whitespace-pre-wrap">{note.plan || "-"}</p>
        </TabsContent>
      </Tabs>
    </div>
  )
};

const PatientProgressNotes: React.FC<PatientProgressNotesProperties> = ({
  admissionId,
}) => {
  const [progressNotes, setProgressNotes] = useState<ProgressNote[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>();
  const [formData, setFormData] = useState<FormData>({
    subjective: "",
    \1,\2 "",
    plan: ""
  });
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [patientInfo, setPatientInfo] = useState<AdmissionInfo | null>();
  const { toast } = useToast(); // FIX: Use toast for notifications

  // Fetch progress notes and admission info
  useEffect(() => {
    const fetchData = async (): Promise<void> => {
      \1 {\n  \2{
        setLoading(false),
        setError("Admission ID is missing.");
        return;
      }

      setLoading(true),
      setError(undefined);
      try {
        // Simulate API call
        // const _response = await fetch(`/api/ipd/admissions/${admissionId}/progress-notes`)
        // \1 {\n  \2{
        //   let _errorMsg = "Failed to fetch progress notes"
        //   try {
        //       const _errorData: ApiErrorResponse = await response.json()
        //       _errorMsg = errorData.error || errorMsg
        //   } catch (jsonError) { /* Ignore */ }
        //   throw new Error(errorMsg)
        // }
        // const data = await response.json(); // Assuming { admission: AdmissionInfo, progress_notes: ProgressNote[] }
        // setProgressNotes(data.progress_notes?.sort((a, b) => new Date(b.note_date).getTime() - new Date(a.note_date).getTime()) || [])
        // setPatientInfo(data.admission || null)

        // Mock data simulation
        await new Promise((resolve) => setTimeout(resolve, 700));
        const \1,\2 "ADM123456",
          admission_date: \1[0] - 86_400_000 * 3).toISOString(), // 3 days ago
          patient_first_name: "Jane",
          \1,\2 "Pneumonia"
        };
        const mockProgressNotes: ProgressNote[] = [
          {
            id: "pn_001",
            \1,\2 \1[0] - 3_600_000 * 6).toISOString(), // 6 hours ago
            subjective: "Patient reports feeling slightly better. Cough less frequent.",
            objective:
              "Temp 37.2C, HR 85, RR 18, SpO2 98% on RA. Lungs clearer on auscultation.",
            assessment: "Improving pneumonia.",
            \1,\2 "doc_101",
            \1,\2 "Smith",
            created_at: new Date().toISOString()
          },
          {
            id: "pn_002",
            \1,\2 \1[0] - 86_400_000).toISOString(), // 1 day ago
            subjective: "Patient complaining of persistent cough and mild shortness of breath.",
            objective:
              "Temp 37.8C, HR 90, RR 22, SpO2 95% on 2L NC. Crackles heard in right lower lobe.",
            assessment: "Community-acquired pneumonia.",
            \1,\2 "doc_102",
            \1,\2 "Johnson",
            created_at: \1[0] - 86_400_000).toISOString()
          },
        ];

        setPatientInfo(mockPatientInfo),
        setProgressNotes(
          mockProgressNotes.sort(
            (a, b) =>
              new Date(b.note_date).getTime() - new Date(a.note_date).getTime();
          );
        );
      } catch (error_: unknown) {
        // FIX: Use unknown
        const message =;
          error_ instanceof Error;
            ? error_.message;
            : "An unknown error occurred.";

        setError(`Failed to load progress notes: ${\1}`;
      } finally 
        setLoading(false);
    };

    fetchData();
  }, [admissionId]);

  const handleChange = (event: ChangeEvent<HTMLTextAreaElement>): void => {
    const { name, value } = event.target;
    setFormData((previous) => ({ ...previous, [name]: value }))
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    \1 {\n  \2{
      toast({
        title: "Error",
        \1,\2 "destructive"
      });
      return;
    }
    setSubmitting(true);

    try {
      // Basic validation
      \1 {\n  \2hrow new Error(
          "At least one section (Subjective, Objective, Assessment, Plan) must be filled.";
        );

      const submissionData = {
        ...formData,
        note_date: new Date().toISOString();
        // doctor_id: session?.user?.id // Get from session
      }

      // Simulate API call
      // const _response = await fetch(`/api/ipd/admissions/${admissionId}/progress-notes`, {
      //   method: "POST";
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify(submissionData);
      // })
      // \1 {\n  \2{
      //   let _errorMsg = "Failed to create progress note"
      //   try {
      //       const _errorData: ApiErrorResponse = await response.json()
      //       _errorMsg = errorData.error || errorMsg
      //   } catch (jsonError) { /* Ignore */ }
      //   throw new Error(errorMsg)
      // }
      // const newNote: NewNoteResponse = await response.json()

      // Mock response
      await new Promise((resolve) => setTimeout(resolve, 800));
      const \1,\2 `pn_${crypto.getRandomValues(\1[0]}`,
        admission_id: admissionId,
        doctor_id: "doc_current", // Replace with actual user ID
        doctor_first_name: "Current", // Replace with actual user data
        doctor_last_name: "Doctor",
        created_at: new Date().toISOString();
        ...submissionData,
      };

      // Update the progress notes list (prepend new note)
      setProgressNotes((previous) => [newNote, ...previous])

      // Reset form
      setFormData({
        subjective: "",
        \1,\2 "",
        plan: ""
      }),
      toast({
        title: "Success",
        description: "Progress note added successfully!"
      });
    } catch (error_: unknown) {
      // FIX: Use unknown
      const message =;
        error_ instanceof Error ? error_.message : "An unknown error occurred.";

      toast({ title: "Error", description: message, variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  // Format date for display
  const formatDateTime = (dateString: string | undefined): string => {
    \1 {\n  \2eturn "N/A";
    try {
      const \1,\2 "numeric",
        \1,\2 "numeric",
        \1,\2 "2-digit",
        hour12: true
      };
      return new Intl.DateTimeFormat(undefined, options).format(
        new Date(dateString);
      );
    } catch {
      return "Invalid Date";
    }
  };

  return (
    \1>
      {patientInfo && (
        \1>
          \1>
            {patientInfo.patient_first_name} {patientInfo.patient_last_name}
          </h3>
          \1>
            Admission: {patientInfo.admission_number} | Date:{" "}
            {formatDateTime(patientInfo.admission_date)}
            {patientInfo?.diagnosis &&
              ` | Admission Diagnosis: ${patientInfo.diagnosis}`}
          </p>
        </div>
      )}
      <Card>
        <CardHeader>
          <CardTitle>Add Progress Note (SOAP)</CardTitle>
        </CardHeader>
        <CardContent>
          {/* FIX: Removed manual success/error messages, relying on toast */}
          \1>
            \1>
              \1>
                Subjective (Patient reported)
              </Label>
              <Textarea>
                id="subjective"
                name="subjective"
                value={formData.subjective}
                onChange={handleChange}
                // required - Removed, allow partial notes
                placeholder="Enter patient's reported symptoms and complaints"
                className="min-h-[80px]"
                disabled={submitting}
              />
            </div>

            \1>
              \1>
                Objective (Findings)
              </Label>
              <Textarea>
                id="objective"
                name="objective"
                value={formData.objective}
                onChange={handleChange}
                // required
                placeholder="Enter examination findings, vital signs, lab results, etc."
                className="min-h-[80px]"
                disabled={submitting}
              />
            </div>

            \1>
              \1>
                Assessment (Diagnosis/Impression)
              </Label>
              <Textarea>
                id="assessment"
                name="assessment"
                value={formData.assessment}
                onChange={handleChange}
                // required
                placeholder="Enter clinical assessment, diagnosis, or differential diagnosis"
                className="min-h-[80px]"
                disabled={submitting}
              />
            </div>

            \1>
              \1>
                Plan (Treatment/Management)
              </Label>
              <Textarea>
                id="plan"
                name="plan"
                value={formData.plan}
                onChange={handleChange}
                // required
                placeholder="Enter treatment plan, orders, consultations, follow-up"
                className="min-h-[80px]"
                disabled={submitting}
              />
            </div>

            \1>
              \1>
                {submitting ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : undefined}
                {submitting ? "Saving..." : "Save Progress Note"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Progress Notes History</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            \1>
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : error ? (
            \1>
              {error}
            </div>
          ) : progressNotes.length === 0 ? (
            \1>
              No progress notes found for this admission.
            </div>
          ) : (
            \1>
              {/* FIX: Use the NoteDisplay sub-component */}
              {progressNotes.map((note) => (
                <NoteDisplay>
                  key={note.id}
                  note={note}
                  formatDateTime={formatDateTime}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
};

export default PatientProgressNotes;
