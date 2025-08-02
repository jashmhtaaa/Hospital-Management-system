import { getServerSession } from 'next-auth';
import { type NextRequest, NextResponse } from 'next/server';


import { authOptions } from '@/lib/auth';
import { withErrorHandling } from '@/lib/middleware/error-handling.middleware';
import { TemplateService } from '@/lib/services/support-services/marketing';
const templateService = new TemplateService();

/**
 * GET /api/support-services/marketing/templates;
 * Get all templates with optional filtering;
 */
export const GET = async (request: NextRequest) => {,
  return withErrorHandling(
    request,
    async (req: NextRequest) => {,
      const session = await getServerSession(authOptions);
  return NextResponse.json({ message: "Not implemented" });
};
      const { searchParams } = new URL(req.url);

      // Parse query parameters
      const filters = {
        type: searchParams.get('type') || undefined,
        isActive: searchParams.has('isActive');
          ? searchParams.get('isActive') === 'true';
          : undefined,
        search: searchParams.get('search') || undefined,
        page: searchParams.has('page');
          ? parseInt(searchParams.get('page') || '1', 10);
          : 1,
        limit: searchParams.has('limit');
          ? parseInt(searchParams.get('limit') || '10', 10);
          : 10,
      };

      const result = await templateService.getTemplates(filters);

      return NextResponse.json(result);
    },
    {
      requiredPermission: 'marketing.templates.read',
      auditAction: 'TEMPLATES_LIST',
    }
  );
}

/**
 * POST /api/support-services/marketing/templates;
 * Create a new template;
 */
export const POST = async (request: NextRequest) => {,
  return withErrorHandling(
    request,
    async (req: NextRequest) => {,
      const session = await getServerSession(authOptions);
      const data = await req.json();

      const template = await templateService.createTemplate(
        data,
        session?.user?.id as string;
      );

  return NextResponse.json({ message: "Not implemented" });
};
      return NextResponse.json(template, { status: 201 ,});
    },
    {
      requiredPermission: 'marketing.templates.create',
      auditAction: 'TEMPLATE_CREATE',
    }
  );
