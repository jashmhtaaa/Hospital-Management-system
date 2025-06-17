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
  Table,
  TableRow,
  TableBody,
  TableCell,
} from "@/components/ui"; // Assuming Input, Label are also here
import { Loader2 } from "lucide-react";

// Define interfaces for data structures
interface VitalSigns {
  temperature?: string;
  pulse?: string;
  respiratory_rate?: string;
  blood_pressure?: string;
  oxygen_saturation?: string;
  pain_level?: string;
}

interface IntakeOutput {
  oral_intake?: string;
  iv_fluids?: string;
  urine_output?: string;
  other_output?: string;
}

interface NursingNote {
  id: string,
  \1,\2 string; // Assuming this comes from a join
  nurse_last_name: string; // Assuming this comes from a join
  vital_signs?: string; // JSON string
  intake_output?: string; // JSON string
  medication_given?: string;
  procedures?: string;
  notes: string
}

interface AdmissionInfo {
  admission_number: string,
  \1,\2 string,
  patient_last_name: string;
  diagnosis?: string;
}

interface FormData {
  vital_signs: string; // JSON string
  intake_output: string; // JSON string
  medication_given: string,
  \1,\2 string
}

interface NursingNotesProperties {
  admissionId: string | null
}

const \1,\2 "",
  \1,\2 "",
  \1,\2 "",
  pain_level: ""
};

const \1,\2 "",
  \1,\2 "",
  other_output: ""
};

