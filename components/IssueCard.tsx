import React from 'react';
import { AlertTriangle, CheckCircle, Info, XCircle } from 'lucide-react';
import { AccessibilityIssue } from '../types';

interface IssueCardProps {
  issue: AccessibilityIssue;
}

export const IssueCard: React.FC<IssueCardProps> = ({ issue }) => {
  const getIcon = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'critical': return <XCircle className="h-5 w-5 text-red-500" />;
      case 'high': return <AlertTriangle className="h-5 w-5 text-orange-500" />;
      case 'medium': return <Info className="h-5 w-5 text-yellow-500" />;
      default: return <CheckCircle className="h-5 w-5 text-blue-500" />;
    }
  };

  const getBorderColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'critical': return 'border-l-4 border-l-red-500';
      case 'high': return 'border-l-4 border-l-orange-500';
      case 'medium': return 'border-l-4 border-l-yellow-500';
      default: return 'border-l-4 border-l-blue-500';
    }
  };

  return (
    <div className={`bg-white p-4 rounded-r-lg shadow-sm border border-gray-200 ${getBorderColor(issue.severity)} mb-4`}>
      <div className="flex items-start gap-3">
        <div className="mt-1 flex-shrink-0">{getIcon(issue.severity)}</div>
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <h3 className="text-base font-semibold text-gray-900">{issue.issue}</h3>
            <span className={`px-2 py-1 text-xs font-bold uppercase tracking-wide rounded-full 
              ${issue.severity === 'Critical' ? 'bg-red-100 text-red-800' : 
                issue.severity === 'High' ? 'bg-orange-100 text-orange-800' : 
                issue.severity === 'Medium' ? 'bg-yellow-100 text-yellow-800' : 'bg-blue-100 text-blue-800'}`}>
              {issue.severity}
            </span>
          </div>
          <p className="text-sm text-gray-600 mt-1">Location: {issue.location}</p>
          <div className="mt-3 bg-gray-50 p-3 rounded-md">
            <p className="text-sm font-medium text-gray-900">Recommendation:</p>
            <p className="text-sm text-gray-700 mt-1">{issue.recommendation}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
