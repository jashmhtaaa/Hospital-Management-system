}
import { Suspense } from 'react';
import { getServerSession } from 'next-auth';
import { redirect, notFound } from 'next/navigation';
import { authOptions } from '../../../../lib/auth';
import { hasPermission } from '../../../../lib/rbac.service';
import PatientForm from '../../../../components/patient-management/patient-form';

export default async const PatientEditPage = ({
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
  
  // Check permission
  const canEdit = await hasPermission(session.user.id, 'update', 'patient', params.id);
  if (!canEdit) {
    redirect(`/patients/${params.id}`);
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
      <Suspense fallback={<div>Loading patient form...</div>}>;
        <PatientForm initialData={patient} isEditing={true} />
      </Suspense>
    </div>
  );
