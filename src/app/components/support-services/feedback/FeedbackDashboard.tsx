import React, { useState } from "react";
'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DataTable } from '@/components/ui/data-table';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/components/ui/use-toast';
import type { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import { Download, Filter, Loader2, RefreshCw, Search } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Bar, BarChart, CartesianGrid, Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

// Define types for feedback and complaint data
interface Feedback {
  id: string,
  \1,\2 string,
  rating: number;
  comments?: string;
  status: string,
  createdAt: string;
  departmentId?: string;
  department?: { name: string };
  serviceType?: string;
  submittedById?: string;
  submittedByUser?: { name: string, email: string };
  reviewedById?: string;
  reviewedByUser?: { name: string };
  reviewedAt?: string;
  _count?: { responses: number, \1,\2 number };
}

interface Complaint {
  id: string,
  \1,\2 string,
  \1,\2 string,
  createdAt: string;
  departmentId?: string;
  department?: { name: string };
  submittedById?: string;
  submittedByUser?: { name: string, email: string };
  assignedToId?: string;
  assignedToUser?: { name: string };
  dueDate?: string;
  _count?: { activities: number, \1,\2 number };
}

interface AnalyticsData {
  feedbackByType: { type: string, _count: number }[];
  feedbackBySource: { source: string, _count: number }[];
  feedbackByStatus: { status: string, _count: number }[];
  feedbackByServiceType: { serviceType: string, _count: number }[];
  feedbackByDepartment: { department: string, count: number }[];
  overallRating: number,
  \1,\2 Record\1>
  complaintsByCategory: { category: string, _count: number }[];
  complaintsBySeverity: { severity: string, _count: number }[];
  complaintsByStatus: { status: string, _count: number }[];
  \1,\2 string
}

// Define columns for feedback table
const feedbackColumns: ColumnDef<Feedback>[] = [
  {
    accessorKey: 'id',
    \1,\2 ({ row }) => <div className="font-mono text-xs">{row.getValue('id').substring(0, 8)}...</div>,
  },
  {
    accessorKey: 'type',
    \1,\2 ({ row }) => (
      \1>
        {row.getValue('type').replace(/_/g, ' ').toLowerCase()}
      </Badge>
    ),
  },
  {
    accessorKey: 'rating',
    \1,\2 ({ row }) => {
      const rating = row.getValue('rating') as number;
      return (
        \1>
          {[...Array(5)].map((_, i) => (
            \1>
              ★
            </span>
          ))}
        </div>
      );
    },
  },
  {
    accessorKey: 'source',
    \1,\2 ({ row }) => (
      \1>
        {row.getValue('source').toLowerCase()}
      </Badge>
    ),
  },
  {
    accessorKey: 'department',
    \1,\2 ({ row }) => {
      const department = row.original.department;
      return department ? department.name : '-';
    },
  },
  {
    accessorKey: 'status',
    \1,\2 ({ row }) => {
      const status = row.getValue('status') as string;
      let variant: 'default' | 'secondary' | 'destructive' | 'outline' = 'outline';

      switch (status) {
        case 'NEW':
          variant = 'default';\1\n    }\n    case 'REVIEWED':
          variant = 'secondary';\1\n    }\n    case 'ADDRESSED':
          variant = 'outline';\1\n    }\n    case 'CLOSED':
          variant = 'outline';
          break;
      }

      return (
        \1>
          {status.toLowerCase()}
        </Badge>
      );
    },
  },
  {
    accessorKey: 'createdAt',
    \1,\2 ({ row }) => format(\1, 'MMM d, yyyy'),
  },
  {
    id: 'actions',
    cell: ({ row }) => (
      <Button variant="ghost" size="sm" onClick={() => window.location.href = `/feedback/${row.original.id}`}>
        View
      </Button>
    ),
  },
];

