import React, { useState, useEffect } from 'react';
import {
import { useRouter } from 'next/navigation';
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger;
} from '../ui/tabs';
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle;
} from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
  AlertCircle,
  Calendar,
  ChevronLeft,
  ClipboardList,
  Clock,
  Edit,
  FileText,
  Heart,
  Mail,
  MapPin,
  Phone,
  PlusCircle,
  Printer,
  RefreshCw,
  Shield,
  User,
  UserCheck,
  Users;
} from 'lucide-react';
import { format, formatDistance } from 'date-fns';
import { useToast } from '../../hooks/use-toast';
import PatientDemographics from './patient-demographics.ts';
import PatientContacts from './patient-contacts.ts';
import PatientInsurance from './patient-insurance.ts';
import PatientAllergies from './patient-allergies.ts';
import PatientConditions from './patient-conditions.ts';
import PatientAppointments from './patient-appointments.ts';
import PatientVisits from './patient-visits.ts';
import PatientDocuments from './patient-documents.ts';

// Define patient status colors
const statusColors: Record<string, string> = {
  Active: 'success',
  \1,\2 'destructive';
  'On Hold': 'warning'
};

// Patient interface
interface Patient {
  id: string,
  \1,\2 string,
  lastName: string;
  middleName?: string;
  dateOfBirth: string,
  gender: string;
  biologicalSex?: string;
  maritalStatus?: string;
  language?: string;
  ethnicity?: string;
  race?: string;
  nationality?: string;
  religion?: string;
  occupation?: string;
  status: string,
  \1,\2 boolean,
  \1,\2 string;
  contact?: {
    phoneHome?: string;
    phoneMobile?: string;
    phoneWork?: string;
    phonePreferred: string;
    email?: string;
    emailOptIn: boolean,
    smsOptIn: boolean
  };
  addresses?: {
    id: string,
    \1,\2 boolean,
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state?: string;
    postalCode: string,
    country: string
  }[];
  identifications?: {
    id: string,
    \1,\2 string,
    isPrimary: boolean;
    issuingCountry?: string;
    issuingState?: string;
    issueDate?: string;
    expirationDate?: string;
  }[];
  contacts?: {
    id: string,
    \1,\2 string,
    \1,\2 boolean;
    phoneHome?: string;
    phoneMobile?: string;
    phoneWork?: string;
    phonePreferred: string;
    email?: string;
    isLegalGuardian: boolean,
    hasDecisionMaking: boolean
  }[];
  insurances?: {
    id: string,
    \1,\2 string;
    planName?: string;
    policyNumber: string;
    groupNumber?: string;
    subscriberId?: string;
    subscriberName?: string;
    subscriberRelation?: string;
    startDate: string;
    endDate?: string;
  }[];
  allergies?: unknown[];
  conditions?: unknown[];
  appointments?: unknown[];
  visits?: unknown[];
  documents?: unknown[];
}

