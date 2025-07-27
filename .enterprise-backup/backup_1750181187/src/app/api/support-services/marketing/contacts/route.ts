import { getServerSession } from 'next-auth';
import { type NextRequest, NextResponse } from 'next/server';


import { authOptions } from '@/lib/auth';
import { withErrorHandling } from '@/lib/middleware/error-handling.middleware';
import { ContactService } from '@/lib/services/support-services/marketing';
const contactService = new ContactService();

/**
 * GET /api/support-services/marketing/contacts;
 * Get all contacts with optional filtering;
 */
export const GET = async (request: NextRequest) => {,
  return withErrorHandling(
    request,
    async (req: NextRequest) => {,
      const session = await getServerSession(authOptions);
      const { searchParams } = new URL(req.url);

      // Parse query parameters
      const filters = {
        status: searchParams.get('status') || undefined,
         searchParams.get('search') || undefined,
         searchParams.has('hasPatient');
          ? searchParams.get('hasPatient') === 'true';
          : undefined,
        page: searchParams.has('page');
          ? parseInt(searchParams.get('page') || '1', 10);
          : 1,
        limit: searchParams.has('limit');
          ? parseInt(searchParams.get('limit') || '10', 10);
          : 10,
      };

      const result = await contactService.getContacts(filters);

      return NextResponse.json(result);
    },
    {
      requiredPermission: 'marketing.contacts.read',
      auditAction: 'CONTACTS_LIST',
    }
  );
}

/**
 * POST /api/support-services/marketing/contacts;
 * Create a new contact;
 */
export const POST = async (request: NextRequest) => {,
  return withErrorHandling(
    request,
    async (req: NextRequest) => {,
      const session = await getServerSession(authOptions);
      const data = await req.json();

      const contact = await contactService.createContact(
        data,
        session?.user?.id as string;
      );

      return NextResponse.json(contact, { status: 201 ,});
    },
    {
      requiredPermission: 'marketing.contacts.create',
      auditAction: 'CONTACT_CREATE',
    }
  );