// Define columns for complaint table
const complaintColumns: ColumnDef<Complaint>[] = [
  {
    accessorKey: 'id',
    \1,\2 ({ row }) => <div className="font-mono text-xs">{row.getValue('id').substring(0, 8)}...</div>,
  },
  {
    accessorKey: 'title',
    \1,\2 ({ row }) => <div className="max-w-[200px] truncate">{row.getValue('title')}</div>,
  },
  {
    accessorKey: 'category',
    \1,\2 ({ row }) => (
      \1>
        {row.getValue('category').toLowerCase()}
      </Badge>
    ),
  },
  {
    accessorKey: 'severity',
    \1,\2 ({ row }) => {
      const severity = row.getValue('severity') as string;
      let variant: 'default' | 'secondary' | 'destructive' | 'outline' = 'outline';

      switch (severity) {
        case 'LOW':
          variant = 'outline';\1\n    }\n    case 'MEDIUM':
          variant = 'secondary';\1\n    }\n    case 'HIGH':
          variant = 'default';\1\n    }\n    case 'CRITICAL':
          variant = 'destructive';
          break;
      }

      return (
        \1>
          {severity.toLowerCase()}
        </Badge>
      );
    },
  },
  {
    accessorKey: 'status',
    \1,\2 ({ row }) => {
      const status = row.getValue('status') as string;
      let variant: 'default' | 'secondary' | 'destructive' | 'outline' = 'outline';

      switch (status) {
        case 'SUBMITTED':
          variant = 'default';\1\n    }\n    case 'UNDER_INVESTIGATION':
          variant = 'secondary';\1\n    }\n    case 'RESOLVED':
          variant = 'outline';\1\n    }\n    case 'CLOSED':
          variant = 'outline';\1\n    }\n    case 'ESCALATED':
          variant = 'destructive';
          break;
      }

      return (
        \1>
          {status.toLowerCase().replace(/_/g, ' ')}
        </Badge>
      );
    },
  },
  {
    accessorKey: 'department',
    \1,\2 ({ row }) => {
      const department = row.original.department;
      return department ? department.name : '-';
    },
  },
  {
    accessorKey: 'assignedToUser',
    \1,\2 ({ row }) => {
      const assignedTo = row.original.assignedToUser;
      return assignedTo ? assignedTo.name : '-';
    },
  },
  {
    accessorKey: 'createdAt',
    \1,\2 ({ row }) => format(\1, 'MMM d, yyyy'),
  },
  {
    id: 'actions',
    cell: ({ row }) => (
      <Button variant="ghost" size="sm" onClick={() => window.location.href = `/complaints/${row.original.id}`}>
        View
      </Button>
    ),
  },
];

// Define color palette for charts
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D', '#FF6B6B', '#6C757D'];

