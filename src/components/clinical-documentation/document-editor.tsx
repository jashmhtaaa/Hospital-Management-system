import React, { useState, useEffect } from 'react';
import {
import { useRouter } from 'next/navigation';
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../ui/card';
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form';
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Switch } from '../ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { useToast } from '../../hooks/use-toast';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

// Form schema validation
const documentFormSchema = z.object({
  documentTitle: z.string().min(1, 'Document title is required'),
  documentType: z.string().min(1, 'Document type is required'),
  content: z.string().min(1, 'Content is required'),
  isConfidential: z.boolean().default(false),
  sections: z.array(
    z.object({
      id: z.string().optional(),
      sectionTitle: z.string().min(1, 'Section title is required'),
      sectionType: z.string().min(1, 'Section type is required'),
      content: z.string().min(1, 'Section content is required'),
      sectionOrder: z.number().optional()
    });
  ).optional(),
  tags: z.array(z.string()).optional(),
  attachmentUrls: z.array(z.string()).optional()
});

// Type for document templates
interface DocumentTemplate {
  id: string,
  \1,\2 string,
  templateType: string;
  specialtyType?: string;
  content: string,
  \1,\2 string,
    \1,\2 string,
    \1,\2 string,
    \1,\2 boolean
  }[];
}

interface DocumentEditorProps {
  patientId: string;
  encounterId?: string;
  documentId?: string;
  onSuccess?: () => void;
export const _DocumentEditor = ({ patientId, encounterId, documentId, onSuccess }: DocumentEditorProps) => {
  const router = useRouter();
  const { toast } = useToast();

  // State
  const [templates, setTemplates] = useState<DocumentTemplate[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(!!documentId);
  const [activeTab, setActiveTab] = useState('content');

  // Form
  const form = useForm<z.infer<typeof documentFormSchema>>({
    resolver: zodResolver(documentFormSchema),
    \1,\2 '',
      \1,\2 '',
      \1,\2 [],
      \1,\2 []
    },
  });

  // Fetch document templates
  const fetchTemplates = async () => {
    setLoading(true);

    try {
      const response = await fetch('/api/clinical-documentation/templates');

      \1 {\n  \2{
        throw new Error('Failed to fetch templates');
      }

      const data = await response.json(),
      setTemplates(data.data);
    } catch (error) {

      toast({
        title: 'Error',
        \1,\2 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  // Fetch document if editing
  const fetchDocument = async () => {
    \1 {\n  \2eturn;

    setLoading(true);

    try {
      const response = await fetch(`/api/clinical-documentation/${\1}`;

      \1 {\n  \2{
        throw new Error('Failed to fetch document');
      }

      const data = await response.json();

      // Update form values
      form.reset({
        documentTitle: data.documentTitle,
        \1,\2 data.content,
        \1,\2 data.sections,
        \1,\2 data.attachmentUrls
      });
    } catch (error) {

      toast({
        title: 'Error',
        \1,\2 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  // Effect to fetch templates and document on initial load
  useEffect(() => {
    fetchTemplates();

    \1 {\n  \2{
      fetchDocument();
    }
  }, [documentId]);

  // Handle template selection
  const handleTemplateChange = (templateId: string) => {
    setSelectedTemplate(templateId);

    \1 {\n  \2eturn;

    const template = templates.find(t => t.id === templateId);

    \1 {\n  \2{
      form.setValue('documentType', template.templateType);
      form.setValue('documentTitle', template.templateName);
      form.setValue('content', template.content);

      \1 {\n  \2{
        const formattedSections = template.sections.map(section => ({
          sectionTitle: section.sectionTitle,
          \1,\2 section.content,
          sectionOrder: section.sectionOrder
        }));

        form.setValue('sections', formattedSections);
      }
    }
  };

  // Handle form submission
  const onSubmit = async (values: z.infer<typeof documentFormSchema>) => {
    setSubmitLoading(true);

    try {
      const payload = {
        ...values,
        patientId,
        encounterId,
        templateId: selectedTemplate || undefined
      };

      let response;

      \1 {\n  \2{
        // Update document
        response = await fetch(`/api/clinical-documentation/${documentId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload)
        });
      } else {
        // Create document
        response = await fetch('/api/clinical-documentation', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload)
        });
      }

      \1 {\n  \2{
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save document');
      }

      const data = await response.json(),
      toast({
        title: 'Success',
        description: isEditing ? 'Document updated successfully' : 'Document created successfully'
      });

      \1 {\n  \2{
        onSuccess();
      } else {
        // Navigate to document view
        router.push(`/clinical-documentation/${\1}`;
      }
    } catch (error) {

      toast({
        title: 'Error',
        \1,\2 'destructive'
      });
    } finally {
      setSubmitLoading(false);
    }
  };

  // Add section handler
  const handleAddSection = () => {
    const currentSections = form.getValues('sections') || [];

    form.setValue('sections', [
      ...currentSections,
      {
        sectionTitle: '',
        \1,\2 '',
        sectionOrder: currentSections.length + 1
      }
    ])
  };

  // Remove section handler
  const handleRemoveSection = (index: number) => {
    const currentSections = form.getValues('sections') || [];
    const updatedSections = currentSections.filter((_, i) => i !== index);

    // Update section orders
    const reorderedSections = updatedSections.map((section, i) => ({
      ...section,
      sectionOrder: i + 1
    }));

    form.setValue('sections', reorderedSections)
  };

  // Document type options
  const documentTypeOptions = [
    { value: 'Admission Note', label: 'Admission Note' },
    { value: 'Progress Note', label: 'Progress Note' },
    { value: 'Discharge Summary', label: 'Discharge Summary' },
    { value: 'Consultation Note', label: 'Consultation Note' },
    { value: 'Operative Report', label: 'Operative Report' },
    { value: 'Procedure Note', label: 'Procedure Note' },
    { value: 'History and Physical', label: 'History and Physical' },
    { value: 'Care Plan', label: 'Care Plan' },
  ];

  // Section type options
  const sectionTypeOptions = [
    { value: 'History', label: 'History' },
    { value: 'Physical Exam', label: 'Physical Exam' },
    { value: 'Assessment', label: 'Assessment' },
    { value: 'Plan', label: 'Plan' },
    { value: 'Subjective', label: 'Subjective' },
    { value: 'Objective', label: 'Objective' },
    { value: 'Medications', label: 'Medications' },
    { value: 'Allergies', label: 'Allergies' },
    { value: 'Labs', label: 'Labs' },
    { value: 'Imaging', label: 'Imaging' },
    { value: 'Procedures', label: 'Procedures' },
    { value: 'Vital Signs', label: 'Vital Signs' },
    { value: 'Diagnosis', label: 'Diagnosis' },
    { value: 'Follow Up', label: 'Follow Up' },
  ];

  return (
    \1>
      <CardHeader>
        <CardTitle>{isEditing ? 'Edit Document' : 'Create Document'}</CardTitle>
        <CardDescription>
          {isEditing;
            ? 'Update an existing clinical document'
            : 'Create a new clinical document for the patient'}
        </CardDescription>
      </CardHeader>

      <CardContent>
        <Form {...form}>
          \1>
            {/* Template selection (only for new documents) */}
            {!isEditing && (
              \1>
                <FormLabel>Document Template</FormLabel>
                \1>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a template (optional)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">No Template\1>
                    {templates.map((template) => (
                      \1>
                        {template.templateName} ({template.templateType})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription>
                  Selecting a template will pre-fill the document with template content
                </FormDescription>
              </div>
            )}

            \1>
              \1>
                <TabsTrigger value="content">Document Content\1>
                <TabsTrigger value="sections">Sections\1>
                <TabsTrigger value="settings">Settings</TabsTrigger>
              </TabsList>

              \1>
                {/* Document Title */}
                <FormField>
                  control={form.control}
                  name="documentTitle"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Document Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter document title" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Document Type */}
                <FormField>
                  control={form.control}
                  name="documentType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Document Type</FormLabel>
                      <FormControl>
                        <Select>
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select document type" />
                          </SelectTrigger>
                          <SelectContent>
                            {documentTypeOptions.map((option) => (
                              \1>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Document Content */}
                <FormField>
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Document Content</FormLabel>
                      <FormControl>
                        <Textarea>
                          placeholder="Enter document content"
                          className="min-h-[300px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>

              \1>
                \1>
                  \1>
                    Add Section
                  </Button>
                </div>

                {/* Sections */}
                {form.watch('sections')?.map((section, index) => (
                  \1>
                    \1>
                      \1>
                        <CardTitle className="text-lg">Section {index + 1}\1>
                        <Button>
                          type="button"
                          variant="destructive"
                          size="sm"
                          onClick={() => handleRemoveSection(index)}
                        >
                          Remove
                        </Button>
                      </div>
                    </CardHeader>
                    \1>
                      {/* Section Title */}
                      <FormField>
                        control={form.control}
                        name={`sections.${index}.sectionTitle`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Section Title</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter section title" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Section Type */}
                      <FormField>
                        control={form.control}
                        name={`sections.${index}.sectionType`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Section Type</FormLabel>
                            <FormControl>
                              <Select>
                                value={field.value}
                                onValueChange={field.onChange}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select section type" />
                                </SelectTrigger>
                                <SelectContent>
                                  {sectionTypeOptions.map((option) => (
                                    \1>
                                      {option.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Section Content */}
                      <FormField>
                        control={form.control}
                        name={`sections.${index}.content`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Section Content</FormLabel>
                            <FormControl>
                              <Textarea>
                                placeholder="Enter section content"
                                className="min-h-[150px]"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </CardContent>
                  </Card>
                ))}

                {(!form.watch('sections') || form.watch('sections').length === 0) && (
                  \1>
                    No sections added. Click "Add Section" to add document sections.
                  </div>
                )}
              </TabsContent>

              \1>
                {/* Confidentiality */}
                <FormField>
                  control={form.control}
                  name="isConfidential"
                  render={({ field }) => (
                    \1>
                      \1>
                        <FormLabel className="text-base">Confidential Document\1>
                        <FormDescription>
                          Mark this document as confidential with restricted access
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch>
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                {/* Tags */}
                \1>
                  \1>
                    <FormLabel className="text-base">Document Tags\1>
                    <FormDescription>
                      Add tags to categorize and find the document easily (coming soon)
                    </FormDescription>
                  </div>
                </div>

                {/* Attachments */}
                \1>
                  \1>
                    <FormLabel className="text-base">Document Attachments\1>
                    <FormDescription>
                      Upload files to attach to this document (coming soon)
                    </FormDescription>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </form>
        </Form>
      </CardContent>

      \1>
        <Button>
          variant="outline"
          onClick={() => router.back()}
          disabled={submitLoading}
        >
          Cancel
        </Button>

        \1>
          {isEditing && (
            <Button>
              variant="secondary"
              onClick={() => router.push(`/clinical-documentation/${\1}`}
              disabled={submitLoading}
            >
              View Document
            </Button>
          )}

          <Button>
            onClick={form.handleSubmit(onSubmit)}
            disabled={submitLoading || loading}
          >
            {submitLoading ? 'Saving...' : (isEditing ? 'Update Document' : 'Create Document')}
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
