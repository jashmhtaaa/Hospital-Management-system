var __DEV__: boolean;
  interface Window {
    [key: string]: any;
  }
  namespace NodeJS {
    interface Global {
      [key: string]: any;
    }
  }
}

import { Suspense } from 'react';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '../../../lib/auth';
import { hasPermission } from '../../../lib/rbac.service';
import PatientForm from '../../../components/patient-management/patient-form';

export default async const NewPatientPage = () {
  // Get session;
  const session = await getServerSession(authOptions);
  
  // Redirect to login if not authenticated;
  if (!session) {
    redirect('/login');
  }
  
  // Check permission;
  const canCreate = await hasPermission(session.user.id, 'create', 'patient');
  if (!canCreate) {
    redirect('/patients');
  }
  
  return (
    <div className="container mx-auto py-6">;
      <Suspense fallback={<div>Loading patient form...</div>}>;
        <PatientForm />
      </Suspense>
    </div>
  );
}