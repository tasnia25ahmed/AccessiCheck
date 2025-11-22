import React, { useState, useRef } from 'react';
import { Activity, Check, FileCheck, Headphones, Layers, Layout as LayoutIcon, ShieldCheck, Download } from 'lucide-react';
import { AnalysisResult, AnalysisStatus, FileInput } from './types';
import { InputSection } from './components/InputSection';
import { ScoreChart } from './components/ScoreChart';
import { IssueCard } from './components/IssueCard';
import { ComplianceBreakdown } from './components/ComplianceBreakdown';
import { Button } from './components/Button';
import { analyzeContent, generateSpeech } from './services/geminiService';
import ReactMarkdown from 'react-markdown';

const App: React.FC = () => {
  const [status, setStatus] = useState<AnalysisStatus>(AnalysisStatus.IDLE);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [viewMode, setViewMode] = useState<'ISSUES' | 'FIXED' | 'SIMPLIFIED'>('ISSUES');
  const [isPlaying, setIsPlaying] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);

  const handleInputSubmit = async (input: FileInput) => {
    setStatus(AnalysisStatus.ANALYZING);
    setResult(null);
    try {
      let analysis: AnalysisResult;
      if (input.type === 'PDF') {
        analysis = await analyzeContent('application/pdf', input.dataUrl!, false);
      } else if (input.type === 'IMAGE') {
        analysis = await analyzeContent('image/jpeg', input.dataUrl!, false);
      } else {
        analysis = await analyzeContent('text/plain', input.textContent, true);
      }
      setResult(analysis);
      setStatus(AnalysisStatus.COMPLETE);
    } catch (error) {
      console.error(error);
      setStatus(AnalysisStatus.ERROR);
    }
  };

  const playAudio = async (text: string) => {
    if (isPlaying) return;
    setIsPlaying(true);
    try {
      const audioBuffer = await generateSpeech(text);
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)({sampleRate: 24000});
      audioContextRef.current = ctx;
      
      const source = ctx.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(ctx.destination);
      source.onended = () => setIsPlaying(false);
      source.start(0);
    } catch (e) {
      console.error("Audio playback failed", e);
      setIsPlaying(false);
    }
  };

  const downloadFixedVersion = () => {
    if (!result) return;
    
    const htmlContent = `<!DOCTYPE html>
<html lang="${result.metadata.language || 'en'}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Accessible Document - Fixed Version</title>
    <style>
        body {
            font-family: system-ui, -apple-system, sans-serif;
            line-height: 1.6;
            max-width: 800px;
            margin: 0 auto;
            padding: 2rem;
            color: #1a202c;
            background-color: #fff;
        }
        h1, h2, h3, h4, h5, h6 { margin-top: 2em; margin-bottom: 0.5em; line-height: 1.2; color: #2d3748; }
        h1 { font-size: 2.25rem; }
        h2 { font-size: 1.875rem; border-bottom: 2px solid #e2e8f0; padding-bottom: 0.5rem; }
        p { margin-bottom: 1.25em; }
        ul, ol { margin-bottom: 1.25em; padding-left: 1.5em; }
        li { margin-bottom: 0.5em; }
        table { width: 100%; border-collapse: collapse; margin: 1.5em 0; }
        th, td { border: 1px solid #cbd5e0; padding: 0.75rem; text-align: left; }
        th { background-color: #f7fafc; font-weight: bold; }
        img { max-width: 100%; height: auto; display: block; margin: 1.5em 0; }
        blockquote { border-left: 4px solid #4299e1; margin: 1.5em 0; padding-left: 1em; color: #4a5568; }
        nav { background-color: #f7fafc; padding: 1.5rem; border-radius: 0.5rem; margin-bottom: 2rem; border: 1px solid #e2e8f0; }
        nav h2 { margin-top: 0; font-size: 1.25rem; border-bottom: none; }
        nav ul { margin-bottom: 0; }
        a { color: #3182ce; text-decoration: underline; }
        a:hover { color: #2c5282; }
    </style>
</head>
<body>
    ${result.fixed_accessible_version}
</body>
</html>`;

    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'fixed-accessible-document.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 p-2 rounded-lg">
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">A11Y Scan</span>
          </div>
          <div className="flex items-center gap-4">
            <a href="#" className="text-sm font-medium text-gray-500 hover:text-gray-900">Documentation</a>
            <div className="h-4 w-px bg-gray-300"></div>
            <span className="text-sm font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full">WCAG 2.1 AA</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow p-6">
        <div className="max-w-7xl mx-auto">
          
          {status === AnalysisStatus.IDLE && (
            <div className="mt-10">
              <div className="text-center mb-12">
                <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-4">
                  Make Your Content <span className="text-blue-600">Universally Accessible</span>
                </h1>
                <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                  Upload PDFs, images, or HTML to evaluate, fix, and enhance accessibility compliance instantly with AI.
                </p>
              </div>
              <InputSection onInputSubmit={handleInputSubmit} isLoading={false} />
            </div>
          )}

          {status === AnalysisStatus.ANALYZING && (
            <div className="flex flex-col items-center justify-center min-h-[50vh]">
              <div className="relative">
                <div className="w-24 h-24 border-4 border-gray-200 rounded-full"></div>
                <div className="w-24 h-24 border-4 border-blue-600 rounded-full border-t-transparent animate-spin absolute top-0 left-0"></div>
              </div>
              <h3 className="mt-8 text-xl font-semibold text-gray-900">Analyzing Content...</h3>
              <p className="text-gray-500 mt-2">Checking structure, contrast, and readability against AODA standards.</p>
            </div>
          )}

          {status === AnalysisStatus.ERROR && (
            <div className="text-center mt-10">
              <div className="inline-flex bg-red-100 p-4 rounded-full mb-4">
                <Activity className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Analysis Failed</h3>
              <p className="text-gray-600 mt-2 mb-6">Something went wrong while processing your request.</p>
              <Button onClick={() => setStatus(AnalysisStatus.IDLE)}>Try Again</Button>
            </div>
          )}

          {status === AnalysisStatus.COMPLETE && result && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Left Sidebar: Score & Meta */}
              <div className="lg:col-span-4 space-y-6">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h2 className="text-lg font-bold text-gray-900 mb-4">Accessibility Score</h2>
                  <ScoreChart scoreString={result.accessibility_score} />
                  <div className="mt-6 space-y-3">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-500">AODA Compliance</span>
                      {result.metadata.aoda_compliance ? (
                        <span className="flex items-center text-green-600 font-medium"><Check className="w-4 h-4 mr-1" /> Pass</span>
                      ) : (
                        <span className="flex items-center text-red-600 font-medium">Fail</span>
                      )}
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-500">WCAG Version</span>
                      <span className="font-medium text-gray-900">{result.metadata.wcag_version}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-500">Language</span>
                      <span className="font-medium text-gray-900 uppercase">{result.metadata.language}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 rounded-xl p-6 border border-blue-100">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Headphones className="w-5 h-5 text-blue-600" />
                    </div>
                    <h3 className="font-semibold text-blue-900">Audio Version</h3>
                  </div>
                  <p className="text-sm text-blue-800 mb-4">Listen to the accessible narration of this document.</p>
                  <Button 
                    className="w-full flex items-center justify-center gap-2" 
                    onClick={() => playAudio(result.audio_transcript)}
                    disabled={isPlaying}
                  >
                     {isPlaying ? 'Playing...' : 'Play Audio'}
                  </Button>
                </div>
                
                 <Button variant="outline" className="w-full" onClick={() => setStatus(AnalysisStatus.IDLE)}>
                    Analyze New File
                 </Button>
              </div>

              {/* Right Content Area */}
              <div className="lg:col-span-8">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                  <div className="border-b border-gray-200 px-6 py-4 flex items-center gap-4 overflow-x-auto">
                    <button 
                      onClick={() => setViewMode('ISSUES')}
                      className={`pb-1 text-sm font-medium transition-colors whitespace-nowrap flex items-center gap-2 ${viewMode === 'ISSUES' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                      <Activity className="w-4 h-4" /> Analysis ({result.issues_found.length} Issues)
                    </button>
                    <button 
                      onClick={() => setViewMode('FIXED')}
                      className={`pb-1 text-sm font-medium transition-colors whitespace-nowrap flex items-center gap-2 ${viewMode === 'FIXED' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                      <FileCheck className="w-4 h-4" /> Fixed Version
                    </button>
                    <button 
                      onClick={() => setViewMode('SIMPLIFIED')}
                      className={`pb-1 text-sm font-medium transition-colors whitespace-nowrap flex items-center gap-2 ${viewMode === 'SIMPLIFIED' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                      <LayoutIcon className="w-4 h-4" /> Simplified View
                    </button>
                  </div>

                  <div className="p-6 min-h-[500px]">
                    {viewMode === 'ISSUES' && (
                      <div className="space-y-6">
                        {/* Compliance Breakdown Component */}
                        {result.compliance_breakdown && result.compliance_breakdown.length > 0 && (
                             <ComplianceBreakdown items={result.compliance_breakdown} />
                        )}

                        <div>
                            <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold">Detailed Audit Log</h3>
                            </div>
                            {result.issues_found.map((issue, idx) => (
                            <IssueCard key={idx} issue={issue} />
                            ))}
                            {result.issues_found.length === 0 && (
                                <div className="text-center py-12 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                                    <Check className="w-12 h-12 text-green-500 mx-auto mb-4" />
                                    <h3 className="text-lg font-medium text-gray-900">No Critical Issues Found</h3>
                                    <p className="text-gray-500">This document appears to meet core AODA/WCAG standards.</p>
                                </div>
                            )}
                        </div>
                      </div>
                    )}

                    {viewMode === 'FIXED' && (
                      <div>
                         <div className="flex justify-between items-center mb-6">
                            <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex-1 mr-4">
                                <h4 className="text-green-800 font-semibold flex items-center gap-2">
                                    <Check className="w-4 h-4" /> Improvements Applied
                                </h4>
                                <ul className="list-disc list-inside text-sm text-green-700 mt-2">
                                    <li>Added Table of Contents</li>
                                    <li>Heading structure fixed (H1-H6)</li>
                                    <li>Missing alt text generated</li>
                                    <li>Tables formatted for screen readers</li>
                                </ul>
                            </div>
                            <Button onClick={downloadFixedVersion} className="shrink-0">
                                <Download className="w-4 h-4 mr-2" /> Download HTML
                            </Button>
                        </div>
                        {/* Render HTML Content */}
                        <div 
                            className="prose prose-blue max-w-none border p-8 rounded-lg bg-gray-50 shadow-inner"
                            dangerouslySetInnerHTML={{ __html: result.fixed_accessible_version }}
                        />
                      </div>
                    )}

                    {viewMode === 'SIMPLIFIED' && (
                      <div className="prose prose-indigo max-w-none">
                         <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4 mb-6">
                            <h4 className="text-indigo-800 font-semibold flex items-center gap-2">
                                <Layers className="w-4 h-4" /> Plain Language Version
                            </h4>
                            <p className="text-sm text-indigo-700 mt-2">
                                This version uses simplified vocabulary and sentence structures (Grade 6-8 level) for better cognitive accessibility.
                            </p>
                        </div>
                        <ReactMarkdown>{result.simplified_version}</ReactMarkdown>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default App;