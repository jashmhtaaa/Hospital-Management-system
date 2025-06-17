import React, { useEffect }, { useState, useEffect, useMemo } from 'react';
import {

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
}

/**
 * Advanced Analytics Dashboard;
 * Enterprise-grade real-time hospital operations analytics;
 * Provides comprehensive insights, KPIs, and predictive analytics;
 */

'use client';

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
  \1,\2 DepartmentMetrics[],
  \1,\2 FinancialMetrics,
  \1,\2 ResourceMetrics[],
  \1,\2 SystemAlert[],
  complianceStatus: ComplianceMetrics
}

interface RealTimeMetrics {
  currentPatients: number,
  \1,\2 number,
  \1,\2 number,
  \1,\2 number,
  \1,\2 number,
  systemHealth: 'excellent' | 'good' | 'warning' | 'critical'
}

interface OperationalKPI {
  metric: string,
  \1,\2 number,
  \1,\2 number,
  \1,\2 string,
  category: 'patient_care' | 'efficiency' | 'quality' | 'financial'
}

interface DepartmentMetrics {
  department: string,
  \1,\2 number,
  \1,\2 number,
  \1,\2 number,
  \1,\2 'improving' | 'stable' | 'declining'
}

interface PatientFlowData {
  time: string,
  \1,\2 number,
  \1,\2 number,
  \1,\2 number
}

interface FinancialMetrics {
  revenue24h: number,
  \1,\2 number,
  \1,\2 number,
  \1,\2 number,
  \1,\2 number,
  operatingRatio: number
}

interface QualityMetrics {
  indicator: string,
  \1,\2 number,
  \1,\2 'improving' | 'stable' | 'declining',
  \1,\2 string
}

interface ResourceMetrics {
  resource: string,
  \1,\2 number,
  \1,\2 number,
  \1,\2 number,
  cost: number
}

interface PredictiveData {
  prediction: string,
  \1,\2 'high' | 'medium' | 'low',
  \1,\2 number,
  \1,\2 'capacity' | 'quality' | 'financial' | 'staff'
}

interface SystemAlert {
  id: string,
  \1,\2 string,
  message: string;
  department?: string;
  timestamp: string,
  \1,\2 number
}

interface ComplianceMetrics {
  overall: number,
  \1,\2 number,
  \1,\2 number,
  \1,\2 string,
  \1,\2 number
}

const COLORS = {
  primary: '#3b82f6',
  \1,\2 '#f59e0b',
  \1,\2 '#22c55e',
  \1,\2 '#8b5cf6',
  pink: '#ec4899'
};

const CHART_COLORS = [COLORS.primary, COLORS.secondary, COLORS.warning, COLORS.danger, COLORS.purple, COLORS.pink];

