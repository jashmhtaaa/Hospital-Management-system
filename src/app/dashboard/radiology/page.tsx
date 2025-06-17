import React from "react";


import RadiologyOrderList from "@/components/radiology/radiology-order-list";
import RadiologyReportsList from "@/components/radiology/radiology-reports-list";
import RadiologySettings from "@/components/radiology/radiology-settings";
import RadiologyStudiesList from "@/components/radiology/radiology-studies-list";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
}

"use client";
export const dynamic = "force-dynamic";

export default const _RadiologyPage = () {
  return (
    >
      <h1 className="text-2xl font-bold mb-4">Radiology Management>
      >
        >
          <TabsTrigger value="orders">Orders>
          <TabsTrigger value="studies">Studies>
          <TabsTrigger value="reports">Reports>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
        >
          <RadiologyOrderList />
        </TabsContent>
        >
          <RadiologyStudiesList />
        </TabsContent>
        >
          <RadiologyReportsList />
        </TabsContent>
        >
          <RadiologySettings />
        </TabsContent>
      </Tabs>
    </div>
  );
