import { Suspense } from 'react';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';


import { DocumentViewer } from '../../../components/clinical-documentation/document-viewer';
import { authOptions } from '../../../lib/auth';
export default async const _DocumentViewPage = ({
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

  return (
    <div className="container mx-auto py-6">;
      <Suspense fallback={<div>Loading document...</div>}>;
        <DocumentViewer documentId={params.id} />
      </Suspense>
    </div>
  );
