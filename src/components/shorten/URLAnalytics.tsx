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

  // Format data for UTM term chart
  const getUtmTermData = () => {
    if (!analytics || !analytics.clicksByUtmTerm) return [];

    return Object.entries(analytics.clicksByUtmTerm)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([term, count]) => ({
        name: term || 'None',
        value: count
      }));
  };

  // Format data for UTM content chart
  const getUtmContentData = () => {
    if (!analytics || !analytics.clicksByUtmContent) return [];

    return Object.entries(analytics.clicksByUtmContent)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([content, count]) => ({
        name: content || 'None',
        value: count
      }));
  };

  // Format data for custom UTM parameters
  const getCustomUtmData = () => {
    if (!analytics || !analytics.clicksByCustomUtm) return [];

    // Flatten custom UTM data for display
    const flattenedData: {name: string, value: number}[] = [];

    Object.entries(analytics.clicksByCustomUtm).forEach(([paramName, values]) => {
      Object.entries(values).forEach(([paramValue, count]) => {
        flattenedData.push({
          name: `${paramName}=${paramValue}`,
          value: count
        });
      });
    });

    return flattenedData
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);
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

  // Colors for charts - amber-themed
  const COLORS = ['#f59e0b', '#fbbf24', '#d97706', '#b45309', '#92400e', '#78350f', '#fdba74'];

  // Custom tooltip for charts
  const CustomTooltip = ({ active, payload, label }: {
    active?: boolean;
    payload?: Array<{
      name: string;
      value: number;
      color: string;
    }>;
    label?: string;
  }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-2 border rounded shadow-sm text-xs">
          <p className="font-medium">{label}</p>
          {payload.map((entry, index: number) => (
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
      <Card className="border border-amber-100 shadow-md hover:shadow-lg transition-all duration-300 bg-white/90 backdrop-blur-md rounded-xl overflow-hidden">
        <div className="h-1.5 w-full bg-gradient-to-r from-amber-400 to-amber-600"></div>
        <CardHeader className="pb-3 sm:pb-4 px-4 sm:px-6 pt-4 sm:pt-6 bg-gradient-to-r from-amber-500/10 to-amber-600/5 border-b border-amber-100">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="bg-amber-100 p-1.5 sm:p-2 rounded-full flex-shrink-0 shadow-sm">
              <BarChartIcon className="h-4 w-4 sm:h-5 sm:w-5 text-amber-600" />
            </div>
            <div>
              <CardTitle className="text-base sm:text-xl font-bold text-amber-900">Link Analytics</CardTitle>
              <div className="text-xs sm:text-sm text-amber-700">
                Track performance and engagement metrics
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="px-4 sm:px-6 py-5 sm:py-7">
          <div className="flex flex-col items-center justify-center h-[300px] bg-white p-4 sm:p-6 rounded-lg border border shadow-sm">
            <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-amber-50 rounded-full mb-3 sm:mb-4">
              <BarChartIcon className="h-5 w-5 sm:h-6 sm:w-6 text-amber-500" />
            </div>
            <p className="text-gray-600 text-sm sm:text-base mb-2">No analytics data available yet.</p>
            <p className="text-gray-500 text-xs sm:text-sm">Data will appear once your link receives clicks.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border border-amber-100 shadow-md hover:shadow-lg transition-all duration-300 bg-white/90 backdrop-blur-md rounded-xl overflow-hidden">
      <div className="h-1.5 w-full bg-gradient-to-r from-amber-400 to-amber-600"></div>
      <CardHeader className="pb-3 sm:pb-4 px-4 sm:px-6 pt-4 sm:pt-6 bg-gradient-to-r from-amber-500/10 to-amber-600/5 border-b border-amber-100">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="bg-amber-100 p-1.5 sm:p-2 rounded-full flex-shrink-0 shadow-sm">
            <BarChartIcon className="h-4 w-4 sm:h-5 sm:w-5 text-amber-600" />
          </div>
          <div className="flex-1">
            <CardTitle className="text-base sm:text-xl font-bold text-amber-900">Link Analytics</CardTitle>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4 mt-1 sm:mt-0">
              <div className="text-xs sm:text-sm text-gray-700">
                Track performance and engagement metrics
              </div>
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className="w-[180px] h-8 text-xs">
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
          </div>
        </div>
      </CardHeader>
      <CardContent className="px-4 sm:px-6 py-5 sm:py-7">
        <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
          <div className="bg-white/80 backdrop-blur-sm rounded-lg border border shadow-sm p-1 mb-6 sm:mb-8">
            <TabsList className="grid w-full grid-cols-4 gap-1.5 bg-transparent">
              <TabsTrigger
                value="overview"
                className="flex items-center justify-center gap-1.5 sm:gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-500 data-[state=active]:to-amber-600 data-[state=active]:text-white rounded-lg transition-all duration-300"
              >
                <BarChartIcon className="h-4 w-4 flex-shrink-0 mr-0 sm:mr-1" />
                <span className="hidden xs:inline text-xs sm:text-sm">Overview</span>
              </TabsTrigger>
              <TabsTrigger
                value="traffic"
                className="flex items-center justify-center gap-1.5 sm:gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-500 data-[state=active]:to-amber-600 data-[state=active]:text-white rounded-lg transition-all duration-300"
              >
                <LineChartIcon className="h-4 w-4 flex-shrink-0 mr-0 sm:mr-1" />
                <span className="hidden xs:inline text-xs sm:text-sm">Traffic</span>
              </TabsTrigger>
              <TabsTrigger
                value="sources"
                className="flex items-center justify-center gap-1.5 sm:gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-500 data-[state=active]:to-amber-600 data-[state=active]:text-white rounded-lg transition-all duration-300"
              >
                <PieChartIcon className="h-4 w-4 flex-shrink-0 mr-0 sm:mr-1" />
                <span className="hidden xs:inline text-xs sm:text-sm">Sources</span>
              </TabsTrigger>
              <TabsTrigger
                value="utm"
                className="flex items-center justify-center gap-1.5 sm:gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-500 data-[state=active]:to-amber-600 data-[state=active]:text-white rounded-lg transition-all duration-300"
              >
                <Tag className="h-4 w-4 flex-shrink-0 mr-0 sm:mr-1" />
                <span className="hidden xs:inline text-xs sm:text-sm">UTM</span>
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="overview" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-lg p-4 flex flex-col border border shadow-sm"
              >
                <span className="text-sm text-gray-700 font-medium">Total Clicks</span>
                <span className="text-3xl font-bold text-gray-900 mt-2">{analytics.totalClicks}</span>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
                className="bg-white rounded-lg p-4 flex flex-col border border shadow-sm"
              >
                <span className="text-sm text-gray-700 font-medium">Unique Visitors</span>
                <span className="text-3xl font-bold text-gray-900 mt-2">
                  {Object.keys(analytics.clicksByReferrer).length}
                </span>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.2 }}
                className="bg-white rounded-lg p-4 flex flex-col border border shadow-sm"
              >
                <span className="text-sm text-gray-700 font-medium">Avg. Daily Clicks</span>
                <span className="text-3xl font-bold text-gray-900 mt-2">
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
                    <Bar dataKey="clicks" fill="#f59e0b" radius={[4, 4, 0, 0]} />
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
                        stroke="#f59e0b"
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
              <div className="bg-white p-4 rounded-lg mb-6 border border shadow-sm">
                <h3 className="text-sm font-medium text-amber-700 mb-2">What are UTM Parameters?</h3>
                <p className="text-xs text-gray-700 mb-3">
                  UTM parameters are tags added to URLs to track the effectiveness of marketing campaigns across different channels.
                  They help identify which sources, mediums, and campaigns are driving traffic to your links.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="bg-amber-50 p-2 rounded border border-amber-100">
                    <span className="font-medium text-amber-800">utm_source</span>: Identifies which site sent the traffic (e.g., google, facebook)
                  </div>
                  <div className="bg-amber-50 p-2 rounded border border-amber-100">
                    <span className="font-medium text-amber-800">utm_medium</span>: Identifies what type of link was used (e.g., cpc, email)
                  </div>
                  <div className="bg-amber-50 p-2 rounded border border-amber-100">
                    <span className="font-medium text-amber-800">utm_campaign</span>: Identifies a specific product promotion or campaign
                  </div>
                  <div className="bg-amber-50 p-2 rounded border border-amber-100">
                    <span className="font-medium text-amber-800">utm_term</span>: Identifies search terms or keywords
                  </div>
                  <div className="bg-amber-50 p-2 rounded border border-amber-100">
                    <span className="font-medium text-amber-800">utm_content</span>: Identifies what specifically was clicked (e.g., banner, textlink)
                  </div>
                  <div className="bg-amber-50 p-2 rounded border border-amber-100">
                    <span className="font-medium text-amber-800">custom parameters</span>: Any additional utm_* parameters you define
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white rounded-lg p-4 flex flex-col border border shadow-sm"
                >
                  <span className="text-sm text-gray-700 font-medium">UTM Sources</span>
                  <span className="text-3xl font-bold text-gray-900 mt-2">
                    {analytics.clicksByUtmSource ? Object.keys(analytics.clicksByUtmSource).length : 0}
                  </span>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                  className="bg-white rounded-lg p-4 flex flex-col border border shadow-sm"
                >
                  <span className="text-sm text-gray-700 font-medium">UTM Mediums</span>
                  <span className="text-3xl font-bold text-gray-900 mt-2">
                    {analytics.clicksByUtmMedium ? Object.keys(analytics.clicksByUtmMedium).length : 0}
                  </span>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                  className="bg-white rounded-lg p-4 flex flex-col border border shadow-sm"
                >
                  <span className="text-sm text-gray-700 font-medium">UTM Campaigns</span>
                  <span className="text-3xl font-bold text-gray-900 mt-2">
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
                      <Bar dataKey="value" name="Clicks" fill="#f59e0b" radius={[0, 4, 4, 0]} />
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
                      <Bar dataKey="value" name="Clicks" fill="#fbbf24" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
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
                      <Bar dataKey="value" name="Clicks" fill="#d97706" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-4">Top UTM Terms</h3>
                <div className="h-[200px] bg-gray-50 rounded-lg border p-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={getUtmTermData()} layout="vertical" margin={{ left: 80 }}>
                      <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                      <XAxis type="number" />
                      <YAxis
                        type="category"
                        dataKey="name"
                        tick={{ fontSize: 12 }}
                        width={80}
                      />
                      <Tooltip content={<CustomTooltip />} />
                      <Bar dataKey="value" name="Clicks" fill="#b45309" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-4">Top UTM Content</h3>
                <div className="h-[200px] bg-gray-50 rounded-lg border p-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={getUtmContentData()} layout="vertical" margin={{ left: 80 }}>
                      <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                      <XAxis type="number" />
                      <YAxis
                        type="category"
                        dataKey="name"
                        tick={{ fontSize: 12 }}
                        width={80}
                      />
                      <Tooltip content={<CustomTooltip />} />
                      <Bar dataKey="value" name="Clicks" fill="#92400e" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-4">Top Custom UTM Parameters</h3>
                <div className="h-[200px] bg-gray-50 rounded-lg border p-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={getCustomUtmData()} layout="vertical" margin={{ left: 80 }}>
                      <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                      <XAxis type="number" />
                      <YAxis
                        type="category"
                        dataKey="name"
                        tick={{ fontSize: 12 }}
                        width={80}
                      />
                      <Tooltip content={<CustomTooltip />} />
                      <Bar dataKey="value" name="Clicks" fill="#78350f" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
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
                    <Bar dataKey="clicks" name="Clicks" fill="#f59e0b" radius={[4, 4, 0, 0]} />
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
