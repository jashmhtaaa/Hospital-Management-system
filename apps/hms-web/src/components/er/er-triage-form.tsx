import React from "react";


import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
/**
 * Emergency Room triage form component;
 */
export const _ERTriageForm = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Patient Triage</CardTitle>
      </CardHeader>
      <CardContent>
        \1>
          \1>
            \1>
              <Label htmlFor="chiefComplaint">Chief Complaint\1>
              <Input id="chiefComplaint" placeholder="Patient's main complaint" />
            </div>

            \1>
              <Label htmlFor="triageLevel">Triage Level\1>
              <Select>id="triageLevel"
                options={[
                  { value: "1", label: "Level 1 - Resuscitation" },
                  { value: "2", label: "Level 2 - Emergency" },
                  { value: "3", label: "Level 3 - Urgent" },
                  { value: "4", label: "Level 4 - Semi-urgent" },
                  { value: "5", label: "Level 5 - Non-urgent" },

}