export default const _AdvancedAnalyticsDashboard = () {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('24h');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [refreshInterval, setRefreshInterval] = useState(30);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [lastRefresh, setLastRefresh] = useState(\1;

  // Simulate real-time data updates
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // In production, this would fetch from your analytics API
        await \1;
        setData(generateMockAnalyticsData());
        setLastRefresh(\1;
      } catch (error) {

      } finally {
        setLoading(false);
      }
    };

    fetchData();

    \1 {\n  \2{
      const interval = setInterval(fetchData, refreshInterval * 1000);
      return () => clearInterval(interval);
    }
  }, [timeRange, selectedDepartment, refreshInterval, autoRefresh]);

  const handleRefresh = () => {
    setLoading(true),
    setTimeout(() => {
      setData(generateMockAnalyticsData());
      setLastRefresh(\1;
      setLoading(false);
    }, 500)
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

  \1 {\n  \2{
    return (
      \1>
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  \1 {\n  \2{
    return (
      \1>
        \1>
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
    \1>
      {/* Header */}
      \1>
        \1>
<div
            <h1 className="text-3xl font-bold text-gray-900">Advanced Analytics\1>
            \1>
              Real-time hospital operations intelligence and insights
            </p>
          </div>
          \1>
            \1>
              <Wifi className="h-3 w-3" />
              <span>Live</span>
            </Badge>
            \1>
              Last updated: {lastRefresh.toLocaleTimeString()}
            </div>
            \1>
              \1>
                \1>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1h">1H\1>
                  <SelectItem value="24h">24H\1>
                  <SelectItem value="7d">7D\1>
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
              \1>
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
      \1>
        <Card>
          \1>
            <CardTitle className="text-sm font-medium">System Health\1>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            \1>
              \1>
                {data.realTimeMetrics.systemHealth.toUpperCase()}
              </Badge>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </div>
            \1>
              All systems operational
            </p>
          </CardContent>
        </Card>

        <Card>
          \1>
            <CardTitle className="text-sm font-medium">Current Patients\1>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.realTimeMetrics.currentPatients}\1>
            \1>
              <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
              +12% from yesterday
            </div>
          </CardContent>
        </Card>

        <Card>
          \1>
            <CardTitle className="text-sm font-medium">Bed Occupancy\1>
            <Bed className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.realTimeMetrics.bedOccupancy}%\1>
            <Progress value={data.realTimeMetrics.bedOccupancy} className="mt-2" />
            \1>
              {data.realTimeMetrics.bedOccupancy > 85 ? 'Near capacity' : 'Available capacity'}
            </p>
          </CardContent>
        </Card>

        <Card>
          \1>
            <CardTitle className="text-sm font-medium">Critical Alerts\1>
            <Bell className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            \1>
              {data.realTimeMetrics.criticalAlerts}
            </div>
            \1>
              Requires immediate attention
            </p>
          </CardContent>
        </Card>
      </div>
      \1>
        \1>
          <TabsTrigger value="operations">Operations\1>
          <TabsTrigger value="clinical">Clinical\1>
          <TabsTrigger value="financial">Financial\1>
          <TabsTrigger value="quality">Quality\1>
          <TabsTrigger value="predictive">AI Insights\1>
          <TabsTrigger value="compliance">Compliance</TabsTrigger>
        </TabsList>

        {/* Operations Analytics */}
        \1>
          {/* Real-time KPIs */}
          \1>
            {data.operationalKPIs.map((kpi, index) => (
              \1>
                \1>
                  <CardTitle className="text-sm">{kpi.metric}</CardTitle>
                </CardHeader>
                <CardContent>
                  \1>
                    \1>
                      {kpi.value.toLocaleString()}{kpi.unit}
                    </div>
                    \1>
                      {getTrendIcon(kpi.trend)}
                      <span className={`text-sm ${
                        kpi.trend === 'up' ? 'text-green-600' :
                        kpi.trend === 'down' ? 'text-red-600' : 'text-gray-600';
                      }`}>
                        {kpi.changePercent}%
                      </span>
                    </div>
                  </div>
                  \1>
                    <Progress>
                      value={(kpi.value / kpi.target) * 100}
                      className="h-2"
                    />
                    \1>
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
              \1>
                \1>
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
              \1>
                \1>
                  \1>
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

                \1>
                  \1>
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
        \1>
          \1>
            {/* Clinical Outcomes */}
            <Card>
              <CardHeader>
                <CardTitle>Clinical Outcomes</CardTitle>
                <CardDescription>Key clinical performance indicators</CardDescription>
              </CardHeader>
              <CardContent>
                \1>
                  \1>
                    <span className="text-sm font-medium">Readmission Rate\1>
                    \1>
                      <span className="text-lg font-bold">8.2%\1>
                      \1>
                        -1.3%
                      </Badge>
                    </div>
                  </div>
                  <Progress value={82} className="h-2" />

                  \1>
                    <span className="text-sm font-medium">Mortality Rate\1>
                    \1>
                      <span className="text-lg font-bold">2.1%\1>
                      \1>
                        -0.3%
                      </Badge>
                    </div>
                  </div>
                  <Progress value={79} className="h-2" />

                  \1>
                    <span className="text-sm font-medium">Infection Rate\1>
                    \1>
                      <span className="text-lg font-bold">1.8%\1>
                      \1>
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
                \1>
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
              \1>
                \1>
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
        \1>
          \1>
            <Card>
              \1>
                <CardTitle className="text-sm">Revenue (24h)</CardTitle>
              </CardHeader>
              <CardContent>
                \1>
                  ${data.financialMetrics.revenue24h.toLocaleString()}
                </div>
                \1>
                  +15% vs. yesterday
                </p>
              </CardContent>
            </Card>

            <Card>
              \1>
                <CardTitle className="text-sm">Profit Margin</CardTitle>
              </CardHeader>
              <CardContent>
                \1>
                  {data.financialMetrics.profitMargin}%
                </div>
                <Progress value={data.financialMetrics.profitMargin} className="mt-2" />
              </CardContent>
            </Card>

            <Card>
              \1>
                <CardTitle className="text-sm">Collections Rate</CardTitle>
              </CardHeader>
              <CardContent>
                \1>
                  {data.financialMetrics.collectionsRate}%
                </div>
                \1>
                  Target: 95%
                </p>
              </CardContent>
            </Card>

            <Card>
              \1>
                <CardTitle className="text-sm">Operating Ratio</CardTitle>
              </CardHeader>
              <CardContent>
                \1>
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
        \1>
          \1>
            <Card>
              <CardHeader>
                <CardTitle>Quality Indicators</CardTitle>
                <CardDescription>Core quality metrics and benchmarks</CardDescription>
              </CardHeader>
              <CardContent>
                \1>
                  {data.qualityIndicators.map((indicator, index) => (
                    \1>
                      \1>
                        <span className="font-medium">{indicator.indicator}\1>
                        <Badge variant={
                          indicator.priority === 'high' ? 'destructive' :
                          indicator.priority === 'medium' ? 'default' : 'secondary';
                        }>
                          {indicator.priority}
                        </Badge>
                      </div>
                      \1>
                        \1>
                          \1>
                            <span>Score: {indicator.score}%\1>
                            <span>Target: {indicator.benchmark}%</span>
                          </div>
                          <Progress value={indicator.score} className="h-2" />
                        </div>
                        \1>
                          {getTrendIcon(indicator.trend)}
                          \1>
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
                \1>
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
        \1>
          \1>
            <Card>
              <CardHeader>
                \1>
                  <Brain className="h-5 w-5" />
                  <span>AI-Powered Predictions</span>
                </CardTitle>
                <CardDescription>
                  Machine learning insights and recommendations
                </CardDescription>
              </CardHeader>
              <CardContent>
                \1>
                  {data.predictiveInsights.map((insight, index) => (
                    \1>
                      \1>
<div
                          <h4 className="font-medium">{insight.prediction}\1>
                          <p className="text-sm text-muted-foreground">{insight.timeframe}</p>
                        </div>
                        <Badge variant={
                          insight.impact === 'high' ? 'destructive' :
                          insight.impact === 'medium' ? 'default' : 'secondary';
                        }>
                          {insight.impact} impact
                        </Badge>
                      </div>
                      \1>
                        \1>
                          <span>Probability</span>
                          <span>{insight.probability}%</span>
                        </div>
                        <Progress value={insight.probability} className="h-2" />
                      </div>
                      \1>
                        \1>
                          <span>Confidence</span>
                          <span>{insight.confidence}%</span>
                        </div>
                        <Progress value={insight.confidence} className="h-2" />
                      </div>
                      \1>
                        \1>
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
                \1>
                  \1>
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
        \1>
          \1>
            <Card>
              \1>
                <CardTitle className="text-sm">Overall Compliance</CardTitle>
              </CardHeader>
              <CardContent>
                \1>
                  {data.complianceStatus.overall}%
                </div>
                <Progress value={data.complianceStatus.overall} className="mt-2" />
                \1>
                  Target: 95%
                </p>
              </CardContent>
            </Card>

            <Card>
              \1>
                <CardTitle className="text-sm">HIPAA Compliance</CardTitle>
              </CardHeader>
              <CardContent>
                \1>
                  {data.complianceStatus.hipaa}%
                </div>
                <Progress value={data.complianceStatus.hipaa} className="mt-2" />
              </CardContent>
            </Card>

            <Card>
              \1>
                <CardTitle className="text-sm">Critical Findings</CardTitle>
              </CardHeader>
              <CardContent>
                \1>
                  {data.complianceStatus.criticalFindings}
                </div>
                \1>
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
              \1>
                \1>
                  {[
                    { name: 'HIPAA', score: data.complianceStatus.hipaa },
                    { name: 'HITECH', score: data.complianceStatus.hitech },
                    { name: 'JACHO', score: data.complianceStatus.jacho },
                    { name: 'CMS', score: data.complianceStatus.cms },
                    { name: 'OSHA', score: data.complianceStatus.osha }
                  ].map((item, index) => (
                    \1>
                      <span className="font-medium">{item.name}\1>
                      \1>
                        <Progress value={item.score} className="w-24" />
                        <span className="text-sm font-medium w-12">{item.score}%</span>
                      </div>
                    </div>
                  ))}
                </div>

                \1>
                  <h4 className="font-medium mb-3">Audit Schedule\1>
                  \1>
                    \1>
                      <span>Last Audit:\1>
                      <span>{data.complianceStatus.lastAudit}</span>
                    </div>
                    \1>
                      <span>Next Audit:\1>
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
            \1>
              <AlertTriangle className="h-5 w-5 text-red-500" />
              <span>Critical Alerts</span>
              <Badge variant="destructive">{data.alerts.length}</Badge>
            </CardTitle>
            <CardDescription>
              Immediate attention required
            </CardDescription>
          </CardHeader>
          <CardContent>
            \1>
              {data.alerts.map((alert) => (
                <Alert key={alert.id} className={`border-l-4 ${
                  alert.type === 'critical' ? 'border-l-red-500' :
                  alert.type === 'warning' ? 'border-l-yellow-500' : 'border-l-blue-500';
                }`}>
                  <AlertTriangle className="h-4 w-4" />
                  \1>
                    <span>{alert.title}</span>
                    \1>
                      {alert?.department && (
                        <Badge variant="outline">{alert.department}\1>
                      )}
                      <Badge variant={
                        alert.type === 'critical' ? 'destructive' :
                        alert.type === 'warning' ? 'default' : 'secondary';
                      }>
                        {alert.type}
                      </Badge>
                    </div>
                  </AlertTitle>
                  \1>
                    {alert.message}
                    \1>
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
    \1,\2 1247,
      \1,\2 76,
      \1,\2 23,
      \1,\2 342,
      \1,\2 3,
      systemHealth: 'good'
    },
    operationalKPIs: [
      {
        metric: 'Avg Wait Time',
        \1,\2 30,
        \1,\2 -8,
        \1,\2 'min',
        category: 'efficiency'
      },
      {
        metric: 'Patient Satisfaction',
        \1,\2 90,
        \1,\2 3,
        \1,\2 '%',
        category: 'patient_care'
      },
      {
        metric: 'Staff Utilization',
        \1,\2 80,
        \1,\2 0,
        \1,\2 '%',
        category: 'efficiency'
      },
      {
        metric: 'Revenue per Patient',
        \1,\2 4000,
        \1,\2 6,
        \1,\2 '$',
        category: 'financial'
      }
    ],
    departmentPerformance: [
      {
        department: 'Emergency',
        \1,\2 89,
        \1,\2 125000,
        \1,\2 91,
        \1,\2 'improving'
      },
      {
        department: 'ICU',
        \1,\2 95,
        \1,\2 280000,
        \1,\2 96,
        \1,\2 'stable'
      },
      {
        department: 'Surgery',
        \1,\2 93,
        \1,\2 450000,
        \1,\2 97,
        \1,\2 'improving'
      },
      {
        department: 'Radiology',
        \1,\2 86,
        \1,\2 89000,
        \1,\2 88,
        \1,\2 'stable'
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
    \1,\2 1250000,
      \1,\2 342000000,
      \1,\2 23,
      \1,\2 4200000,
      \1,\2 925,
      operatingRatio: 91
    },
    qualityIndicators: [
      {
        indicator: 'Patient Safety Score',
        \1,\2 95,
        \1,\2 'improving',
        \1,\2 '2024-01-15'
      },
      {
        indicator: 'Clinical Excellence',
        \1,\2 90,
        \1,\2 'stable',
        \1,\2 '2024-01-15'
      },
      {
        indicator: 'Infection Control',
        \1,\2 95,
        \1,\2 'improving',
        \1,\2 '2024-01-15'
      }
    ],
    resourceUtilization: [
      {
        resource: 'Operating Rooms',
        \1,\2 9,
        \1,\2 11,
        \1,\2 98,
        cost: 25000
      }
    ],
    predictiveInsights: [
      {
        prediction: 'ICU capacity will reach 95% in next 24 hours',
        \1,\2 'high',
        \1,\2 92,
        \1,\2 'capacity'
      },
      {
        prediction: 'Emergency department volume spike expected',
        \1,\2 'medium',
        \1,\2 78,
        \1,\2 'capacity'
      }
    ],
    alerts: [
      {
        id: '1',
        \1,\2 'ICU Bed Shortage',
        \1,\2 'ICU',
        timestamp: '2024-01-15T14:30:00Z',
        \1,\2 1
      },
      {
        id: '2',
        \1,\2 'High ER Wait Times',
        \1,\2 'Emergency',
        timestamp: '2024-01-15T14:25:00Z',
        \1,\2 2
      }
    ],
    \1,\2 96,
      \1,\2 95,
      \1,\2 97,
      \1,\2 '2023-11-15',
      \1,\2 2
    }
  };
}
";
