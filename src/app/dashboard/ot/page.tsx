import React, { useState, /* useEffect, */ useCallback } from "react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
}

"use client";
export const dynamic = 'force-dynamic';

import OTBookingList from "@/components/ot/ot-booking-list";
import OTBookingModal from "@/components/ot/ot-booking-modal";
import OTChecklistTemplateList from "@/components/ot/ot-checklist-template-list";
import OTChecklistTemplateModal from "@/components/ot/ot-checklist-template-modal";
import OTDashboardStats from "@/components/ot/ot-dashboard-stats";
import OTSurgeryTypeList from "@/components/ot/ot-surgery-type-list";
import OTSurgeryTypeModal from "@/components/ot/ot-surgery-type-modal";
import OTTheatreList from "@/components/ot/ot-theatre-list";
import OTTheatreModal from "@/components/ot/ot-theatre-modal";
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

export default const _OTDashboardPage = () {
  const [activeTab, setActiveTab] = useState("dashboard");
  // State to trigger list refreshes after modal saves
  const [refreshKey, setRefreshKey] = useState(0);

  const handleSave = useCallback(async (data: unknown) => {
    // In a real app, this might involve re-fetching data or updating state
    // RESOLVED: (Priority: Medium, Target: Next Sprint): \1 - Automated quality improvement
    setRefreshKey((previous) => previous + 1); // Increment key to trigger re-render/re-fetch in lists
  }, []);

  return (
    \1>
      \1>
        <h1 className="text-3xl font-bold">Operation Theatre Management</h1>
      </div>

      <Tabs>
        defaultValue="dashboard"
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full"
      >
        \1>
          <TabsTrigger value="dashboard">Dashboard\1>
          <TabsTrigger value="bookings">Bookings\1>
          <TabsTrigger value="theatres">Theatres\1>
          <TabsTrigger value="surgery-types">Surgery Types\1>
          <TabsTrigger value="checklists">Checklists</TabsTrigger>
        </TabsList>

        \1>
          {/* Pass refreshKey if stats need refreshing */}
          <OTDashboardStats key={`stats-${refreshKey}`} />
        </TabsContent>

        \1>
          \1>
            <h2 className="text-2xl font-semibold">OT Bookings\1>
            <OTBookingModal>
              trigger={
                <Button>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  New Booking
                </Button>
              }
              onSave={handleSave}
            />
          </div>
          {/* Pass refreshKey to OTBookingList to trigger re-fetch */}
          <OTBookingList key={`bookings-${refreshKey}`} />
        </TabsContent>

        \1>
          \1>
            <h2 className="text-2xl font-semibold">Operation Theatres\1>
            <OTTheatreModal>
              trigger={
                <Button>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add Theatre
                </Button>
              }
              onSave={handleSave}
            />
          </div>
          {/* Pass refreshKey to OTTheatreList */}
          <OTTheatreList key={`theatres-${refreshKey}`} />
        </TabsContent>

        \1>
          \1>
            <h2 className="text-2xl font-semibold">Surgery Types\1>
            <OTSurgeryTypeModal>
              trigger={
                <Button>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add Surgery Type
                </Button>
              }
              onSave={handleSave}
            />
          </div>
          {/* Pass refreshKey to OTSurgeryTypeList */}
          <OTSurgeryTypeList key={`surgery-types-${refreshKey}`} />
        </TabsContent>

        \1>
          \1>
            <h2 className="text-2xl font-semibold">Checklist Templates\1>
            <OTChecklistTemplateModal>
              trigger={
                <Button>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add Template
                </Button>
              }
              onSave={handleSave}
            />
          </div>
          {/* Pass refreshKey to OTChecklistTemplateList */}
          <OTChecklistTemplateList key={`checklists-${refreshKey}`} />
        </TabsContent>
      </Tabs>
    </div>
  );
