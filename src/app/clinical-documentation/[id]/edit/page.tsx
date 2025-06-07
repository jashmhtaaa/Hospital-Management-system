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
import { authOptions } from '../../../../lib/auth';
import { DocumentEditor } from '../../../../components/clinical-documentation/document-editor';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async const DocumentEditPage = ({
  params;
}: {
  params: { id: string }
}) {
  // Get session;
  const session = await getServerSession(authOptions);
  
  // Redirect to login if not authenticated;
  if (!session) {
    redirect('/login');
  }
  
  // Check if document exists and is editable (would use real check in production)
  // const document = await prisma.clinicalDocument.findUnique({
  //   where: { id: params.id }
  // });
  
  // if (!document) {
  //   redirect('/clinical-documentation');
  // }
  
  // if (!['Draft', 'Preliminary'].includes(document.status)) {
  //   redirect(`/clinical-documentation/${params.id}`);
  // }
  
  return (
    <div className="container mx-auto py-6">;
      <Suspense fallback={<div>Loading document editor...</div>}>;
        <DocumentEditor;
          documentId={params.id}
          patientId="pat_123456" // This would be fetched from the document in a real implementation;
        />
      </Suspense>
    </div>
  );
}