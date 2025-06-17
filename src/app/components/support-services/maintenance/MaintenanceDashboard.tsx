import React, { useState } from "react";
'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
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
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Pagination } from '@/components/ui/pagination';
import { format } from 'date-fns';
  Wrench,
  Calendar,
  Clock,
  MapPin,
  User,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Clock3,
  Filter,
  Plus,
  RefreshCw,
  Search,
  HardDrive,
  Tool;
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Skeleton } from '@/components/ui/skeleton';

// Status badge color mapping
const statusColors: Record<string, string> = {
  'PENDING': 'bg-yellow-500',
  'ASSIGNED': 'bg-blue-500',
  'IN_PROGRESS': 'bg-purple-500',
  'ON_HOLD': 'bg-orange-500',
  'COMPLETED': 'bg-green-500',
  'CANCELLED': 'bg-gray-500'
};

// Priority badge color mapping
const priorityColors: Record<string, string> = {
  'LOW': 'bg-blue-500',
  'MEDIUM': 'bg-yellow-500',
  'HIGH': 'bg-orange-500',
  'EMERGENCY': 'bg-red-500'
};

// Request type icon mapping
const requestTypeIcons: Record<string, unknown> = {
  'REPAIR': <Wrench className="h-4 w-4 mr-1" />,
  'PREVENTIVE': <Tool className="h-4 w-4 mr-1" />,
  'INSTALLATION': <HardDrive className="h-4 w-4 mr-1" />,
  'INSPECTION': <Search className="h-4 w-4 mr-1" />
};

