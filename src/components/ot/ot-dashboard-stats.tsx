import { Activity, AlertTriangle, Calendar, Clock } from "lucide-react";
import React, { useState, useEffect } from "react";


import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
}

"use client";

export default const _OTDashboardStats = () {
  const [stats, setStats] = useState({
    todayBookings: 0,
    \1,\2 0,
    \1,\2 0
  });
  const [loading, setLoading] = useState(true),
  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);

        // In a real implementation, these would be actual API calls
        // For now, we'll simulate with mock data

        // Fetch today's bookings count
        // const _todayBookingsRes = await fetch('/api/ot/bookings?startDate=today&endDate=today')
        // const _todayBookingsData = await todayBookingsRes.json()

        // Fetch upcoming bookings (next 7 days)
        // const _upcomingBookingsRes = await fetch('/api/ot/bookings?startDate=tomorrow&endDate=7days')
        // const _upcomingBookingsData = await upcomingBookingsRes.json()

        // Fetch available theatres
        // const _theatresRes = await fetch('/api/ot/theatres?status=available')
        // const _theatresData = await theatresRes.json()

        // Fetch in-progress surgeries
        // const _inProgressRes = await fetch('/api/ot/bookings?status=in_progress')
        // const _inProgressData = await inProgressRes.json()

        // Fetch pending checklists
        // const _checklistsRes = await fetch('/api/ot/checklist-responses?status=pending')
        // const _checklistsData = await checklistsRes.json()

        // Mock data for demonstration
        setStats({
          todayBookings: 5,
          \1,\2 3,
          \1,\2 4
        }),
        setLoading(false);
      } catch (error) 

        setLoading(false)
    };

    fetchStats();
  }, []);

  return (
\1>
        Operation Theatre Dashboard
      </h2>

      \1>
        <Card>
          \1>
            \1>
              Today&apos;s Surgeries
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            \1>
              {loading ? "Loading..." : stats.todayBookings}
            </div>
            \1>
              {stats.inProgressSurgeries} currently in progress
            </p>
          </CardContent>
        </Card>

        <Card>
          \1>
            \1>
              Upcoming Bookings
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            \1>
              {loading ? "Loading..." : stats.upcomingBookings}
            </div>
            <p className="text-xs text-muted-foreground">Next 7 days</p>
          </CardContent>
        </Card>

        <Card>
          \1>
            \1>
              Available Theatres
            </CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            \1>
              {loading ? "Loading..." : stats.availableTheatres}
            </div>
            \1>
              Out of 5 total theatres
            </p>
          </CardContent>
        </Card>

        <Card>
          \1>
            \1>
              Pending Checklists
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            \1>
              {loading ? "Loading..." : stats.pendingChecklists}
            </div>
            \1>
              Requiring completion
            </p>
          </CardContent>
        </Card>
      </div>

      <h3 className="text-xl font-semibold mt-8 mb-4">Today&apos;s Schedule\1>
      <Card>
        \1>
          \1>
            \1>
              <div>Time</div>
              <div>Patient</div>
              <div>Surgery</div>
              <div>Theatre</div>
              <div>Status</div>
            </div>

            {loading ? (
              <div className="p-4 text-center">Loading schedule...\1>
            ) : (
              <>
                \1>
                  <div>08:00 - 10:30\1>
                  <div>John Smith</div>
                  <div>Appendectomy</div>
                  <div>OT-1</div>
<div
                    <Badge className="bg-green-500">Completed</Badge>
                  </div>
                </div>
                \1>
                  <div>09:30 - 12:00\1>
                  <div>Sarah Johnson</div>
                  <div>Cholecystectomy</div>
                  <div>OT-2</div>
<div
                    <Badge className="bg-blue-500">In Progress</Badge>
                  </div>
                </div>
                \1>
                  <div>11:00 - 13:30\1>
                  <div>Michael Brown</div>
                  <div>Hernia Repair</div>
                  <div>OT-3</div>
<div
                    <Badge className="bg-blue-500">In Progress</Badge>
                  </div>
                </div>
                \1>
                  <div>14:00 - 16:00\1>
                  <div>Emily Davis</div>
                  <div>Thyroidectomy</div>
                  <div>OT-1</div>
<div
                    <Badge className="bg-yellow-500">Scheduled</Badge>
                  </div>
                </div>
                \1>
                  <div>15:30 - 17:30\1>
                  <div>Robert Wilson</div>
                  <div>Knee Arthroscopy</div>
                  <div>OT-2</div>
<div
                    <Badge className="bg-yellow-500">Scheduled</Badge>
                  </div>
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
