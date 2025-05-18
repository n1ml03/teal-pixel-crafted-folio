import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.tsx';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs.tsx';
import { ShortenedURL, URLAnalytics as URLAnalyticsType } from '@/types/shorten.ts';
import { URLShortenerService } from '@/services/URLShortenerService.ts';
import {
  BarChart as BarChartIcon,
  LineChart as LineChartIcon,
  PieChart as PieChartIcon,
  Tag
} from 'lucide-react';
import { format, subDays } from 'date-fns';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.tsx';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';

interface URLAnalyticsProps {
  url: ShortenedURL;
}

const URLAnalytics: React.FC<URLAnalyticsProps> = ({ url }) => {
  const [analytics, setAnalytics] = useState<URLAnalyticsType | null>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [timeRange, setTimeRange] = useState('7days');

  useEffect(() => {
    if (url) {
      const data = URLShortenerService.getURLAnalytics(url.id);
      setAnalytics(data);
    }
  }, [url]);

  // Generate date labels for the selected time range
  const getDateLabels = () => {
    const today = new Date();
    const labels: string[] = [];

    let days = 7;
    if (timeRange === '30days') days = 30;
    if (timeRange === '90days') days = 90;

    for (let i = days - 1; i >= 0; i--) {
      const date = subDays(today, i);
      labels.push(format(date, 'yyyy-MM-dd'));
    }

    return labels;
  };

  // Get click data for the chart
  const getClickData = () => {
    if (!analytics) return [];

    const labels = getDateLabels();
    return labels.map(date => ({
      date,
      clicks: analytics.clicksByDate[date] || 0
    }));
  };

  // Format data for referrer pie chart
  const getReferrerData = () => {
    if (!analytics) return [];

    return Object.entries(analytics.clicksByReferrer)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([referrer, count]) => ({
        name: referrer || 'Direct',
        value: count
      }));
  };

  // Format data for device pie chart
  const getDeviceData = () => {
    if (!analytics) return [];

    return Object.entries(analytics.clicksByDevice)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([device, count]) => ({
        name: device || 'Unknown',
        value: count
      }));
  };

  // Format data for UTM source chart
  const getUtmSourceData = () => {
    if (!analytics || !analytics.clicksByUtmSource) return [];

    return Object.entries(analytics.clicksByUtmSource)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([source, count]) => ({
        name: source || 'None',
        value: count
      }));
  };

  // Format data for UTM medium chart
  const getUtmMediumData = () => {
    if (!analytics || !analytics.clicksByUtmMedium) return [];

    return Object.entries(analytics.clicksByUtmMedium)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([medium, count]) => ({
        name: medium || 'None',
        value: count
      }));
  };

  // Format data for UTM campaign chart
  const getUtmCampaignData = () => {
    if (!analytics || !analytics.clicksByUtmCampaign) return [];

    return Object.entries(analytics.clicksByUtmCampaign)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([campaign, count]) => ({
        name: campaign || 'None',
        value: count
      }));
  };



  // Format data for hourly clicks
  const getHourlyClickData = () => {
    if (!analytics || !analytics.clicksByHour) return [];

    const hourlyData = [];
    for (let i = 0; i < 24; i++) {
      const hour = i.toString();
      hourlyData.push({
        hour: i,
        clicks: analytics.clicksByHour[hour] || 0,
        label: `${i}:00`
      });
    }
    return hourlyData;
  };

  // Colors for charts
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A569BD', '#8884d8', '#82ca9d'];

  // Custom tooltip for charts
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-2 border rounded shadow-sm text-xs">
          <p className="font-medium">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={`tooltip-${index}`} style={{ color: entry.color }}>
              {entry.name}: {entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  if (!analytics) {
    return (
      <Card className="border border-gray-200 shadow-sm bg-white/90 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>Analytics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-[300px]">
            <p className="text-gray-500">No analytics data available yet.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border border-gray-200 shadow-sm bg-white/90 backdrop-blur-sm">
      <CardHeader className="pb-2">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <CardTitle>Link Analytics</CardTitle>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7days">Last 7 days</SelectItem>
              <SelectItem value="30days">Last 30 days</SelectItem>
              <SelectItem value="90days">Last 90 days</SelectItem>
              <SelectItem value="all">All time</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4 mb-6">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <BarChartIcon className="h-4 w-4" />
              <span className="hidden sm:inline">Overview</span>
            </TabsTrigger>
            <TabsTrigger value="traffic" className="flex items-center gap-2">
              <LineChartIcon className="h-4 w-4" />
              <span className="hidden sm:inline">Traffic</span>
            </TabsTrigger>
            <TabsTrigger value="sources" className="flex items-center gap-2">
              <PieChartIcon className="h-4 w-4" />
              <span className="hidden sm:inline">Sources</span>
            </TabsTrigger>
            <TabsTrigger value="utm" className="flex items-center gap-2">
              <Tag className="h-4 w-4" />
              <span className="hidden sm:inline">UTM</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-blue-50 rounded-lg p-4 flex flex-col"
              >
                <span className="text-sm text-blue-600 font-medium">Total Clicks</span>
                <span className="text-3xl font-bold text-blue-700 mt-2">{analytics.totalClicks}</span>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
                className="bg-green-50 rounded-lg p-4 flex flex-col"
              >
                <span className="text-sm text-green-600 font-medium">Unique Visitors</span>
                <span className="text-3xl font-bold text-green-700 mt-2">
                  {Object.keys(analytics.clicksByReferrer).length}
                </span>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.2 }}
                className="bg-purple-50 rounded-lg p-4 flex flex-col"
              >
                <span className="text-sm text-purple-600 font-medium">Avg. Daily Clicks</span>
                <span className="text-3xl font-bold text-purple-700 mt-2">
                  {analytics.clicksTimeline.length > 0
                    ? Math.round(analytics.totalClicks / analytics.clicksTimeline.length)
                    : 0}
                </span>
              </motion.div>
            </div>

            <div className="mt-6">
              <h3 className="text-sm font-medium text-gray-500 mb-4">Click Timeline</h3>
              <div className="h-[200px] bg-gray-50 rounded-lg border p-4">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={getClickData()} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis
                      dataKey="date"
                      tick={{ fontSize: 12 }}
                      tickFormatter={(value) => format(new Date(value), 'MMM d')}
                      angle={-45}
                      textAnchor="end"
                    />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="clicks" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="traffic" className="mt-0">
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-4">Traffic Over Time</h3>
                <div className="h-[300px] bg-gray-50 rounded-lg border p-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={getClickData()} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        dataKey="date"
                        tick={{ fontSize: 12 }}
                        tickFormatter={(value) => format(new Date(value), 'MMM d')}
                      />
                      <YAxis tick={{ fontSize: 12 }} />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="clicks"
                        stroke="#8884d8"
                        strokeWidth={2}
                        dot={{ r: 4 }}
                        activeDot={{ r: 6 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="sources" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-4">Top Referrers</h3>
                <div className="h-[200px] bg-gray-50 rounded-lg border p-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={getReferrerData()}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        nameKey="name"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {getReferrerData().map((_, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-4">Device Breakdown</h3>
                <div className="h-[200px] bg-gray-50 rounded-lg border p-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={getDeviceData()}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        nameKey="name"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {getDeviceData().map((_, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="utm" className="mt-0">
            <div className="mb-6">
              <div className="bg-blue-50 p-4 rounded-lg mb-6">
                <h3 className="text-sm font-medium text-blue-700 mb-2">What are UTM Parameters?</h3>
                <p className="text-xs text-blue-600">
                  UTM parameters are tags added to URLs to track the effectiveness of marketing campaigns across different channels.
                  They help identify which sources, mediums, and campaigns are driving traffic to your links.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="bg-blue-50 rounded-lg p-4 flex flex-col"
                >
                  <span className="text-sm text-blue-600 font-medium">UTM Sources</span>
                  <span className="text-3xl font-bold text-blue-700 mt-2">
                    {analytics.clicksByUtmSource ? Object.keys(analytics.clicksByUtmSource).length : 0}
                  </span>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                  className="bg-green-50 rounded-lg p-4 flex flex-col"
                >
                  <span className="text-sm text-green-600 font-medium">UTM Mediums</span>
                  <span className="text-3xl font-bold text-green-700 mt-2">
                    {analytics.clicksByUtmMedium ? Object.keys(analytics.clicksByUtmMedium).length : 0}
                  </span>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                  className="bg-purple-50 rounded-lg p-4 flex flex-col"
                >
                  <span className="text-sm text-purple-600 font-medium">UTM Campaigns</span>
                  <span className="text-3xl font-bold text-purple-700 mt-2">
                    {analytics.clicksByUtmCampaign ? Object.keys(analytics.clicksByUtmCampaign).length : 0}
                  </span>
                </motion.div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-4">Top UTM Sources</h3>
                <div className="h-[200px] bg-gray-50 rounded-lg border p-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={getUtmSourceData()} layout="vertical" margin={{ left: 80 }}>
                      <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                      <XAxis type="number" />
                      <YAxis
                        type="category"
                        dataKey="name"
                        tick={{ fontSize: 12 }}
                        width={80}
                      />
                      <Tooltip content={<CustomTooltip />} />
                      <Bar dataKey="value" name="Clicks" fill="#3b82f6" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-4">Top UTM Mediums</h3>
                <div className="h-[200px] bg-gray-50 rounded-lg border p-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={getUtmMediumData()} layout="vertical" margin={{ left: 80 }}>
                      <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                      <XAxis type="number" />
                      <YAxis
                        type="category"
                        dataKey="name"
                        tick={{ fontSize: 12 }}
                        width={80}
                      />
                      <Tooltip content={<CustomTooltip />} />
                      <Bar dataKey="value" name="Clicks" fill="#10b981" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-4">Top UTM Campaigns</h3>
              <div className="h-[200px] bg-gray-50 rounded-lg border p-4">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={getUtmCampaignData()} layout="vertical" margin={{ left: 80 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                    <XAxis type="number" />
                    <YAxis
                      type="category"
                      dataKey="name"
                      tick={{ fontSize: 12 }}
                      width={80}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="value" name="Clicks" fill="#8b5cf6" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="mt-6">
              <h3 className="text-sm font-medium text-gray-500 mb-4">Hourly Click Distribution</h3>
              <div className="h-[200px] bg-gray-50 rounded-lg border p-4">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={getHourlyClickData()} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis
                      dataKey="hour"
                      tick={{ fontSize: 12 }}
                      tickFormatter={(value) => `${value}:00`}
                    />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="clicks" name="Clicks" fill="#8884d8" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default URLAnalytics;
