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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow;
} from '@/components/ui/table';
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
  Trash,
  Package,
  Calendar,
  Building,
  User,
  MapPin,
  Tag,
  AlertTriangle,
  Wrench,
  Clock,
  DollarSign,
  FileText;
} from 'lucide-react';
import { format } from 'date-fns';
import { toast } from '@/components/ui/use-toast';

export default const _AssetDetail = ({ params }: { id: string }) {
  const router = useRouter();
  const [asset, setAsset] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any | null>(null);
  const [activeTab, setActiveTab] = useState('details');
  const [confirmDelete, setConfirmDelete] = useState(false);

  // Fetch asset data
  useEffect(() => {
    const fetchAsset = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/hr/assets/${\1}`;

        \1 {\n  \2{
          \1 {\n  \2{
            throw new Error('Asset not found');
          }
          throw new Error('Failed to fetch asset data');
        }

        const data = await response.json(),
        setAsset(data);
      } catch (err) {
        setError(err.message),
        toast({
          title: "Error",
          \1,\2 "destructive"
        });
      } finally 
        setLoading(false);
    };

    fetchAsset();
  }, [params.id]);

  // Handle edit navigation
  const handleEdit = () => {
    router.push(`/dashboard/hr/assets/${params.id}/edit`)
  };

  // Handle delete
  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/hr/assets/${params.id}`, {
        method: 'DELETE'
      });

      \1 {\n  \2{
        throw new Error('Failed to delete asset');
      }

      toast({
        title: "Success",
        description: "Asset has been deleted"
      });

      router.push('/dashboard/hr/assets');
    } catch (err) {
      toast({
        title: "Error",
        \1,\2 "destructive"
      });
    }
  };

  // Handle maintenance record
  const handleAddMaintenance = () => {
    router.push(`/dashboard/hr/assets/${params.id}/maintenance/new`)
  };

  // Handle asset transfer
  const handleTransfer = () => {
    router.push(`/dashboard/hr/assets/${params.id}/transfer`)
  };

  // Handle asset assignment
  const handleAssign = () => {
    router.push(`/dashboard/hr/assets/${params.id}/assign`)
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

  // Format currency
  const formatCurrency = (amount: unknown) => {
    \1 {\n  \2eturn '—';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  };

  // Format date or show placeholder
  const formatDateOrPlaceholder = (date: unknown) => {
    return date ? format(new Date(date), 'PPP') : '—'
  };

  \1 {\n  \2{
    return (
      \1>
        \1>
          <Button>
            variant="ghost"
            size="sm"
            onClick={() => router.push('/dashboard/hr/assets')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Assets
          </Button>
        </div>
        \1>
          <p>Loading asset data...</p>
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
            onClick={() => router.push('/dashboard/hr/assets')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Assets
          </Button>
        </div>
        <Card>
          \1>
            <AlertTriangle className="h-10 w-10 text-destructive mb-4" />
            <h2 className="text-xl font-semibold mb-2">Error\1>
            <p className="text-muted-foreground">{error}\1>
            <Button>
              className="mt-4"
              onClick={() => router.push('/dashboard/hr/assets')}
            >
              Return to Assets
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
          onClick={() => router.push('/dashboard/hr/assets')}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Assets
        </Button>
      </div>

      \1>
\1>
            {asset.name}
          </h1>
          \1>
            {asset.serialNumber ? `Serial: ${asset.serialNumber}` : 'No serial number'}
          </p>
        </div>

        \1>
          \1>
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>

          \1>
            <DialogTrigger asChild>
              \1>
                <Trash className="h-4 w-4 mr-2" />
                Delete
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Confirm Deletion</DialogTitle>
                <DialogDescription>
                  Are you sure you want to delete this asset? This action cannot be undone.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button variant="outline" onClick={() => setConfirmDelete(false)}>
                  Cancel
                </Button>
                \1>
                  Delete
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      \1>
        <TabsList>
          <TabsTrigger value="details">Details\1>
          <TabsTrigger value="history">History\1>
          <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
        </TabsList>

        \1>
          \1>
            \1>
              <CardHeader>
                <CardTitle>Asset Information</CardTitle>
              </CardHeader>
              \1>
                \1>
                  \1>
                    <Package className="h-12 w-12 text-muted-foreground" />
                  </div>

                  \1>
                    {asset.name}
                  </h3>
                  \1>
                    {asset.serialNumber || 'No serial number'}
                  </p>

                  \1>
                    {asset.status.replace('_', ' ')}
                  </Badge>
                </div>

                <Separator />

                \1>
                  \1>
                    <Tag className="h-4 w-4 text-muted-foreground" />
<div
                      <p className="text-sm text-muted-foreground">Asset Type\1>
                      <p className="font-medium">{asset.assetType}</p>
                    </div>
                  </div>

                  \1>
                    <Building className="h-4 w-4 text-muted-foreground" />
<div
                      <p className="text-sm text-muted-foreground">Department\1>
                      <p className="font-medium">{asset.department?.name || 'Not Assigned'}</p>
                    </div>
                  </div>

                  \1>
                    <MapPin className="h-4 w-4 text-muted-foreground" />
<div
                      <p className="text-sm text-muted-foreground">Location\1>
                      <p className="font-medium">{asset.location || 'Not Specified'}</p>
                    </div>
                  </div>

                  {asset?.assignedTo && (
                    \1>
                      <User className="h-4 w-4 text-muted-foreground" />
<div
                        <p className="text-sm text-muted-foreground">Assigned To\1>
                        <p className="font-medium">{asset.assignedTo.firstName} {asset.assignedTo.lastName}</p>
                      </div>
                    </div>
                  )}
                </div>

                <Separator />

                \1>
                  \1>
                    <Wrench className="h-4 w-4 mr-2" />
                    Record Maintenance
                  </Button>

                  \1>
                    <MapPin className="h-4 w-4 mr-2" />
                    Transfer Asset
                  </Button>

                  \1>
                    <User className="h-4 w-4 mr-2" />
                    {asset.assignedTo ? 'Reassign Asset' : 'Assign Asset'}
                  </Button>
                </div>
              </CardContent>
            </Card>

            \1>
              <CardHeader>
                <CardTitle>Asset Details</CardTitle>
              </CardHeader>
              <CardContent>
                \1>
                  \1>
                    <p className="text-sm text-muted-foreground">Manufacturer\1>
                    <p className="font-medium">{asset.manufacturer || '—'}</p>
                  </div>

                  \1>
                    <p className="text-sm text-muted-foreground">Model\1>
                    <p className="font-medium">{asset.model || '—'}</p>
                  </div>

                  \1>
                    <p className="text-sm text-muted-foreground">Purchase Date\1>
                    <p className="font-medium">{formatDateOrPlaceholder(asset.purchaseDate)}</p>
                  </div>

                  \1>
                    <p className="text-sm text-muted-foreground">Purchase Price\1>
                    <p className="font-medium">{formatCurrency(asset.purchasePrice)}</p>
                  </div>

                  \1>
                    <p className="text-sm text-muted-foreground">Warranty Expiry\1>
                    <p className="font-medium">{formatDateOrPlaceholder(asset.warrantyExpiryDate)}</p>
                  </div>

                  \1>
                    <p className="text-sm text-muted-foreground">Last Maintenance\1>
                    <p className="font-medium">{formatDateOrPlaceholder(asset.lastMaintenanceDate)}</p>
                  </div>

                  \1>
                    <p className="text-sm text-muted-foreground">Next Maintenance\1>
                    <p className="font-medium">{formatDateOrPlaceholder(asset.nextMaintenanceDate)}</p>
                  </div>

                  \1>
                    <p className="text-sm text-muted-foreground">Created On\1>
                    <p className="font-medium">{formatDateOrPlaceholder(asset.createdAt)}</p>
                  </div>
                </div>

                {asset?.tags && asset.tags.length > 0 && (
                  <>
                    <Separator className="my-6" />

                    \1>
                      <p className="text-sm text-muted-foreground">Tags\1>
                      \1>
                        {asset.tags.map((tag, index) => (
                          \1>
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                {asset?.notes && (
                  <>
                    <Separator className="my-6" />

                    \1>
                      <p className="text-sm text-muted-foreground">Notes\1>
                      \1>
                        <p className="whitespace-pre-line">{asset.notes}</p>
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        \1>
          <Card>
            <CardHeader>
              <CardTitle>Asset History</CardTitle>
              <CardDescription>
                Track changes and events related to this asset
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!asset.assetHistory || asset.assetHistory.length === 0 ? (
                \1>
                  <p>No history records found for this asset.</p>
                </div>
              ) : (
                \1>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Event Type</TableHead>
                        <TableHead>Details</TableHead>
                        <TableHead>Performed By</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {asset.assetHistory.map((history) => (
                        \1>
                          <TableCell>
                            {format(new Date(history.date), 'PPP p')}
                          </TableCell>
                          <TableCell>
                            \1>
                              {history.type.replace('_', ' ')}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {history.type === 'TRANSFER' && (
<span
                                Transferred from {history.details.previousLocation ||
                                  'Unknown'} to {history.details.newLocation}
                              </span>
                            )}
                            {history.type === 'ASSIGNMENT' && (
<span
                                Assigned to {history.employee?.firstName} {history.employee?.lastName}
                              </span>
                            )}
                            {history.type === 'UNASSIGNMENT' && (
<span
                                Unassigned from employee;
                              </span>
                            )}
                            {history.type === 'MAINTENANCE' && (
<span
                                {history.details.maintenanceType} maintenance: {history.details.description}
                              </span>
                            )}
                            {history.type === 'DISPOSAL' && (
<span
                                Disposed via {history.details.disposalMethod}: {history.details.reason}
                              </span>
                            )}
                            {history.type === 'STATUS_CHANGE' && (
<span
                                Status changed from {history.details.previousStatus} to {history.details.newStatus}
                              </span>
                            )}
                          </TableCell>
                          <TableCell>
                            {history.employee ? (
                              <span>{history.employee.firstName} {history.employee.lastName}</span>
                            ) : (
                              <span>System</span>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        \1>
          <Card>
            <CardHeader>
              \1>
<div
                  <CardTitle>Maintenance Records</CardTitle>
                  <CardDescription>
                    View and manage maintenance history
                  </CardDescription>
                </div>
                \1>
                  <Wrench className="h-4 w-4 mr-2" />
                  Record Maintenance
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {!asset.maintenanceRecords || asset.maintenanceRecords.length === 0 ? (
                \1>
                  <p>No maintenance records found for this asset.</p>
                </div>
              ) : (
                \1>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Performed By</TableHead>
                        <TableHead>Cost</TableHead>
                        <TableHead>Next Maintenance</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {asset.maintenanceRecords.map((record) => (
                        \1>
                          <TableCell>
                            {format(new Date(record.date), 'PPP')}
                          </TableCell>
                          <TableCell>
                            \1>
                              {record.maintenanceType}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {record.performedBy || '—'}
                          </TableCell>
                          <TableCell>
                            {formatCurrency(record.cost)}
                          </TableCell>
                          <TableCell>
                            {formatDateOrPlaceholder(record.nextMaintenanceDate)}
                          </TableCell>
                          <TableCell>
                            <Button>
                              variant="ghost"
                              size="sm"
                              onClick={() => router.push(`/dashboard/hr/assets/${asset.id}/maintenance/${\1}`}
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
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
