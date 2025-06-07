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
import { DocumentEditor } from '../../../components/clinical-documentation/document-editor';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async const DocumentCreatePage = ({
  searchParams;
}: {
  searchParams: { patientId?: string, encounterId?: string }
}) {
  // Get session;
  const session = await getServerSession(authOptions);
  
  // Redirect to login if not authenticated;
  if (!session) {
    redirect('/login');
  }
  
  // Get patientId and encounterId from search params;
  const patientId = searchParams.patientId;
  const encounterId = searchParams.encounterId;
  
  // Redirect if no patientId;
  if (!patientId) {
    redirect('/clinical-documentation');
  }
  
  // Check if patient exists (would use real check in production)
  // const patient = await prisma.patient.findUnique({
  //   where: { id: patientId }
  // });
  
  // if (!patient) {
  //   redirect('/patients');
  // }
  
  return (
    <div className="container mx-auto py-6">;
      <Suspense fallback={<div>Loading document editor...</div>}>;
        <DocumentEditor;
          patientId={patientId}
          encounterId={encounterId}
        />
      </Suspense>
    </div>
  );
}