
import React, { useState } from 'react';
import Card from './Card';
import Button from './Button';
import { getMarketInsights } from '../services/geminiService';
import { MarketInsightsIcon, SparklesIcon, GlobeIcon } from './IconComponents';

const MarketInsights: React.FC = () => {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<{text: string, sources: {uri: string, title: string}[]} | null>(null);

  const quickPrompts = [
    "Lekki rental yields 2024",
    "Accra vs Nairobi property trends",
    "Investment risks in Lagos",
    "Emerging areas in Rwanda"
  ];

  const handleQuery = async (searchQuery: string = query) => {
    if (!searchQuery.trim()) {
      setError('Please enter a query.');
      return;
    }
    setError('');
    setIsLoading(true);
    setResult(null);
    // If using a quick prompt, update input
    if (searchQuery !== query) setQuery(searchQuery);

    try {
      const data = await getMarketInsights(searchQuery);
      setResult(data);
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  const renderFormattedInsights = (text: string) => {
    const sections = text.split(/(\*\*.*?\*\*)/g); // Split by bolded titles
    return sections.map((section, index) => {
      if (section.startsWith('**') && section.endsWith('**')) {
        return <h3 key={index} className="text-lg sm:text-xl font-bold text-teal-400 mt-6 mb-3 border-b border-teal-500/20 pb-1">{section.slice(2, -2)}</h3>;
      }
      if (section.includes('* ')) {
        return (
          <ul key={index} className="list-disc list-inside space-y-2 text-gray-300 my-3 pl-2">
            {section.split('* ').filter(s => s.trim()).map((item, i) => <li key={i} className="leading-relaxed">{item.trim()}</li>)}
          </ul>
        );
      }
      return <p key={index} className="text-gray-300 leading-relaxed my-2">{section}</p>;
    });
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="text-center">
        <div className="inline-flex items-center justify-center p-3 bg-teal-500/10 rounded-full mb-4 ring-1 ring-teal-500/30">
          <MarketInsightsIcon className="w-8 h-8 text-teal-400" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-white">Market Insights Engine</h1>
        <p className="text-gray-400 mt-2 max-w-xl mx-auto">Leverage real-time data from Google Search to analyze the African real estate market.</p>
      </div>

      <Card>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleQuery()}
              placeholder="Ask about trends, prices, regulations..."
              className="flex-1 bg-gray-900/50 border-gray-700 text-white rounded-xl p-3 px-4 focus:ring-teal-500 focus:border-teal-500 placeholder-gray-500"
            />
            <Button onClick={() => handleQuery(query)} isLoading={isLoading} icon={<SparklesIcon className="w-5 h-5"/>} className="sm:w-32">
              Analyze
            </Button>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {quickPrompts.map((prompt, i) => (
              <button 
                key={i}
                onClick={() => handleQuery(prompt)}
                className="text-xs bg-gray-800 hover:bg-gray-700 text-teal-400 border border-gray-700 hover:border-teal-500/50 px-3 py-1.5 rounded-full transition-all"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>
        {error && <p className="text-red-400 text-sm mt-3 text-center bg-red-500/10 py-2 rounded border border-red-500/20">{error}</p>}
      </Card>

      {isLoading && (
        <Card className="animate-pulse border-teal-500/20">
             <div className="flex items-center space-x-2 mb-6">
                <div className="w-2 h-2 bg-teal-500 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-teal-500 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                <div className="w-2 h-2 bg-teal-500 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                <span className="text-sm text-teal-500 font-medium ml-2">Searching live market data...</span>
             </div>
            <div className="h-6 bg-gray-800 rounded w-1/3 mb-6"></div>
            <div className="space-y-3">
                <div className="h-4 bg-gray-800 rounded w-full"></div>
                <div className="h-4 bg-gray-800 rounded w-11/12"></div>
                <div className="h-4 bg-gray-800 rounded w-4/5"></div>
            </div>
             <div className="h-6 bg-gray-800 rounded w-1/4 mt-8 mb-6"></div>
             <div className="space-y-3">
                <div className="h-4 bg-gray-800 rounded w-full"></div>
                <div className="h-4 bg-gray-800 rounded w-3/4"></div>
            </div>
        </Card>
      )}

      {result && (
        <Card className="border-t-4 border-t-teal-500">
          <div className="flex justify-between items-center mb-6">
             <h2 className="text-xl font-bold text-white flex items-center gap-2">
                Analysis Report
            </h2>
             <span className="text-xs bg-teal-500/10 text-teal-300 border border-teal-500/20 px-2 py-1 rounded flex items-center gap-1">
                <SparklesIcon className="w-3 h-3"/> AI Generated
             </span>
          </div>
         
          <div className="prose prose-invert max-w-none prose-p:text-gray-300 prose-li:text-gray-300">
            {renderFormattedInsights(result.text)}
          </div>

          {result.sources && result.sources.length > 0 && (
            <div className="mt-8 pt-6 border-t border-gray-800">
                <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                    <GlobeIcon className="w-4 h-4"/> Sources & Citations
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {result.sources.map((source, idx) => (
                        <a 
                            key={idx} 
                            href={source.uri} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-xs text-teal-400 hover:text-teal-300 bg-gray-900/50 hover:bg-gray-900 border border-gray-700 rounded p-2 truncate block transition-colors"
                        >
                            {source.title || source.uri}
                        </a>
                    ))}
                </div>
            </div>
          )}
        </Card>
      )}
    </div>
  );
};

export default MarketInsights;
