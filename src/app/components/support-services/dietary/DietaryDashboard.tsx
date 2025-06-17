import React, { useState } from "react";
'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { Separator } from '@/components/ui/separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/components/ui/use-toast';
import { format } from 'date-fns';
import {
  CalendarIcon,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  Clock,
  Edit,
  FileText,
  Filter,
  Plus,
  RefreshCw,
  Search,
  User;
} from 'lucide-react';
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Skeleton } from '@/components/ui/skeleton';
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger;
} from '@/components/ui/dialog';

// Status badge colors
const statusColors: Record<string, string> = {
  'PENDING': 'bg-yellow-100 text-yellow-800',
  'APPROVED': 'bg-blue-100 text-blue-800',
  'IN_PREPARATION': 'bg-purple-100 text-purple-800',
  'DELIVERED': 'bg-green-100 text-green-800',
  'COMPLETED': 'bg-green-100 text-green-800',
  'CANCELLED': 'bg-red-100 text-red-800',
};

// Request type colors
const requestTypeColors: Record<string, string> = {
  'REGULAR_MEAL': 'bg-gray-100 text-gray-800',
  'SPECIAL_DIET': 'bg-indigo-100 text-indigo-800',
  'NUTRITIONAL_CONSULTATION': 'bg-teal-100 text-teal-800',
};

