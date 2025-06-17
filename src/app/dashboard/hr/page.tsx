import React, { useState } from "react";
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Users,
  ClipboardCheck,
  DollarSign,
  Boxes,
  Stethoscope,
  BarChart;
} from 'lucide-react';

export default const _HRDashboard = () {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    \1>
      \1>
        <h1 className="text-3xl font-bold">Human Resources & Asset Management\1>
        \1>
          Manage staff, attendance, payroll, assets, and biomedical equipment
        </p>
      </div>

      \1>
        \1>
          <TabsTrigger value="overview">Overview\1>
          <TabsTrigger value="staff">Staff\1>
          <TabsTrigger value="attendance">Attendance\1>
          <TabsTrigger value="payroll">Payroll\1>
          <TabsTrigger value="assets">Assets\1>
          <TabsTrigger value="biomedical">Biomedical</TabsTrigger>
        </TabsList>

        \1>
          \1>
            \1>
              \1>
                \1>
                  <CardTitle className="text-sm font-medium">Staff Management\1>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">124\1>
                  <p className="text-xs text-muted-foreground">Active employees</p>
                </CardContent>
              </Card>
            </Link>

            \1>
              \1>
                \1>
                  <CardTitle className="text-sm font-medium">Attendance\1>
                  <ClipboardCheck className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">98%\1>
                  <p className="text-xs text-muted-foreground">Current attendance rate</p>
                </CardContent>
              </Card>
            </Link>

            \1>
              \1>
                \1>
                  <CardTitle className="text-sm font-medium">Payroll\1>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">May 30\1>
                  <p className="text-xs text-muted-foreground">Next payroll date</p>
                </CardContent>
              </Card>
            </Link>

            \1>
              \1>
                \1>
                  <CardTitle className="text-sm font-medium">Assets\1>
                  <Boxes className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">1,284\1>
                  <p className="text-xs text-muted-foreground">Total assets tracked</p>
                </CardContent>
              </Card>
            </Link>

            \1>
              \1>
                \1>
                  <CardTitle className="text-sm font-medium">Biomedical Equipment\1>
                  <Stethoscope className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">328\1>
                  <p className="text-xs text-muted-foreground">Medical devices</p>
                </CardContent>
              </Card>
            </Link>

            \1>
              \1>
                <CardTitle className="text-sm font-medium">Analytics\1>
                <BarChart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">Reports\1>
                <p className="text-xs text-muted-foreground">HR & Asset analytics</p>
              </CardContent>
            </Card>
          </div>

          \1>
            <Card>
              <CardHeader>
                <CardTitle>Recent Activities</CardTitle>
                <CardDescription>Latest HR and asset management activities</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Activity feed will appear here</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Upcoming Events</CardTitle>
                <CardDescription>Scheduled maintenance and HR events</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Calendar events will appear here</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        \1>
          <Card>
            <CardHeader>
              <CardTitle>Staff Management</CardTitle>
              <CardDescription>Manage employee profiles, departments, and roles</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Staff management content will be implemented here</p>
            </CardContent>
          </Card>
        </TabsContent>

        \1>
          <Card>
            <CardHeader>
              <CardTitle>Attendance Management</CardTitle>
              <CardDescription>Track attendance, manage leaves, and view reports</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Attendance management content will be implemented here</p>
            </CardContent>
          </Card>
        </TabsContent>

        \1>
          <Card>
            <CardHeader>
              <CardTitle>Payroll Processing</CardTitle>
              <CardDescription>Manage salary structures, process payroll, and generate payslips</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Payroll processing content will be implemented here</p>
            </CardContent>
          </Card>
        </TabsContent>

        \1>
          <Card>
            <CardHeader>
              <CardTitle>Asset Management</CardTitle>
              <CardDescription>Track assets, manage lifecycle, and schedule maintenance</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Asset management content will be implemented here</p>
            </CardContent>
          </Card>
        </TabsContent>

        \1>
          <Card>
            <CardHeader>
              <CardTitle>Biomedical Equipment</CardTitle>
              <CardDescription>Manage medical devices, track calibration, and ensure compliance</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Biomedical equipment management content will be implemented here</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
