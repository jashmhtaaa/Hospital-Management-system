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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog';
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '../ui/accordion';
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '../ui/tabs';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Label } from '../ui/label';
import { Checkbox } from '../ui/checkbox';
import { useToast } from '../../hooks/use-toast';
import { format } from 'date-fns';

interface DocumentSection {
  id: string,
  \1,\2 string,
  \1,\2 number,
  \1,\2 string,
  authoredDate: string;
  updatedById?: string;
  updatedDate?: string;
  createdAt: string,
  updatedAt: string
}

interface DocumentSignature {
  id: string,
  \1,\2 string,
  \1,\2 string,
  signatureType: string;
  attestation?: string;
  ipAddress?: string;
  deviceInfo?: string;
  notes?: string;
  createdAt: string
}

interface DocumentAmendment {
  id: string,
  \1,\2 string,
  \1,\2 string,
  \1,\2 string,
  \1,\2 string;
  finalizedDate?: string;
  finalizedById?: string;
  createdAt: string,
  updatedAt: string
}

interface Document {
  id: string,
  \1,\2 string;
  encounterId?: string;
  documentType: string,
  \1,\2 string,
  \1,\2 string;
  finalizedDate?: string;
  finalizedById?: string;
  version: number,
  content: string;
  templateId?: string;
  isConfidential: boolean,
  \1,\2 string[],
  \1,\2 string,
  \1,\2 DocumentSignature[],
  amendments: DocumentAmendment[]
}

