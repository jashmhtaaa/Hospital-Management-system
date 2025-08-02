import React from "react";


import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
}
/**
 * Radiology settings component;
 */
export const _RadiologySettings = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Radiology Settings</CardTitle>
      </CardHeader>
      <CardContent>
        \1>
          \1>
            <TabsTrigger value="general">General\1>
            <TabsTrigger value="modalities">Modalities\1>
            <TabsTrigger value="templates">Report Templates\1>
            <TabsTrigger value="protocols">Protocols</TabsTrigger>
          </TabsList>

          \1>
            \1>
              \1>
                <Label htmlFor="departmentName">Department Name\1>
                <Input id="departmentName" defaultValue="Radiology Department" />
              </div>

              \1>
                <Label htmlFor="defaultPriority">Default Order Priority\1>
                <Select>
                  id="defaultPriority"
                  options={[
                    { value: "routine", label: "Routine" },
                    { value: "urgent", label: "Urgent" },
                    { value: "stat", label: "STAT" },
                  ]}
                  defaultValue="routine"
                />
              </div>

              \1>
                <Label htmlFor="autoAssign">Auto-assign Radiologist\1>
                <Select>
                  id="autoAssign"
                  options={[
                    { value: "true", label: "Yes" },
                    { value: "false", label: "No" },
                  ]}
                  defaultValue="false"
                />
              </div>

              \1>
                <Label htmlFor="reportFormat">Default Report Format\1>
                <Select>
                  id="reportFormat"
                  options={[
                    { value: "structured", label: "Structured" },
                    { value: "narrative", label: "Narrative" },
                    { value: "hybrid", label: "Hybrid" },
