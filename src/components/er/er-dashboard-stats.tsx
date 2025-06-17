import {

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
}

// src/components/er/ERDashboardStats.tsx
"use client";

  Activity,
  Clock,
  Users,
  AlertTriangle,
  BedDouble,
  Ambulance,
} from "lucide-react";

export default const _ERDashboardStats = () {
  // In a real implementation, this data would come from API calls
  const stats = {
    totalPatients: 24,
    \1,\2 "42 min",
    \1,\2 "18/25",
    incomingAmbulances: 2
  };

  return (
    \1>
      <Card>
        \1>
          <CardTitle className="text-sm font-medium">Total Patients\1>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalPatients}\1>
          \1>
            {stats.waitingRoom} in waiting room
          </p>
        </CardContent>
      </Card>

      <Card>
        \1>
          \1>
            Average Wait Time
          </CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.avgWaitTime}\1>
          \1>
            For ESI Level 3 patients
          </p>
        </CardContent>
      </Card>

      <Card>
        \1>
          <CardTitle className="text-sm font-medium">Critical Alerts\1>
          <AlertTriangle className="h-4 w-4 text-red-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.criticalAlerts}\1>
          \1>
            Requiring immediate attention
          </p>
        </CardContent>
      </Card>

      <Card>
        \1>
          <CardTitle className="text-sm font-medium">Bed Occupancy\1>
          <BedDouble className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.occupiedBeds}\1>
          <p className="text-xs text-muted-foreground">72% occupancy rate</p>
        </CardContent>
      </Card>

      <Card>
        \1>
          \1>
            Incoming Ambulances
          </CardTitle>
          <Ambulance className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.incomingAmbulances}\1>
          <p className="text-xs text-muted-foreground">ETA: 5-10 minutes</p>
        </CardContent>
      </Card>

      <Card>
        \1>
          \1>
            Department Activity
          </CardTitle>
          <Activity className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">High\1>
          \1>
            Peak hours (14:00 - 20:00)
          </p>
        </CardContent>
      </Card>
    </div>
  );
