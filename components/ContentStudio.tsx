
import React, { useState, useEffect } from 'react';
import Card from './Card';
import Button from './Button';
import { ContentType, AudiencePersona, MarketingObjective, Listing } from '../types';
import { generateMarketingContent } from '../services/geminiService';
import { SparklesIcon, ClipboardIcon, CheckIcon, CalendarDaysIcon } from './IconComponents';

interface ContentStudioProps {
  onContentGenerated: (data: { propertyDetails: string, objective: MarketingObjective, text: string[], image: string | null, video: string | null }) => void;
  onSchedule?: (text: string) => void;
  selectedListing: Listing | null;
  clearSelectedListing: () => void;
}

const ContentStudio: React.FC<ContentStudioProps> = ({ onContentGenerated, onSchedule, selectedListing, clearSelectedListing }) => {
  const [contentType, setContentType] = useState<ContentType>(ContentType.Instagram);
  const [propertyDetails, setPropertyDetails] = useState('');
  const [audiencePersona, setAudiencePersona] = useState<AudiencePersona>('Young Families');
  const [marketingObjective, setMarketingObjective] = useState<MarketingObjective>('Generate Leads');
  const [tone, setTone] = useState('Professional');
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [generatedContent, setGeneratedContent] = useState<string[]>([]);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  useEffect(() => {
    if (selectedListing) {
      const amenities = selectedListing.amenities && selectedListing.amenities.length > 0 ? ` Key Amenities: ${selectedListing.amenities.join(', ')}.` : '';
      const details = `${selectedListing.beds} bedroom, ${selectedListing.baths} bathroom property at ${selectedListing.address}. Price: ${selectedListing.price}. Size: ${selectedListing.size} sqm.${amenities}`;
      setPropertyDetails(details);
    } else {
        setPropertyDetails(''); // Clear details if selection is cleared
    }
  }, [selectedListing]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!propertyDetails) {
      setError('Please provide property details.');
      return;
    }
    setError('');
    setIsLoading(true);
    setGeneratedContent([]);

    try {
      const content = await generateMarketingContent(contentType, propertyDetails, audiencePersona, marketingObjective, tone);
      setGeneratedContent(content);
      onContentGenerated({
        propertyDetails,
        objective: marketingObjective,
        text: content,
        image: selectedListing?.imageUrl || null, // Use existing image if available
        video: null
      });
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleCopy = (text: string, index: number) => {
      navigator.clipboard.writeText(text);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="space-y-6">
      {selectedListing && (
        <Card className="bg-teal-900/50 border border-teal-700 flex justify-between items-center animate-fade-in">
            <div>
                <p className="text-sm font-semibold text-teal-300">Marketing for Listing:</p>
                <p className="text-white truncate">{selectedListing.address}</p>
            </div>
            <button onClick={clearSelectedListing} className="text-2xl text-gray-400 hover:text-white font-bold">&times;</button>
        </Card>
      )}
      <Card>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Property Details</label>
            <textarea
              rows={4}
              value={propertyDetails}
              onChange={(e) => setPropertyDetails(e.target.value)}
              placeholder="e.g., 4-bedroom duplex in Lekki Phase 1, with a swimming pool, 24/7 power, and modern kitchen."
              className="w-full bg-gray-700 border-gray-600 text-white rounded-lg p-2 focus:ring-teal-500 focus:border-teal-500"
              disabled={!!selectedListing}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Marketing Objective</label>
                <select value={marketingObjective} onChange={(e) => setMarketingObjective(e.target.value as MarketingObjective)} className="w-full bg-gray-700 border-gray-600 text-white rounded-lg p-2 focus:ring-teal-500 focus:border-teal-500">
                    {Object.values(marketingObjectiveOptions).map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                </select>
            </div>
             <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Target Audience</label>
                <select value={audiencePersona} onChange={(e) => setAudiencePersona(e.target.value as AudiencePersona)} className="w-full bg-gray-700 border-gray-600 text-white rounded-lg p-2 focus:ring-teal-500 focus:border-teal-500">
                     {Object.values(audiencePersonaOptions).map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                </select>
            </div>
          </div>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Content Type</label>
                <select value={contentType} onChange={(e) => setContentType(e.target.value as ContentType)} className="w-full bg-gray-700 border-gray-600 text-white rounded-lg p-2 focus:ring-teal-500 focus:border-teal-500">
                    {Object.values(ContentType).map((type) => (<option key={type} value={type}>{type}</option>))}
                </select>
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Tone of Voice</label>
                <select value={tone} onChange={(e) => setTone(e.target.value)} className="w-full bg-gray-700 border-gray-600 text-white rounded-lg p-2 focus:ring-teal-500 focus:border-teal-500">
                    <option>Professional</option><option>Luxury</option><option>Friendly & Casual</option><option>Urgent</option>
                </select>
            </div>
          </div>
          
           <div className="pt-2">
             <Button type="submit" isLoading={isLoading} icon={<SparklesIcon className="w-5 h-5"/>} className="w-full">
                Generate Text Content
            </Button>
           </div>
          {error && <p className="text-red-400 text-sm text-center">{error}</p>}
        </form>
      </Card>
      
      {(isLoading || generatedContent.length > 0) && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-white text-center">Generated Text Results</h2>
          {isLoading && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[...Array(2)].map((_, i) => (
                <Card key={i} className="animate-pulse"><div className="h-24 bg-gray-700 rounded"></div></Card>
              ))}
            </div>
          )}
          <div className="space-y-4">
            {generatedContent.map((content, index) => (
              <Card key={index} className="bg-gray-800/50">
                <p className="text-gray-200 whitespace-pre-wrap mb-3">{content}</p>
                <div className="flex justify-end gap-2 border-t border-gray-700 pt-2">
                    <Button onClick={() => handleCopy(content, index)} variant="secondary" size="small" className="!py-1 !px-2 text-xs">
                        {copiedIndex === index ? <CheckIcon className="w-4 h-4 text-green-400"/> : <ClipboardIcon className="w-4 h-4"/>}
                        <span className="ml-1">{copiedIndex === index ? 'Copied' : 'Copy'}</span>
                    </Button>
                    {onSchedule && contentType === ContentType.Instagram && (
                        <Button onClick={() => onSchedule(content)} size="small" className="!py-1 !px-2 text-xs">
                             <CalendarDaysIcon className="w-4 h-4 mr-1"/>
                             Schedule Post
                        </Button>
                    )}
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// Data for selects
const audiencePersonaOptions = [
    { value: 'First-time Homebuyers', label: 'First-time Homebuyers' },
    { value: 'Luxury Investors', label: 'Luxury Investors' },
    { value: 'Young Families', label: 'Young Families' },
    { value: 'Expatriates', label: 'Expatriates' },
    { value: 'Retirees', label: 'Retirees' },
];

const marketingObjectiveOptions = [
    { value: 'Generate Leads', label: 'Generate Leads' },
    { value: 'Increase Awareness', label: 'Increase Awareness' },
    { value: 'Announce Open House', label: 'Announce Open House' },
    { value: 'Promote Price Reduction', label: 'Promote Price Reduction' },
];

export default ContentStudio;