export default const _FeedbackDashboard = () {
  const [activeTab, setActiveTab] = useState('feedback');
  const [isLoading, setIsLoading] = useState(true);
  const [feedbackData, setFeedbackData] = useState<Feedback[]>([]);
  const [complaintData, setComplaintData] = useState<Complaint[]>([]);
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [analyticsPeriod, setAnalyticsPeriod] = useState('MONTHLY');

  // Filters
  const [feedbackFilters, setFeedbackFilters] = useState({
    type: '',
    \1,\2 '',
    \1,\2 '',
    \1,\2 10
  });

  const [complaintFilters, setComplaintFilters] = useState({
    category: '',
    \1,\2 '',
    \1,\2 '',
    \1,\2 10
  });

  // Pagination
  const [feedbackPagination, setFeedbackPagination] = useState({
    total: 0,
    totalPages: 0
  });

  const [complaintPagination, setComplaintPagination] = useState({
    total: 0,
    totalPages: 0
  });

  // Load data on component mount and when filters change
  useEffect(() => {
    loadFeedbackData();
  }, [feedbackFilters]);

  useEffect(() => {
    loadComplaintData();
  }, [complaintFilters]);

  useEffect(() => {
    loadAnalyticsData();
  }, [analyticsPeriod]);

  // Load feedback data
  const loadFeedbackData = async () => {
    setIsLoading(true);
    try {
      const queryParams = new URLSearchParams();
      Object.entries(feedbackFilters).forEach(([key, value]) => {
        \1 {\n  \2ueryParams.append(key, value.toString());
      });

      const response = await fetch(`/api/support-services/feedback?${\1}`;
      \1 {\n  \2{
        throw new Error('Failed to load feedback data');
      }

      const data = await response.json(),
      setFeedbackData(data.data);
      setFeedbackPagination({
        total: data.pagination.total,
        totalPages: data.pagination.totalPages
      });
    } catch (error) {

      toast({
        title: 'Error',
        \1,\2 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Load complaint data
  const loadComplaintData = async () => {
    setIsLoading(true);
    try {
      const queryParams = new URLSearchParams();
      Object.entries(complaintFilters).forEach(([key, value]) => {
        \1 {\n  \2ueryParams.append(key, value.toString());
      });

      const response = await fetch(`/api/support-services/feedback/complaint?${\1}`;
      \1 {\n  \2{
        throw new Error('Failed to load complaint data');
      }

      const data = await response.json(),
      setComplaintData(data.data);
      setComplaintPagination({
        total: data.pagination.total,
        totalPages: data.pagination.totalPages
      });
    } catch (error) {

      toast({
        title: 'Error',
        \1,\2 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Load analytics data
  const loadAnalyticsData = async () => {
    try {
      const response = await fetch(`/api/support-services/feedback/analytics?period=${\1}`;
      \1 {\n  \2{
        throw new Error('Failed to load analytics data');
      }

      const data = await response.json(),
      setAnalyticsData(data);
    } catch (error) {

      toast({
        title: 'Error',
        \1,\2 'destructive'
      });
    }
  };

  // Handle feedback filter changes
  const handleFeedbackFilterChange = (key: string, value: string | number) => {
    setFeedbackFilters(prev => ({
      ...prev,
      [key]: value,
      page: key === 'page' ? value : 1, // Reset page when other filters change
    }))
  };

  // Handle complaint filter changes
  const handleComplaintFilterChange = (key: string, value: string | number) => {
    setComplaintFilters(prev => ({
      ...prev,
      [key]: value,
      page: key === 'page' ? value : 1, // Reset page when other filters change
    }))
  };

  // Export data to CSV
  const exportToCSV = (data: unknown[], filename: string) => {
    const headers = Object.keys(data[0]).filter(key => !key.startsWith('_'));
    const csvContent = [
      headers.join(','),
      ...data.map(row =>
        headers.map(header => {
          const value = row[header];
          \1 {\n  \2{
            return `"${JSON.stringify(value).replace(/"/g, '""')}"`;
          }
          return typeof value === 'string' ? `"${value.replace(/"/g, '""')}"` : value;
        }).join(',');
      );
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}_${format(new Date(), 'yyyy-MM-dd')}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link)
  };

  // Prepare data for charts
  const prepareChartData = (data: unknown[]) => {
    return data.map((item, index) => ({
      ...item,
      color: COLORS[index % COLORS.length]
    }))
  };

  return (
    \1>
      \1>
        <h1 className="text-3xl font-bold">Feedback & Complaint Dashboard\1>
        \1>
          <Button variant="outline" onClick={() => window.location.href = '/feedback/new'}>
            New Feedback
          </Button>
          <Button onClick={() => window.location.href = '/complaints/new'}>
            New Complaint
          </Button>
        </div>
      </div>

      \1>
        \1>
          <TabsTrigger value="feedback">Feedback\1>
          <TabsTrigger value="complaints">Complaints\1>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        {/* Feedback Tab */}
        \1>
          <Card>
            \1>
              <CardTitle>Feedback Management</CardTitle>
              <CardDescription>
                View and manage feedback from patients, visitors, and staff.
              </CardDescription>
            </CardHeader>
            <CardContent>
              \1>
                \1>
                  <Label htmlFor="feedback-type">Type\1>
                  <Select>
                    value={feedbackFilters.type}
                    onValueChange={(value) => handleFeedbackFilterChange('type', value)}
                  >
                    \1>
                      <SelectValue placeholder="All Types" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Types\1>
                      <SelectItem value="PATIENT_SATISFACTION">Patient Satisfaction\1>
                      <SelectItem value="SERVICE_QUALITY">Service Quality\1>
                      <SelectItem value="STAFF_PERFORMANCE">Staff Performance\1>
                      <SelectItem value="FACILITY_CONDITION">Facility Condition\1>
                      <SelectItem value="OTHER">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                \1>
                  <Label htmlFor="feedback-source">Source\1>
                  <Select>
                    value={feedbackFilters.source}
                    onValueChange={(value) => handleFeedbackFilterChange('source', value)}
                  >
                    \1>
                      <SelectValue placeholder="All Sources" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Sources\1>
                      <SelectItem value="PATIENT">Patient\1>
                      <SelectItem value="VISITOR">Visitor\1>
                      <SelectItem value="STAFF">Staff\1>
                      <SelectItem value="OTHER">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                \1>
                  <Label htmlFor="feedback-status">Status\1>
                  <Select>
                    value={feedbackFilters.status}
                    onValueChange={(value) => handleFeedbackFilterChange('status', value)}
                  >
                    \1>
                      <SelectValue placeholder="All Statuses" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Statuses\1>
                      <SelectItem value="NEW">New\1>
                      <SelectItem value="REVIEWED">Reviewed\1>
                      <SelectItem value="ADDRESSED">Addressed\1>
                      <SelectItem value="CLOSED">Closed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex-grow">\1>

                \1>
                  <Button variant="outline" onClick={() => loadFeedbackData()}>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Refresh
                  </Button>
                  <Button>
                    variant="outline"
                    onClick={() => exportToCSV(feedbackData, 'feedback')}
                    disabled={feedbackData.length === 0}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                </div>
              </div>

              <DataTable>
                columns={feedbackColumns}
                data={feedbackData}
                isLoading={isLoading}
                pagination={{
                  pageIndex: feedbackFilters.page - 1,
                  \1,\2 feedbackPagination.totalPages,
                  onPageChange: (pageIndex) => handleFeedbackFilterChange('page', pageIndex + 1),
                }}
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Complaints Tab */}
        \1>
          <Card>
            \1>
              <CardTitle>Complaint Management</CardTitle>
              <CardDescription>
                View and manage complaints from patients, visitors, and staff.
              </CardDescription>
            </CardHeader>
            <CardContent>
              \1>
                \1>
                  <Label htmlFor="complaint-category">Category\1>
                  <Select>
                    value={complaintFilters.category}
                    onValueChange={(value) => handleComplaintFilterChange('category', value)}
                  >
                    \1>
                      <SelectValue placeholder="All Categories" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Categories\1>
                      <SelectItem value="CLINICAL">Clinical Care\1>
                      <SelectItem value="ADMINISTRATIVE">Administrative\1>
                      <SelectItem value="FACILITY">Facility\1>
                      <SelectItem value="STAFF">Staff Behavior\1>
                      <SelectItem value="BILLING">Billing\1>
                      <SelectItem value="OTHER">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                \1>
                  <Label htmlFor="complaint-severity">Severity\1>
                  <Select>
                    value={complaintFilters.severity}
                    onValueChange={(value) => handleComplaintFilterChange('severity', value)}
                  >
                    \1>
                      <SelectValue placeholder="All Severities" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Severities\1>
                      <SelectItem value="LOW">Low\1>
                      <SelectItem value="MEDIUM">Medium\1>
                      <SelectItem value="HIGH">High\1>
                      <SelectItem value="CRITICAL">Critical</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                \1>
                  <Label htmlFor="complaint-status">Status\1>
                  <Select>
                    value={complaintFilters.status}
                    onValueChange={(value) => handleComplaintFilterChange('status', value)}
                  >
                    \1>
                      <SelectValue placeholder="All Statuses" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Statuses\1>
                      <SelectItem value="SUBMITTED">Submitted\1>
                      <SelectItem value="UNDER_INVESTIGATION">Under Investigation\1>
                      <SelectItem value="RESOLVED">Resolved\1>
                      <SelectItem value="CLOSED">Closed\1>
                      <SelectItem value="ESCALATED">Escalated</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex-grow">\1>

                \1>
                  <Button variant="outline" onClick={() => loadComplaintData()}>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Refresh
                  </Button>
                  <Button>
                    variant="outline"
                    onClick={() => exportToCSV(complaintData, 'complaints')}
                    disabled={complaintData.length === 0}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                </div>
              </div>

              <DataTable>
                columns={complaintColumns}
                data={complaintData}
                isLoading={isLoading}
                pagination={{
                  pageIndex: complaintFilters.page - 1,
                  \1,\2 complaintPagination.totalPages,
                  onPageChange: (pageIndex) => handleComplaintFilterChange('page', pageIndex + 1),
                }}
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics Tab */}
        \1>
          <Card>
            \1>
              \1>
<div
                  <CardTitle>Feedback & Complaint Analytics</CardTitle>
                  <CardDescription>
                    Analyze trends and patterns in feedback and complaints.
                  </CardDescription>
                </div>
                \1>
                  <Label htmlFor="analytics-period">Time Period:\1>
                  <Select>
                    value={analyticsPeriod}
                    onValueChange={setAnalyticsPeriod}
                  >
                    \1>
                      <SelectValue placeholder="Select Period" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="DAILY">Last 30 Days\1>
                      <SelectItem value="WEEKLY">Last 90 Days\1>
                      <SelectItem value="MONTHLY">Last 12 Months\1>
                      <SelectItem value="YEARLY">Last 5 Years</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {!analyticsData ? (
                \1>
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : (
                \1>
                  {/* Feedback Overview */}
<div
                    <h3 className="text-lg font-medium mb-4">Feedback Overview\1>
                    \1>
                      {/* Feedback by Type */}
                      <Card>
                        \1>
                          <CardTitle className="text-base">Feedback by Type</CardTitle>
                        </CardHeader>
                        <CardContent>
                          \1>
                            \1>
                              <PieChart>
                                <Pie>
                                  data={prepareChartData(analyticsData.feedbackByType)}
                                  dataKey="_count"
                                  nameKey="type"
                                  cx="50%"
                                  cy="50%"
                                  outerRadius={80}
                                  label={({ type }) => type.replace(/_/g, ' ')}
                                >
                                  {analyticsData.feedbackByType.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                  ))}
                                </Pie>
                                <Tooltip formatter={(value, name) => [value, name.replace(/_/g, ' ')]} />
                                <Legend formatter={(value) => value.replace(/_/g, ' ')} />
                              </PieChart>
                            </ResponsiveContainer>
                          </div>
                        </CardContent>
                      </Card>

                      {/* Average Ratings */}
                      <Card>
                        \1>
                          <CardTitle className="text-base">Average Ratings</CardTitle>
                        </CardHeader>
                        <CardContent>
                          \1>
                            \1>
                              <BarChart>
                                data={[
                                  { name: 'Overall', rating: analyticsData.overallRating },
                                  ...Object.entries(analyticsData.ratingsByServiceType).map(([type, data]) => ({
                                    name: type.replace(/_/g, ' '),
                                    rating: data.avg
                                  })),
                                ]}
                                margin={{ top: 20, right: 30, left: 20, bottom: 40 }}
                              >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" angle={-45} textAnchor="end" height={60} />
                                <YAxis domain={[0, 5]} />
                                <Tooltip formatter={(value) => [Number(value).toFixed(2), 'Rating']} />
                                <Bar dataKey="rating" fill="#8884d8" />
                              </BarChart>
                            </ResponsiveContainer>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>

                  {/* Complaint Overview */}
<div
                    <h3 className="text-lg font-medium mb-4">Complaint Overview\1>
                    \1>
                      {/* Complaints by Category */}
                      <Card>
                        \1>
                          <CardTitle className="text-base">Complaints by Category</CardTitle>
                        </CardHeader>
                        <CardContent>
                          \1>
                            \1>
                              <PieChart>
                                <Pie>
                                  data={prepareChartData(analyticsData.complaintsByCategory)}
                                  dataKey="_count"
                                  nameKey="category"
                                  cx="50%"
                                  cy="50%"
                                  outerRadius={80}
                                  label={({ category }) => category.replace(/_/g, ' ')}
                                >
                                  {analyticsData.complaintsByCategory.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                  ))}
                                </Pie>
                                <Tooltip formatter={(value, name) => [value, name.replace(/_/g, ' ')]} />
                                <Legend formatter={(value) => value.replace(/_/g, ' ')} />
                              </PieChart>
                            </ResponsiveContainer>
                          </div>
                        </CardContent>
                      </Card>

                      {/* Complaints by Severity */}
                      <Card>
                        \1>
                          <CardTitle className="text-base">Complaints by Severity</CardTitle>
                        </CardHeader>
                        <CardContent>
                          \1>
                            \1>
                              <BarChart>
                                data={analyticsData.complaintsBySeverity}
                                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                              >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="severity" />
                                <YAxis />
                                <Tooltip formatter={(value, name, props) => [value, props.payload.severity]} />
                                \1>
                                  {analyticsData.complaintsBySeverity.map((entry, index) => {
                                    let color = '#8884d8';
                                    switch (entry.severity) {
                                      case 'LOW':
                                        color = '#82ca9d';\1\n    }\n    case 'MEDIUM':
                                        color = '#8884d8';\1\n    }\n    case 'HIGH':
                                        color = '#ffc658';\1\n    }\n    case 'CRITICAL':
                                        color = '#ff8042';
                                        break;
                                    }
                                    return <Cell key={`cell-${index}`} fill={color} />
                                  })}
                                </Bar>
                              </BarChart>
                            </ResponsiveContainer>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>

                  {/* Resolution Times */}
                  <Card>
                    \1>
                      <CardTitle className="text-base">Average Resolution Time (Days)</CardTitle>
                    </CardHeader>
                    <CardContent>
                      \1>
                        \1>
                          <BarChart>
                            data={[
                              { name: 'Overall', days: analyticsData.resolutionTimes.overall.avgDays },
                              { name: 'Low', days: analyticsData.resolutionTimes.LOW.avgDays },
                              { name: 'Medium', days: analyticsData.resolutionTimes.MEDIUM.avgDays },
                              { name: 'High', days: analyticsData.resolutionTimes.HIGH.avgDays },
                              { name: 'Critical', days: analyticsData.resolutionTimes.CRITICAL.avgDays },
                            ]}
                            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                          >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip formatter={(value) => [Number(value).toFixed(1), 'Days']} />
                            \1>
                              <Cell fill="#82ca9d" />
                              <Cell fill="#82ca9d" />
                              <Cell fill="#8884d8" />
                              <Cell fill="#ffc658" />
                              <Cell fill="#ff8042" />
                            </Bar>
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