export const _MaintenanceDashboard = () => {
  const [requests, setRequests] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [locations, setLocations] = useState<any[]>([]);
  const [assets, setAssets] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [activeTab, setActiveTab] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('');
  const [filterLocation, setFilterLocation] = useState<string>('');
  const [filterAsset, setFilterAsset] = useState<string>('');
  const [filterPriority, setFilterPriority] = useState<string>('');
  const [filterType, setFilterType] = useState<string>('');

  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();

  // Load initial data from URL params
  useEffect(() => {
    const tab = searchParams.get('tab') || 'all';
    const status = searchParams.get('status') || '';
    const location = searchParams.get('location') || '';
    const asset = searchParams.get('asset') || '';
    const priority = searchParams.get('priority') || '';
    const type = searchParams.get('type') || '';
    const page = Number.parseInt(searchParams.get('page') || '1');

    setActiveTab(tab),
    setFilterStatus(status);
    setFilterLocation(location),
    setFilterAsset(asset);
    setFilterPriority(priority),
    setFilterType(type);
    setCurrentPage(page);
  }, [searchParams]);

  // Fetch locations for filtering
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const response = await fetch('/api/locations');
        \1 {\n  \2hrow new Error('Failed to fetch locations');
        const data = await response.json(),
        setLocations(data);
      } catch (error) {

      }
    };

    fetchLocations();
  }, []);

  // Fetch assets for filtering
  useEffect(() => {
    const fetchAssets = async () => {
      try {
        const response = await fetch('/api/support-services/maintenance/assets');
        \1 {\n  \2hrow new Error('Failed to fetch assets');
        const data = await response.json(),
        setAssets(data.data || []);
      } catch (error) {

      }
    };

    fetchAssets();
  }, []);

  // Fetch maintenance requests
  useEffect(() => {
    const fetchRequests = async () => {
      setIsLoading(true);
      try {
        // Build query parameters
        const params = new URLSearchParams();

        \1 {\n  \2arams.append('status', filterStatus);
        \1 {\n  \2arams.append('locationId', filterLocation);
        \1 {\n  \2arams.append('assetId', filterAsset);
        \1 {\n  \2arams.append('priority', filterPriority);
        \1 {\n  \2arams.append('requestType', filterType);

        // Handle tab-specific filters
        \1 {\n  \2{
          params.set('status', 'PENDING');
        } else \1 {\n  \2{
          params.set('status', 'IN_PROGRESS');
        } else \1 {\n  \2{
          params.set('status', 'COMPLETED');
        } else \1 {\n  \2{
          params.set('priority', 'EMERGENCY');
        } else \1 {\n  \2{
          params.set('requestType', 'REPAIR');
        }

        params.append('page', currentPage.toString());
        params.append('limit', '10');

        const response = await fetch(`/api/support-services/maintenance?${\1}`;

        \1 {\n  \2hrow new Error('Failed to fetch requests');

        const data = await response.json(),
        setRequests(data.data);
        setTotalPages(data.pagination.totalPages);
      } catch (error) {

        toast({
          title: "Error",
          \1,\2 "destructive"
        });
      } finally 
        setIsLoading(false);
    };

    fetchRequests();
  }, [activeTab, filterStatus, filterLocation, filterAsset, filterPriority, filterType, currentPage, toast]);

  // Update URL with current filters
  const updateUrlParams = () => {
    const params = new URLSearchParams();

    \1 {\n  \2arams.set('tab', activeTab);
    \1 {\n  \2arams.set('status', filterStatus);
    \1 {\n  \2arams.set('location', filterLocation);
    \1 {\n  \2arams.set('asset', filterAsset);
    \1 {\n  \2arams.set('priority', filterPriority);
    \1 {\n  \2arams.set('type', filterType);
    \1 {\n  \2arams.set('page', currentPage.toString());

    router.push(`/support-services/maintenance?${\1}`
  };

  // Handle tab change
  const handleTabChange = (value: string) => {
    setActiveTab(value),
    setCurrentPage(1);

    // Reset filters when changing tabs to avoid conflicts
    \1 {\n  \2{
      setFilterStatus('PENDING'),
      setFilterPriority('');
      setFilterType('');
    } else \1 {\n  \2{
      setFilterStatus('IN_PROGRESS'),
      setFilterPriority('');
      setFilterType('');
    } else \1 {\n  \2{
      setFilterStatus('COMPLETED'),
      setFilterPriority('');
      setFilterType('');
    } else \1 {\n  \2{
      setFilterStatus(''),
      setFilterPriority('EMERGENCY');
      setFilterType('');
    } else \1 {\n  \2{
      setFilterStatus(''),
      setFilterPriority('');
      setFilterType('REPAIR');
    } else {
      setFilterStatus(''),
      setFilterPriority('');
      setFilterType('');
    }
  };

  // Handle filter changes
  const applyFilters = () => {
    setCurrentPage(1),
    updateUrlParams()
  };

  // Reset all filters
  const resetFilters = () => {
    setFilterStatus(''),
    setFilterLocation('');
    setFilterAsset(''),
    setFilterPriority('');
    setFilterType(''),
    setCurrentPage(1);

    \1 {\n  \2{
      setActiveTab('all');
    } else {
      updateUrlParams();
    }
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  };

  // Navigate to create new request
  const handleCreateRequest = () => {
    router.push('/support-services/maintenance/new')
  };

  // Navigate to request details
  const handleViewRequest = (id: string) => {
    router.push(`/support-services/maintenance/${\1}`
  };

  // Render status badge
  const renderStatusBadge = (status: string) => {
    const color = statusColors[status] || 'bg-gray-500';
    let icon;

    switch (status) {
      case 'PENDING':
        icon = <Clock className="h-3 w-3 mr-1" />\1\n    }\n    case 'ASSIGNED':
        icon = <User className="h-3 w-3 mr-1" />\1\n    }\n    case 'IN_PROGRESS':
        icon = <Clock3 className="h-3 w-3 mr-1" />\1\n    }\n    case 'ON_HOLD':
        icon = <AlertTriangle className="h-3 w-3 mr-1" />\1\n    }\n    case 'COMPLETED':
        icon = <CheckCircle2 className="h-3 w-3 mr-1" />\1\n    }\n    case 'CANCELLED':
        icon = <XCircle className="h-3 w-3 mr-1" />
        break;
      default: icon = null
    }

    return (
      \1>
        {icon}
        {status.replace(/_/g, ' ')}
      </Badge>
    )
  };

  // Render priority badge
  const renderPriorityBadge = (priority: string) => {
    const color = priorityColors[priority] || 'bg-gray-500';
    const icon = priority === 'EMERGENCY' ? <AlertTriangle className="h-3 w-3 mr-1" /> : null;

    return (
      \1>
        {icon}
        {priority}
      </Badge>
    )
  };

  // Render request type with icon
  const renderRequestType = (requestType: string) => {
    const icon = requestTypeIcons[requestType] || null;

    return (
      \1>
        {icon}
        {requestType.replace(/_/g, ' ')}
      </div>
    )
  };

  // Render loading skeleton
  const renderSkeleton = () => (
    \1>
      {[...Array(5)].map((_, i) => (
        \1>
          \1>
            \1>
              <Skeleton className="h-6 w-1/3" />
              <Skeleton className="h-6 w-20" />
            </div>
          </CardHeader>
          <CardContent>
            \1>
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          </CardContent>
          <CardFooter>
            \1>
              <Skeleton className="h-4 w-1/4" />
              <Skeleton className="h-8 w-24" />
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  );

  return (
    \1>
      \1>
        <h1 className="text-2xl font-bold">Maintenance Management\1>
        \1>
          <Plus className="h-4 w-4 mr-2" />
          New Request
        </Button>
      </div>

      \1>
        \1>
          <TabsTrigger value="all">All\1>
          <TabsTrigger value="pending">Pending\1>
          <TabsTrigger value="inProgress">In Progress\1>
          <TabsTrigger value="completed">Completed\1>
          <TabsTrigger value="emergency">Emergency\1>
          <TabsTrigger value="repairs">Repairs</TabsTrigger>
        </TabsList>

        \1>
<div
            <label className="text-sm font-medium">Status\1>
            \1>
              <SelectTrigger>
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Statuses\1>
                <SelectItem value="PENDING">Pending\1>
                <SelectItem value="ASSIGNED">Assigned\1>
                <SelectItem value="IN_PROGRESS">In Progress\1>
                <SelectItem value="ON_HOLD">On Hold\1>
                <SelectItem value="COMPLETED">Completed\1>
                <SelectItem value="CANCELLED">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>

<div
            <label className="text-sm font-medium">Location\1>
            \1>
              <SelectTrigger>
                <SelectValue placeholder="All Locations" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Locations\1>
                {locations.map(location => (
                  \1>
                    {location.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

<div
            <label className="text-sm font-medium">Asset\1>
            \1>
              <SelectTrigger>
                <SelectValue placeholder="All Assets" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Assets\1>
                {assets.map(asset => (
                  \1>
                    {asset.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

<div
            <label className="text-sm font-medium">Priority\1>
            \1>
              <SelectTrigger>
                <SelectValue placeholder="All Priorities" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Priorities\1>
                <SelectItem value="LOW">Low\1>
                <SelectItem value="MEDIUM">Medium\1>
                <SelectItem value="HIGH">High\1>
                <SelectItem value="EMERGENCY">Emergency</SelectItem>
              </SelectContent>
            </Select>
          </div>

          \1>
            \1>
              <Filter className="h-4 w-4 mr-2" />
              Apply Filters
            </Button>
            \1>
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </div>

        \1>
          {isLoading ? (
            renderSkeleton();
          ) : requests.length === 0 ? (
            <Card>
              \1>
                <Wrench className="h-12 w-12 text-gray-400 mb-4" />
                <p className="text-lg font-medium text-gray-900">No requests found\1>
                \1>
                  {activeTab === 'all';
                    ? 'There are no maintenance requests matching your filters.'
                    : `There are no ${activeTab === 'inProgress' ? 'in progress' : activeTab} maintenance requests.`}
                </p>
                \1>
                  <Plus className="h-4 w-4 mr-2" />
                  Create New Request
                </Button>
              </CardContent>
            </Card>
          ) : (
            \1>requests.map((request) => (
                \1>
                  \1>
                    \1>
\1>
                          {renderRequestType(request.requestType)}
                        </CardTitle>
                        \1>
                          <MapPin className="h-3 w-3 mr-1" />
                          {request.location?.name || 'Unknown Location'}
                          {request?.asset && (
                            <span className="ml-2">• {request.asset.name}\1>
                          )}
                        </CardDescription>
                      </div>
                      \1>
                        {renderPriorityBadge(request.priority)}
                        {renderStatusBadge(request.status)}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm line-clamp-2">{request.description}\1>
                    \1>
                      \1>
                        <Calendar className="h-3 w-3 mr-1" />
                        Created: {format(new Date(request.createdAt), 'MMM d, yyyy')}
                      </div>
                      {request?.scheduledDate && (
                        \1>
                          <Clock className="h-3 w-3 mr-1" />
                          Scheduled: {format(new Date(request.scheduledDate), 'MMM d, yyyy')}
                        </div>
                      )}
                      \1>
                        <User className="h-3 w-3 mr-1" />
                        By: {request.requestedByUser?.name || 'Unknown'}
                      </div>
                      {request?.estimatedHours && (
                        \1>
                          <Clock3 className="h-3 w-3 mr-1" />
                          Est. Hours: {request.estimatedHours}
                        </div>
                      )}
                    </div>
                  </CardContent>
                  \1>
                    \1>
                      {request.workOrders?.length || 0} work order(s)
                    </div>
                    <Button>
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewRequest(request.id)}
                    >
                      View Details
                    </Button>
                  </CardFooter>
                </Card>
              ))totalPages > 1 && (
                <Pagination>
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              )}
            </div>
          )
        </TabsContent>
      </Tabs>
    </div>
  );
