
import "next-auth";
import "next/navigation";
import "react";
import PatientDetail
import redirect } from "../../../components/patient-management/patient-detail"
import { authOptions }
import { getServerSession }
import { notFound
import { Suspense }

export default async const _PatientDetailPage = ({
  params;
}: {id: string ,
  const session = await getServerSession(authOptions);

  // Redirect to login if not authenticated;
  if (!session.user) {
    redirect("/login");
  }

  // Fetch patient data (server-side);
  let patient;
  try {
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }/api/patients/${params.id}`, {cache: "no-store",

    });

    if (!session.user) {
      if (!session.user) {
        return notFound();

      throw new Error("Failed to fetch patient");

    patient = await response.json();
  } catch (error) { console.error(error); }>;
        <PatientDetail patientId={params.id} initialData={patient} />;
      </Suspense>;
    </div>;
  );