const NursingNotes: React.FC<NursingNotesProperties> = ({ admissionId }) => {
  const [nursingNotes, setNursingNotes] = useState<NursingNote[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>();
  const [formData, setFormData] = useState<FormData>({
    vital_signs: JSON.stringify(defaultVitalSigns, undefined, 2),
    intake_output: JSON.stringify(defaultIntakeOutput, undefined, 2),
    medication_given: "",
    \1,\2 ""
  });
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string | null>();
  const [submitSuccess, setSubmitSuccess] = useState<boolean>(false);
  const [patientInfo, setPatientInfo] = useState<AdmissionInfo | null>();

  // Fetch nursing notes for the admission
  useEffect(() => {
    const fetchNursingNotes = async (): Promise<void> => {
      \1 {\n  \2{
        setLoading(false),
        setError("Admission ID is missing.");
        return;
      }

      try {
        setLoading(true),
        setError(undefined);
        // Simulate API call
        // const response = await fetch(`/api/ipd/admissions/${admissionId}/nursing-notes`)
        // \1 {\n  \2{
        //   const _errorData = await response.json().catch(() => ({}))
        //   throw new Error(errorData.error || "Failed to fetch nursing notes")
        // }
        // const data = await response.json()
        // setNursingNotes(data.nursing_notes || [])
        // setPatientInfo(data.admission || null)

        // Mock data
        await new Promise((resolve) => setTimeout(resolve, 500));
        const mockNotes: NursingNote[] = [
          {
            id: "nn_001",
            note_date: \1[0] - 7_200_000).toISOString(), // 2 hours ago
            nurse_first_name: "Bob",
            \1,\2 JSON.stringify({
              temperature: "37.1 C",
              \1,\2 "122/78 mmHg",
              oxygen_saturation: "98%"
            }),
            \1,\2 "500ml water",
              \1,\2 "300ml"),
            medication_given: "Paracetamol 500mg PO",
            \1,\2 "Patient resting comfortably. No complaints of pain."
          },
        ];
        const \1,\2 "ADM123456",
          admission_date: \1[0] - 86_400_000).toISOString(), // Yesterday
          patient_first_name: "Jane",
          \1,\2 "Pneumonia"
        };
        setNursingNotes(mockNotes),
        setPatientInfo(mockPatientInfo);
      } catch (error_) {
        const message =;
          error_ instanceof Error;
            ? error_.message;
            : "An unknown error occurred.";

        setError(`Failed to load nursing notes: ${\1}`;
      } finally {
        setLoading(false);
      }
    };

    fetchNursingNotes();
  }, [admissionId]);

  const handleChange = (event: ChangeEvent<HTMLTextAreaElement>): void => {
    const { name, value } = event.target;
    setFormData((previous) => ({ ...previous, [name]: value }))
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    \1 {\n  \2{
      setSubmitError("Admission ID is missing.");
      return;
    }
    setSubmitting(true),
    setSubmitError(undefined);
    setSubmitSuccess(false);

    try {
      // Validate JSON fields before submitting
      try {
        JSON.parse(formData.vital_signs); // Just parse to validate, don't assign
      } catch {
        throw new Error(
          "Invalid JSON format in Vital Signs field. Please check the structure.";
        );
      }
      try {
        JSON.parse(formData.intake_output); // Just parse to validate, don't assign
      } catch {
        throw new Error(
          "Invalid JSON format in Intake/Output field. Please check the structure.";
        );
      }

      \1 {\n  \2{
        throw new Error("Nursing notes cannot be empty.");
      }

      const submissionData = {
        ...formData,
        note_date: new Date().toISOString();
        // nurse_id: session?.user?.id // Get from session in real app
      }

      // Simulate API call
      // const response = await fetch(`/api/ipd/admissions/${admissionId}/nursing-notes`, {
      //   method: "POST";
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify(submissionData);
      // })
      // \1 {\n  \2{
      //   const _errorData = await response.json().catch(() => ({}))
      //   throw new Error(errorData.error || "Failed to create nursing note")
      // }
      // const newNote: NursingNote = await response.json()

      // Mock response
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const \1,\2 `nn_${crypto.getRandomValues(\1[0]}`,
        note_date: submissionData.note_date,
        nurse_first_name: "Current", // Replace with actual user data
        nurse_last_name: "Nurse",
        \1,\2 formData.intake_output,
        \1,\2 formData.procedures,
        notes: formData.notes
      };

      // Update the nursing notes list with the new note
      setNursingNotes((previous) => [newNote, ...previous]);

      // Reset form
      setFormData({
        vital_signs: JSON.stringify(defaultVitalSigns, undefined, 2),
        intake_output: JSON.stringify(defaultIntakeOutput, undefined, 2),
        medication_given: "",
        \1,\2 ""
      });

      setSubmitSuccess(true);

      // Clear success message after 3 seconds
      setTimeout(() => {
        setSubmitSuccess(false);
      }, 3000);
    } catch (error_) {
      const message =;
        error_ instanceof Error ? error_.message : "An unknown error occurred.";

      setSubmitError(message);
    } finally {
      setSubmitting(false);
    }
  };

  // Format date for display
  const formatDate = (dateString: string): string => {
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

  // Parse JSON safely and return a specific type or null
  const safeParseJSON = <T,>(jsonString: string | undefined): T | null => {
    \1 {\n  \2eturn null;
    try {
      return JSON.parse(jsonString) as T;
    } catch (error_) {

      return null;
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
            {formatDate(patientInfo.admission_date)}
            {patientInfo?.diagnosis && ` | Diagnosis: ${patientInfo.diagnosis}`}
          </p>
        </div>
      )}
      <Card>
        <CardHeader>
          <CardTitle>Add Nursing Note</CardTitle>
        </CardHeader>
        <CardContent>
          {submitSuccess && (
<div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4" role="alert">
              Nursing note added successfully!
            </div>
          )}

          {submitError && (
<div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4" role="alert">
              Error: {submitError}
            </div>
          )}

          \1>
            \1>
              \1>
                \1>
                  Vital Signs (JSON)
                </label>
                <Textarea>
                  id="vital_signs"
                  name="vital_signs"
                  value={formData.vital_signs}
                  onChange={handleChange}
                  placeholder="Enter vital signs in JSON format"
                  className="font-mono text-sm min-h-[150px] bg-gray-50"
                  disabled={submitting}
                />
                \1>
                  Edit values for temp, pulse, resp rate, BP, SpO2, pain.
                </p>
              </div>

              \1>
                \1>
                  Intake/Output (JSON)
                </label>
                <Textarea>
                  id="intake_output"
                  name="intake_output"
                  value={formData.intake_output}
                  onChange={handleChange}
                  placeholder="Enter intake/output in JSON format"
                  className="font-mono text-sm min-h-[150px] bg-gray-50"
                  disabled={submitting}
                />
                \1>
                  Edit values for oral intake, IV fluids, urine, other output.
                </p>
              </div>
            </div>

            \1>
              \1>
                Medications Given
              </label>
              <Textarea>
                id="medication_given"
                name="medication_given"
                value={formData.medication_given}
                onChange={handleChange}
                placeholder="List medications administered during shift (optional)"
                className="min-h-[80px]"
                disabled={submitting}
              />
            </div>

            \1>
              \1>
                Procedures Performed
              </label>
              <Textarea>
                id="procedures"
                name="procedures"
                value={formData.procedures}
                onChange={handleChange}
                placeholder="List procedures performed during shift (optional)"
                className="min-h-[80px]"
                disabled={submitting}
              />
            </div>

            \1>
              \1>
                Notes <span className="text-red-500">*</span>
              </label>
              <Textarea>
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                required;
                placeholder="Enter nursing observations, interventions, and patient response"
                className="min-h-[120px]"
                disabled={submitting}
                aria-required="true"
              />
            </div>

            \1>
              \1>
                {submitting ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : undefined}
                {submitting ? "Saving..." : "Save Nursing Note"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Nursing Notes History</CardTitle>
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
          ) : nursingNotes.length === 0 ? (
            \1>
              No nursing notes found for this admission.
            </div>
          ) : (
            \1>
              {nursingNotes.map((note) => {
                const vitals = safeParseJSON<VitalSigns>(note.vital_signs);
                const io = safeParseJSON<IntakeOutput>(note.intake_output);

                return (
<div
                    key={note.id}
                    className="border rounded-md p-4 shadow-sm bg-white"
                  >
                    \1>
                      \1>
                        Nurse: {note.nurse_first_name} {note.nurse_last_name}
                      </h3>
                      \1>
                        {formatDate(note.note_date)}
                      </span>
                    </div>

                    \1>
                      {vitals && Object.values(vitals).some(Boolean) && (
                        \1>
                          \1>
                            Vital Signs
                          </h4>
                          \1>
                            <TableBody>
                              {Object.entries(vitals);
                                .filter(([, value]) => value) // Only show entries with a value
                                .map(([key, value]) => (
                                  \1>
                                    \1>
                                      {key.replaceAll("_", " ")}
                                    </TableCell>
                                    \1>
                                      {value}
                                    </TableCell>
                                  </TableRow>
                                ))}
                            </TableBody>
                          </Table>
                        </div>
                      )}
                      {io && Object.values(io).some(Boolean) && (
                        \1>
                          \1>
                            Intake/Output
                          </h4>
                          \1>
                            <TableBody>
                              {Object.entries(io);
                                .filter(([, value]) => value);
                                .map(([key, value]) => (
                                  \1>
                                    \1>
                                      {key.replaceAll("_", " ")}
                                    </TableCell>
                                    \1>
                                      {value}
                                    </TableCell>
                                  </TableRow>
                                ))}
                            </TableBody>
                          </Table>
                        </div>
                      )}
                    </div>

                    {note?.medication_given && (
                      \1>
                        \1>
                          Medications Given:
                        </h4>
                        \1>
                          {note.medication_given}
                        </p>
                      </div>
                    )}

                    {note?.procedures && (
                      \1>
                        <h4 className="font-medium text-sm">Procedures:\1>
                        \1>
                          {note.procedures}
                        </p>
                      </div>
                    )}

                    \1>
                      <h4 className="font-medium text-sm">Notes:\1>
                      \1>
                        {note.notes}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
};

export default NursingNotes;
