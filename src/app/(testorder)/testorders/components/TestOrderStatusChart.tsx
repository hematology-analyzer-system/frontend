import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
interface TestOrder {
  id: number;
  status: string;
  // ... other properties
}

interface TestOrderData {
  content: TestOrder[];
  // ... other properties
}

interface StatusChartProps {
  data: TestOrderData;
}

const TestOrderStatusChart: React.FC<StatusChartProps> = ({ data }) => {
  // Count the statuses
  const statusCounts = data.content.reduce((acc, order) => {
    const status = order.status.toLowerCase();
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Prepare chart data
  const chartData = [
    {
      status: 'Completed',
      count: statusCounts.completed || 0,
      color: '#10B981' // Green
    },
    {
      status: 'Reviewed',
      count: statusCounts.reviewed || 0,
      color: '#3B82F6' // Blue
    },
    {
      status: 'Pending',
      count: statusCounts.pending || 0,
      color: '#F59E0B' // Orange
    }
  ];

  return (
    <div className="w-full bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4 text-gray-800">Test Order Status Distribution</h2>
      
      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {chartData.map((item) => (
          <div key={item.status} className="bg-gray-50 p-4 rounded-lg text-center">
            <div 
              className="w-4 h-4 rounded mx-auto mb-2"
              style={{ backgroundColor: item.color }}
            ></div>
            <p className="text-sm text-gray-600">{item.status}</p>
            <p className="text-2xl font-bold" style={{ color: item.color }}>
              {item.count}
            </p>
          </div>
        ))}
      </div>

      {/* Chart */}
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="status" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" radius={[4, 4, 0, 0]}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 text-center text-sm text-gray-600">
        Total Test Orders: {data.content.length}
      </div>
    </div>
  );
};

export default TestOrderStatusChart;