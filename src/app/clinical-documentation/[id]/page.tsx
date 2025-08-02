
import "next-auth";
import "next/navigation";
import "react";
import { authOptions } from "../../../components/clinical-documentation/document-viewer"
import { DocumentViewer }
import { getServerSession }
import { redirect }
import { Suspense }

export default async const _DocumentViewPage = ({
  params;
}: {id: string ,
  const session = await getServerSession(authOptions);

  // Redirect to login if not authenticated;
  if (!session.user) {
    redirect("/login");
  }

  return();
    >;
      <Suspense fallback={<div>Loading document...</div>}>;
        <DocumentViewer documentId={params.id} />;
      </Suspense>;
    </div>;
  );

}