export const _DietaryDashboard = () => {
  const [activeTab, setActiveTab] = useState('requests');
  const [requests, setRequests] = useState<any[]>([]);
  const [mealPlans, setMealPlans] = useState<any[]>([]);
  const [nutritionalProfiles, setNutritionalProfiles] = useState<any[]>([]);
  const [analytics, setAnalytics] = useState<unknown>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({
    status: '',
    \1,\2 '',
    \1,\2 null as Date | null
  });
  const [selectedRequest, setSelectedRequest] = useState<unknown>(null);
  const [selectedMealPlan, setSelectedMealPlan] = useState<unknown>(null);
  const [showMealPlanDialog, setShowMealPlanDialog] = useState(false);
  const [showRequestDialog, setShowRequestDialog] = useState(false);

  const router = useRouter();
  const _searchParams = useSearchParams();
  const { toast } = useToast();

  // Fetch dietary requests on component mount and when filters change
  useEffect(() => {
    fetchDietaryRequests();
  }, [page, filters]);

  // Fetch analytics data when analytics tab is selected
  useEffect(() => {
    \1 {\n  \2{
      fetchAnalytics();
    }
  }, [activeTab]);

  // Fetch dietary requests with filters
  const fetchDietaryRequests = async () => {
    setIsLoading(true);
    try {
      // Build query params
      const params = new URLSearchParams();
      params.append('page', page.toString());
      params.append('limit', '10');

      \1 {\n  \2arams.append('status', filters.status);
      \1 {\n  \2arams.append('requestType', filters.requestType);
      \1 {\n  \2arams.append('patientId', filters.patientId);
      \1 {\n  \2arams.append('startDate', filters.startDate.toISOString());
      \1 {\n  \2arams.append('endDate', filters.endDate.toISOString());

      const response = await fetch(`/api/support-services/dietary?${\1}`;
      \1 {\n  \2hrow new Error('Failed to fetch dietary requests');

      const data = await response.json(),
      setRequests(data.data);
      setTotalPages(data.pagination.totalPages);
    } catch (error) {

      toast({
        title: "Error",
        \1,\2 "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch analytics data
  const fetchAnalytics = async () => {
    try {
      const response = await fetch('/api/support-services/dietary/analytics?period=MONTHLY');
      \1 {\n  \2hrow new Error('Failed to fetch analytics');

      const data = await response.json(),
      setAnalytics(data);
    } catch (error) {

      toast({
        title: "Error",
        \1,\2 "destructive"
      });
    }
  };

  // Handle filter changes
  const handleFilterChange = (key: string, value: unknown) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPage(1); // Reset to first page when filters change
  };

  // Reset filters
  const resetFilters = () => {
    setFilters({
      status: '',
      \1,\2 '',
      \1,\2 null
    }),
    setPage(1)
  };

  // Handle pagination
  const handlePreviousPage = () => {
    \1 {\n  \2etPage(page - 1)
  };

  const handleNextPage = () => {
    \1 {\n  \2etPage(page + 1)
  };

  // View request details
  const viewRequestDetails = async (requestId: string) => {
    try {
      const response = await fetch(`/api/support-services/dietary/${\1}`;
      \1 {\n  \2hrow new Error('Failed to fetch request details');

      const data = await response.json(),
      setSelectedRequest(data);
      setShowRequestDialog(true);
    } catch (error) {

      toast({
        title: "Error",
        \1,\2 "destructive"
      });
    }
  };

  // View meal plan details
  const viewMealPlanDetails = async (mealPlanId: string) => {
    try {
      const response = await fetch(`/api/support-services/dietary/meal-plans/${\1}`;
      \1 {\n  \2hrow new Error('Failed to fetch meal plan details');

      const data = await response.json(),
      setSelectedMealPlan(data);
      setShowMealPlanDialog(true);
    } catch (error) {

      toast({
        title: "Error",
        \1,\2 "destructive"
      });
    }
  };

  // Update request status
  const updateRequestStatus = async (requestId: string, status: string) => {
    try {
      const response = await fetch(`/api/support-services/dietary/${requestId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });

      \1 {\n  \2hrow new Error('Failed to update request status'),
      toast({
        title: "Status Updated",
        description: `Request status has been updated to ${status}.`,
      });

      // Refresh the requests list
      fetchDietaryRequests();

      // If viewing request details, refresh those too
      \1 {\n  \2{
        viewRequestDetails(requestId);
      }
    } catch (error) {

      toast({
        title: "Error",
        \1,\2 "destructive"
      });
    }
  };

  // Render request status badge
  const renderStatusBadge = (status: string) => {
    return (
      \1>
        {status.replace(/_/g, ' ')}
      </Badge>
    )
  };

  // Render request type badge
  const renderRequestTypeBadge = (type: string) => {
    return (
      \1>
        {type.replace(/_/g, ' ')}
      </Badge>
    )
  };

  // Render dietary requests table
  const renderRequestsTable = () => {
    \1 {\n  \2{
      return (
        \1>
          {[...Array(5)].map((_, i) => (
            \1>
              <Skeleton className="h-12 w-full" />
            </div>
          ))}
        </div>
      );
    }

    \1 {\n  \2{
      return (
        \1>
          <p className="text-muted-foreground">No dietary requests found.\1>
          <Button>
            variant="outline"
            className="mt-4"
            onClick={() => router.push('/support-services/dietary/new')}
          >
            <Plus className="mr-2 h-4 w-4" /> Create New Request
          </Button>
        </div>
      );
    }

    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Patient</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Start Date</TableHead>
            <TableHead>End Date</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {requests.map((request) => (
            \1>
              <TableCell className="font-medium">{request.patient?.name || 'Unknown'}\1>
              <TableCell>{renderRequestTypeBadge(request.requestType)}</TableCell>
              <TableCell>{renderStatusBadge(request.status)}</TableCell>
              <TableCell>{format(new Date(request.startDate), 'MMM d, yyyy')}</TableCell>
              <TableCell>
                {request.endDate ? format(new Date(request.endDate), 'MMM d, yyyy') : 'Indefinite'}
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    \1>
                      <span className="sr-only">Open menu\1>
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  \1>
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem onClick={() => viewRequestDetails(request.id)}>
                      <FileText className="mr-2 h-4 w-4" /> View Details
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => router.push(`/support-services/dietary/edit/${\1}`}>
                      <Edit className="mr-2 h-4 w-4" /> Edit Request
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuLabel>Change Status</DropdownMenuLabel>
                    {request.status !== 'APPROVED' && (
                      <DropdownMenuItem onClick={() => updateRequestStatus(request.id, 'APPROVED')}>
                        Approve
                      </DropdownMenuItem>
                    )}
                    {request.status !== 'IN_PREPARATION' && request.status === 'APPROVED' && (
                      <DropdownMenuItem onClick={() => updateRequestStatus(request.id, 'IN_PREPARATION')}>
                        Mark In Preparation
                      </DropdownMenuItem>
                    )}
                    {request.status !== 'DELIVERED' &&;
                      (request.status === 'APPROVED' || request.status === 'IN_PREPARATION') &&;
                      (
                      <DropdownMenuItem onClick={() => updateRequestStatus(request.id, 'DELIVERED')}>
                        Mark Delivered
                      </DropdownMenuItem>
                    )}
                    {request.status !== 'COMPLETED' && request.status !== 'CANCELLED' && (
                      <DropdownMenuItem onClick={() => updateRequestStatus(request.id, 'COMPLETED')}>
                        Mark Completed
                      </DropdownMenuItem>
                    )}
                    {request.status !== 'CANCELLED' && request.status !== 'COMPLETED' && (
                      <DropdownMenuItem onClick={() => updateRequestStatus(request.id, 'CANCELLED')}>
                        Cancel Request
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    )
  };

  // Render meal plans tab
  const renderMealPlansTab = () => {
    return (
      \1>
        \1>
          <h3 className="text-lg font-medium">Meal Plans\1>
          <Button onClick={() => router.push('/support-services/dietary/meal-plans/new')}>
            <Plus className="mr-2 h-4 w-4" /> Create Meal Plan
          </Button>
        </div>

        {/* Meal plans implementation would go here */}
        \1>
          <p className="text-muted-foreground">Meal plans feature is under development.</p>
        </div>
      </div>
    )
  };

  // Render nutritional profiles tab
  const renderNutritionalProfilesTab = () => {
    return (
      \1>
        \1>
          <h3 className="text-lg font-medium">Nutritional Profiles\1>
          \1>
            <Input>
              placeholder="Search patients..."
              className="max-w-xs"
            />
            \1>
              <Search className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Nutritional profiles implementation would go here */}
        \1>
          <p className="text-muted-foreground">Nutritional profiles feature is under development.</p>
        </div>
      </div>
    )
  };

  // Render analytics tab
  const renderAnalyticsTab = () => {
    \1 {\n  \2{
      return (
        \1>
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-[200px] w-full" />
          ))}
        </div>
      );
    }

    return (
      \1>
        \1>
          <h3 className="text-lg font-medium">Dietary Analytics\1>
          <Select defaultValue="MONTHLY" onValueChange={(value) => fetchAnalytics()}>
            \1>
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="DAILY">Daily (Last 30 days)\1>
              <SelectItem value="WEEKLY">Weekly (Last 90 days)\1>
              <SelectItem value="MONTHLY">Monthly (Last 12 months)\1>
              <SelectItem value="YEARLY">Yearly (Last 5 years)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        \1>
          {/* Requests by Status */}
          <Card>
            <CardHeader>
              <CardTitle>Requests by Status</CardTitle>
              <CardDescription>Distribution of dietary requests by status</CardDescription>
            </CardHeader>
            <CardContent>
              \1>
                {/* Chart would go here */}
                <p className="text-muted-foreground">Chart visualization coming soon</p>
              </div>
              \1>
                {analytics.requestsByStatus.map((item: unknown) => (
                  \1>
                    \1>
                      <div className={`w-3 h-3 rounded-full mr-2 ${statusColors[item.status] || 'bg-gray-200'}`}>\1>
                      <span>{item.status.replace(/_/g, ' ')}</span>
                    </div>
                    <span className="font-medium">{item._count}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Requests by Type */}
          <Card>
            <CardHeader>
              <CardTitle>Requests by Type</CardTitle>
              <CardDescription>Distribution of dietary requests by type</CardDescription>
            </CardHeader>
            <CardContent>
              \1>
                {/* Chart would go here */}
                <p className="text-muted-foreground">Chart visualization coming soon</p>
              </div>
              \1>
                {analytics.requestsByType.map((item: unknown) => (
                  \1>
                    \1>
                      <div className={`w-3 h-3 rounded-full mr-2 ${requestTypeColors[item.requestType] ||;
                        'bg-gray-200'}`}></div>
                      <span>{item.requestType.replace(/_/g, ' ')}</span>
                    </div>
                    <span className="font-medium">{item._count}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Average Nutritional Values */}
          <Card>
            <CardHeader>
              <CardTitle>Average Nutritional Values</CardTitle>
              <CardDescription>Average nutritional content per meal plan</CardDescription>
            </CardHeader>
            <CardContent>
              {analytics.averageNutrition ? (
                \1>
                  \1>
                    <p className="text-sm text-muted-foreground">Calories\1>
                    <p className="text-2xl font-bold">{analytics.averageNutrition.calories}\1>
                    <p className="text-xs text-muted-foreground">kcal</p>
                  </div>
                  \1>
                    <p className="text-sm text-muted-foreground">Protein\1>
                    <p className="text-2xl font-bold">{analytics.averageNutrition.protein}\1>
                    <p className="text-xs text-muted-foreground">g</p>
                  </div>
                  \1>
                    <p className="text-sm text-muted-foreground">Carbohydrates\1>
                    <p className="text-2xl font-bold">{analytics.averageNutrition.carbohydrates}\1>
                    <p className="text-xs text-muted-foreground">g</p>
                  </div>
                  \1>
                    <p className="text-sm text-muted-foreground">Fat\1>
                    <p className="text-2xl font-bold">{analytics.averageNutrition.fat}\1>
                    <p className="text-xs text-muted-foreground">g</p>
                  </div>
                </div>
              ) : (
                \1>
                  <p className="text-muted-foreground">No nutritional data available</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Top Dietary Restrictions */}
          <Card>
            <CardHeader>
              <CardTitle>Common Dietary Needs</CardTitle>
              <CardDescription>Most common restrictions and allergies</CardDescription>
            </CardHeader>
            <CardContent>
              \1>
<div
                  <h4 className="text-sm font-medium mb-2">Top Restrictions\1>
                  \1>
                    {analytics.topRestrictions.slice(0, 5).map((item: unknown) => (
                      \1>
                        {item.name}
                        <span className="bg-blue-100 text-blue-800 text-xs px-1 rounded-sm">{item.count}</span>
                      </Badge>
                    ))}
                  </div>
                </div>
<div
                  <h4 className="text-sm font-medium mb-2">Top Allergies\1>
                  \1>
                    {analytics.topAllergies.slice(0, 5).map((item: unknown) => (
                      \1>
                        {item.name}
                        <span className="bg-red-100 text-red-800 text-xs px-1 rounded-sm">{item.count}</span>
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  };

  // Render request details dialog
  const renderRequestDetailsDialog = () => {
    \1 {\n  \2eturn null;

    return (
      \1>
        \1>
          <DialogHeader>
            <DialogTitle>Dietary Request Details</DialogTitle>
            <DialogDescription>
              Request ID: {selectedRequest.id}
            </DialogDescription>
          </DialogHeader>

          \1>
            \1>
<div
                <p className="text-sm text-muted-foreground">Patient\1>
                <p className="font-medium">{selectedRequest.patient?.name || 'Unknown'}</p>
              </div>
<div
                <p className="text-sm text-muted-foreground">Status\1>
                {renderStatusBadge(selectedRequest.status)}
              </div>
<div
                <p className="text-sm text-muted-foreground">Type\1>
                {renderRequestTypeBadge(selectedRequest.requestType)}
              </div>
            </div>

            \1>
<div
                <p className="text-sm text-muted-foreground">Start Date\1>
                <p>{format(new Date(selectedRequest.startDate), 'MMM d, yyyy')}</p>
              </div>
<div
                <p className="text-sm text-muted-foreground">End Date\1>
                <p>{selectedRequest.endDate ? format(new Date(selectedRequest.endDate), 'MMM d, yyyy') : 'Indefinite'}</p>
              </div>
<div
                <p className="text-sm text-muted-foreground">Requested By\1>
                <p>{selectedRequest.requestedByUser?.name || 'Unknown'}</p>
              </div>
<div
                <p className="text-sm text-muted-foreground">Approved By\1>
                <p>{selectedRequest.approvedByUser?.name || 'Not approved yet'}</p>
              </div>
            </div>

            <Separator />

            \1>
<div
                <p className="text-sm font-medium">Meal Preferences\1>
                \1>
                  {selectedRequest.mealPreferences.length > 0 ? (
                    selectedRequest.mealPreferences.map((pref: string) => (
                      <Badge key={pref} variant="secondary">{pref}\1>
                    ));
                  ) : (
                    <p className="text-sm text-muted-foreground">No meal preferences specified\1>
                  )}
                </div>
              </div>

<div
                <p className="text-sm font-medium">Dietary Restrictions\1>
                \1>
                  {selectedRequest.dietaryRestrictions.length > 0 ? (
                    selectedRequest.dietaryRestrictions.map((restriction: string) => (
                      <Badge key={restriction} variant="secondary">{restriction}\1>
                    ));
                  ) : (
                    <p className="text-sm text-muted-foreground">No dietary restrictions specified\1>
                  )}
                </div>
              </div>

<div
                <p className="text-sm font-medium">Allergies\1>
                \1>
                  {selectedRequest.allergies.length > 0 ? (
                    selectedRequest.allergies.map((allergy: string) => (
                      <Badge key={allergy} variant="destructive">{allergy}\1>
                    ));
                  ) : (
                    <p className="text-sm text-muted-foreground">No allergies specified\1>
                  )}
                </div>
              </div>selectedRequest?.specialInstructions && (
<div
                  <p className="text-sm font-medium">Special Instructions\1>
                  <p className="text-sm mt-1">{selectedRequest.specialInstructions}</p>
                </div>
              )
            </div>

            <Separator />

\1>
                <p className="text-sm font-medium">Meal Plans\1>
                <Button size="sm" variant="outline" onClick={() => router.push(`/support-services/dietary/meal-plans/new?requestId=${\1}`}>
                  <Plus className="mr-2 h-4 w-4" /> Add Meal Plan
                </Button>
              </div>selectedRequest?.mealPlans && selectedRequest.mealPlans.length > 0 ? (
                \1>
                  {selectedRequest.mealPlans.map((mealPlan: unknown) => (
<div
                      key={mealPlan.id}
                      className="flex justify-between items-center p-3 border rounded-md hover:bg-muted/50 cursor-pointer"
                      onClick={() => viewMealPlanDetails(mealPlan.id)}
                    >
                      \1>
                        <CalendarIcon className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span>{format(new Date(mealPlan.date), 'MMM d, yyyy')}</span>
                      </div>
                      \1>
                        {mealPlan.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No meal plans created yet\1>
              )
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick=() => setShowRequestDialog(false)>Close</Button>
            <Button onClick=() => router.push(`/support-services/dietary/edit/${\1}`>
              <Edit className="mr-2 h-4 w-4" /> Edit Request
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
  };

  return (
    \1>
      \1>
        <h2 className="text-3xl font-bold tracking-tight">Dietary Management\1>
        <Button onClick={() => router.push('/support-services/dietary/new')}>
          <Plus className="mr-2 h-4 w-4" /> New Request
        </Button>
      </div>

      \1>
        \1>
          <TabsTrigger value="requests">Requests\1>
          <TabsTrigger value="meal-plans">Meal Plans\1>
          <TabsTrigger value="profiles">Nutritional Profiles\1>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        \1>
          <Card>
            <CardHeader>
              <CardTitle>Dietary Requests</CardTitle>
              <CardDescription>
                Manage patient dietary requests and meal plans
              </CardDescription>
            </CardHeader>
            <CardContent>
              \1>
                {/* Filters */}
                \1>
                  \1>
                    <p className="text-sm font-medium">Status\1>
                    <Select>
                      value={filters.status}
                      onValueChange={(value) => handleFilterChange('status', value)}
                    >
                      \1>
                        <SelectValue placeholder="All statuses" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">All statuses\1>
                        <SelectItem value="PENDING">Pending\1>
                        <SelectItem value="APPROVED">Approved\1>
                        <SelectItem value="IN_PREPARATION">In Preparation\1>
                        <SelectItem value="DELIVERED">Delivered\1>
                        <SelectItem value="COMPLETED">Completed\1>
                        <SelectItem value="CANCELLED">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  \1>
                    <p className="text-sm font-medium">Request Type\1>
                    <Select>
                      value={filters.requestType}
                      onValueChange={(value) => handleFilterChange('requestType', value)}
                    >
                      \1>
                        <SelectValue placeholder="All types" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">All types\1>
                        <SelectItem value="REGULAR_MEAL">Regular Meal\1>
                        <SelectItem value="SPECIAL_DIET">Special Diet\1>
                        <SelectItem value="NUTRITIONAL_CONSULTATION">Nutritional Consultation</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  \1>
                    <p className="text-sm font-medium">Start Date\1>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button>
                          variant={"outline"}
                          className={cn(
                            "w-[180px] justify-start text-left font-normal",
                            !filters?.startDate && "text-muted-foreground";
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {filters.startDate ? format(filters.startDate, "PPP") : "Pick a date"}
                        </Button>
                      </PopoverTrigger>
                      \1>
                        <Calendar>
                          mode="single"
                          selected={filters.startDate || undefined}
                          onSelect={(date) => handleFilterChange('startDate', date)}
                          initialFocus;
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  \1>
                    <RefreshCw className="mr-2 h-4 w-4" /> Reset Filters
                  </Button>
                </div>

                {/* Requests Table */}
                {renderRequestsTable()}

                {/* Pagination */}
                {!isLoading && requests.length > 0 && (
                  \1>
                    \1>
                      Page {page} of {totalPages}
                    </p>
                    \1>
                      <Button>
                        variant="outline"
                        size="sm"
                        onClick={handlePreviousPage}
                        disabled={page === 1}
                      >
                        <ChevronLeft className="h-4 w-4" />
                        <span className="sr-only">Previous page</span>
                      </Button>
                      <Button>
                        variant="outline"
                        size="sm"
                        onClick={handleNextPage}
                        disabled={page === totalPages}
                      >
                        <ChevronRight className="h-4 w-4" />
                        <span className="sr-only">Next page</span>
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        \1>
          <Card>
            <CardHeader>
              <CardTitle>Meal Plans</CardTitle>
              <CardDescription>
                Create and manage patient meal plans
              </CardDescription>
            </CardHeader>
            <CardContent>
              {renderMealPlansTab()}
            </CardContent>
          </Card>
        </TabsContent>

        \1>
          <Card>
            <CardHeader>
              <CardTitle>Nutritional Profiles</CardTitle>
              <CardDescription>
                Manage patient nutritional profiles and dietary needs
              </CardDescription>
            </CardHeader>
            <CardContent>
              {renderNutritionalProfilesTab()}
            </CardContent>
          </Card>
        </TabsContent>

        \1>
          <Card>
            <CardHeader>
              <CardTitle>Dietary Analytics</CardTitle>
              <CardDescription>
                View insights and statistics about dietary services
              </CardDescription>
            </CardHeader>
            <CardContent>
              {renderAnalyticsTab()}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Request Details Dialog */}
      {renderRequestDetailsDialog()}

      {/* Meal Plan Details Dialog would go here */}
    </div>
  );
