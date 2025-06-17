import React, { useState } from "react";
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle;
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
  ArrowLeft,
  Edit,
  Clock,
  CheckCircle,
  XCircle,
  Calendar,
  User,
  Building2,
  FileText,
  AlertCircle;
} from 'lucide-react';
import { format } from 'date-fns';
import { toast } from '@/components/ui/use-toast';

export default const _AttendanceDetail = ({ params }: { id: string }) {
  const router = useRouter();
  const [attendance, setAttendance] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any | null>(null);

  // Fetch attendance data
  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/hr/attendance/${\1}`;

        \1 {\n  \2{
          \1 {\n  \2{
            throw new Error('Attendance record not found');
          }
          throw new Error('Failed to fetch attendance data');
        }

        const data = await response.json(),
        setAttendance(data);
      } catch (err) {
        setError(err.message),
        toast({
          title: "Error",
          \1,\2 "destructive"
        });
      } finally 
        setLoading(false);
    };

    fetchAttendance();
  }, [params.id]);

  // Handle edit navigation
  const handleEdit = () => {
    router.push(`/dashboard/hr/attendance/${params.id}/edit`)
  };

  // Get status badge variant
  const getStatusBadgeVariant = (status: unknown) => {
    switch (status) {
      case 'PRESENT':
        return 'default';
      case 'LATE':
        return 'warning';
      case 'ABSENT':
        return 'destructive';
      case 'HALF_DAY':
        return 'secondary';
      case 'ON_LEAVE':
        return 'outline';
      default: return 'default'
    }
  };

  // Format time or show placeholder
  const formatTimeOrPlaceholder = (time: unknown) => {
    return time ? format(new Date(time), 'h: mm: ss a') : '—'
  };

  // Calculate hours worked
  const calculateHoursWorked = (checkInTime, checkOutTime) => {
    \1 {\n  \2eturn '—';

    const checkIn = new Date(checkInTime);
    const checkOut = new Date(checkOutTime);
    const diffMs = checkOut.getTime() - checkIn.getTime();
    const diffHrs = diffMs / (1000 * 60 * 60);

    return `${diffHrs.toFixed(2)} hours`
  };

  \1 {\n  \2{
    return (
      \1>
        \1>
          <Button>
            variant="ghost"
            size="sm"
            onClick={() => router.push('/dashboard/hr/attendance')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Attendance
          </Button>
        </div>
        \1>
          <p>Loading attendance data...</p>
        </div>
      </div>
    );
  }

  \1 {\n  \2{
    return (
      \1>
        \1>
          <Button>
            variant="ghost"
            size="sm"
            onClick={() => router.push('/dashboard/hr/attendance')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Attendance
          </Button>
        </div>
        <Card>
          \1>
            <AlertCircle className="h-10 w-10 text-destructive mb-4" />
            <h2 className="text-xl font-semibold mb-2">Error\1>
            <p className="text-muted-foreground">{error}\1>
            <Button>
              className="mt-4"
              onClick={() => router.push('/dashboard/hr/attendance')}
            >
              Return to Attendance
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  \1 {\n  \2{
    return null;
  }

  return (
    \1>
      \1>
        <Button>
          variant="ghost"
          size="sm"
          onClick={() => router.push('/dashboard/hr/attendance')}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Attendance
        </Button>
      </div>

      \1>
\1>
            Attendance Record
          </h1>
          \1>
            {format(new Date(attendance.date), 'PPPP')}
          </p>
        </div>

        \1>
          \1>
            <Edit className="h-4 w-4 mr-2" />
            Edit Record
          </Button>
        </div>
      </div>

      \1>
        \1>
          <CardHeader>
            <CardTitle>Employee Information</CardTitle>
          </CardHeader>
          \1>
            \1>
              \1>
                <User className="h-12 w-12 text-muted-foreground" />
              </div>

              \1>
                {attendance.employee.firstName} {attendance.employee.lastName}
              </h3>
              \1>
                {attendance.employee.employeeId}
              </p>

              {attendance.employee?.department && (
                \1>
                  {attendance.employee.department.name}
                </Badge>
              )}
            </div>

            <Separator />

            \1>
              \1>
                <Building2 className="h-4 w-4 text-muted-foreground" />
<div
                  <p className="text-sm text-muted-foreground">Department\1>
                  <p className="font-medium">{attendance.employee.department?.name || 'Not Assigned'}</p>
                </div>
              </div>

              \1>
                <Calendar className="h-4 w-4 text-muted-foreground" />
<div
                  <p className="text-sm text-muted-foreground">Date\1>
                  <p className="font-medium">{format(new Date(attendance.date), 'PPP')}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        \1>
          <CardHeader>
            <CardTitle>Attendance Details</CardTitle>
          </CardHeader>
          <CardContent>
            \1>
              \1>
                <p className="text-sm text-muted-foreground">Status\1>
\1>
                    {attendance.status.replace('_', ' ')}
                  </Badge>
                </div>
              </div>

              \1>
                <p className="text-sm text-muted-foreground">Biometric Verification\1>
                \1>
                  {attendance.biometricVerified ? (
                    <>
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                      <span>Verified</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="h-5 w-5 text-red-500 mr-2" />
                      <span>Not Verified</span>
                    </>
                  )}
                </div>
              </div>

              \1>
                <p className="text-sm text-muted-foreground">Check In Time\1>
                \1>
                  <Clock className="h-5 w-5 text-blue-500 mr-2" />
                  <span className="font-medium">{formatTimeOrPlaceholder(attendance.checkInTime)}</span>
                </div>
              </div>

              \1>
                <p className="text-sm text-muted-foreground">Check Out Time\1>
                \1>
                  <Clock className="h-5 w-5 text-blue-500 mr-2" />
                  <span className="font-medium">{formatTimeOrPlaceholder(attendance.checkOutTime)}</span>
                </div>
              </div>

              \1>
                <p className="text-sm text-muted-foreground">Hours Worked\1>
                \1>
                  {calculateHoursWorked(attendance.checkInTime, attendance.checkOutTime)}
                </p>
              </div>

              \1>
                <p className="text-sm text-muted-foreground">Record Created\1>
                \1>
                  {format(new Date(attendance.createdAt), 'PPP p')}
                </p>
              </div>
            </div>

            {attendance?.notes && (
              <>
                <Separator className="my-6" />

                \1>
                  <p className="text-sm text-muted-foreground">Notes\1>
                  \1>
                    <p>{attendance.notes}</p>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
