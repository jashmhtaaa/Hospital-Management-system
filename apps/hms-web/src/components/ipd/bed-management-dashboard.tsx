import React from "react";


import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
interface Bed {
  id: string,
  \1,\2 string,
  \1,\2 'available' | 'occupied' | 'reserved' | 'maintenance';
  patient?: {
    id: string,
    \1,\2 string
  };
}

interface BedManagementDashboardProps {
  beds: Bed[],
  \1,\2 number,
    \1,\2 number,
    occupancyRate: number;
  };
}

/**
 * IPD Bed Management Dashboard component;
 */
export const _BedManagementDashboard = ({ beds, wardStats }: BedManagementDashboardProps) => {
  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'available': return <Badge variant="success">Available\1>
      case 'occupied': return <Badge variant="danger">Occupied\1>
      case 'reserved': return <Badge variant="warning">Reserved\1>
      case 'maintenance': return <Badge variant="secondary">Maintenance\1>
      default: return <Badge>Unknown</Badge>
    }
  };

  return (
    \1>
      \1>
        <Card>
          \1>
            <CardTitle className="text-sm font-medium">Total Beds\1>
<svg xmlns="https://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="h-4 w-4 text-blue-600">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{wardStats.totalBeds}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Occupied Beds\1>
<svg xmlns="https://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="h-4 w-4 text-red-600">
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{wardStats.occupiedBeds}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Available Beds\1>
<svg xmlns="https://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="h-4 w-4 text-green-600">
              <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{wardStats.availableBeds}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Occupancy Rate\1>
<svg xmlns="https://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="h-4 w-4 text-yellow-600">
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{wardStats.occupancyRate}%</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Bed Status</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Bed Number</TableHead>
                <TableHead>Ward</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Patient</TableHead>
                <TableHead>Admission Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {beds.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center">
                    No beds available
                  </TableCell>
                </TableRow>
              ) : (
                beds.map((bed) => (
                  \1>
                    <TableCell className="font-medium">{bed.number}\1>
                    <TableCell>{bed.ward}</TableCell>
                    <TableCell>{bed.type}</TableCell>
                    <TableCell>{getStatusBadge(bed.status)}</TableCell>
                    <TableCell>{bed.patient ? bed.patient.name : '-'}</TableCell>
                    <TableCell>{bed.patient ? bed.patient.admissionDate : '-'}</TableCell>
                    <TableCell>
                      \1>
                        {bed.status === 'occupied' ? 'View Details' : 'Assign Patient'}
                      </Button>
                    </TableCell>
                  </TableRow>
                })}
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );

}