import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
  ReferenceLine
} from 'recharts';
import { ValuationData } from '../types';

interface Props {
  data: ValuationData;
}

const AnalysisChart: React.FC<Props> = ({ data }) => {
  const chartData = [
    {
      name: 'Bear Case',
      value: data.bearValue,
      color: '#ef4444', // Red-500
    },
    {
      name: 'Current Price',
      value: data.currentPriceEstimate,
      color: '#64748b', // Slate-500
    },
    {
      name: 'Fair Value',
      value: data.fairValue,
      color: '#3b82f6', // Blue-500
    },
    {
      name: 'Best Case',
      value: data.bestValue,
      color: '#22c55e', // Green-500
    },
  ];

  // Calculate domain to make the chart look nice
  const values = chartData.map(d => d.value);
  const minVal = Math.min(...values) * 0.8;
  const maxVal = Math.max(...values) * 1.1;

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-slate-200 shadow-lg rounded-lg">
          <p className="font-semibold text-slate-800">{label}</p>
          <p className="text-slate-600">
            {data.currency} {payload[0].value.toFixed(2)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-[350px] bg-white p-4 rounded-xl shadow-sm border border-slate-100">
      <h3 className="text-lg font-semibold text-slate-700 mb-4">Valuation Scenarios vs Price</h3>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
          <XAxis 
            dataKey="name" 
            tick={{ fill: '#475569', fontSize: 12 }} 
            axisLine={false}
            tickLine={false}
          />
          <YAxis 
            domain={[0, 'auto']} 
            tick={{ fill: '#475569', fontSize: 12 }} 
            axisLine={false}
            tickLine={false}
            tickFormatter={(value) => `${value}`}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f1f5f9' }} />
          <ReferenceLine y={data.currentPriceEstimate} stroke="gray" strokeDasharray="3 3" label="Current" />
          <Bar dataKey="value" radius={[4, 4, 0, 0]}>
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AnalysisChart;