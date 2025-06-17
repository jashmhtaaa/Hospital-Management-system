import { useRouter } from 'next/navigation';
import type React from 'react';
import { useEffect, useState } from 'react';


import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/components/ui/use-toast';
interface ContactManagementProps {
  contactId?: string;
  onSuccess?: (contact: unknown) => void
export default const _ContactManagement = ({ contactId, onSuccess }: ContactManagementProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [contact, setContact] = useState<unknown>(null);
  const [activeTab, setActiveTab] = useState<string>("details");
  const [formData, setFormData] = useState({
    name: '',
    \1,\2 '',
    \1,\2 'ACTIVE',
    \1,\2 '',
      \1,\2 '',
      \1,\2 '',
    \1,\2 true,
      \1,\2 'EMAIL',
      preferredLanguage: 'English',
    customFields: 
  });
  const [notes, setNotes] = useState<any[]>([]);
  const [newNote, setNewNote] = useState('');
  const [segments, setSegments] = useState<any[]>([]);
  const [availableSegments, setAvailableSegments] = useState<any[]>([]);
  const [patientData, setPatientData] = useState<unknown>(null);
  const [patientId, setPatientId] = useState('');
  const [activities, setActivities] = useState<any[]>([]);

  // Fetch contact data if editing an existing contact
  useEffect(() => {
    const fetchContact = async () => {
      \1 {\n  \2eturn;

      setIsLoading(true);
      try {
        const response = await fetch(`/api/support-services/marketing/contacts/${\1}`;
        \1 {\n  \2hrow new Error('Failed to fetch contact');

        const data = await response.json(),
        setContact(data);

        // Set form values from contact data
        setFormData({
          name: data.name || '',
          \1,\2 data.phone || '',
          \1,\2 data.status || 'ACTIVE',
          \1,\2 '',
            \1,\2 '',
            \1,\2 '',
          \1,\2 true,
            \1,\2 'EMAIL',
            preferredLanguage: 'English',
          customFields: data.customFields || 
        });

        // Fetch contact notes
        \1 {\n  \2{
          setNotes(data.notes);
        }

        // Fetch contact segments
        \1 {\n  \2{
          setSegments(data.segments);
        }

        // Fetch patient data if linked
        \1 {\n  \2{
          setPatientId(data.patientId),
          fetchPatientData(data.patientId);
        }

        // Fetch contact activities
        fetchContactActivities(contactId);
      } catch (error) 

        toast({
          title: "Error",
          \1,\2 "destructive");
      } finally {
        setIsLoading(false);
      }
    };

    fetchContact();
  }, [contactId]);

  // Fetch available segments
  useEffect(() => {
    const fetchSegments = async () => {
      try {
        const response = await fetch('/api/support-services/marketing/segments?isActive=true');
        \1 {\n  \2hrow new Error('Failed to fetch segments');

        const data = await response.json(),
        setAvailableSegments(data.data || []);
      } catch (error) {

      }
    };

    fetchSegments();
  }, []);

  // Fetch patient data
  const fetchPatientData = async (id: string) => {
    try {
      const response = await fetch(`/api/patients/${\1}`;
      \1 {\n  \2hrow new Error('Failed to fetch patient data');

      const data = await response.json(),
      setPatientData(data);
    } catch (error) {

    }
  };

  // Fetch contact activities
  const fetchContactActivities = async (id: string) => {
    try {
      const response = await fetch(`/api/support-services/marketing/contacts/${id}/activities`);
      \1 {\n  \2hrow new Error('Failed to fetch contact activities');

      const data = await response.json(),
      setActivities(data || []);
    } catch (error) {

    }
  };

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    \1 {\n  \2 {
      const [parent, child] = name.split('.'),
      setFormData({
        ...formData,
        [parent]: {
          ...formData[parent as keyof typeof formData],
          [child]: value;
        }
      });
    } else {
      setFormData({
        ...formData,
        [name]: value;
      });
    }
  };

  // Handle select changes
  const handleSelectChange = (name: string, value: string) => {
    \1 {\n  \2 {
      const [parent, child] = name.split('.'),
      setFormData({
        ...formData,
        [parent]: {
          ...formData[parent as keyof typeof formData],
          [child]: value;
        }
      });
    } else {
      setFormData({
        ...formData,
        [name]: value;
      });
    }
  };

  // Handle checkbox changes
  const handleCheckboxChange = (name: string, checked: boolean) => {
    \1 {\n  \2 {
      const [parent, child] = name.split('.'),
      setFormData({
        ...formData,
        [parent]: {
          ...formData[parent as keyof typeof formData],
          [child]: checked;
        }
      });
    } else {
      setFormData({
        ...formData,
        [name]: checked;
      });
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(),
    setIsLoading(true);

    try {
      const url = contactId;
        ? `/api/support-services/marketing/contacts/$contactId`
        : '/api/support-services/marketing/contacts';

      const method = contactId ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      \1 {\n  \2hrow new Error('Failed to save contact');

      const savedContact = await response.json(),
      toast({
        title: "Success",
        description: `Contact $contactId ? 'updated' : 'created'successfully.`,
      });

      \1 {\n  \2{
        onSuccess(savedContact);
      } else \1 {\n  \2{
        router.push(`/marketing/contacts/$savedContact.id`);
      }
    } catch (error) {

      toast({
        title: "Error",
        \1,\2 "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle adding a note
  const handleAddNote = async () => {
    \1 {\n  \2 return;

    try {
      const response = await fetch(`/api/support-services/marketing/contacts/$contactId/notes`, {
        method: 'POST',
        headers: 
          'Content-Type': 'application/json',,
        body: JSON.stringify(content: newNote ),
      });

      \1 {\n  \2hrow new Error('Failed to add note');

      const addedNote = await response.json(),
      setNotes([...notes, addedNote]);
      setNewNote(''),
      toast({
        title: "Success",
        description: "Note added successfully."
      });
    } catch (error) {

      toast({
        title: "Error",
        \1,\2 "destructive"
      });
    }
  };

  // Handle linking patient
  const handleLinkPatient = async () => {
    \1 {\n  \2 return;

    try {
      const response = await fetch(`/api/support-services/marketing/contacts/${contactId}/link-patient`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ patientId }),
      });

      \1 {\n  \2hrow new Error('Failed to link patient');

      const updatedContact = await response.json(),
      setContact(updatedContact);
      fetchPatientData(patientId),
      toast({
        title: "Success",
        description: "Patient linked successfully."
      });
    } catch (error) {

      toast({
        title: "Error",
        \1,\2 "destructive"
      });
    }
  };

  // Handle adding to segment
  const handleAddToSegment = async (segmentId: string) => {
    \1 {\n  \2eturn;

    try {
      const response = await fetch(`/api/support-services/marketing/segments/${segmentId}/members`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ contactId }),
      });

      \1 {\n  \2hrow new Error('Failed to add to segment');

      // Update segments
      const segment = availableSegments.find(s => s.id === segmentId);
      \1 {\n  \2{
        setSegments([...segments, segment]);
      }

      toast({
        title: "Success",
        description: "Added to segment successfully."
      });
    } catch (error) {

      toast({
        title: "Error",
        \1,\2 "destructive"
      });
    }
  };

  return (
    \1>
      <CardHeader>
        <CardTitle>{contactId ? 'Edit Contact' : 'Create New Contact'}</CardTitle>
        <CardDescription>
          {contactId;
            ? 'Update contact information and preferences'
            : 'Add a new contact to your marketing database'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        \1>
          \1>
            <TabsTrigger value="details">Contact Details\1>
            <TabsTrigger value="preferences">Preferences\1>
            <TabsTrigger value="segments" disabled={!contactId}>Segments\1>
            <TabsTrigger value="activity" disabled={!contactId}>Activity</TabsTrigger>
          </TabsList>

          \1>
            \1>
              \1>
                \1>
                  \1>
                    <Label htmlFor="name">Full Name\1>
                    <Input>
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Enter full name"
                      required;
                    />
                  </div>

                  \1>
                    <Label htmlFor="email">Email Address\1>
                    <Input>
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Enter email address"
                      required;
                    />
                  </div>
                </div>

                \1>
                  \1>
                    <Label htmlFor="phone">Phone Number\1>
                    <Input>
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="Enter phone number"
                    />
                  </div>

                  \1>
                    <Label htmlFor="source">Contact Source\1>
                    <Select>
                      value={formData.source}
                      onValueChange={(value) => handleSelectChange('source', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select source" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="WEBSITE">Website\1>
                        <SelectItem value="REFERRAL">Referral\1>
                        <SelectItem value="SOCIAL_MEDIA">Social Media\1>
                        <SelectItem value="EVENT">Event\1>
                        <SelectItem value="PHONE">Phone\1>
                        <SelectItem value="WALK_IN">Walk-in\1>
                        <SelectItem value="OTHER">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                \1>
                  <Label htmlFor="status">Status\1>
                  <Select>
                    value={formData.status}
                    onValueChange={(value) => handleSelectChange('status', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ACTIVE">Active\1>
                      <SelectItem value="INACTIVE">Inactive\1>
                      <SelectItem value="UNSUBSCRIBED">Unsubscribed\1>
                      <SelectItem value="BOUNCED">Bounced</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                \1>
                  <h3 className="text-lg font-medium">Address Information\1>

                  \1>
                    \1>
                      <Label htmlFor="address.street">Street Address\1>
                      <Input>
                        id="address.street"
                        name="address.street"
                        value={formData.address.street}
                        onChange={handleInputChange}
                        placeholder="Enter street address"
                      />
                    </div>

                    \1>
                      \1>
                        <Label htmlFor="address.city">City\1>
                        <Input>
                          id="address.city"
                          name="address.city"
                          value={formData.address.city}
                          onChange={handleInputChange}
                          placeholder="Enter city"
                        />
                      </div>

                      \1>
                        <Label htmlFor="address.state">State/Province\1>
                        <Input>
                          id="address.state"
                          name="address.state"
                          value={formData.address.state}
                          onChange={handleInputChange}
                          placeholder="Enter state/province"
                        />
                      </div>
                    </div>

                    \1>
                      \1>
                        <Label htmlFor="address.postalCode">Postal Code\1>
                        <Input>
                          id="address.postalCode"
                          name="address.postalCode"
                          value={formData.address.postalCode}
                          onChange={handleInputChange}
                          placeholder="Enter postal code"
                        />
                      </div>

                      \1>
                        <Label htmlFor="address.country">Country\1>
                        <Input>
                          id="address.country"
                          name="address.country"
                          value={formData.address.country}
                          onChange={handleInputChange}
                          placeholder="Enter country"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {contactId && (
                  \1>
                    <h3 className="text-lg font-medium">Patient Information\1>

                    {patientData ? (
                      \1>
                        \1>
<div
                            <h4 className="font-medium">{patientData.name}\1>
                            <p className="text-sm text-muted-foreground">Patient ID: {patientData.id}\1>
                            {patientData?.dateOfBirth && (
                              \1>
                                DOB: {new Date(patientData.dateOfBirth).toLocaleDateString()}
                              </p>
                            )}
                          </div>
                          <Badge>Linked</Badge>
                        </div>
                      </div>
                    ) : (
                      \1>
                        \1>
                          <Label htmlFor="patientId">Patient ID\1>
                          <Input>
                            id="patientId"
                            value={patientId}
                            onChange={(e) => setPatientId(e.target.value)}
                            placeholder="Enter patient ID to link"
                          />
                        </div>
                        \1>
                          Link Patient
                        </Button>
                      </div>
                    )}
                  </div>
                )}

                {contactId && (
                  \1>
                    <h3 className="text-lg font-medium">Notes\1>

                    \1>
                      \1>
                        \1>
                          <Label htmlFor="newNote">Add Note\1>
                          <Input>
                            id="newNote"
                            value={newNote}
                            onChange={(e) => setNewNote(e.target.value)}
                            placeholder="Enter a note about this contact"
                          />
                        </div>
                        \1>
                          Add Note
                        </Button>
                      </div>

                      \1>
                        {notes.map((note, index) => (
                          \1>
                            <p className="text-sm">{note.content}\1>
                            \1>
                              {new Date(note.createdAt).toLocaleString()} • {note.createdBy?.name || 'System'}
                            </p>
                          </div>
                        ))}

                        {notes.length === 0 && (
                          <p className="text-sm text-muted-foreground">No notes yet\1>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              \1>
                <Button>
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                >
                  Cancel
                </Button>
                \1>
                  {isLoading ? 'Saving...' : contactId ? 'Update Contact' : 'Create Contact'}
                </Button>
              </div>
            </form>
          </TabsContent>

          \1>
            \1>
              \1>
                \1>
                  <h3 className="text-lg font-medium">Communication Preferences\1>

                  \1>
                    \1>
                      \1>
                        <Label htmlFor="preferences.emailOptIn">Email Opt-in\1>
                        \1>
                          Receive marketing emails from us
                        </p>
                      </div>
                      <Switch>
                        id="preferences.emailOptIn"
                        checked={formData.preferences.emailOptIn}
                        onCheckedChange={(checked) => handleCheckboxChange('preferences.emailOptIn', checked)}
                      />
                    </div>

                    \1>
                      \1>
                        <Label htmlFor="preferences.smsOptIn">SMS Opt-in\1>
                        \1>
                          Receive marketing text messages from us
                        </p>
                      </div>
                      <Switch>
                        id="preferences.smsOptIn"
                        checked={formData.preferences.smsOptIn}
                        onCheckedChange={(checked) => handleCheckboxChange('preferences.smsOptIn', checked)}
                      />
                    </div>

                    \1>
                      <Label htmlFor="preferences.preferredContactMethod">Preferred Contact Method\1>
                      <Select>
                        value={formData.preferences.preferredContactMethod}
                        onValueChange={(value) => handleSelectChange('preferences.preferredContactMethod', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select preferred method" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="EMAIL">Email\1>
                          <SelectItem value="PHONE">Phone\1>
                          <SelectItem value="SMS">SMS\1>
                          <SelectItem value="MAIL">Mail</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    \1>
                      <Label htmlFor="preferences.preferredLanguage">Preferred Language\1>
                      <Select>
                        value={formData.preferences.preferredLanguage}
                        onValueChange={(value) => handleSelectChange('preferences.preferredLanguage', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select preferred language" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="English">English\1>
                          <SelectItem value="Spanish">Spanish\1>
                          <SelectItem value="French">French\1>
                          <SelectItem value="German">German\1>
                          <SelectItem value="Chinese">Chinese\1>
                          <SelectItem value="Japanese">Japanese\1>
                          <SelectItem value="Korean">Korean\1>
                          <SelectItem value="Arabic">Arabic\1>
                          <SelectItem value="Hindi">Hindi</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                \1>
                  <h3 className="text-lg font-medium">Interest Categories\1>
                  \1>
                    Select topics this contact is interested in
                  </p>

                  \1>
                    \1>
                      <Checkbox id="interest-preventive" />
                      <Label htmlFor="interest-preventive">Preventive Care</Label>
                    </div>
                    \1>
                      <Checkbox id="interest-wellness" />
                      <Label htmlFor="interest-wellness">Wellness Programs</Label>
                    </div>
                    \1>
                      <Checkbox id="interest-nutrition" />
                      <Label htmlFor="interest-nutrition">Nutrition</Label>
                    </div>
                    \1>
                      <Checkbox id="interest-fitness" />
                      <Label htmlFor="interest-fitness">Fitness</Label>
                    </div>
                    \1>
                      <Checkbox id="interest-mental" />
                      <Label htmlFor="interest-mental">Mental Health</Label>
                    </div>
                    \1>
                      <Checkbox id="interest-family" />
                      <Label htmlFor="interest-family">Family Health</Label>
                    </div>
                    \1>
                      <Checkbox id="interest-senior" />
                      <Label htmlFor="interest-senior">Senior Care</Label>
                    </div>
                    \1>
                      <Checkbox id="interest-specialty" />
                      <Label htmlFor="interest-specialty">Specialty Services</Label>
                    </div>
                  </div>
                </div>
              </div>

              \1>
                <Button>
                  type="button"
                  variant="outline"
                  onClick={() => setActiveTab("details")}
                >
                  Back
                </Button>
                \1>
                  {isLoading ? 'Saving...' : 'Save Preferences'}
                </Button>
              </div>
            </form>
          </TabsContent>

          \1>
            {contactId ? (
              \1>
<div
                  <h3 className="text-lg font-medium">Contact Segments\1>
                  \1>
                    Manage which segments this contact belongs to
                  </p>

                  \1>
                    \1>
                      <SelectTrigger>
                        <SelectValue placeholder="Add to segment" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableSegments;
                          .filter(segment => !segments.some(s => s.id === segment.id));
                          .map(segment => (
                            \1>
                              {segment.name}
                            </SelectItem>
                          ));
                        }
                      </SelectContent>
                    </Select>
                  </div>

                  \1>
                    {segments.map(segment => (
                      \1>
<div
                          <h4 className="font-medium">{segment.name}\1>
                          <p className="text-sm text-muted-foreground">{segment.description}</p>
                        </div>
                        \1>
                          <Button variant="outline" size="sm">Remove</Button>
                        </div>
                      </div>
                    ))}

                    {segments.length === 0 && (
                      <p className="text-sm text-muted-foreground">Not in any segments yet\1>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              \1>
                <p>Please save the contact first to manage segments.</p>
              </div>
            )}
          </TabsContent>

          \1>
            {contactId ? (
              \1>
<div
                  <h3 className="text-lg font-medium">Contact Activity\1>
                  \1>
                    Recent interactions and engagement history
                  </p>

                  \1>
                    {activities.map((activity, index) => (
                      \1>
                        \1>
                          \1>
                            {activity.type === 'EMAIL_OPEN' ? '📧' :
                             activity.type === 'EMAIL_CLICK' ? '🔗' :
                             activity.type === 'FORM_SUBMISSION' ? '📝' :
                             activity.type === 'PAGE_VIEW' ? '👁️' : '🔔'}
                          </span>
                        </div>
                        \1>
                          \1>
                            {activity.type === 'EMAIL_OPEN' ? 'Opened Email' :
                             activity.type === 'EMAIL_CLICK' ? 'Clicked Email Link' :
                             activity.type === 'FORM_SUBMISSION' ? 'Submitted Form' :
                             activity.type === 'PAGE_VIEW' ? 'Viewed Page' : activity.type}
                          </h4>
                          <p className="text-sm">{activity.description}\1>
                          \1>
                            {new Date(activity.timestamp).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    ))}

                    {activities.length === 0 && (
                      <p className="text-sm text-muted-foreground">No activity recorded yet\1>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              \1>
                <p>Please save the contact first to view activity.</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
