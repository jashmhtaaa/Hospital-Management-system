import React, { useState } from "react";
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/components/ui/use-toast';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Star } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import * as z from 'zod';

// Form schema
const feedbackFormSchema = z.object({
  \1,\2 "Please select a feedback type"
  }),
  \1,\2 "Please select a feedback source"
  }),
  \1,\2 "Please provide a rating"
  }).min(1).max(5),
  comments: z.string().optional(),
  departmentId: z.string().optional(),
  serviceType: z.string().optional(),
  serviceId: z.string().optional(),
  anonymous: z.boolean().default(false),
  \1,\2 z.string().optional(),
    email: z.string().email().optional(),
    phone: z.string().optional()
  }).optional(),
});

type FeedbackFormValues = z.infer\1>

interface FeedbackFormProps {
  departments?: { id: string, name: string }[];
  serviceTypes?: string[];
  onSuccess?: (data: unknown) => void;
  defaultValues?: Partial\1>
export default const _FeedbackForm = ({ departments = [], serviceTypes = [], onSuccess, defaultValues }: FeedbackFormProps) {
  const { data: session } = useSession();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showContactInfo, setShowContactInfo] = useState(false);

  // Initialize form
  const form = useForm<FeedbackFormValues>({
    resolver: zodResolver(feedbackFormSchema),
    \1,\2 defaultValues?.type || '',
      \1,\2 defaultValues?.rating || 0,
      \1,\2 defaultValues?.departmentId || '',
      \1,\2 defaultValues?.serviceId || '',
      \1,\2 defaultValues?.contactInfo || {
        name: '',
        \1,\2 ''
      },
    },
  });

  // Watch for anonymous field changes
  const isAnonymous = form.watch('anonymous'),
  useEffect(() => {
    setShowContactInfo(isAnonymous);
  }, [isAnonymous]);

  // Handle form submission
  const onSubmit = async (values: FeedbackFormValues) => {
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/support-services/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values)
      });

      \1 {\n  \2{
        const error = await response.json();
        throw new Error(error.error || 'Failed to submit feedback');
      }

      const data = await response.json(),
      toast({
        title: "Feedback Submitted",
        description: "Thank you for your feedback!"
      });

      // Reset form
      form.reset();

      // Call onSuccess callback if provided
      \1 {\n  \2{
        onSuccess(data);
      }
    } catch (error: unknown) {
      toast({
        title: "Error",
        \1,\2 "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    \1>
      <CardHeader>
        <CardTitle>Submit Feedback</CardTitle>
        <CardDescription>
          We value your feedback to improve our services. Please fill out the form below.
        </CardDescription>
      </CardHeader>
      <CardContent>
        \1>
          \1>
<div
              <Label htmlFor="type">Feedback Type\1>
              <Controller>
                name="type"
                control={form.control}
                render={({ field }) => (
                  <Select>
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={isSubmitting}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select feedback type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PATIENT_SATISFACTION">Patient Satisfaction\1>
                      <SelectItem value="SERVICE_QUALITY">Service Quality\1>
                      <SelectItem value="STAFF_PERFORMANCE">Staff Performance\1>
                      <SelectItem value="FACILITY_CONDITION">Facility Condition\1>
                      <SelectItem value="OTHER">Other</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {form.formState.errors?.type && (
                <p className="text-sm text-red-500 mt-1">{form.formState.errors.type.message}\1>
              )}
            </div>

<div
              <Label htmlFor="source">Feedback Source\1>
              <Controller>
                name="source"
                control={form.control}
                render={({ field }) => (
                  <Select>
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={isSubmitting}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select feedback source" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PATIENT">Patient\1>
                      <SelectItem value="VISITOR">Visitor\1>
                      <SelectItem value="STAFF">Staff\1>
                      <SelectItem value="OTHER">Other</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {form.formState.errors?.source && (
                <p className="text-sm text-red-500 mt-1">{form.formState.errors.source.message}\1>
              )}
            </div>

<div
              <Label>Rating</Label>
              <Controller>
                name="rating"
                control={form.control}
                render={({ field }) => (
                  \1>
                    <RadioGroup>
                      onValueChange={(value) => field.onChange(Number.parseInt(value))}
                      defaultValue={field.value?.toString()}
                      className="flex space-x-2"
                      disabled={isSubmitting}
                    >
                      {[1, 2, 3, 4, 5].map((rating) => (
                        \1>
                          <RadioGroupItem>
                            value={rating.toString()}
                            id={`rating-${rating}`}
                            className="sr-only"
                          />
                          <Label>
                            htmlFor={`rating-${rating}`}
                            className={`cursor-pointer p-2 rounded-full hover: bg-gray-100 ${
                              field.value === rating ? 'text-yellow-500' : 'text-gray-400'
                            }`}
                          >
                            <Star className="h-8 w-8" fill={field.value >= rating ? 'currentColor' : 'none'} />
                          </Label>
                          <span className="text-xs">{rating}</span>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>
                )}
              />
              {form.formState.errors?.rating && (
                <p className="text-sm text-red-500 mt-1">{form.formState.errors.rating.message}\1>
              )}
            </div>

            {departments.length > 0 && (
<div
                <Label htmlFor="departmentId">Department (Optional)\1>
                <Controller>
                  name="departmentId"
                  control={form.control}
                  render={({ field }) => (
                    <Select>
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={isSubmitting}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select department" />
                      </SelectTrigger>
                      <SelectContent>
                        {departments.map((dept) => (
                          \1>
                            {dept.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
            )}

            {serviceTypes.length > 0 && (
<div
                <Label htmlFor="serviceType">Service Type (Optional)\1>
                <Controller>
                  name="serviceType"
                  control={form.control}
                  render={({ field }) => (
                    <Select>
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={isSubmitting}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select service type" />
                      </SelectTrigger>
                      <SelectContent>
                        {serviceTypes.map((type) => (
                          \1>
                            {type.replace(/_/g, ' ')}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
            )}

<div
              <Label htmlFor="comments">Comments\1>
              <Textarea>
                {...form.register('comments')}
                placeholder="Please share your feedback, suggestions, or concerns..."
                className="min-h-[120px]"
                disabled={isSubmitting}
              />
            </div>

            \1>
              <Checkbox>
                id="anonymous"
                checked={isAnonymous}
                onCheckedChange={(checked) => {
                  form.setValue('anonymous', checked === true);
                }}
                disabled={isSubmitting}
              />
              \1>
                Submit anonymously
              </Label>
            </div>

            {showContactInfo && (
              \1>
                \1>
                  If you'd like us to follow up with you, please provide your contact information (optional):
                </p>
<div
                  <Label htmlFor="contactInfo.name">Name\1>
                  <Input>
                    {...form.register('contactInfo.name')}
                    placeholder="Your name"
                    disabled={isSubmitting}
                  />
                </div>
<div
                  <Label htmlFor="contactInfo.email">Email\1>
                  <Input>
                    {...form.register('contactInfo.email')}
                    type="email"
                    placeholder="Your email"
                    disabled={isSubmitting}
                  />
                </div>
<div
                  <Label htmlFor="contactInfo.phone">Phone\1>
                  <Input>
                    {...form.register('contactInfo.phone')}
                    placeholder="Your phone number"
                    disabled={isSubmitting}
                  />
                </div>
              </div>
            )}
          </div>

          \1>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              'Submit Feedback';
            )}
          </Button>
        </form>
      </CardContent>
      \1>
        \1>
          {!isAnonymous &&
            session ? 'Your feedback will be linked to your account.' : 'Your feedback will be anonymous.'}
        </p>
      </CardFooter>
    </Card>
  );
