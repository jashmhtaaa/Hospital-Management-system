import { Suspense } from 'react';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '../../lib/auth';
import PatientList from '../../components/patient-management/patient-list';

export default async function PatientsPage({
  searchParams
}: {
  searchParams: { 
    page?: string; 
    limit?: string;
    mrn?: string;
    firstName?: string;
    lastName?: string;
    dateOfBirth?: string;
    phone?: string;
    email?: string;
    status?: string;
  }
}) {
  // Get session
  const session = await getServerSession(authOptions);
  
  // Redirect to login if not authenticated
  if (!session) {
    redirect('/login');
  }
  
  // Parse pagination parameters
  const page = searchParams.page ? parseInt(searchParams.page) : 1;
  const limit = searchParams.limit ? parseInt(searchParams.limit) : 10;
  
  // Build search filters
  const filters: any = {};
  if (searchParams.mrn) filters.mrn = searchParams.mrn;
  if (searchParams.firstName) filters.firstName = searchParams.firstName;
  if (searchParams.lastName) filters.lastName = searchParams.lastName;
  if (searchParams.dateOfBirth) filters.dateOfBirth = searchParams.dateOfBirth;
  if (searchParams.phone) filters.phone = searchParams.phone;
  if (searchParams.email) filters.email = searchParams.email;
  if (searchParams.status) filters.status = searchParams.status;
  
  // Fetch patients data (server-side)
  let initialData;
  try {
    // Build query parameters
    const params = new URLSearchParams();
    params.append('page', page.toString());
    params.append('limit', limit.toString());
    
    // Add filters if they have values
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.append(key, value as string);
    });
    
    // Fetch patients
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ''}/api/patients?${params.toString()}`, {
      cache: 'no-store',
      headers: {
        Cookie: `next-auth.session-token=${session.user.id}`
      }
    });
    
    if (response.ok) {
      initialData = await response.json();
    }
  } catch (error) {
    console.error('Error pre-fetching patients:', error);
    // Will let client-side handling take over
  }
  
  return (
    <div className="container mx-auto py-6">
      <Suspense fallback={<div>Loading patients...</div>}>
        <PatientList initialData={initialData} />
      </Suspense>
    </div>
  );
}