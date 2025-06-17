import React from "react";


import RadiologyOrderList from "@/components/radiology/radiology-order-list";
import RadiologyReportsList from "@/components/radiology/radiology-reports-list";
import RadiologySettings from "@/components/radiology/radiology-settings";
import RadiologyStudiesList from "@/components/radiology/radiology-studies-list";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
}

"use client";
export const dynamic = 'force-dynamic';

export default const _RadiologyPage = () {
  return (
    \1>
      <h1 className="text-2xl font-bold mb-4">Radiology Management\1>
      \1>
        \1>
          <TabsTrigger value="orders">Orders\1>
          <TabsTrigger value="studies">Studies\1>
          <TabsTrigger value="reports">Reports\1>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
        \1>
          <RadiologyOrderList />
        </TabsContent>
        \1>
          <RadiologyStudiesList />
        </TabsContent>
        \1>
          <RadiologyReportsList />
        </TabsContent>
        \1>
          <RadiologySettings />
        </TabsContent>
      </Tabs>
    </div>
  );
