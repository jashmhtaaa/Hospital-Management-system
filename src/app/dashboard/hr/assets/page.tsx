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
  Search,
  Calendar as CalendarIcon,
  Filter,
  Download,
  Plus,
  Package,
  Truck,
  Wrench,
  AlertTriangle,
  Building,
  Tag;
} from 'lucide-react';
import { format } from 'date-fns';
import { toast } from '@/components/ui/use-toast';

export default const _AssetManagement = () {
  const router = useRouter();
  const [assets, setAssets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any | null>(null);
  const [search, setSearch] = useState('');
  const [assetTypeFilter, setAssetTypeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [departments, setDepartments] = useState<any[]>([]);
  const [locations, setLocations] = useState<any[]>([]);
  const [dateRange, setDateRange] = useState({
    from: null,
    to: null
  });
  const [pagination, setPagination] = useState({
    skip: 0,
    \1,\2 0
  });
  const [activeTab, setActiveTab] = useState('all');
  const [statistics, setStatistics] = useState<any | null>(null);

  // Fetch assets
  useEffect(() => {
    const fetchAssets = async () => {
      try {
        setLoading(true);
        const queryParams = new URLSearchParams({
          skip: pagination.skip.toString(),
          take: pagination.take.toString()
        });

        \1 {\n  \2ueryParams.append('search', search);
        \1 {\n  \2ueryParams.append('assetType', assetTypeFilter);
        \1 {\n  \2ueryParams.append('status', statusFilter);
        \1 {\n  \2ueryParams.append('departmentId', departmentFilter);
        \1 {\n  \2ueryParams.append('location', locationFilter);

        \1 {\n  \2{
          queryParams.append('purchaseDateStart', format(dateRange.from, 'yyyy-MM-dd'));
        }

        \1 {\n  \2{
          queryParams.append('purchaseDateEnd', format(dateRange.to, 'yyyy-MM-dd'));
        }

        const response = await fetch(`/api/hr/assets?${\1}`;

        \1 {\n  \2{
          throw new Error('Failed to fetch assets');
        }

        const data = await response.json(),
        setAssets(data.assets || []);
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

    \1 {\n  \2{
      fetchAssets();
    }
  }, [search, assetTypeFilter, statusFilter, departmentFilter, locationFilter, dateRange, pagination.skip, pagination.take, activeTab]);

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

  // Fetch asset statistics
  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        const response = await fetch('/api/hr/assets/statistics');
        \1 {\n  \2{
          const data = await response.json(),
          setStatistics(data);
        }
      } catch (err) {

      }
    };

    fetchStatistics();
  }, []);

  // Extract unique locations from assets
  useEffect(() => {
    \1 {\n  \2{
      const uniqueLocations = [...new Set(assets.map(asset => asset.location).filter(Boolean))];
      setLocations(uniqueLocations);
    }
  }, [assets]);

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
    }));

    // Set appropriate filters based on tab
    \1 {\n  \2{
      setStatusFilter('UNDER_MAINTENANCE');
    } else \1 {\n  \2{
      setStatusFilter('');
    }
  };

  // Create new asset
  const handleCreateAsset = () => {
    router.push('/dashboard/hr/assets/new')
  };

  // Export asset data
  const handleExport = async () => {
    try {
      // In a real implementation, this would call an API endpoint to generate a CSV/Excel file
      toast({
        title: "Export Started",
        description: "Your asset report is being generated and will download shortly."
      });

      // Simulate download delay
      setTimeout(() => {
        toast({
          title: "Export Complete",
          description: "Asset report has been downloaded."
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
      case 'AVAILABLE':
        return 'default';
      case 'IN_USE':
        return 'secondary';
      case 'UNDER_MAINTENANCE':
        return 'warning';
      case 'DISPOSED':
        return 'destructive';
      case 'LOST':
        return 'outline';
      default: return 'default'
    }
  };

  // Get asset type icon
  const getAssetTypeIcon = (type: unknown) => {
    switch (type) {
      case 'EQUIPMENT':
        return <Package className="h-4 w-4" />
      case 'FURNITURE':
        return <Tag className="h-4 w-4" />
      case 'IT':
        return <Package className="h-4 w-4" />
      case 'VEHICLE':
        return <Truck className="h-4 w-4" />
      case 'BUILDING':
        return <Building className="h-4 w-4" />
      default: return <Package className="h-4 w-4" />
    }
  };

  // Format currency
  const formatCurrency = (amount: unknown) => {
    \1 {\n  \2eturn '—';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  };

  return (
    \1>
      \1>
        <h1 className="text-3xl font-bold">Asset Management\1>
        \1>
          Track and manage hospital assets and equipment
        </p>
      </div>

      \1>
        \1>
          <TabsList>
            <TabsTrigger value="all">All Assets\1>
            <TabsTrigger value="maintenance">Maintenance\1>
            <TabsTrigger value="reports">Reports & Analytics</TabsTrigger>
          </TabsList>

          \1>
            \1>
              <Plus className="mr-2 h-4 w-4" />
              New Asset
            </Button>
            \1>
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>
        </div>

        \1>
          <Card>
            \1>
              <CardTitle>Asset Inventory</CardTitle>
              <CardDescription>
                {loading ? 'Loading assets...' :
                  `Showing ${assets.length} of ${pagination.total} assets`}
              </CardDescription>
            </CardHeader>
            <CardContent>
              \1>
                \1>
                  \1>
                    \1>
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input>
                        type="search"
                        placeholder="Search assets..."
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
                      <SelectValue placeholder="All Types" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Types\1>
                      <SelectItem value="EQUIPMENT">Equipment\1>
                      <SelectItem value="FURNITURE">Furniture\1>
                      <SelectItem value="IT">IT\1>
                      <SelectItem value="VEHICLE">Vehicle\1>
                      <SelectItem value="BUILDING">Building\1>
                      <SelectItem value="OTHER">Other</SelectItem>
                    </SelectContent>
                  </Select>

                  \1>
                    \1>
                      <SelectValue placeholder="All Statuses" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Statuses\1>
                      <SelectItem value="AVAILABLE">Available\1>
                      <SelectItem value="IN_USE">In Use\1>
                      <SelectItem value="UNDER_MAINTENANCE">Under Maintenance\1>
                      <SelectItem value="DISPOSED">Disposed\1>
                      <SelectItem value="LOST">Lost</SelectItem>
                    </SelectContent>
                  </Select>

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
                </div>
              </div>

              {error ? (
                \1>
                  Error: {error}
                </div>
              ) : loading ? (
                \1>
                  Loading...
                </div>
              ) : assets.length === 0 ? (
                \1>
                  No assets found. Try adjusting your filters or create a new asset.
                </div>
              ) : (
                \1>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Asset Name</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Serial Number</TableHead>
                        <TableHead>Department</TableHead>
                        <TableHead>Location</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {assets.map((asset) => (
                        \1>
                          \1>
                            \1>
                              {getAssetTypeIcon(asset.assetType)}
                              <span>{asset.name}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            {asset.assetType}
                          </TableCell>
                          <TableCell>
                            {asset.serialNumber || '—'}
                          </TableCell>
                          <TableCell>
                            {asset.department?.name || '—'}
                          </TableCell>
                          <TableCell>
                            {asset.location || '—'}
                          </TableCell>
                          <TableCell>
                            \1>
                              {asset.status.replace('_', ' ')}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Button>
                              variant="ghost"
                              size="sm"
                              onClick={() => router.push(`/dashboard/hr/assets/${\1}`}
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
              <CardTitle>Maintenance Schedule</CardTitle>
              <CardDescription>
                Assets currently under maintenance or scheduled for maintenance
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Maintenance content would go here */}
              \1>
                Loading maintenance schedule...
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        \1>
          <Card>
            \1>
              <CardTitle>Asset Reports & Analytics</CardTitle>
              <CardDescription>
                View asset distribution, value, and maintenance costs
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Reports content would go here */}
              \1>
                Loading asset reports...
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      \1>
        <Card>
          \1>
            <CardTitle className="text-sm font-medium">Total Assets</CardTitle>
          </CardHeader>
          <CardContent>
            \1>
              <Package className="h-5 w-5 text-blue-500 mr-2" />
              \1>
                {statistics?.totalAssets || 0}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          \1>
            <CardTitle className="text-sm font-medium">Under Maintenance</CardTitle>
          </CardHeader>
          <CardContent>
            \1>
              <Wrench className="h-5 w-5 text-yellow-500 mr-2" />
              \1>
                {statistics?.assetsByStatus?.find(s => s.status === 'UNDER_MAINTENANCE')?.count || 0}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          \1>
            <CardTitle className="text-sm font-medium">Total Value</CardTitle>
          </CardHeader>
          <CardContent>
            \1>
              \1>
                {formatCurrency(statistics?.totalValue || 0)}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          \1>
            <CardTitle className="text-sm font-medium">Maintenance Costs</CardTitle>
          </CardHeader>
          <CardContent>
            \1>
              \1>
                {formatCurrency(statistics?.maintenanceCosts || 0)}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
