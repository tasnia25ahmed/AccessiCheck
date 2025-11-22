import React from 'react';
import { CheckCircle, XCircle } from 'lucide-react';
import { ComplianceItem } from '../types';

interface ComplianceBreakdownProps {
  items: ComplianceItem[];
}

export const ComplianceBreakdown: React.FC<ComplianceBreakdownProps> = ({ items }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">WCAG 2.1 AA Compliance Breakdown</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
        {items.map((item, idx) => {
          const isPass = item.status === 'Pass';
          const isPerfect = item.score === 100;
          
          // Color logic: Green for Pass, Red for Fail
          const colorClass = isPass ? 'bg-green-500' : 'bg-red-500';
          const textClass = isPass ? 'text-green-700' : 'text-red-700';
          const bgClass = isPass ? 'bg-green-50' : 'bg-red-50';
          const borderClass = isPass ? 'border-green-200' : 'border-red-200';

          return (
            <div key={idx} className={`p-4 rounded-lg border ${borderClass} ${bgClass}`}>
              <div className="flex justify-between items-start mb-2">
                <span className="font-medium text-gray-900">{item.category}</span>
                <div className="flex items-center gap-2">
                    {isPass ? (
                        <CheckCircle className="w-5 h-5 text-green-600" />
                    ) : (
                        <XCircle className="w-5 h-5 text-red-600" />
                    )}
                    <span className={`text-sm font-bold ${textClass}`}>
                        {item.status.toUpperCase()}
                    </span>
                </div>
              </div>
              
              <div className="flex items-center gap-3 mb-1">
                <div className="flex-grow bg-gray-200 rounded-full h-2.5">
                  <div 
                    className={`h-2.5 rounded-full transition-all duration-1000 ${colorClass}`} 
                    style={{ width: `${item.score}%` }}
                  ></div>
                </div>
                <span className="text-sm font-bold text-gray-700 w-10 text-right">{item.score}%</span>
              </div>
              
              <p className="text-xs text-gray-600 mt-1">{item.description}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};