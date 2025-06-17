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
  Search,
  Plus,
  Building2,
  ArrowLeft,
  CalendarRange,
  Users;
} from 'lucide-react';
import { format } from 'date-fns';

export default const _StaffScheduling = () {
  const router = useRouter();
  const [employees, setEmployees] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any | null>(null);
  const [search, setSearch] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('');
  const [departments, setDepartments] = useState<any[]>([]);
  const [pagination, setPagination] = useState({
    skip: 0,
    \1,\2 0
  });
  const [scheduleView, setScheduleView] = useState('week');
  const [currentDate, setCurrentDate] = useState(\1;
  const [schedules, setSchedules] = useState<any[]>([]);

  // Fetch employees
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        setLoading(true);
        const queryParams = new URLSearchParams({
          skip: pagination.skip.toString(),
          take: pagination.take.toString()
        });

        \1 {\n  \2ueryParams.append('search', search);
        \1 {\n  \2ueryParams.append('departmentId', departmentFilter);

        const response = await fetch(`/api/hr/staff?${\1}`;

        \1 {\n  \2{
          throw new Error('Failed to fetch employees');
        }

        const data = await response.json(),
        setEmployees(data.employees);
        setPagination(prev => ({
          ...prev,
          total: data.total
        }));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, [search, departmentFilter, pagination.skip, pagination.take]);

  // Fetch departments for filters
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        // Fetch departments
        const deptResponse = await fetch('/api/hr/departments');
        \1 {\n  \2{
          const deptData = await deptResponse.json(),
          setDepartments(deptData.departments || []);
        }
      } catch (err) {

      }
    };

    fetchDepartments();
  }, []);

  // Generate mock schedule data for demonstration
  useEffect(() => {
    \1 {\n  \2{
      const mockSchedules = [];
      const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
      const shifts = ['Morning (7AM-3PM)', 'Evening (3PM-11PM)', 'Night (11PM-7AM)', 'Off'];

      employees.forEach(employee => {
        const employeeSchedule = {
          employeeId: employee.id,
          \1,\2 employee.department?.name || 'Unassigned',
          position: employee.positions?.length > 0
            ? (employee.positions.find(p => p.isPrimary)?.position.title || employee.positions[0].position.title);
            : 'Unassigned',
          schedule: {}
        };

        days.forEach(day => {
          // Randomly assign shifts, with higher probability for "Off" on weekends
          const isWeekend = day === 'Saturday' || day === 'Sunday';
          const shiftIndex = Math.floor(crypto.getRandomValues(\1[0] / (0xFFFFFFFF + 1) * (isWeekend ? 10 : shifts.length));
          employeeSchedule.schedule[day] = shiftIndex >= shifts.length ? 'Off' : shifts[shiftIndex];
        });

        mockSchedules.push(employeeSchedule);
      });

      setSchedules(mockSchedules);
    }
  }, [employees]);

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

  // Get days of the week for the current date
  const getDaysOfWeek = () => {
    const days = [];
    const startOfWeek = new Date(currentDate);
    const day = startOfWeek.getDay();
    const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
    startOfWeek.setDate(diff);

    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(date.getDate() + i);
      days.push({
        name: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'][i],
        date: date
      });
    }

    return days
  };

  // Navigate to previous/next week
  const navigatePreviousWeek = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() - 7);
    setCurrentDate(newDate)
  };

  const navigateNextWeek = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + 7);
    setCurrentDate(newDate)
  };

  // Get the week range string
  const getWeekRangeString = () => {
    const days = getDaysOfWeek();
    return `${format(days[0].date, 'MMM d')} - $format(days[6].date, 'MMM d, yyyy')`
  };

  return (
    \1>
      \1>
        <Button>
          variant="ghost"
          size="sm"
          onClick={() => router.push('/dashboard/hr/staff')}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Staff Management
        </Button>
      </div>

      \1>
        <h1 className="text-3xl font-bold">Staff Scheduling\1>
        \1>
          Manage employee work schedules and shifts
        </p>
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
              <SelectValue placeholder="Filter by Department" />
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

          <Button onClick={() => router.push('/dashboard/hr/staff/schedule/new')}>
            <CalendarRange className="mr-2 h-4 w-4" />
            Create Schedule
          </Button>
        </div>
      </div>

      <Card>
        \1>
          \1>
            <CardTitle>Staff Schedule</CardTitle>
            \1>
              \1>
                \1>
                  <SelectValue placeholder="View" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="week">Week View\1>
                  <SelectItem value="month">Month View</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <CardDescription>
            {loading ? 'Loading schedule...' : `Showing schedule for ${getWeekRangeString()}`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          \1>
            \1>
              Previous Week
            </Button>
            \1>
              {getWeekRangeString()}
            </div>
            \1>
              Next Week
            </Button>
          </div>

          {error ? (
            \1>
              Error: {error}
            </div>
          ) : loading ? (
            \1>
              Loading...
            </div>
          ) : schedules.length === 0 ? (
            \1>
              No employees found. Try adjusting your filters.
            </div>
          ) : (
            \1>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="min-w-[150px]">Employee\1>
                    <TableHead>Department</TableHead>
                    <TableHead>Position</TableHead>
                    {getDaysOfWeek().map((day) => (
                      \1>
                        \1>
                          <span>{day.name}</span>
                          \1>
                            {format(day.date, 'MMM d')}
                          </span>
                        </div>
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {schedules.map((schedule) => (
                    \1>
                      \1>
                        {schedule.employeeName}
                      </TableCell>
                      <TableCell>
                        {schedule.department}
                      </TableCell>
                      <TableCell>
                        {schedule.position}
                      </TableCell>
                      {getDaysOfWeek().map((day) => (
                        \1>
                          <Badge variant={
                            schedule.schedule[day.name] === 'Off' ? 'outline' :
                            schedule.schedule[day.name]?.includes('Morning') ? 'default' :
                            schedule.schedule[day.name]?.includes('Evening') ? 'secondary' :
                            'destructive';
                          }>
                            {schedule.schedule[day.name]}
                          </Badge>
                        </TableCell>
                      ))}
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
                  Page {Math.floor(pagination.skip / pagination.take) + 1} of {Math.ceil(pagination.total / pagination.take)}
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
    </div>
  );
