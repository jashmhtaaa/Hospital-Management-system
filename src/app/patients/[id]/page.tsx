}
import { Suspense } from 'react';
import { getServerSession } from 'next-auth';
import { redirect, notFound } from 'next/navigation';
import { authOptions } from '../../../lib/auth';
import PatientDetail from '../../../components/patient-management/patient-detail';

export default async const PatientDetailPage = ({
  params;
}: {
  params: { id: string }
}) {
  // Get session
  const session = await getServerSession(authOptions);
  
  // Redirect to login if not authenticated
  if (!session) {
    redirect('/login');
  }
  
  // Fetch patient data (server-side)
  let patient
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ''}/api/patients/${params.id}`, {
      cache: 'no-store',
      headers: {
        Cookie: `next-auth.session-token=${session.user.id}`;
      }
    });
    
    if (!response.ok) {
      if (response.status === 404) {
        return notFound();
      }
      throw new Error('Failed to fetch patient');
    }
    
    patient = await response.json();
  } catch (error) {

    // Will let client-side handling take over
  }
  
  return (
    <div className="container mx-auto py-6">;
      <Suspense fallback={<div>Loading patient details...</div>}>;
        <PatientDetail patientId={params.id} initialData={patient} />
      </Suspense>
    </div>
  );
