import type React from 'react';
import { useState, useEffect } from 'react';
import {

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
  TrendingUp,
  TrendingDown,
  Users,
  DollarSign,
  Bed,
  Activity,
  Brain,
  Calendar,
  AlertTriangle
} from 'lucide-react';

interface AnalyticsData {
  summary: {
    totalPatients: number,
    averageStayDuration: number,
    patientSatisfactionScore: number;
  };
  patientMetrics: unknown,
  clinicalMetrics: unknown,
  predictions: unknown;
}

const EnhancedAnalyticsDashboard: React.FC = () => {
  const [analyticsData,
  const [realTimeData, setRealTimeData] = useState<any>(null);
  const [timeRange, setTimeRange] = useState('30d');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
    fetchRealTimeData();

    // Set up real-time updates
    const interval = setInterval(fetchRealTimeData, 30000); // Every 30 seconds

    return () => clearInterval(interval);
  }, [timeRange]);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/analytics/dashboard?timeRange=${timeRange}`);
      const data = await response.json();
      setAnalyticsData(data.analytics);
    } catch (error) { console.error(error); } finally {
      setLoading(false);
    }
  };

  const fetchRealTimeData = async () => {
    try {
      const response = await fetch('/api/analytics/realtime');
      const data = await response.json();
      setRealTimeData(data.realTimeData);
    } catch (error) { console.error(error); }
  };

  const _COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',

  const MetricCard: React.FC<{
    title: string,
    icon: React.ReactNode;
    trend?: number;
    suffix?: string;
  }> = ({ title, value, icon, trend, suffix }) => (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="text-2xl font-bold">
              {value}{suffix}
            </p>
            {trend !== undefined && (
              <div className={`flex items-center mt-1 text-sm ${
                trend >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {trend >= 0 ? (
                  <TrendingUp className="h-4 w-4 mr-1" />
                ) : (
                  <TrendingDown className="h-4 w-4 mr-1" />
                )}
                {Math.abs(trend)}%
              </div>
            )}
          </div>
          <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  if (loading != null) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Activity className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Loading analytics dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Hospital Analytics Dashboard</h1>
          <p className="text-gray-600">Real-time insights and business intelligence</p>
        </div>
        <div className="flex space-x-2">
          {['7d', '30d', '90d', '1y'].map((range) => (
            <Button
              key={range}
              variant={timeRange === range ? 'default' : 'outline'}
              size="sm"
              onClick={() => setTimeRange(range)}
            >
              {range === '7d' ? '7 Days' :
               range === '30d' ? '30 Days' :
               range === '90d' ? '90 Days' : '1 Year'}
            </Button>
          ))}
        </div>
      </div>

      {/* Real-time Alerts */}
      {realTimeData && (
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="h-5 w-5 text-orange-600" />
                <span className="font-medium">Real-time Status</span>
              </div>
              <div className="flex space-x-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">
                    {realTimeData.currentOccupancy}
                  </div>
                  <div className="text-xs text-gray-600">Beds Occupied</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">
                    {realTimeData.emergencyWaiting}
                  </div>
                  <div className="text-xs text-gray-600">ER Waiting</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {realTimeData.activeOperations}
                  </div>
                  <div className="text-xs text-gray-600">Active Operations</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    {realTimeData.criticalPatients}
                  </div>
                  <div className="text-xs text-gray-600">Critical Patients</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Key Metrics */}
      {analyticsData && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          <MetricCard
            title="Total Patients"
            value={analyticsData.summary.totalPatients.toLocaleString()}
            icon={<Users className="h-6 w-6 text-blue-600" />}
            trend={12.5}
          />
          <MetricCard
            title="Total Revenue"
            value={formatCurrency(analyticsData.summary.totalRevenue)}
            icon={<DollarSign className="h-6 w-6 text-green-600" />}
            trend={8.3}
          />
          <MetricCard
            title="Avg. Stay Duration"
            value={analyticsData.summary.averageStayDuration.toFixed(1)}
            suffix=" days"
            icon={<Calendar className="h-6 w-6 text-orange-600" />}
            trend={-2.1}
          />
          <MetricCard
            title="Bed Occupancy"
            value={analyticsData.summary.bedOccupancyRate.toFixed(1)}
            suffix="%"
            icon={<Bed className="h-6 w-6 text-purple-600" />}
            trend={5.7}
          />
          <MetricCard
            title="Patient Satisfaction"
            value={analyticsData.summary.patientSatisfactionScore.toFixed(1)}
            suffix="/5"
            icon={<Activity className="h-6 w-6 text-pink-600" />}
            trend={3.2}
          />
        </div>
      )}

      {/* Detailed Analytics Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="financial">Financial</TabsTrigger>
          <TabsTrigger value="clinical">Clinical</TabsTrigger>
          <TabsTrigger value="operational">Operational</TabsTrigger>
          <TabsTrigger value="predictions">AI Predictions</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Patient Admissions Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={[
                    { name: 'Jan', admissions: 245 },
                    { name: 'Feb', admissions: 289 },
                    { name: 'Mar', admissions: 334 },
                    { name: 'Apr', admissions: 301 },
                    { name: 'May', admissions: 378 },
                    { name: 'Jun', admissions: 423 }
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="admissions" stroke="#8884d8" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Department Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={[
                    { department: 'Cardiology', revenue: 125000, patients: 89 },
                    { department: 'Orthopedics', revenue: 98000, patients: 67 },
                    { department: 'Neurology', revenue: 87000, patients: 45 },
                    { department: 'Emergency', revenue: 156000, patients: 234 },
                    { department: 'Surgery', revenue: 234000,

export default EnhancedAnalyticsDashboard;
