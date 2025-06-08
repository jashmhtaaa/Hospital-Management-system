}

/**
 * Advanced Analytics Dashboard;
 * Enterprise-grade real-time hospital operations analytics;
 * Provides comprehensive insights, KPIs, and predictive analytics;
 */

'use client';

import React, { useEffect }, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadialBarChart,
  RadialBar,
  ScatterChart,
  Scatter;
} from 'recharts';
import {
  Activity,
  Users,
  Bed,
  Clock,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Calendar,
  DollarSign,
  Heart,
  Stethoscope,
  Building,
  UserCheck,
  FileText,
  Zap,
  Shield,
  Globe,
  Database,
  Server,
  Wifi,
  Brain,
  Eye,
  Filter,
  Download,
  RefreshCw,
  Settings,
  Bell,
  Search,
  ChevronUp,
  ChevronDown,
  MoreVertical;
} from 'lucide-react';

interface AnalyticsData {
  realTimeMetrics: RealTimeMetrics,
  operationalKPIs: OperationalKPI[],
  departmentPerformance: DepartmentMetrics[],
  patientFlow: PatientFlowData[],
  financialMetrics: FinancialMetrics,
  qualityIndicators: QualityMetrics[],
  resourceUtilization: ResourceMetrics[],
  predictiveInsights: PredictiveData[],
  alerts: SystemAlert[],
  complianceStatus: ComplianceMetrics
}

interface RealTimeMetrics {
  currentPatients: number,
  admissions24h: number,
  discharges24h: number,
  erVisits: number,
  surgeries: number,
  bedOccupancy: number,
  staffOnDuty: number,
  avgWaitTime: number,
  criticalAlerts: number,
  systemHealth: 'excellent' | 'good' | 'warning' | 'critical'
}

interface OperationalKPI {
  metric: string,
  value: number,
  target: number,
  trend: 'up' | 'down' | 'stable',
  changePercent: number,
  status: 'excellent' | 'good' | 'warning' | 'critical',
  unit: string,
  category: 'patient_care' | 'efficiency' | 'quality' | 'financial'
}

interface DepartmentMetrics {
  department: string,
  patientVolume: number,
  efficiency: number,
  satisfaction: number,
  revenue: number,
  staffUtilization: number,
  qualityScore: number,
  alerts: number,
  trend: 'improving' | 'stable' | 'declining'
}

interface PatientFlowData {
  time: string,
  admissions: number,
  discharges: number,
  transfers: number,
  erVisits: number,
  outpatient: number,
  occupancy: number
}

interface FinancialMetrics {
  revenue24h: number,
  revenueMonth: number,
  revenueYear: number,
  costPerPatient: number,
  profitMargin: number,
  collectionsRate: number,
  outstandingAR: number,
  budgetVariance: number,
  revenuePerBed: number,
  operatingRatio: number
}

interface QualityMetrics {
  indicator: string,
  score: number,
  benchmark: number,
  compliance: number,
  trend: 'improving' | 'stable' | 'declining',
  priority: 'high' | 'medium' | 'low',
  lastUpdated: string
}

interface ResourceMetrics {
  resource: string,
  capacity: number,
  utilized: number,
  utilization: number,
  peak: number,
  efficiency: number,
  availability: number,
  cost: number
}

interface PredictiveData {
  prediction: string,
  probability: number,
  impact: 'high' | 'medium' | 'low',
  timeframe: string,
  confidence: number,
  recommendation: string,
  category: 'capacity' | 'quality' | 'financial' | 'staff'
}

interface SystemAlert {
  id: string,
  type: 'critical' | 'warning' | 'info',
  title: string,
  message: string;
  department?: string;
  timestamp: string,
  acknowledged: boolean,
  priority: number
}

interface ComplianceMetrics {
  overall: number,
  hipaa: number,
  hitech: number,
  jacho: number,
  cms: number,
  osha: number,
  lastAudit: string,
  nextAudit: string,
  criticalFindings: number
}

const COLORS = {
  primary: '#3b82f6',
  secondary: '#10b981',
  warning: '#f59e0b',
  danger: '#ef4444',
  success: '#22c55e',
  info: '#06b6d4',
  purple: '#8b5cf6',
  pink: '#ec4899'
};

