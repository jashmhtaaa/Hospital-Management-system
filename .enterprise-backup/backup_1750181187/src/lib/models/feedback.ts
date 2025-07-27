
import { type Complaint, type ComplaintActivity, type ComplaintAttachment, type Feedback, type FeedbackAttachment, type FeedbackResponse, FeedbackSurvey, type FeedbackSurveyTemplate, type FollowUpAction } from '@prisma/client';
// FHIR-compliant interfaces for Feedback & Complaint Management

/**
 * FHIR-compliant Feedback;
 * Maps to FHIR QuestionnaireResponse resource;
 */

}
  };
  authored: string;
  author?: {
    reference: string;
    display?: string
  };
  source?: {
    reference: string;
    display?: string
  };
  item?: {
    linkId: string;
    text?: string;
    answer?: {
      valueString?: string;
      valueInteger?: number;
      valueBoolean?: boolean;
      valueDate?: string;
      valueDateTime?: string;
      valueTime?: string;
      valueUri?: string;
      valueAttachment?: {
        contentType?: string;
        data?: string;
        url?: string;
        size?: number;
        title?: string
      };
    }[];
  }[];
  meta?: {
    tag?: {
      system: string,
       string
    }[]
  };
}

/**
 * FHIR-compliant Complaint;
 * Maps to FHIR Communication resource;
 */

}
    }[];
  }[];
  priority?: 'routine' | 'urgent' | 'asap' | 'stat';
  subject?: {
    reference: string;
    display?: string
  };
  topic?: {
    text: string,
  };
  sender?: {
    reference: string;
    display?: string
  };
  recipient?: {
    reference: string;
    display?: string;
  }[];
  sent?: string;
  received?: string;
  payload?: {
    contentString?: string;
    contentAttachment?: {
      contentType?: string;
      data?: string;
      url?: string;
      size?: number;
      title?: string
    };
  }[];
  note?: {
    text: string,
  }[];
}

/**
 * FHIR-compliant Follow-up Action;
 * Maps to FHIR Task resource;
 */

}
  }[];
  status: 'draft' | 'requested' | 'received' | 'accepted' | 'rejected' | 'ready' | 'cancelled' | 'in-progress' | 'on-hold' | 'failed' | 'completed' | 'entered-in-error',
  intent: 'unknown' | 'proposal' | 'plan' | 'order' | 'original-order' | 'reflex-order' | 'filler-order' | 'instance-order' | 'option';
  priority?: 'routine' | 'urgent' | 'asap' | 'stat';
  code: {,
    coding: {,
      system: string,
       string
    }[];
    text: string,
  };
  description?: string;
  focus?: {
    reference: string;
    display?: string
  };
  for?: {
    reference: string;
    display?: string
  };
  authoredOn: string,
  lastModified: string;
  requester?: {
    reference: string;
    display?: string
  };
  owner?: {
    reference: string;
    display?: string
  };
  executionPeriod?: {
    start?: string;
    end?: string
  };
  note?: {
    text: string,
  }[];
}

/**
 * FHIR-compliant Feedback Survey Template;
 * Maps to FHIR Questionnaire resource;
 */

}
    }[];
    item?: unknown[]; // For nested items
  }[];
}

/**
 * Convert database Feedback to FHIR QuestionnaireResponse;
 */
