import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend
} from 'recharts';

interface ChartData {
  name: string;
  value: number;
  color?: string;
}

interface TimeSeriesData {
  date: string;
  value?: number;
  challenges?: number;
  tests?: number;
  [key: string]: string | number | undefined;
}

interface DynamicChartsProps {
  type: 'pie' | 'line';
  data: ChartData[] | TimeSeriesData[];
  height?: number;
  colors?: string[];
}

const DynamicCharts = ({ type, data, height = 250, colors }: DynamicChartsProps) => {
  if (type === 'pie') {
    const pieData = data as ChartData[];
    return (
      <ResponsiveContainer width="100%" height={height}>
        <PieChart>
          <Pie
            data={pieData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {pieData.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={entry.color || (colors && colors[index % colors.length]) || '#8884d8'} 
              />
            ))}
          </Pie>
          <Legend />
          <RechartsTooltip />
        </PieChart>
      </ResponsiveContainer>
    );
  }

  if (type === 'line') {
    const lineData = data as TimeSeriesData[];
    return (
      <ResponsiveContainer width="100%" height={height}>
        <LineChart data={lineData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <RechartsTooltip />
          <Legend />
          {lineData.length > 0 && lineData[0].challenges !== undefined && (
            <Line
              type="monotone"
              dataKey="challenges"
              stroke="#3b82f6"
              strokeWidth={2}
              activeDot={{ r: 8 }}
            />
          )}
          {lineData.length > 0 && lineData[0].tests !== undefined && (
            <Line
              type="monotone"
              dataKey="tests"
              stroke="#10b981"
              strokeWidth={2}
            />
          )}
          {lineData.length > 0 && lineData[0].value !== undefined && (
            <Line
              type="monotone"
              dataKey="value"
              stroke="#8884d8"
              strokeWidth={2}
              dot={{ fill: '#8884d8' }}
            />
          )}
        </LineChart>
      </ResponsiveContainer>
    );
  }

  return null;
};

export default DynamicCharts;