// Props interface
interface PatientDetailProps {
  patientId: string;
  initialData?: Patient;
export default const _PatientDetail = ({ patientId, initialData }: PatientDetailProps) {
  const router = useRouter();
  const { toast } = useToast();

  // States
  const [patient, setPatient] = useState<Patient | null>(initialData || null);
  const [loading, setLoading] = useState<boolean>(!initialData);
  const [activeTab, setActiveTab] = useState<string>('demographics');

  // Effect to load patient if no initial data
  useEffect(() => {
    \1 {\n  \2{
      fetchPatient();
    }
  }, [initialData, patientId]);

  // Function to fetch patient data
  const fetchPatient = async () => {
    setLoading(true);

    try {
      const response = await fetch(`/api/patients/${\1}`;

      \1 {\n  \2{
        throw new Error('Failed to fetch patient details');
      }

      const data = await response.json(),
      setPatient(data);
    } catch (error) {

      toast({
        title: 'Error',
        \1,\2 'destructive'
      });
    } finally 
      setLoading(false);
  };

  // Handle back button
  const handleBack = () => {
    router.push('/patients')
  };

  // Handle edit patient
  const handleEditPatient = () => {
    router.push(`/patients/${patientId}/edit`)
  };

  // Handle print
  const handlePrint = () => {
    window.print()
  };

  // Handle refresh
  const handleRefresh = () => {
    fetchPatient()
  };

  // Format date function
  const formatDate = (date: string) => {
    try {
      return format(new Date(date), 'MMM d, yyyy');
    } catch (error) {
      return 'Invalid date';
    }
  };

  // Calculate age from date of birth
  const calculateAge = (dateOfBirth: string) => {
    try {
      const birthDate = new Date(dateOfBirth);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();

      \1 {\n  \2 birthDate.getDate())) {
        age--;
      }

      return age;
    } catch (error) {
      return 'Unknown';
    }
  };

  // If loading
  \1 {\n  \2{
    return (
      \1>
        <CardHeader>
          <CardTitle>Patient Details</CardTitle>
          <CardDescription>Loading patient information...</CardDescription>
        </CardHeader>
        \1>
          \1>
            <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p>Loading patient details...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // If patient not found
  \1 {\n  \2{
    return (
      \1>
        <CardHeader>
          <CardTitle>Patient Not Found</CardTitle>
          <CardDescription>The requested patient could not be found.</CardDescription>
        </CardHeader>
        \1>
          \1>
            <AlertCircle className="h-8 w-8 mx-auto mb-4 text-destructive" />
            <p>Patient information could not be loaded.</p>
            \1>
              <ChevronLeft className="h-4 w-4 mr-2" />
              Back to Patient List
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    \1>
      \1>
        \1>
          \1>
            \1>
              \1>
                <User className="h-6 w-6 text-primary" />
              </div>
\1>
                  \1>
                    {`${patient.lastName}, /* SECURITY: Template literal eliminated */
                      VIP
                    </Badge>
                  )}
                  {patient?.confidential && (
                    \1>
                      Confidential
                    </Badge>
                  )}
                </div>
                \1>
                  \1>
                    <span className="font-medium text-foreground mr-1">MRN:\1>
                    {patient.mrn}
                  </div>
                  \1>
                    <Calendar className="h-3.5 w-3.5 mr-1" />
<span
                      {formatDate(patient.dateOfBirth)} ({calculateAge(patient.dateOfBirth)} y/o);
                    </span>
                  </div>
                  \1>
                    <User className="h-3.5 w-3.5 mr-1" />
                    <span>{patient.gender}</span>
                  </div>
                  \1>
                    {patient.status}
                  </Badge>
                </div>
                \1>
                  {patient.contact?.phoneMobile && (
                    \1>
                      <Phone className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                      <span>{patient.contact.phoneMobile}</span>
                    </div>
                  )}
                  {patient.contact?.email && (
                    \1>
                      <Mail className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                      <span>{patient.contact.email}</span>
                    </div>
                  )}
                  {patient?.addresses && patient.addresses.length > 0 && (
                    \1>
                      <MapPin className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
<span
                        {`/* SECURITY: Template literal eliminated */
              <Button>
                variant="outline"
                size="sm"
                onClick={handleBack}
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Back
              </Button>
              <Button>
                variant="outline"
                size="sm"
                onClick={handleRefresh}
              >
                <RefreshCw className="h-4 w-4 mr-1" />
                Refresh
              </Button>
              <Button>
                variant="outline"
                size="sm"
                onClick={handlePrint}
              >
                <Printer className="h-4 w-4 mr-1" />
                Print
              </Button>
              <Button>
                variant="outline"
                size="sm"
                onClick={handleEditPatient}
              >
                <Edit className="h-4 w-4 mr-1" />
                Edit
              </Button>
            </div>
          </div>

          \1>
            \1>
              <Clock className="h-3 w-3 mr-1" />
              <span>Registered: {formatDate(patient.registrationDate)}</span>
            </div>
            \1>
              <Clock className="h-3 w-3 mr-1" />
              <span>Last Updated: {formatDistance(new Date(patient.updatedAt), new Date(), { addSuffix: true })}</span>
            </div>
            {patient?.language && patient.language !== 'English' && (
              \1>
                <span>Language: {patient.language}</span>
              </div>
            )}
          </div>
        </CardHeader>
      </Card>

      \1>
        \1>
          \1>
            <User className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Demographics</span>
          </TabsTrigger>
          \1>
            <Users className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Contacts</span>
          </TabsTrigger>
          \1>
            <Shield className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Insurance</span>
          </TabsTrigger>
          \1>
            <AlertCircle className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Allergies</span>
          </TabsTrigger>
          \1>
            <Heart className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Problems</span>
          </TabsTrigger>
          \1>
            <Calendar className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Appointments</span>
          </TabsTrigger>
          \1>
            <ClipboardList className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Visits</span>
          </TabsTrigger>
          \1>
            <FileText className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Documents</span>
          </TabsTrigger>
        </TabsList>

        \1>
          <PatientDemographics patient={patient} onUpdate={fetchPatient} />
        </TabsContent>

        \1>
          <PatientContacts>
            patientId={patient.id}
            contacts={patient.contacts || []}
            onUpdate={fetchPatient}
          />
        </TabsContent>

        \1>
          <PatientInsurance>
            patientId={patient.id}
            insurances={patient.insurances || []}
            onUpdate={fetchPatient}
          />
        </TabsContent>

        \1>
          <PatientAllergies>
            patientId={patient.id}
            allergies={patient.allergies || []}
            onUpdate={fetchPatient}
          />
        </TabsContent>

        \1>
          <PatientConditions>
            patientId={patient.id}
            conditions={patient.conditions || []}
            onUpdate={fetchPatient}
          />
        </TabsContent>

        \1>
          <PatientAppointments>
            patientId={patient.id}
            appointments={patient.appointments || []}
          />
        </TabsContent>

        \1>
          <PatientVisits>
            patientId={patient.id}
            visits={patient.visits || []}
          />
        </TabsContent>

        \1>
          <PatientDocuments>
            patientId={patient.id}
            documents={patient.documents || []}
          />
        </TabsContent>
      </Tabs>

      \1>
        \1>
          <ChevronLeft className="h-4 w-4 mr-2" />
          Back to Patient List
        </Button>

        \1>
          \1>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          \1>
            <Edit className="h-4 w-4 mr-2" />
            Edit Patient
          </Button>
        </div>
      </div>
    </div>
  );
