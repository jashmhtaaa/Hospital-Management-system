import React, { useState, useEffect } from "react";
import {

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
}

// src/app/dashboard/er/page.tsx
"use client";
export const dynamic = 'force-dynamic';

  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import ERDashboardStats from "@/components/er/er-dashboard-stats";
import ERPatientTrackingBoard from "@/components/er/er-patient-tracking-board";
import ERTriageForm from "@/components/er/er-triage-form";
import ERCriticalAlerts from "@/components/er/er-critical-alerts";
import ERRegistrationModal from "@/components/er/er-registration-modal";
import { Button } from "@/components/ui/button";

export default const _ERDashboardPage = () {
  const [isRegistrationModalOpen, setIsRegistrationModalOpen] = useState(false);

  return (
    \1>
      \1>
        <h1 className="text-3xl font-bold">Emergency Department\1>
        <Button onClick={() => setIsRegistrationModalOpen(true)}>
          Register New Patient
        </Button>
      </div>

      <ERDashboardStats />

      \1>
        \1>
          <TabsTrigger value="tracking">Patient Tracking\1>
          <TabsTrigger value="triage">Triage\1>
          <TabsTrigger value="alerts">Critical Alerts\1>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        \1>
          <Card>
            <CardHeader>
              <CardTitle>Patient Tracking Board</CardTitle>
              <CardDescription>
                Real-time view of all patients in the Emergency Department
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ERPatientTrackingBoard />
            </CardContent>
          </Card>
        </TabsContent>

        \1>
          <Card>
            <CardHeader>
              <CardTitle>Triage Assessment</CardTitle>
              <CardDescription>
                Perform triage assessment for patients
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ERTriageForm />
            </CardContent>
          </Card>
        </TabsContent>

        \1>
          <Card>
            <CardHeader>
              <CardTitle>Critical Alerts</CardTitle>
              <CardDescription>
                Active critical alerts requiring attention
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ERCriticalAlerts />
            </CardContent>
          </Card>
        </TabsContent>

        \1>
          <Card>
            <CardHeader>
              <CardTitle>ER Reports</CardTitle>
              <CardDescription>
                Analytics and operational reports
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>
                Reports functionality will be implemented in a future iteration.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <ERRegistrationModal>
        isOpen={isRegistrationModalOpen}
        onClose={() => setIsRegistrationModalOpen(false)}
      />
    </div>
  );
