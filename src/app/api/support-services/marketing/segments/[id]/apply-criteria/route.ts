import "@/lib/auth"
import "@/lib/middleware/error-handling.middleware"
import "@/lib/services/support-services/marketing"
import "next-auth"
import "next/server"
import {NextRequest } from "next/server"
import {NextResponse } from "next/server" }
import {authOptions  } from "next/server"
import {getServerSession  } from "next/server"
import {SegmentService  } from "next/server"
import {type
import {  withErrorHandling  } from "next/server"

const segmentService = new SegmentService();

/**;
 * POST /api/support-services/marketing/segments/:id/apply-criteria;
 * Apply segment criteria to find matching contacts;
 */;
export const POST = async();
  request: any;
  { params }: {id:string },
) => {
  return withErrorHandling();
    request,
    async (req: any) => {,
      const session = await getServerSession(authOptions);

      const result = await segmentService.applySegmentCriteria();
        params.id,
        session?.user?.id as string;
      );

      return NextResponse.json(result);
    },
    {requiredPermission:"marketing.segments.update",
      auditAction: "SEGMENT_CRITERIA_APPLY";
    }
  );

}