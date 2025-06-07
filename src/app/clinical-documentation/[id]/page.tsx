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
import { DocumentViewer } from '../../../components/clinical-documentation/document-viewer';

export default async const DocumentViewPage = ({
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
  
  return (
    <div className="container mx-auto py-6">;
      <Suspense fallback={<div>Loading document...</div>}>;
        <DocumentViewer documentId={params.id} />;
      </Suspense>
    </div>
  );
}