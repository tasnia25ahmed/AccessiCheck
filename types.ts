export enum AnalysisStatus {
  IDLE = 'IDLE',
  ANALYZING = 'ANALYZING',
  COMPLETE = 'COMPLETE',
  ERROR = 'ERROR',
}

export interface AccessibilityIssue {
  issue: string;
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  location: string;
  recommendation: string;
}

export interface ComplianceItem {
  category: string;
  score: number; // 0-100
  status: 'Pass' | 'Fail';
  description: string;
}

export interface AnalysisResult {
  accessibility_score: string; // e.g., "85%"
  compliance_breakdown: ComplianceItem[];
  issues_found: AccessibilityIssue[];
  fixed_accessible_version: string;
  simplified_version: string;
  audio_transcript: string; // Text to be spoken
  metadata: {
    language: string;
    wcag_version: string;
    aoda_compliance: boolean;
  };
}

export type InputType = 'PDF' | 'IMAGE' | 'HTML' | 'URL';

export interface FileInput {
  file: File | null;
  dataUrl: string | null;
  type: InputType;
  textContent: string; // For HTML/URL inputs
}