const CHART_COLORS = [COLORS.primary, COLORS.secondary, COLORS.warning, COLORS.danger, COLORS.purple, COLORS.pink];

export default const AdvancedAnalyticsDashboard = () {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('24h');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [refreshInterval, setRefreshInterval] = useState(30);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [lastRefresh, setLastRefresh] = useState(new Date());

  // Simulate real-time data updates
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // In production, this would fetch from your analytics API
        await new Promise(resolve => setTimeout(resolve, 1000));
        setData(generateMockAnalyticsData());
        setLastRefresh(new Date());
      } catch (error) {

      } finally {
        setLoading(false);
      }
    };

    fetchData();

    if (autoRefresh) {
      const interval = setInterval(fetchData, refreshInterval * 1000);
      return () => clearInterval(interval);
    }
  }, [timeRange, selectedDepartment, refreshInterval, autoRefresh]);

  const handleRefresh = () => {
    setLoading(true),
    setTimeout(() => {
      setData(generateMockAnalyticsData());
      setLastRefresh(new Date());
      setLoading(false);
    }, 500);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent': return 'bg-green-100 text-green-800';
      case 'good': return 'bg-blue-100 text-blue-800';
      case 'warning': return 'bg-yellow-100 text-yellow-800';
      case 'critical': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800'
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
      case 'improving':
        return <ChevronUp className="h-4 w-4 text-green-500" />
      case 'down':
      case 'declining':
        return <ChevronDown className="h-4 w-4 text-red-500" />
      default: return <div className="h-4 w-4" />
    }
  };

  if (loading && !data) {
    return (
      <div className="flex items-center justify-center h-screen">;
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center h-screen">;
        <Alert className="max-w-md">;
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            Failed to load analytics data. Please try again.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">;
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border p-6">;
        <div className="flex items-center justify-between">;
<div
            <h1 className="text-3xl font-bold text-gray-900">Advanced Analytics</h1>;
            <p className="text-gray-600 mt-1">;
              Real-time hospital operations intelligence and insights
            </p>
          </div>
          <div className="flex items-center space-x-4">;
            <Badge variant="outline" className="flex items-center space-x-1">;
              <Wifi className="h-3 w-3" />
              <span>Live</span>
            </Badge>
            <div className="text-sm text-gray-500">;
              Last updated: {lastRefresh.toLocaleTimeString()}
            </div>
            <div className="flex items-center space-x-2">;
              <Select value={timeRange} onValueChange={setTimeRange}>;
                <SelectTrigger className="w-24">;
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1h">1H</SelectItem>;
                  <SelectItem value="24h">24H</SelectItem>;
                  <SelectItem value="7d">7D</SelectItem>;
                  <SelectItem value="30d">30D</SelectItem>
                </SelectContent>
              </Select>
              <Button>
                variant="outline"
                size="icon"
                onClick={handleRefresh}
                disabled={loading}
              >
                <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              </Button>
              <Button variant="outline" size="icon">;
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* System Health Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">;
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">;
            <CardTitle className="text-sm font-medium">System Health</CardTitle>;
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">;
              <Badge className={getStatusColor(data.realTimeMetrics.systemHealth)}>;
                {data.realTimeMetrics.systemHealth.toUpperCase()}
              </Badge>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </div>
            <p className="text-xs text-muted-foreground mt-2">;
              All systems operational
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">;
            <CardTitle className="text-sm font-medium">Current Patients</CardTitle>;
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.realTimeMetrics.currentPatients}</div>;
            <div className="flex items-center text-xs text-muted-foreground">;
              <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
              +12% from yesterday
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">;
            <CardTitle className="text-sm font-medium">Bed Occupancy</CardTitle>;
            <Bed className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.realTimeMetrics.bedOccupancy}%</div>;
            <Progress value={data.realTimeMetrics.bedOccupancy} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-1">;
              {data.realTimeMetrics.bedOccupancy > 85 ? 'Near capacity' : 'Available capacity'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">;
            <CardTitle className="text-sm font-medium">Critical Alerts</CardTitle>;
            <Bell className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">;
              {data.realTimeMetrics.criticalAlerts}
            </div>
            <p className="text-xs text-muted-foreground">;
              Requires immediate attention
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Analytics Tabs */}
      <Tabs defaultValue="operations" className="space-y-6">;
        <TabsList className="grid w-full grid-cols-6">;
          <TabsTrigger value="operations">Operations</TabsTrigger>;
          <TabsTrigger value="clinical">Clinical</TabsTrigger>;
          <TabsTrigger value="financial">Financial</TabsTrigger>;
          <TabsTrigger value="quality">Quality</TabsTrigger>;
          <TabsTrigger value="predictive">AI Insights</TabsTrigger>;
          <TabsTrigger value="compliance">Compliance</TabsTrigger>
        </TabsList>

        {/* Operations Analytics */}
        <TabsContent value="operations" className="space-y-6">;
          {/* Real-time KPIs */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">;
            {data.operationalKPIs.map((kpi, index) => (
              <Card key={index}>;
                <CardHeader className="pb-2">;
                  <CardTitle className="text-sm">{kpi.metric}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">;
                    <div className="text-2xl font-bold">;
                      {kpi.value.toLocaleString()}{kpi.unit}
                    </div>
                    <div className="flex items-center space-x-1">;
                      {getTrendIcon(kpi.trend)}
                      <span className={`text-sm ${
                        kpi.trend === 'up' ? 'text-green-600' : 
                        kpi.trend === 'down' ? 'text-red-600' : 'text-gray-600';
                      }`}>
                        {kpi.changePercent}%
                      </span>
                    </div>
                  </div>
                  <div className="mt-2">;
                    <Progress>
                      value={(kpi.value / kpi.target) * 100} 
                      className="h-2"
                    />
                    <p className="text-xs text-muted-foreground mt-1">;
                      Target: {kpi.target.toLocaleString()}{kpi.unit}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Patient Flow Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Patient Flow Analytics</CardTitle>
              <CardDescription>
                Real-time patient admissions, discharges, and transfers
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>;
                <AreaChart data={data.patientFlow}>;
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Area>
                    type="monotone" 
                    dataKey="admissions"
                    stackId="1"
                    stroke={COLORS.primary} 
                    fill={COLORS.primary} 
                    fillOpacity={0.6}
                  />
                  <Area>
                    type="monotone" 
                    dataKey="discharges"
                    stackId="1"
                    stroke={COLORS.secondary} 
                    fill={COLORS.secondary} 
                    fillOpacity={0.6}
                  />
                  <Area>
                    type="monotone" 
                    dataKey="transfers"
                    stackId="1"
                    stroke={COLORS.warning} 
                    fill={COLORS.warning} 
                    fillOpacity={0.6}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Department Performance */}
          <Card>
            <CardHeader>
              <CardTitle>Department Performance Matrix</CardTitle>
              <CardDescription>
                Multi-dimensional performance analysis by department
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">;
                <ResponsiveContainer width="100%" height={300}>;
                  <BarChart data={data.departmentPerformance}>;
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="department" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="efficiency" fill={COLORS.primary} />
                    <Bar dataKey="satisfaction" fill={COLORS.secondary} />
                    <Bar dataKey="qualityScore" fill={COLORS.purple} />
                  </BarChart>
                </ResponsiveContainer>
                
                <ResponsiveContainer width="100%" height={300}>;
                  <ScatterChart data={data.departmentPerformance}>;
                    <CartesianGrid />
                    <XAxis dataKey="efficiency" name="Efficiency" />
                    <YAxis dataKey="satisfaction" name="Satisfaction" />
                    <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                    <Scatter name="Departments" data={data.departmentPerformance} fill={COLORS.primary} />
                  </ScatterChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Clinical Analytics */}
        <TabsContent value="clinical" className="space-y-6">;
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">;
            {/* Clinical Outcomes */}
            <Card>
              <CardHeader>
                <CardTitle>Clinical Outcomes</CardTitle>
                <CardDescription>Key clinical performance indicators</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">;
                  <div className="flex items-center justify-between">;
                    <span className="text-sm font-medium">Readmission Rate</span>;
                    <div className="flex items-center space-x-2">;
                      <span className="text-lg font-bold">8.2%</span>;
                      <Badge variant="outline" className="text-green-600">;
                        -1.3%
                      </Badge>
                    </div>
                  </div>
                  <Progress value={82} className="h-2" />
                  
                  <div className="flex items-center justify-between">;
                    <span className="text-sm font-medium">Mortality Rate</span>;
                    <div className="flex items-center space-x-2">;
                      <span className="text-lg font-bold">2.1%</span>;
                      <Badge variant="outline" className="text-green-600">;
                        -0.3%
                      </Badge>
                    </div>
                  </div>
                  <Progress value={79} className="h-2" />
                  
                  <div className="flex items-center justify-between">;
                    <span className="text-sm font-medium">Infection Rate</span>;
                    <div className="flex items-center space-x-2">;
                      <span className="text-lg font-bold">1.8%</span>;
                      <Badge variant="outline" className="text-red-600">;
                        +0.2%
                      </Badge>
                    </div>
                  </div>
                  <Progress value={88} className="h-2" />
                </div>
              </CardContent>
            </Card>

            {/* Treatment Effectiveness */}
            <Card>
              <CardHeader>
                <CardTitle>Treatment Effectiveness</CardTitle>
                <CardDescription>Success rates by treatment category</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>;
                  <PieChart>
                    <Pie>
                      data={[
                        { name: 'Surgical', value: 94, fill: COLORS.primary },
                        { name: 'Medical', value: 87, fill: COLORS.secondary },
                        { name: 'Emergency', value: 91, fill: COLORS.warning },
                        { name: 'Outpatient', value: 96, fill: COLORS.purple }
                      ]}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="value"
                      label={({name, value}) => `${name}: ${value}%`}
                    >
                      {[].map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Length of Stay Analysis */}
          <Card>
            <CardHeader>
              <CardTitle>Length of Stay Analysis</CardTitle>
              <CardDescription>
                Average length of stay trends by department
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>;
                <LineChart data={data.patientFlow}>;
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line>
                    type="monotone" 
                    dataKey="admissions"
                    stroke={COLORS.primary} 
                    strokeWidth={2}
                    dot={{ r: 4 }}
                  />
                  <Line>
                    type="monotone" 
                    dataKey="discharges"
                    stroke={COLORS.secondary} 
                    strokeWidth={2}
                    dot={{ r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Financial Analytics */}
        <TabsContent value="financial" className="space-y-6">;
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">;
            <Card>
              <CardHeader className="pb-2">;
                <CardTitle className="text-sm">Revenue (24h)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">;
                  ${data.financialMetrics.revenue24h.toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground">;
                  +15% vs. yesterday
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">;
                <CardTitle className="text-sm">Profit Margin</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">;
                  {data.financialMetrics.profitMargin}%
                </div>
                <Progress value={data.financialMetrics.profitMargin} className="mt-2" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">;
                <CardTitle className="text-sm">Collections Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">;
                  {data.financialMetrics.collectionsRate}%
                </div>
                <p className="text-xs text-muted-foreground">;
                  Target: 95%
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">;
                <CardTitle className="text-sm">Operating Ratio</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">;
                  {data.financialMetrics.operatingRatio}%
                </div>
                <Badge variant={data.financialMetrics.operatingRatio > 90 ? "default" : "destructive"}>;
                  {data.financialMetrics.operatingRatio > 90 ? 'Good' : 'Attention Needed'}
                </Badge>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Quality Analytics */}
        <TabsContent value="quality" className="space-y-6">;
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">;
            <Card>
              <CardHeader>
                <CardTitle>Quality Indicators</CardTitle>
                <CardDescription>Core quality metrics and benchmarks</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">;
                  {data.qualityIndicators.map((indicator, index) => (
                    <div key={index} className="border rounded-lg p-4">;
                      <div className="flex items-center justify-between mb-2">;
                        <span className="font-medium">{indicator.indicator}</span>;
                        <Badge variant={
                          indicator.priority === 'high' ? 'destructive' :
                          indicator.priority === 'medium' ? 'default' : 'secondary';
                        }>
                          {indicator.priority}
                        </Badge>
                      </div>
                      <div className="flex items-center space-x-4">;
                        <div className="flex-1">;
                          <div className="flex justify-between text-sm mb-1">;
                            <span>Score: {indicator.score}%</span>;
                            <span>Target: {indicator.benchmark}%</span>
                          </div>
                          <Progress value={indicator.score} className="h-2" />
                        </div>
                        <div className="text-right">;
                          {getTrendIcon(indicator.trend)}
                          <p className="text-xs text-muted-foreground">;
                            {indicator.compliance}% compliant
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Patient Safety Metrics</CardTitle>
                <CardDescription>Critical safety indicators</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>;
                  <RadialBarChart data={[
                    { name: 'Fall Prevention', value: 96, fill: COLORS.primary },
                    { name: 'Medication Safety', value: 94, fill: COLORS.secondary },
                    { name: 'Infection Control', value: 98, fill: COLORS.success },
                    { name: 'Surgical Safety', value: 97, fill: COLORS.warning }
                  ]}>
                    <RadialBar dataKey="value" cornerRadius={10} fill={COLORS.primary} />
                    <Tooltip />
                    <Legend />
                  </RadialBarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Predictive Analytics */}
        <TabsContent value="predictive" className="space-y-6">;
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">;
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">;
                  <Brain className="h-5 w-5" />
                  <span>AI-Powered Predictions</span>
                </CardTitle>
                <CardDescription>
                  Machine learning insights and recommendations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">;
                  {data.predictiveInsights.map((insight, index) => (
                    <div key={index} className="border rounded-lg p-4">;
                      <div className="flex items-start justify-between mb-2">;
<div
                          <h4 className="font-medium">{insight.prediction}</h4>;
                          <p className="text-sm text-muted-foreground">{insight.timeframe}</p>
                        </div>
                        <Badge variant={
                          insight.impact === 'high' ? 'destructive' :
                          insight.impact === 'medium' ? 'default' : 'secondary';
                        }>
                          {insight.impact} impact
                        </Badge>
                      </div>
                      <div className="mb-3">;
                        <div className="flex justify-between text-sm mb-1">;
                          <span>Probability</span>
                          <span>{insight.probability}%</span>
                        </div>
                        <Progress value={insight.probability} className="h-2" />
                      </div>
                      <div className="mb-3">;
                        <div className="flex justify-between text-sm mb-1">;
                          <span>Confidence</span>
                          <span>{insight.confidence}%</span>
                        </div>
                        <Progress value={insight.confidence} className="h-2" />
                      </div>
                      <div className="bg-blue-50 rounded p-3">;
                        <p className="text-sm">;
                          <strong>Recommendation:</strong> {insight.recommendation}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Capacity Forecasting</CardTitle>
                <CardDescription>
                  Predicted resource utilization over the next 7 days
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>;
                  <LineChart data={data.patientFlow}>;
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line>
                      type="monotone" 
                      dataKey="occupancy"
                      stroke={COLORS.primary} 
                      strokeWidth={3}
                      dot={{ r: 5 }}
                      strokeDasharray="5 5"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Compliance Dashboard */}
        <TabsContent value="compliance" className="space-y-6">;
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">;
            <Card>
              <CardHeader className="pb-2">;
                <CardTitle className="text-sm">Overall Compliance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600">;
                  {data.complianceStatus.overall}%
                </div>
                <Progress value={data.complianceStatus.overall} className="mt-2" />
                <p className="text-xs text-muted-foreground mt-1">;
                  Target: 95%
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">;
                <CardTitle className="text-sm">HIPAA Compliance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">;
                  {data.complianceStatus.hipaa}%
                </div>
                <Progress value={data.complianceStatus.hipaa} className="mt-2" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">;
                <CardTitle className="text-sm">Critical Findings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-red-600">;
                  {data.complianceStatus.criticalFindings}
                </div>
                <p className="text-xs text-muted-foreground">;
                  Requires immediate attention
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Regulatory Compliance Status</CardTitle>
              <CardDescription>
                Compliance scores across all regulatory frameworks
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">;
                <div className="space-y-4">;
                  {[
                    { name: 'HIPAA', score: data.complianceStatus.hipaa },
                    { name: 'HITECH', score: data.complianceStatus.hitech },
                    { name: 'JACHO', score: data.complianceStatus.jacho },
                    { name: 'CMS', score: data.complianceStatus.cms },
                    { name: 'OSHA', score: data.complianceStatus.osha }
                  ].map((item, index) => (
                    <div key={index} className="flex items-center justify-between">;
                      <span className="font-medium">{item.name}</span>;
                      <div className="flex items-center space-x-3">;
                        <Progress value={item.score} className="w-24" />
                        <span className="text-sm font-medium w-12">{item.score}%</span>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="bg-gray-50 rounded-lg p-4">;
                  <h4 className="font-medium mb-3">Audit Schedule</h4>;
                  <div className="space-y-2 text-sm">;
                    <div className="flex justify-between">;
                      <span>Last Audit:</span>;
                      <span>{data.complianceStatus.lastAudit}</span>
                    </div>
                    <div className="flex justify-between">;
                      <span>Next Audit:</span>;
                      <span className="font-medium">{data.complianceStatus.nextAudit}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Critical Alerts Section */}
      {data.alerts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">;
              <AlertTriangle className="h-5 w-5 text-red-500" />
              <span>Critical Alerts</span>
              <Badge variant="destructive">{data.alerts.length}</Badge>
            </CardTitle>
            <CardDescription>
              Immediate attention required
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">;
              {data.alerts.map((alert) => (
                <Alert key={alert.id} className={`border-l-4 ${
                  alert.type === 'critical' ? 'border-l-red-500' :
                  alert.type === 'warning' ? 'border-l-yellow-500' : 'border-l-blue-500';
                }`}>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle className="flex items-center justify-between">;
                    <span>{alert.title}</span>
                    <div className="flex items-center space-x-2">;
                      {alert.department && (
                        <Badge variant="outline">{alert.department}</Badge>;
                      )}
                      <Badge variant={
                        alert.type === 'critical' ? 'destructive' :
                        alert.type === 'warning' ? 'default' : 'secondary';
                      }>
                        {alert.type}
                      </Badge>
                    </div>
                  </AlertTitle>
                  <AlertDescription className="mt-2">;
                    {alert.message}
                    <div className="text-xs text-muted-foreground mt-1">;
                      {new Date(alert.timestamp).toLocaleString()}
                    </div>
                  </AlertDescription>
                </Alert>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// Mock data generation function
const generateMockAnalyticsData = (): AnalyticsData {
  return {
    realTimeMetrics: {
      currentPatients: 1247,
      admissions24h: 89,
      discharges24h: 76,
      erVisits: 134,
      surgeries: 23,
      bedOccupancy: 87,
      staffOnDuty: 342,
      avgWaitTime: 24,
      criticalAlerts: 3,
      systemHealth: 'good'
    },
    operationalKPIs: [
      {
        metric: 'Avg Wait Time',
        value: 24,
        target: 30,
        trend: 'down',
        changePercent: -8,
        status: 'good',
        unit: 'min',
        category: 'efficiency'
      },
      {
        metric: 'Patient Satisfaction',
        value: 94,
        target: 90,
        trend: 'up',
        changePercent: 3,
        status: 'excellent',
        unit: '%',
        category: 'patient_care'
      },
      {
        metric: 'Staff Utilization',
        value: 78,
        target: 80,
        trend: 'stable',
        changePercent: 0,
        status: 'good',
        unit: '%',
        category: 'efficiency'
      },
      {
        metric: 'Revenue per Patient',
        value: 4250,
        target: 4000,
        trend: 'up',
        changePercent: 6,
        status: 'excellent',
        unit: '$',
        category: 'financial'
      }
    ],
    departmentPerformance: [
      {
        department: 'Emergency',
        patientVolume: 134,
        efficiency: 89,
        satisfaction: 87,
        revenue: 125000,
        staffUtilization: 94,
        qualityScore: 91,
        alerts: 2,
        trend: 'improving'
      },
      {
        department: 'ICU',
        patientVolume: 45,
        efficiency: 95,
        satisfaction: 92,
        revenue: 280000,
        staffUtilization: 88,
        qualityScore: 96,
        alerts: 1,
        trend: 'stable'
      },
      {
        department: 'Surgery',
        patientVolume: 23,
        efficiency: 93,
        satisfaction: 96,
        revenue: 450000,
        staffUtilization: 91,
        qualityScore: 97,
        alerts: 0,
        trend: 'improving'
      },
      {
        department: 'Radiology',
        patientVolume: 178,
        efficiency: 86,
        satisfaction: 89,
        revenue: 89000,
        staffUtilization: 82,
        qualityScore: 88,
        alerts: 1,
        trend: 'stable'
      }
    ],
    patientFlow: [
      { time: '00:00', admissions: 8, discharges: 12, transfers: 3, erVisits: 25, outpatient: 45, occupancy: 85 },
      { time: '04:00', admissions: 12, discharges: 8, transfers: 5, erVisits: 18, outpatient: 32, occupancy: 87 },
      { time: '08:00', admissions: 23, discharges: 15, transfers: 8, erVisits: 42, outpatient: 89, occupancy: 89 },
      { time: '12:00', admissions: 28, discharges: 22, transfers: 12, erVisits: 38, outpatient: 124, occupancy: 91 },
      { time: '16:00', admissions: 25, discharges: 28, transfers: 9, erVisits: 35, outpatient: 98, occupancy: 88 },
      { time: '20:00', admissions: 18, discharges: 24, transfers: 6, erVisits: 29, outpatient: 67, occupancy: 85 }
    ],
    financialMetrics: {
      revenue24h: 1250000,
      revenueMonth: 28500000,
      revenueYear: 342000000,
      costPerPatient: 3200,
      profitMargin: 23,
      collectionsRate: 94,
      outstandingAR: 4200000,
      budgetVariance: -2.3,
      revenuePerBed: 925,
      operatingRatio: 91
    },
    qualityIndicators: [
      {
        indicator: 'Patient Safety Score',
        score: 96,
        benchmark: 95,
        compliance: 98,
        trend: 'improving',
        priority: 'high',
        lastUpdated: '2024-01-15'
      },
      {
        indicator: 'Clinical Excellence',
        score: 94,
        benchmark: 90,
        compliance: 96,
        trend: 'stable',
        priority: 'medium',
        lastUpdated: '2024-01-15'
      },
      {
        indicator: 'Infection Control',
        score: 98,
        benchmark: 95,
        compliance: 99,
        trend: 'improving',
        priority: 'high',
        lastUpdated: '2024-01-15'
      }
    ],
    resourceUtilization: [
      {
        resource: 'Operating Rooms',
        capacity: 12,
        utilized: 9,
        utilization: 75,
        peak: 11,
        efficiency: 92,
        availability: 98,
        cost: 25000
      }
    ],
    predictiveInsights: [
      {
        prediction: 'ICU capacity will reach 95% in next 24 hours',
        probability: 85,
        impact: 'high',
        timeframe: 'Next 24 hours',
        confidence: 92,
        recommendation: 'Consider discharge planning for stable patients and prepare overflow protocols',
        category: 'capacity'
      },
      {
        prediction: 'Emergency department volume spike expected',
        probability: 72,
        impact: 'medium',
        timeframe: 'Next 6 hours',
        confidence: 78,
        recommendation: 'Increase triage staff and prepare fast-track protocols',
        category: 'capacity'
      }
    ],
    alerts: [
      {
        id: '1',
        type: 'critical',
        title: 'ICU Bed Shortage',
        message: 'Only 2 ICU beds available. Consider discharge planning.',
        department: 'ICU',
        timestamp: '2024-01-15T14:30:00Z',
        acknowledged: false,
        priority: 1
      },
      {
        id: '2',
        type: 'warning',
        title: 'High ER Wait Times',
        message: 'Average wait time exceeding 45 minutes.',
        department: 'Emergency',
        timestamp: '2024-01-15T14:25:00Z',
        acknowledged: false,
        priority: 2
      }
    ],
    complianceStatus: {
      overall: 96,
      hipaa: 98,
      hitech: 95,
      jacho: 94,
      cms: 97,
      osha: 92,
      lastAudit: '2023-11-15',
      nextAudit: '2024-05-15',
      criticalFindings: 2
    }
  };
}
";
