import React from 'react';
import { KeyMetric } from '../types';

interface Props {
  metrics: KeyMetric[];
}

const MetricsGrid: React.FC<Props> = ({ metrics }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {metrics.map((metric, index) => (
        <div 
          key={index} 
          className="bg-white p-4 rounded-lg border border-slate-100 hover:shadow-md transition-shadow duration-200"
        >
          <div className="flex justify-between items-start mb-2">
            <span className="text-sm font-medium text-slate-500 uppercase tracking-wide">
              {metric.label}
            </span>
          </div>
          <div className="text-xl font-bold text-slate-800 mb-1">
            {metric.value}
          </div>
          <p className="text-xs text-slate-400">
            {metric.description}
          </p>
        </div>
      ))}
    </div>
  );
};

export default MetricsGrid;