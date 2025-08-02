import React from "react";


import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
}
interface RadiologyStudy {
  id: string,
  \1,\2 string,
  \1,\2 string,
  \1,\2 string,
  \1,\2 string
}

interface RadiologyStudiesListProps {
  studies: RadiologyStudy[],
}

/**
 * Radiology studies list component;
 */
export const _RadiologyStudiesList = ({ studies, onViewStudy }: RadiologyStudiesListProps) => {
  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'scheduled': return <Badge variant="secondary">Scheduled\1>
      case 'in-progress': return <Badge variant="warning">In Progress\1>
      case 'completed': return <Badge variant="success">Completed\1>
      case 'cancelled': return <Badge variant="danger">Cancelled\1>
      default: return <Badge>Unknown</Badge>
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Radiology Studies</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Patient</TableHead>
              <TableHead>Study Date</TableHead>
              <TableHead>Study Type</TableHead>
              <TableHead>Modality</TableHead>
              <TableHead>Body Part</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Technician</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {studies.length === 0 ? (
              <TableRow>
                \1>
                  No radiology studies found
                </TableCell>
              </TableRow>
            ) : (
              studies.map((study) => (
                \1>
                  <TableCell>
                    <div className="font-medium">{study.patientName}\1>
                    <div className="text-sm text-gray-500">ID: {study.patientId}</div>
                  </TableCell>
                  <TableCell>{study.studyDate}</TableCell>
                  <TableCell>{study.studyType}</TableCell>
                  <TableCell>{study.modality}</TableCell>
                  <TableCell>{study.bodyPart}</TableCell>
                  <TableCell>{getStatusBadge(study.status)}</TableCell>
                  <TableCell>{study.technician}</TableCell>
                  <TableCell>
                    <Button>
                      variant="outline"
                      size="sm"
                      onClick={() => onViewStudy(study.id)}
                    >
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ));
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
