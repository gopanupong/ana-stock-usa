import React from 'react';
import { ValuationData } from '../types';

interface Props {
  data: ValuationData;
}

const ScenarioCards: React.FC<Props> = ({ data }) => {
  const getUpsideDownside = (target: number, current: number) => {
    const percent = ((target - current) / current) * 100;
    const sign = percent > 0 ? '+' : '';
    return `${sign}${percent.toFixed(2)}%`;
  };

  const getCardColor = (type: 'bear' | 'fair' | 'best') => {
    switch (type) {
      case 'bear': return 'bg-red-50 border-red-100 text-red-900';
      case 'fair': return 'bg-blue-50 border-blue-100 text-blue-900';
      case 'best': return 'bg-green-50 border-green-100 text-green-900';
    }
  };

  const getTitle = (type: 'bear' | 'fair' | 'best') => {
    switch (type) {
      case 'bear': return '🐻 Bear Value';
      case 'fair': return '⚖️ Fair Value';
      case 'best': return '🚀 Best Value';
    }
  };

  const scenarios: { type: 'bear' | 'fair' | 'best', value: number }[] = [
    { type: 'bear', value: data.bearValue },
    { type: 'fair', value: data.fairValue },
    { type: 'best', value: data.bestValue },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      {scenarios.map((scenario) => {
        const upside = getUpsideDownside(scenario.value, data.currentPriceEstimate);
        const isPositive = parseFloat(upside) > 0;
        
        return (
          <div 
            key={scenario.type}
            className={`p-6 rounded-xl border ${getCardColor(scenario.type)} flex flex-col items-center justify-center text-center shadow-sm`}
          >
            <h3 className="text-sm font-semibold uppercase tracking-wider opacity-70 mb-2">
              {getTitle(scenario.type)}
            </h3>
            <div className="text-3xl font-bold mb-2">
              {data.currency} {scenario.value.toFixed(2)}
            </div>
            <div className={`text-sm font-medium px-2 py-1 rounded-full ${isPositive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
              Margin: {upside}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ScenarioCards;