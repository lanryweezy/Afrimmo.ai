
import React, { useState } from 'react';
import Card from './Card';
import Button from './Button';
import { getPropertyValuation } from '../services/geminiService';
import { PropertyDetailsForValuation, ValuationResponse } from '../types';
import { PropertyValuatorIcon } from './IconComponents';

const PropertyValuator: React.FC = () => {
    const [details, setDetails] = useState<PropertyDetailsForValuation>({
        location: '',
        propertyType: 'Apartment',
        bedrooms: '3',
        bathrooms: '2',
        size: '',
        condition: 'Good',
        features: '',
    });

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [valuation, setValuation] = useState<ValuationResponse | null>(null);
    
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setDetails(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!details.location || !details.size) {
            setError('Please fill in Location and Property Size.');
            return;
        }
        setError('');
        setIsLoading(true);
        setValuation(null);

        try {
            const result = await getPropertyValuation(details);
            setValuation(result);
        } catch (err: any) {
            setError(err.message || 'An unexpected error occurred.');
        } finally {
            setIsLoading(false);
        }
    };
    
    const renderMarkdown = (text: string) => {
        return text.split('\n').filter(line => line.trim() !== '').map((line, i) => {
            const trimmedLine = line.trim();
            if (trimmedLine.startsWith('* ')) {
                return <li key={i} className="ml-4 list-disc text-gray-300">{trimmedLine.substring(2)}</li>;
            }
            return <p key={i} className="text-gray-300 leading-relaxed">{trimmedLine}</p>;
        });
    };

    const inputClasses = "w-full bg-gray-700 border-gray-600 text-white rounded-lg p-2 focus:ring-teal-500 focus:border-teal-500";

    return (
        <div className="space-y-6 max-w-6xl mx-auto animate-fade-in">
            <div className="text-center">
                <h1 className="text-2xl sm:text-3xl font-bold text-white">AI Property Valuator</h1>
                <p className="text-gray-400 mt-2">Get instant, data-driven valuation reports for properties across Africa.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
                <Card className="md:col-span-2 h-fit">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <h2 className="text-xl font-semibold text-white mb-2">Property Details</h2>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">Location</label>
                            <input type="text" name="location" value={details.location} onChange={handleInputChange} placeholder="e.g., Ikoyi, Lagos, Nigeria" className={inputClasses} required />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">Type</label>
                                <select name="propertyType" value={details.propertyType} onChange={handleInputChange} className={inputClasses}>
                                    <option>Apartment</option><option>Duplex</option><option>Bungalow</option><option>Mansion</option><option>Terrace House</option><option>Land</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">Condition</label>
                                <select name="condition" value={details.condition} onChange={handleInputChange} className={inputClasses}>
                                    <option>Excellent</option><option>Good</option><option>Fair</option><option>Needs Renovation</option>
                                </select>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                             <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">Bedrooms</label>
                                <input type="number" name="bedrooms" value={details.bedrooms} onChange={handleInputChange} min="0" className={inputClasses} />
                            </div>
                             <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">Bathrooms</label>
                                <input type="number" name="bathrooms" value={details.bathrooms} onChange={handleInputChange} min="0" className={inputClasses} />
                            </div>
                             <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">Size (sqm)</label>
                                <input type="number" name="size" value={details.size} onChange={handleInputChange} placeholder="e.g. 300" className={inputClasses} required />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">Key Features (Optional)</label>
                            <textarea name="features" rows={3} value={details.features} onChange={handleInputChange} placeholder="e.g., Swimming pool, 24/7 security, ocean view..." className={inputClasses} />
                        </div>
                        <Button type="submit" isLoading={isLoading} icon={<PropertyValuatorIcon className="w-5 h-5"/>} className="w-full">
                            Generate Valuation
                        </Button>
                        {error && <p className="text-red-400 text-sm text-center">{error}</p>}
                    </form>
                </Card>

                <div className="md:col-span-3">
                    {isLoading && (
                        <Card className="animate-pulse">
                            <div className="h-10 bg-gray-700 rounded w-3/4 mb-4"></div>
                            <div className="h-4 bg-gray-700 rounded w-1/4 mb-8"></div>
                            <div className="h-6 bg-gray-700 rounded w-1/3 mb-4"></div>
                            <div className="space-y-2">
                                <div className="h-4 bg-gray-700 rounded"></div>
                                <div className="h-4 bg-gray-700 rounded w-5/6"></div>
                            </div>
                        </Card>
                    )}
                    {!isLoading && !valuation && (
                        <Card className="h-full flex items-center justify-center text-center">
                            <div>
                                <PropertyValuatorIcon className="w-16 h-16 mx-auto text-gray-600" />
                                <h3 className="mt-4 text-lg font-semibold text-gray-400">Your valuation report will appear here.</h3>
                                <p className="mt-1 text-sm text-gray-500">Fill out the property details and click "Generate Valuation" to begin.</p>
                            </div>
                        </Card>
                    )}
                    {valuation && (
                        <div className="space-y-6">
                            <Card className="border-t-4 border-teal-500">
                                <p className="text-sm text-gray-400">Estimated Value</p>
                                <p className="text-3xl md:text-4xl font-bold text-white my-2">{valuation.valueRange}</p>
                                <p className={`text-sm font-medium px-2 py-1 rounded-full inline-block ${
                                    valuation.confidence === 'High' ? 'bg-green-500/20 text-green-300' :
                                    valuation.confidence === 'Medium' ? 'bg-yellow-500/20 text-yellow-300' :
                                    'bg-red-500/20 text-red-300'
                                }`}>{valuation.confidence} Confidence</p>
                            </Card>
                            <Card>
                                <h3 className="text-xl font-semibold text-white mb-2">Market Analysis</h3>
                                {renderMarkdown(valuation.analysis)}
                            </Card>
                            <Card>
                                <h3 className="text-xl font-semibold text-white mb-2">Comparable Properties</h3>
                                <div className="space-y-4">
                                    {valuation.comps.map((comp, index) => (
                                        <div key={index} className="p-3 bg-gray-900/50 rounded-lg">
                                            <div className="flex flex-col sm:flex-row justify-between items-start gap-1">
                                                <p className="font-semibold text-teal-400">{comp.address}</p>
                                                <p className="font-bold text-white">{comp.price}</p>
                                            </div>
                                            <p className="text-sm text-gray-400 mt-1">{comp.notes}</p>
                                        </div>
                                    ))}
                                </div>
                            </Card>
                             <Card>
                                <h3 className="text-xl font-semibold text-white mb-2">Value-Add Recommendations</h3>
                                {renderMarkdown(valuation.recommendations)}
                            </Card>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PropertyValuator;
