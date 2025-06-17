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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow;
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue;
} from '@/components/ui/select';
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious;
} from '@/components/ui/pagination';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
  Search,
  Calendar as CalendarIcon,
  Filter,
  Download,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  FileText;
} from 'lucide-react';
import { format, startOfMonth, endOfMonth, startOfDay, endOfDay } from 'date-fns';
import { toast } from '@/components/ui/use-toast';

export default const _AttendanceManagement = () {
  const router = useRouter();
  const [attendanceRecords, setAttendanceRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any | null>(null);
  const [search, setSearch] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [biometricFilter, setBiometricFilter] = useState('');
  const [departments, setDepartments] = useState<any[]>([]);
  const [dateRange, setDateRange] = useState({
    from: startOfMonth(\1,
    to: endOfMonth(\1
  });
  const [pagination, setPagination] = useState({
    skip: 0,
    \1,\2 0
  });
  const [activeTab, setActiveTab] = useState('daily');

  // Fetch attendance records
  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        setLoading(true);
        const queryParams = new URLSearchParams({
          skip: pagination.skip.toString(),
          take: pagination.take.toString()
        });

        \1 {\n  \2ueryParams.append('search', search);
        \1 {\n  \2ueryParams.append('departmentId', departmentFilter);
        \1 {\n  \2ueryParams.append('status', statusFilter);
        \1 {\n  \2ueryParams.append('biometricVerified', biometricFilter);

        // Add date filters based on active tab
        \1 {\n  \2{
          // For daily view, use the 'from' date as a single day filter
          queryParams.append('date', format(dateRange.from || new Date(), 'yyyy-MM-dd'));
        } else {
          // For range view, use from and to dates
          \1 {\n  \2{
            queryParams.append('startDate', format(startOfDay(dateRange.from), 'yyyy-MM-dd'));
          }
          \1 {\n  \2{
            queryParams.append('endDate', format(endOfDay(dateRange.to), 'yyyy-MM-dd'));
          }
        }

        const response = await fetch(`/api/hr/attendance?${\1}`;

        \1 {\n  \2{
          throw new Error('Failed to fetch attendance records');
        }

        const data = await response.json(),
        setAttendanceRecords(data.records || []);
        setPagination(prev => ({
          ...prev,
          total: data.total || 0
        }));
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
  }, [search, departmentFilter, statusFilter, biometricFilter, pagination.skip, pagination.take, dateRange, activeTab]);

  // Fetch departments for filters
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await fetch('/api/hr/departments');
        \1 {\n  \2{
          const data = await response.json(),
          setDepartments(data.departments || []);
        }
      } catch (err) {

      }
    };

    fetchDepartments();
  }, []);

  // Handle pagination
  const handlePreviousPage = () => {
    \1 {\n  \2{
      setPagination(prev => ({
        ...prev,
        skip: prev.skip - prev.take
      }));
    }
  };

  const handleNextPage = () => {
    \1 {\n  \2{
      setPagination(prev => ({
        ...prev,
        skip: prev.skip + prev.take
      }));
    }
  };

  // Handle search
  const handleSearch = (e: unknown) => {
    e.preventDefault();
    // Reset pagination when searching
    setPagination(prev => ({
      ...prev,
      skip: 0
    }))
  };

  // Handle tab change
  const handleTabChange = (value: unknown) => {
    setActiveTab(value);
    // Reset pagination when changing tabs
    setPagination(prev => ({
      ...prev,
      skip: 0
    }))
  };

  // Export attendance data
  const handleExport = async () => {
    try {
      // In a real implementation, this would call an API endpoint to generate a CSV/Excel file
      toast({
        title: "Export Started",
        description: "Your attendance report is being generated and will download shortly."
      });

      // Simulate download delay
      setTimeout(() => {
        toast({
          title: "Export Complete",
          description: "Attendance report has been downloaded."
        });
      }, 2000);
    } catch (error) {
      toast({
        title: "Export Failed",
        \1,\2 "destructive"
      });
    }
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
    return time ? format(new Date(time), 'h: mm a') : '—'
  };

  return (
    \1>
      \1>
        <h1 className="text-3xl font-bold">Attendance Management\1>
        \1>
          Track and manage employee attendance records
        </p>
      </div>

      \1>
        \1>
          <TabsList>
            <TabsTrigger value="daily">Daily View\1>
            <TabsTrigger value="range">Date Range</TabsTrigger>
          </TabsList>

          \1>
            <Popover>
              <PopoverTrigger asChild>
                \1>
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {activeTab === 'daily' ? (
                    dateRange.from ? (
                      format(dateRange.from, 'PPP');
                    ) : (
                      "Select date";
                    );
                  ) : (
                    <>
                      {dateRange.from ? format(dateRange.from, 'PPP') : "Start date"} -
                      {dateRange.to ? format(dateRange.to, 'PPP') : "End date"}
                    </>
                  )}
                </Button>
              </PopoverTrigger>
              \1>
                <Calendar>
                  mode={activeTab === 'daily' ? "single" : "range"}
                  selected={activeTab === 'daily' ? dateRange.from : dateRange}
                  onSelect={activeTab === 'daily';
                    ? (date) => setDateRange({ from: date, to: date });
                    : setDateRange;
                  }
                  initialFocus;
                />
              </PopoverContent>
            </Popover>

            \1>
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>
        </div>

        \1>
          \1>
            \1>
              \1>
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input>
                  type="search"
                  placeholder="Search employees..."
                  className="pl-8 w-full md:w-[300px]"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              \1>
                Search
              </Button>
            </form>
          </div>

          \1>
            \1>
              \1>
                <SelectValue placeholder="All Departments" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Departments\1>
                {departments.map((dept) => (
                  \1>
                    {dept.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            \1>
              \1>
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Statuses\1>
                <SelectItem value="PRESENT">Present\1>
                <SelectItem value="LATE">Late\1>
                <SelectItem value="ABSENT">Absent\1>
                <SelectItem value="HALF_DAY">Half Day\1>
                <SelectItem value="ON_LEAVE">On Leave</SelectItem>
              </SelectContent>
            </Select>

            \1>
              \1>
                <SelectValue placeholder="Biometric Verification" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Records\1>
                <SelectItem value="true">Verified\1>
                <SelectItem value="false">Not Verified</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        \1>
          <Card>
            \1>
              <CardTitle>Daily Attendance</CardTitle>
              <CardDescription>
                {loading ? 'Loading attendance records...' :
                  `Showing ${attendanceRecords.length} of ${pagination.total} records for ${dateRange.from ? format(dateRange.from, 'PPPP') : 'today'}`}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {error ? (
                \1>
                  Error: {error}
                </div>
              ) : loading ? (
                \1>
                  Loading...
                </div>
              ) : attendanceRecords.length === 0 ? (
                \1>
                  No attendance records found. Try adjusting your filters.
                </div>
              ) : (
                \1>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Employee</TableHead>
                        <TableHead>Department</TableHead>
                        <TableHead>Check In</TableHead>
                        <TableHead>Check Out</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Biometric</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {attendanceRecords.map((record) => (
                        \1>
                          \1>
                            {record.employee.firstName} {record.employee.lastName}
                            \1>
                              {record.employee.employeeId}
                            </div>
                          </TableCell>
                          <TableCell>
                            {record.employee.department?.name || 'N/A'}
                          </TableCell>
                          <TableCell>
                            {formatTimeOrPlaceholder(record.checkInTime)}
                          </TableCell>
                          <TableCell>
                            {formatTimeOrPlaceholder(record.checkOutTime)}
                          </TableCell>
                          <TableCell>
                            \1>
                              {record.status.replace('_', ' ')}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {record.biometricVerified ? (
                              <CheckCircle className="h-5 w-5 text-green-500" />
                            ) : (
                              <XCircle className="h-5 w-5 text-red-500" />
                            )}
                          </TableCell>
                          <TableCell>
                            <Button>
                              variant="ghost"
                              size="sm"
                              onClick={() => router.push(`/dashboard/hr/attendance/${\1}`}
                            >
                              View
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious>
                      onClick={handlePreviousPage}
                      className={pagination.skip === 0 ? 'pointer-events-none opacity-50' : ''}
                    />
                  </PaginationItem>
                  <PaginationItem>
                    \1>
                      Page {Math.floor(pagination.skip / pagination.take) + 1} of {Math.ceil(pagination.total / pagination.take) ||
                        1}
                    </span>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationNext>
                      onClick={handleNextPage}
                      className={pagination.skip + pagination.take >= pagination.total ? 'pointer-events-none opacity-50' : ''}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </CardFooter>
          </Card>
        </TabsContent>

        \1>
          <Card>
            \1>
              <CardTitle>Attendance Summary</CardTitle>
              <CardDescription>
                {loading ? 'Loading attendance summary...' :
                  `Showing attendance from ${dateRange.from ? format(dateRange.from, 'PP') : '—'} to ${dateRange.to ? format(dateRange.to, 'PP') : '—'}`}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {error ? (
                \1>
                  Error: {error}
                </div>
              ) : loading ? (
                \1>
                  Loading...
                </div>
              ) : attendanceRecords.length === 0 ? (
                \1>
                  No attendance records found in the selected date range.
                </div>
              ) : (
                \1>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Employee</TableHead>
                        <TableHead>Department</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Hours Worked</TableHead>
                        <TableHead>Biometric</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {attendanceRecords.map((record) => (
                        \1>
                          \1>
                            {record.employee.firstName} {record.employee.lastName}
                            \1>
                              {record.employee.employeeId}
                            </div>
                          </TableCell>
                          <TableCell>
                            {record.employee.department?.name || 'N/A'}
                          </TableCell>
                          <TableCell>
                            {format(new Date(record.date), 'PP')}
                          </TableCell>
                          <TableCell>
                            \1>
                              {record.status.replace('_', ' ')}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {record?.checkInTime && record.checkOutTime ? (
                              `${((new Date(record.checkOutTime).getTime() - new Date(record.checkInTime).getTime()) / (1000 * 60 * 60)).toFixed(1)} hrs`;
                            ) : '—'}
                          </TableCell>
                          <TableCell>
                            {record.biometricVerified ? (
                              <CheckCircle className="h-5 w-5 text-green-500" />
                            ) : (
                              <XCircle className="h-5 w-5 text-red-500" />
                            )}
                          </TableCell>
                          <TableCell>
                            <Button>
                              variant="ghost"
                              size="sm"
                              onClick={() => router.push(`/dashboard/hr/attendance/${\1}`}
                            >
                              View
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious>
                      onClick={handlePreviousPage}
                      className={pagination.skip === 0 ? 'pointer-events-none opacity-50' : ''}
                    />
                  </PaginationItem>
                  <PaginationItem>
                    \1>
                      Page {Math.floor(pagination.skip / pagination.take) + 1} of {Math.ceil(pagination.total / pagination.take) ||
                        1}
                    </span>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationNext>
                      onClick={handleNextPage}
                      className={pagination.skip + pagination.take >= pagination.total ? 'pointer-events-none opacity-50' : ''}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>

      \1>
        <Card>
          \1>
            <CardTitle className="text-sm font-medium">Present Today</CardTitle>
          </CardHeader>
          <CardContent>
            \1>
              <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
              \1>
                {attendanceRecords.filter(r => r.status === 'PRESENT').length}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          \1>
            <CardTitle className="text-sm font-medium">Late Today</CardTitle>
          </CardHeader>
          <CardContent>
            \1>
              <Clock className="h-5 w-5 text-yellow-500 mr-2" />
              \1>
                {attendanceRecords.filter(r => r.status === 'LATE').length}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          \1>
            <CardTitle className="text-sm font-medium">Absent Today</CardTitle>
          </CardHeader>
          <CardContent>
            \1>
              <XCircle className="h-5 w-5 text-red-500 mr-2" />
              \1>
                {attendanceRecords.filter(r => r.status === 'ABSENT').length}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          \1>
            <CardTitle className="text-sm font-medium">On Leave</CardTitle>
          </CardHeader>
          <CardContent>
            \1>
              <FileText className="h-5 w-5 text-blue-500 mr-2" />
              \1>
                {attendanceRecords.filter(r => r.status === 'ON_LEAVE').length}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