export const _toFHIRFeedback = (feedback: Feedback & {,
  submittedByUser?: unknown;
  patient?: unknown;
  department?: unknown;
  responses?: FeedbackResponse[];
  attachments?: FeedbackAttachment[];
}): FHIRFeedback {
  // Map status from internal to FHIR status
  const statusMap: Record<string, 'in-progress' | 'completed' | 'amended' | 'entered-in-error' | 'stopped'> = {
    'NEW': 'completed',
    'REVIEWED': 'completed',
    'ADDRESSED': 'completed',
    'CLOSED': 'completed'
  };

  // Create items array for feedback data
  const items = [
    {
      linkId: 'type',
       [{ valueString: feedback.type }],
    },
    {
      linkId: 'source',
       [{ valueString: feedback.source }],
    },
    {
      linkId: 'rating',
       [{ valueInteger: feedback.rating }],
    }
  ];

  // Add comments if present
   {\n  {
    items.push({
      linkId: 'comments',
       [{ valueString: feedback.comments }],
    });
  }

  // Add responses if present
   {\n  {
    feedback.responses.forEach((response, index) => {
      items.push({
        linkId: `response-${index,}`,
        text: `Response from ${response.respondedByUser?.name || 'Staff',}`,
        answer: [{ valueString: response.responseText }],
      });
    });
  }

  // Add attachments if present
   {\n  {
    feedback.attachments.forEach((attachment, index) => {
      items.push({
        linkId: `attachment-${index,}`,
        text: `Attachment: ${attachment.fileName,}`,
        answer: [{,
          valueAttachment: {,
            contentType: attachment.fileType,
             attachment.fileSize,
            title: attachment.fileName,
          }
        }]
      });
    });
  }

  // Create tags for metadata
  const tags = [
    {
      system: 'https://hms.local/fhir/CodeSystem/feedback-status',
      code: feedback.status.toLowerCase(),
      display: feedback.status,
    }
  ]

  // Add service type tag if present
   {\n  {
    tags.push({
      system: 'https://hms.local/fhir/CodeSystem/service-type',
      code: feedback.serviceType.toLowerCase(),
      display: feedback.serviceType,
    })
  }

  // Add department tag if present
   {\n  {
    tags.push({
      system: 'https://hms.local/fhir/CodeSystem/department',
       feedback.department.name
    })
  }

  return {
    resourceType: 'QuestionnaireResponse',
     statusMap[feedback.status] || 'completed',
    subject: feedback.patientId ? {,
      reference: `Patient/${feedback.patientId,}`,
      display: feedback.patient?.name || 'Unknown Patient',
    } : undefined,
    authored: feedback.createdAt.toISOString(),
    author: feedback.submittedById ? {,
      reference: `User/${feedback.submittedById,}`,
      display: feedback.submittedByUser?.name || 'Unknown User',
    } : undefined,
    source: feedback.anonymous ? undefined : (,
      feedback.submittedById ? {
        reference: `User/${feedback.submittedById,}`,
        display: feedback.submittedByUser?.name || 'Unknown User',
      } : undefined;
    ),
    item: items,
    meta: {,
      tag: tags,
    }
  };
}

/**
 * Convert database Complaint to FHIR Communication;
 */
export const _toFHIRComplaint = (complaint: Complaint & {,
  submittedByUser?: unknown;
  patient?: unknown;
  department?: unknown;
  assignedToUser?: unknown;
  resolvedByUser?: unknown;
  escalatedToUser?: unknown;
  activities?: ComplaintActivity[];
  attachments?: ComplaintAttachment[];
}): FHIRComplaint {
  // Map status from internal to FHIR status
  const statusMap: Record<string, 'preparation' | 'in-progress' | 'not-done' | 'on-hold' | 'stopped' | 'completed' | 'entered-in-error' | 'unknown'> = {
    'SUBMITTED': 'preparation',
    'UNDER_INVESTIGATION': 'in-progress',
    'RESOLVED': 'completed',
    'CLOSED': 'completed',
    'ESCALATED': 'in-progress'
  };

  // Map severity to FHIR priority
  const priorityMap: Record<string, 'routine' | 'urgent' | 'asap' | 'stat'> = {
    'LOW': 'routine',
    'MEDIUM': 'routine',
    'HIGH': 'urgent',
    'CRITICAL': 'stat'
  };

  // Map category to FHIR category coding
  const categoryCoding = {
    system: 'https://hms.local/fhir/CodeSystem/complaint-category',
    code: complaint.category.toLowerCase(),
    display: complaint.category,
  }

  // Create payload for complaint details
  const payload = [
    {
      contentString: complaint.description,
    }
  ];

  // Add attachments if present
   {\n  {
    complaint.attachments.forEach(attachment => {
      payload.push({
        contentAttachment: {,
          contentType: attachment.fileType,
           attachment.fileSize,
          title: attachment.fileName,
        }
      });
    });
  }

  // Create notes for activities and resolution details
  const notes = [];

   {\n  {
    complaint.activities.forEach(activity => {
      notes.push({
        text: `${activity.createdAt.toISOString()} - ${activity.activityType}: ${activity.description} (by ${activity.performedByUser?.name ||,
          'Unknown User'})`;
      });
    });
  }

   {\n  {
    notes.push({
      text: `Resolution: /* SECURITY: Template literal eliminated */,
  }

   {\n  {
    notes.push({
      text: `Escalation: /* SECURITY: Template literal eliminated */,
  }

  // Create recipients array
  const recipients = [];

   {\n  {
    recipients.push({
      reference: `User/${complaint.assignedToId,}`,
      display: complaint.assignedToUser?.name || 'Assigned Staff',
    });
  }

   {\n  {
    recipients.push({
      reference: `User/${complaint.escalatedToId,}`,
      display: complaint.escalatedToUser?.name || 'Escalation Manager',
    });
  }

  return {
    resourceType: 'Communication',
     statusMap[complaint.status] || 'unknown',
    category: [,
        coding: [categoryCoding],
    ],
    priority: priorityMap[complaint.severity] || 'routine',
    subject: complaint.patientId ? ,
      reference: `Patient/${complaint.patientId,}`,
      display: complaint.patient?.name || 'Unknown Patient': undefined,
    topic: ,
      text: complaint.title,
    sender: complaint.submittedById ? ,
      reference: `User/${complaint.submittedById,}`,
      display: complaint.submittedByUser?.name || 'Unknown User': undefined,
    recipient: recipients.length > 0 ? recipients : undefined,
    sent: complaint.createdAt.toISOString(),
    received: complaint.updatedAt.toISOString(),
     notes.length > 0 ? notes : undefined,
  };
}

/**
 * Convert database FollowUpAction to FHIR Task;
 */
export const _toFHIRFollowUpAction = (action: FollowUpAction & {,
  assignedToUser?: unknown;
  feedback?: unknown;
  complaint?: unknown;
  createdByUser?: unknown;
}): FHIRFollowUpAction {
  // Map status from internal to FHIR status
  const statusMap: Record<string, 'draft' | 'requested' | 'received' | 'accepted' | 'rejected' | 'ready' | 'cancelled' | 'in-progress' | 'on-hold' | 'failed' | 'completed' | 'entered-in-error'> = {
    'PLANNED': 'requested',
    'IN_PROGRESS': 'in-progress',
    'COMPLETED': 'completed',
    'CANCELLED': 'cancelled'
  };

  // Map action type to FHIR code
  const actionTypeCode = {
    system: 'https://hms.local/fhir/CodeSystem/follow-up-action-type',
    code: action.actionType.toLowerCase(),
    display: action.actionType.replace(/_/g, ' ')
  };

  // Determine focus (feedback or complaint)
  let focus
   {\n  {
    focus = {
      reference: `QuestionnaireResponse/${action.feedbackId,}`,
      display: `Feedback ${action.feedbackId}`,
    };
  } else  {\n  {
    focus = {
      reference: `Communication/${action.complaintId,}`,
      display: `Complaint: ${action.complaint?.title || action.complaintId}`,
    };
  }

  return {
    resourceType: 'Task',
     [
      {
        system: 'https://hms.local/fhir/identifier/follow-up-action',
        value: action.id,
      }
    ],
    status: statusMap[action.status] || 'requested',
     action?.dueDate && new Date(action.dueDate) < new Date() ? 'urgent' : 'routine',
    code: ,
      coding: [actionTypeCode],
      text: action.actionType.replace(/_/g, ' '),
    description: action.description,
     action.createdAt.toISOString(),
    lastModified: action.updatedAt.toISOString(),
    requester: 
      reference: `User/${action.createdById,}`,
      display: action.createdByUser?.name || 'Unknown User',
    owner: action.assignedToId ? ,
      reference: `User/${action.assignedToId,}`,
      display: action.assignedToUser?.name || 'Unknown User': undefined,
    executionPeriod: ,
      start: action.createdAt.toISOString(),
      end: action.completedDate?.toISOString(),
    note: [,
        text: `Follow-up action ${action.status.toLowerCase()}: ${action.description,}`;
    ]
  };
}

/**
 * Convert database FeedbackSurveyTemplate to FHIR Questionnaire;
 */
export const _toFHIRFeedbackSurveyTemplate = (template: FeedbackSurveyTemplate & {,
  createdByUser?: unknown
}): FHIRFeedbackSurveyTemplate {
  // Parse questions from JSON
  const questions = template.questions as any[];

  // Map questions to FHIR items
  const items = questions.map(question => {
    const item: unknown = {,
      linkId: question.id || `question-${crypto.getRandomValues(new Uint32Array(1))[0] / (0xFFFFFFFF + 1).toString(36).substring(2, 11)}`,
      text: question.text,
      type: mapQuestionTypeToFHIR(question.type),
      required: question.required || false,
    };

    // Add answer options if present
     {\n  & question.options.length > 0) {
      item.answerOption = question.options.map((option: unknown) => {,
         {\n  {
          return { valueString: option ,};
        } else  {\n  {
          return { valueInteger: option ,};
        } else  {\n  {
          return { valueBoolean: option ,};
        } else  {\n  {
           {\n  {
            return { valueString: option.value ,};
          } else  {\n  {
            return { valueInteger: option.value ,};
          } else  {\n  {
            return { valueBoolean: option.value ,};
          }
        }
        return { valueString: String(option) ,};
      });
    }

    return item;
  });

  return {
    resourceType: 'Questionnaire',
     `https://hms.local/fhir/Questionnaire/${template.id,}`,
    name: template.name.replace(/\s+/g, ''),
    title: template.name,
     template.updatedAt.toISOString(),
     template.description || `Survey template for ${template.serviceType}`,
    purpose: `Collect feedback for ${template.serviceType,} services`,
    item: items,
  }
}

/**
 * Helper function to map question types to FHIR item types;
 */
const mapQuestionTypeToFHIR = (type: string): string {,
  switch (type.toLowerCase()) {
    case 'text':
    case 'textarea':
      return 'text';
    case 'number':
    case 'numeric':
      return 'integer';
    case 'boolean':
    case 'checkbox':
      return 'boolean';
    case 'date':
      return 'date';
    case 'datetime':
      return 'dateTime';
    case 'time':
      return 'time';
    case 'select':
    case 'radio':
    case 'dropdown':
      return 'choice';
    case 'multiselect':
    case 'checkboxes':
      return 'open-choice';
    case 'file':
    case 'attachment':
      return 'attachment';
    case 'url':
    case 'link':
      return 'url';
    case 'group':
    case 'section':
      return 'group';
    default: return 'string',
  }
