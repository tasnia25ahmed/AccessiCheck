import React, { useState, ChangeEvent } from 'react';
import { Upload, Link as LinkIcon, FileText, Image as ImageIcon } from 'lucide-react';
import { InputType, FileInput } from '../types';
import { Button } from './Button';

interface InputSectionProps {
  onInputSubmit: (input: FileInput) => void;
  isLoading: boolean;
}

export const InputSection: React.FC<InputSectionProps> = ({ onInputSubmit, isLoading }) => {
  const [activeTab, setActiveTab] = useState<InputType>('PDF');
  const [textInput, setTextInput] = useState('');

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      // Extract base64 data
      const base64 = result.split(',')[1];
      
      onInputSubmit({
        file,
        dataUrl: base64,
        type: activeTab,
        textContent: ''
      });
    };
    reader.readAsDataURL(file);
  };

  const handleTextSubmit = () => {
    if (!textInput.trim()) return;
    onInputSubmit({
        file: null,
        dataUrl: null,
        type: activeTab,
        textContent: textInput
    });
  };

  const tabs: { id: InputType; label: string; icon: React.ReactNode }[] = [
    { id: 'PDF', label: 'PDF Document', icon: <FileText className="w-4 h-4" /> },
    { id: 'IMAGE', label: 'Image Scan', icon: <ImageIcon className="w-4 h-4" /> },
    { id: 'HTML', label: 'HTML / Text', icon: <LinkIcon className="w-4 h-4" /> },
  ];

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-8 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Analyze Accessibility</h2>
      
      <div className="flex flex-wrap gap-2 mb-6 justify-center">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-all
              ${activeTab === tab.id 
                ? 'bg-indigo-600 text-white shadow-md' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 bg-gray-50 text-center hover:bg-gray-50/80 transition-colors">
        {activeTab === 'PDF' || activeTab === 'IMAGE' ? (
          <div className="flex flex-col items-center">
            <div className="bg-indigo-100 p-4 rounded-full mb-4">
              <Upload className="w-8 h-8 text-indigo-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Upload your {activeTab === 'PDF' ? 'PDF' : 'Image'} file
            </h3>
            <p className="text-gray-500 mb-6 max-w-sm">
              Drag and drop or click to browse. We'll scan it for AODA & WCAG compliance.
            </p>
            <input 
              type="file" 
              id="file-upload" 
              className="hidden" 
              accept={activeTab === 'PDF' ? ".pdf" : "image/*"}
              onChange={handleFileChange}
              disabled={isLoading}
            />
            <label htmlFor="file-upload">
               <Button as="span" disabled={isLoading} variant="secondary" className="cursor-pointer">
                 Select File
               </Button>
            </label>
          </div>
        ) : (
          <div className="flex flex-col items-center w-full">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Paste Content or URL</h3>
            <p className="text-gray-500 mb-4">Paste raw HTML or text content to analyze structure and readability.</p>
            <textarea 
              className="w-full p-4 border border-gray-300 rounded-lg mb-4 focus:ring-2 focus:ring-blue-500 focus:border-transparent h-40 font-mono text-sm"
              placeholder="<html>...</html> or plain text"
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              disabled={isLoading}
            />
            <Button onClick={handleTextSubmit} disabled={isLoading || !textInput.trim()}>
              Analyze Content
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