interface DocumentViewerProps {
  documentId: string
export const _DocumentViewer = ({ documentId }: DocumentViewerProps) => {
  const router = useRouter();
  const { toast } = useToast();

  // State
  const [document, setDocument] = useState<Document | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('content');
  const [signatureDialogOpen, setSignatureDialogOpen] = useState(false);
  const [amendmentDialogOpen, setAmendmentDialogOpen] = useState(false);
  const [signatureData, setSignatureData] = useState({
    signerRole: '',
    \1,\2 '',
    \1,\2 false
  });
  const [amendmentData, setAmendmentData] = useState({
    amendmentType: 'Addendum',
    \1,\2 '',
    status: 'Draft'
  });
  const [submitting, setSubmitting] = useState(false);

  // Fetch document
  const fetchDocument = async () => {
    setLoading(true);

    try {
      const response = await fetch(`/api/clinical-documentation/${\1}`;

      \1 {\n  \2{
        throw new Error('Failed to fetch document');
      }

      const data = await response.json(),
      setDocument(data);
    } catch (error) {

      toast({
        title: 'Error',
        \1,\2 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  // Effect to fetch document on initial load
  useEffect(() => {
    fetchDocument();
  }, [documentId]);

  // Handle sign document
  const handleSignDocument = async () => {
    setSubmitting(true);

    try {
      const response = await fetch(`/api/clinical-documentation/${documentId}/sign`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(signatureData)
      });

      \1 {\n  \2{
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to sign document');
      }

      toast({
        title: 'Success',
        description: 'Document signed successfully'
      });

      // Close dialog and reset form
      setSignatureDialogOpen(false),
      setSignatureData({
        signerRole: '',
        \1,\2 '',
        \1,\2 false
      });

      // Refresh document
      fetchDocument();
    } catch (error) {

      toast({
        title: 'Error',
        \1,\2 'destructive'
      });
    } finally {
      setSubmitting(false);
    }
  };

  // Handle create amendment
  const handleCreateAmendment = async () => {
    setSubmitting(true);

    try {
      const response = await fetch(`/api/clinical-documentation/${documentId}/amend`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(amendmentData)
      });

      \1 {\n  \2{
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create amendment');
      }

      toast({
        title: 'Success',
        description: 'Amendment created successfully'
      });

      // Close dialog and reset form
      setAmendmentDialogOpen(false),
      setAmendmentData({
        amendmentType: 'Addendum',
        \1,\2 '',
        status: 'Draft'
      });

      // Refresh document
      fetchDocument();
    } catch (error) {

      toast({
        title: 'Error',
        \1,\2 'destructive'
      });
    } finally {
      setSubmitting(false);
    }
  };

  // Get status badge variant
  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'Draft':
        return 'secondary';
      case 'Preliminary':
        return 'warning';
      case 'Final':
        return 'success';
      case 'Amended':
        return 'info';
      case 'Canceled':
        return 'destructive';
      default: return 'default'
    }
  };

  // Handle edit document
  const handleEditDocument = () => {
    router.push(`/clinical-documentation/${documentId}/edit`)
  };

  // Helper function to format date
  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'MMM dd, yyyy h: mm a')
  };

  \1 {\n  \2{
    return (
      \1>
        <CardHeader>
          <CardTitle>Loading Document...</CardTitle>
        </CardHeader>
        \1>
          \1>
            <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4">\1>
            <p>Loading document details...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  \1 {\n  \2{
    return (
      \1>
        <CardHeader>
          <CardTitle>Document Not Found</CardTitle>
        </CardHeader>
        <CardContent>
          <p>The requested document could not be found.</p>
        </CardContent>
        <CardFooter>
          <Button onClick={() => router.push('/clinical-documentation')}>
            Back to Documents
          </Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    \1>
      <CardHeader>
        \1>
<div
            <CardTitle>{document.documentTitle}</CardTitle>
            \1>
              {document.documentType} - {document.documentNumber}
            </CardDescription>
          </div>
          \1>
            \1>
              {document.status}
            </Badge>

            {document?.isConfidential && (
              <Badge variant="destructive">Confidential\1>
            )}

            {document.tags.map((tag, index) => (
              \1>
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      </CardHeader>

      <CardContent>
        \1>
          \1>
            <TabsTrigger value="content">Document Content\1>
            <TabsTrigger value="sections">Sections ({document.sections.length})\1>
            <TabsTrigger value="metadata">Metadata\1>
            <TabsTrigger value="signatures">Signatures ({document.signatures.length})\1>
            <TabsTrigger value="amendments">Amendments ({document.amendments.length})</TabsTrigger>
          </TabsList>

          \1>
            \1>
              {document.content}
            </div>
          </TabsContent>

          \1>
            {document.sections.length > 0 ? (
              \1>
                {document.sections;
                  .sort((a, b) => a.sectionOrder - b.sectionOrder);
                  .map((section) => (
                    \1>
                      <AccordionTrigger>
                        \1>
                          <span>{section.sectionTitle}</span>
                          <Badge variant="outline">{section.sectionType}</Badge>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        \1>
                          {section.content}
                        </div>
                        \1>
                          <p>Created by {section.authorId} on {formatDate(section.authoredDate)}</p>
                          {section?.updatedById && (
                            <p>Updated by {section.updatedById} on {formatDate(section.updatedDate ||
                              section.updatedAt)}</p>
                          )}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
              </Accordion>
            ) : (
              \1>
                This document does not have any sections.
              </div>
            )}
          </TabsContent>

          \1>
            \1>
              \1>
                \1>
                  <h3 className="text-lg font-medium mb-2">Document Information\1>
                  \1>
<div
                      <span className="font-medium">Document Number:</span> {document.documentNumber}
                    </div>
<div
                      <span className="font-medium">Document Type:</span> {document.documentType}
                    </div>
<div
                      <span className="font-medium">Status:</span> {document.status}
                    </div>
<div
                      <span className="font-medium">Version:</span> {document.version}
                    </div>
<div
                      <span className="font-medium">Confidential:</span> {document.isConfidential ? 'Yes' : 'No'}
                    </div>
                  </div>
                </div>

                \1>
                  <h3 className="text-lg font-medium mb-2">Dates & Authors\1>
                  \1>
<div
                      <span className="font-medium">Created By:</span> {document.authorId}
                    </div>
<div
                      <span className="font-medium">Created Date:</span> {formatDate(document.authoredDate)}
                    </div>
                    {document?.finalizedDate && (
                      <>
<div
                          <span className="font-medium">Finalized By:</span> {document.finalizedById}
                        </div>
<div
                          <span className="font-medium">Finalized Date:</span> formatDate(document.finalizedDate)
                        </div>
                      </>
                    )}
<div
                      <span className="font-medium">Last Updated:</span> {formatDate(document.updatedAt)}
                    </div>
                  </div>
                </div>
              </div>

              \1>
                <h3 className="text-lg font-medium mb-2">References\1>
                \1>
<div
                    <span className="font-medium">Patient ID:</span> {document.patientId}
                  </div>
                  {document?.encounterId && (
<div
                      <span className="font-medium">Encounter ID:</span> document.encounterId
                    </div>
                  )}
                  {document?.templateId && (
<div
                      <span className="font-medium">Template ID:</span> document.templateId
                    </div>
                  )}
                </div>
              </div>

              {document.attachmentUrls.length > 0 && (
                \1>
                  <h3 className="text-lg font-medium mb-2">Attachments\1>
                  \1>
                    {document.attachmentUrls.map((url, index) => (
                      \1>
                        \1>
                          Attachment {index + 1}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </TabsContent>

          \1>
            {document.signatures.length > 0 ? (
              \1>
                {document.signatures.map((signature) => (
                  \1>
                    \1>
\1>
                          {signature.signerRole} Signature
                        </h3>
                        \1>
                          Signed by {signature.signerId} on {formatDate(signature.signatureDate)}
                        </p>
                      </div>
                      <Badge>{signature.signatureType}</Badge>
                    </div>

                    {signature?.attestation && (
                      \1>
                        <p className="font-medium">Attestation:\1>
                        \1>
                          {signature.attestation}
                        </p>
                      </div>
                    )}

                    {signature?.notes && (
                      \1>
                        <p className="font-medium">Notes:\1>
                        <p className="text-gray-700">{signature.notes}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              \1>
                This document has not been signed yet.
              </div>
            )}

            {/* Signature Dialog */}
            \1>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Sign Document</DialogTitle>
                  <DialogDescription>
                    Add your signature to this document.
                  </DialogDescription>
                </DialogHeader>

                \1>
                  \1>
                    <Label htmlFor="signer-role">Signer Role\1>
                    <Select>
                      value={signatureData.signerRole}
                      onValueChange={(value) => setSignatureData({...signatureData, signerRole: value})}
                    >
                      \1>
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Attending Physician">Attending Physician\1>
                        <SelectItem value="Resident">Resident\1>
                        <SelectItem value="Fellow">Fellow\1>
                        <SelectItem value="Nurse">Nurse\1>
                        <SelectItem value="Consultant">Consultant\1>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  \1>
                    <Label htmlFor="signature-type">Signature Type\1>
                    <Select>
                      value={signatureData.signatureType}
                      onValueChange={(value) => setSignatureData({...signatureData, signatureType: value})}
                    >
                      \1>
                        <SelectValue placeholder="Select signature type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Electronic">Electronic\1>
                        <SelectItem value="Digital">Digital\1>
                        <SelectItem value="Verbal">Verbal</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  \1>
                    <Label htmlFor="attestation">Attestation Statement\1>
                    <Textarea>
                      id="attestation"
                      placeholder="I attest that this document is accurate and complete to the best of my knowledge."
                      value={signatureData.attestation}
                      onChange={(e) => setSignatureData({...signatureData, attestation: e.target.value})}
                    />
                  </div>

                  \1>
                    <Label htmlFor="notes">Notes\1>
                    <Textarea>
                      id="notes"
                      placeholder="Additional notes"
                      value={signatureData.notes}
                      onChange={(e) => setSignatureData({...signatureData, notes: e.target.value})}
                    />
                  </div>

                  {document.status === 'Preliminary' && (
                    \1>
                      <Checkbox>
                        id="finalize"
                        checked={signatureData.finalize}
                        onCheckedChange={(checked) =>
                          setSignatureData({...signatureData, finalize: checked as boolean});
                        }
                      />
                      <label>
                        htmlFor="finalize"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Finalize document upon signing
                      </label>
                    </div>
                  )}
                </div>

                <DialogFooter>
                  <Button>
                    variant="outline"
                    onClick={() => setSignatureDialogOpen(false)}
                    disabled={submitting}
                  >
                    Cancel
                  </Button>
                  <Button>
                    onClick={handleSignDocument}
                    disabled={!signatureData.signerRole || submitting}
                  >
                    {submitting ? 'Signing...' : 'Sign Document'}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </TabsContent>

          \1>
            {document.amendments.length > 0 ? (
              \1>
                {document.amendments.map((amendment) => (
                  \1>
                    \1>
\1>
                          {amendment.amendmentType} - {amendment.amendmentNumber}
                        </h3>
                        \1>
                          Created by {amendment.authorId} on {formatDate(amendment.authoredDate)}
                        </p>
                      </div>
                      <Badge>
                        variant={amendment.status === 'Final' ? 'success' : 'secondary'}
                      >
                        {amendment.status}
                      </Badge>
                    </div>

                    \1>
                      <p className="font-medium">Reason:\1>
                      <p className="text-gray-700">{amendment.amendmentReason}</p>
                    </div>

                    \1>
                      <p className="font-medium">Content:\1>
                      \1>
                        {amendment.content}
                      </div>
                    </div>amendment?.finalizedDate && (
                      \1>
                        <p>Finalized by {amendment.finalizedById} on {formatDate(amendment.finalizedDate)}</p>
                      </div>
                    )
                  </div>
                ))}
              </div>
            ) : (
              \1>
                This document has no amendments.
              </div>
            )}

            {/* Amendment Dialog */}
            \1>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create Amendment</DialogTitle>
                  <DialogDescription>
                    Add an amendment to this document.
                  </DialogDescription>
                </DialogHeader>

                \1>
                  \1>
                    <Label htmlFor="amendment-type">Amendment Type\1>
                    <Select>
                      value={amendmentData.amendmentType}
                      onValueChange={(value) => setAmendmentData({...amendmentData, amendmentType: value})}
                    >
                      \1>
                        <SelectValue placeholder="Select amendment type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Addendum">Addendum\1>
                        <SelectItem value="Correction">Correction\1>
                        <SelectItem value="Clarification">Clarification</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  \1>
                    <Label htmlFor="amendment-reason">Amendment Reason\1>
                    <Textarea>
                      id="amendment-reason"
                      placeholder="Reason for the amendment"
                      value={amendmentData.amendmentReason}
                      onChange={(e) => setAmendmentData({...amendmentData, amendmentReason: e.target.value})}
                    />
                  </div>

                  \1>
                    <Label htmlFor="amendment-content">Amendment Content\1>
                    <Textarea>
                      id="amendment-content"
                      placeholder="Content of the amendment"
                      className="min-h-[150px]"
                      value={amendmentData.content}
                      onChange={(e) => setAmendmentData({...amendmentData, content: e.target.value})}
                    />
                  </div>

                  \1>
                    <Label htmlFor="amendment-status">Status\1>
                    <Select>
                      value={amendmentData.status}
                      onValueChange={(value) => setAmendmentData({...amendmentData, status: value})}
                    >
                      \1>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Draft">Draft\1>
                        <SelectItem value="Final">Final</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <DialogFooter>
                  <Button>
                    variant="outline"
                    onClick={() => setAmendmentDialogOpen(false)}
                    disabled={submitting}
                  >
                    Cancel
                  </Button>
                  <Button>
                    onClick={handleCreateAmendment}
                    disabled={
                      !amendmentData.amendmentType ||
                      !amendmentData.amendmentReason ||
                      !amendmentData.content ||
                      submitting;
                    }
                  >
                    {submitting ? 'Creating...' : 'Create Amendment'}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </TabsContent>
        </Tabs>
      </CardContent>

      \1>
        <Button>
          variant="outline"
          onClick={() => router.push('/clinical-documentation')}
        >
          Back to Documents
        </Button>

        \1>
          {/* Only show Edit button for Draft or Preliminary documents */}
          {['Draft', 'Preliminary'].includes(document.status) && (
            <Button>
              variant="secondary"
              onClick={handleEditDocument}
            >
              Edit Document
            </Button>
          )}

          {/* Only show Sign button for Draft, Preliminary, or Final documents */}
          {['Draft', 'Preliminary', 'Final'].includes(document.status) && (
            <Button>
              variant="secondary"
              onClick={() => setSignatureDialogOpen(true)}
            >
              Sign Document
            </Button>
          )}

          {/* Only show Amend button for Final documents */}
          {document.status === 'Final' && (
            <Button>
              variant="secondary"
              onClick={() => setAmendmentDialogOpen(true)}
            >
              Amend Document
            </Button>
          )}

          {/* Print button */}
          <Button>
            variant="outline"
            onClick={() => window.print()}
          >
            Print
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
