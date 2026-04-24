
import React, { useState } from 'react';
import { Lead } from '../types';
import Button from './Button';
import { generateLegalAgreement } from '../services/geminiService';
import { DocumentTextIcon, ReceiptPercentIcon, PrinterIcon, SparklesIcon, PlusIcon, TrashIcon, PaperAirplaneIcon } from './IconComponents';

interface DealDocsProps {
    lead: Lead;
}

type Tab = 'agreement' | 'invoice';

const DealDocs: React.FC<DealDocsProps> = ({ lead }) => {
    const [activeTab, setActiveTab] = useState<Tab>('agreement');

    // Agreement State
    const [agreementType, setAgreementType] = useState('Tenancy Agreement');
    const [propertyAddress, setPropertyAddress] = useState('');
    const [price, setPrice] = useState('');
    const [terms, setTerms] = useState('');
    const [generatedAgreement, setGeneratedAgreement] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [isSending, setIsSending] = useState(false);

    // Invoice State
    const [invoiceItems, setInvoiceItems] = useState<{ id: string; desc: string; amount: number }[]>([
        { id: '1', desc: 'Agency Fee (10%)', amount: 0 },
        { id: '2', desc: 'Legal Fee (5%)', amount: 0 },
    ]);
    const [invoiceDate, setInvoiceDate] = useState(new Date().toISOString().split('T')[0]);

    const handleGenerateAgreement = async () => {
        if (!propertyAddress || !price) {
            alert("Please fill in Property Address and Price.");
            return;
        }
        setIsGenerating(true);
        try {
            const agreement = await generateLegalAgreement(
                agreementType,
                { agent: 'Afrimmo Agency', client: lead.name },
                propertyAddress,
                price,
                terms
            );
            setGeneratedAgreement(agreement);
        } catch (error) {
            console.error(error);
            alert("Failed to generate agreement.");
        } finally {
            setIsGenerating(false);
        }
    };

    const handleSend = () => {
        setIsSending(true);
        // Simulate API call
        setTimeout(() => {
            setIsSending(false);
            alert(`Document sent to ${lead.name} via Email and WhatsApp!`);
        }, 1500);
    };

    const addInvoiceItem = () => {
        setInvoiceItems([...invoiceItems, { id: Date.now().toString(), desc: '', amount: 0 }]);
    };

    const removeInvoiceItem = (id: string) => {
        setInvoiceItems(invoiceItems.filter(i => i.id !== id));
    };

    const updateItem = (id: string, field: 'desc' | 'amount', value: string | number) => {
        setInvoiceItems(invoiceItems.map(i => i.id === id ? { ...i, [field]: value } : i));
    };

    const calculateTotal = () => invoiceItems.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);

    const printDoc = () => {
        const content = activeTab === 'agreement' 
            ? document.getElementById('agreement-content')?.innerHTML 
            : document.getElementById('invoice-content')?.innerHTML;
        
        if (!content) return;
        
        const printWindow = window.open('', '', 'height=600,width=800');
        printWindow?.document.write('<html><head><title>Print</title>');
        printWindow?.document.write('<style>body{font-family:sans-serif; padding: 20px;} .invoice-box{max-width:800px;margin:auto;padding:30px;border:1px solid #eee;box-shadow:0 0 10px rgba(0,0,0,.15);font-size:16px;line-height:24px;color:#555;} .invoice-box table{width:100%;line-height:inherit;text-align:left;} .invoice-box table td{padding:5px;vertical-align:top;} .invoice-box table tr td:nth-child(2){text-align:right;} .invoice-box table tr.top table td{padding-bottom:20px;} .invoice-box table tr.top table td.title{font-size:45px;line-height:45px;color:#333;} .invoice-box table tr.information table td{padding-bottom:40px;} .invoice-box table tr.heading td{background:#eee;border-bottom:1px solid #ddd;font-weight:bold;} .invoice-box table tr.details td{padding-bottom:20px;} .invoice-box table tr.item td{border-bottom:1px solid #eee;} .invoice-box table tr.item.last td{border-bottom:none;} .invoice-box table tr.total td:nth-child(2){border-top:2px solid #eee;font-weight:bold;}</style>');
        printWindow?.document.write('</head><body>');
        printWindow?.document.write(content);
        printWindow?.document.write('</body></html>');
        printWindow?.document.close();
        printWindow?.print();
    };

    return (
        <div className="h-full flex flex-col bg-slate-900 rounded-xl overflow-hidden">
            {/* Tabs */}
            <div className="flex border-b border-slate-700 bg-slate-950">
                <button
                    onClick={() => setActiveTab('agreement')}
                    className={`flex-1 py-4 text-sm font-medium flex items-center justify-center gap-2 transition-colors ${activeTab === 'agreement' ? 'text-teal-400 border-b-2 border-teal-500 bg-slate-900' : 'text-slate-400 hover:text-white hover:bg-slate-900/50'}`}
                >
                    <DocumentTextIcon className="w-5 h-5" /> Draft Agreement
                </button>
                <button
                    onClick={() => setActiveTab('invoice')}
                    className={`flex-1 py-4 text-sm font-medium flex items-center justify-center gap-2 transition-colors ${activeTab === 'invoice' ? 'text-teal-400 border-b-2 border-teal-500 bg-slate-900' : 'text-slate-400 hover:text-white hover:bg-slate-900/50'}`}
                >
                    <ReceiptPercentIcon className="w-5 h-5" /> Create Invoice
                </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
                {activeTab === 'agreement' ? (
                    <div className="space-y-6 max-w-3xl mx-auto">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-1">Document Type</label>
                                <select 
                                    value={agreementType} 
                                    onChange={(e) => setAgreementType(e.target.value)}
                                    className="w-full bg-slate-800 border-slate-700 rounded-lg p-2 text-white"
                                >
                                    <option>Tenancy Agreement</option>
                                    <option>Contract of Sale</option>
                                    <option>Offer Letter</option>
                                    <option>Management Agreement</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-1">Agreed Amount</label>
                                <input 
                                    type="text" 
                                    value={price} 
                                    onChange={(e) => setPrice(e.target.value)}
                                    placeholder="e.g. ₦2,500,000"
                                    className="w-full bg-slate-800 border-slate-700 rounded-lg p-2 text-white"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-1">Property Address</label>
                            <input 
                                type="text" 
                                value={propertyAddress} 
                                onChange={(e) => setPropertyAddress(e.target.value)}
                                placeholder="Full address of the property"
                                className="w-full bg-slate-800 border-slate-700 rounded-lg p-2 text-white"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-1">Terms / Notes</label>
                            <textarea 
                                value={terms} 
                                onChange={(e) => setTerms(e.target.value)}
                                placeholder="Any special clauses, payment terms, or duration..."
                                rows={3}
                                className="w-full bg-slate-800 border-slate-700 rounded-lg p-2 text-white"
                            />
                        </div>
                        
                        <Button onClick={handleGenerateAgreement} isLoading={isGenerating} className="w-full">
                            <SparklesIcon className="w-5 h-5 mr-2" /> Generate Draft with AI
                        </Button>

                        {generatedAgreement && (
                            <div className="bg-white text-black p-8 rounded-lg shadow-xl mt-8">
                                <div id="agreement-content" className="prose max-w-none font-serif whitespace-pre-wrap text-sm">
                                    {generatedAgreement}
                                </div>
                                <div className="mt-6 flex justify-end gap-3 print:hidden">
                                     <Button variant="secondary" onClick={() => navigator.clipboard.writeText(generatedAgreement)}>Copy Text</Button>
                                     <Button variant="secondary" onClick={handleSend} isLoading={isSending} icon={<PaperAirplaneIcon className="w-4 h-4"/>}>Send to Client</Button>
                                     <Button variant="primary" onClick={printDoc} icon={<PrinterIcon className="w-4 h-4" />}>Print</Button>
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
                        {/* Editor */}
                        <div className="space-y-6">
                            <h3 className="text-lg font-bold text-white">Invoice Details</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-400 mb-1">Invoice Date</label>
                                    <input type="date" value={invoiceDate} onChange={e => setInvoiceDate(e.target.value)} className="w-full bg-slate-800 border-slate-700 rounded-lg p-2 text-white" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-400 mb-1">Due Date</label>
                                    <input type="date" className="w-full bg-slate-800 border-slate-700 rounded-lg p-2 text-white" />
                                </div>
                            </div>

                            <div className="space-y-3">
                                <div className="flex justify-between items-center">
                                    <label className="block text-sm font-medium text-slate-400">Line Items</label>
                                    <button onClick={addInvoiceItem} className="text-xs text-teal-400 hover:text-teal-300 flex items-center gap-1"><PlusIcon className="w-3 h-3" /> Add Item</button>
                                </div>
                                {invoiceItems.map((item) => (
                                    <div key={item.id} className="flex gap-2 items-center">
                                        <input 
                                            type="text" 
                                            value={item.desc} 
                                            onChange={e => updateItem(item.id, 'desc', e.target.value)}
                                            placeholder="Description"
                                            className="flex-grow bg-slate-800 border-slate-700 rounded-lg p-2 text-white text-sm"
                                        />
                                        <input 
                                            type="number" 
                                            value={item.amount} 
                                            onChange={e => updateItem(item.id, 'amount', Number(e.target.value))}
                                            placeholder="0.00"
                                            className="w-24 bg-slate-800 border-slate-700 rounded-lg p-2 text-white text-sm text-right"
                                        />
                                        <button onClick={() => removeInvoiceItem(item.id)} className="text-slate-600 hover:text-red-400 p-1">
                                            <TrashIcon className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                            
                            <div className="bg-slate-800 p-4 rounded-lg flex justify-between items-center">
                                <span className="font-bold text-white">Total Amount</span>
                                <span className="font-bold text-teal-400 text-xl">₦{calculateTotal().toLocaleString()}</span>
                            </div>
                        </div>

                        {/* Preview */}
                        <div className="relative">
                            <div id="invoice-content" className="bg-white text-slate-800 p-8 rounded-lg shadow-2xl min-h-[500px] text-sm">
                                <div className="flex justify-between items-start mb-8">
                                    <div>
                                        <h1 className="text-3xl font-bold text-slate-900 mb-1">INVOICE</h1>
                                        <p className="text-slate-500">#{Math.floor(Math.random() * 10000)}</p>
                                    </div>
                                    <div className="text-right">
                                        <h2 className="font-bold text-lg">Afrimmo Agency</h2>
                                        <p>12 Victoria Island</p>
                                        <p>Lagos, Nigeria</p>
                                    </div>
                                </div>

                                <div className="mb-8 flex justify-between">
                                    <div>
                                        <p className="font-bold text-slate-400 text-xs uppercase mb-1">Bill To</p>
                                        <p className="font-bold text-lg">{lead.name}</p>
                                        <p>Client ID: {lead.id}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold text-slate-400 text-xs uppercase mb-1">Date</p>
                                        <p>{invoiceDate}</p>
                                    </div>
                                </div>

                                <table className="w-full mb-8">
                                    <thead>
                                        <tr className="border-b-2 border-slate-200">
                                            <th className="text-left py-2 font-bold text-slate-600">Description</th>
                                            <th className="text-right py-2 font-bold text-slate-600">Amount</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {invoiceItems.map(item => (
                                            <tr key={item.id} className="border-b border-slate-100">
                                                <td className="py-3">{item.desc}</td>
                                                <td className="py-3 text-right">₦{item.amount.toLocaleString()}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>

                                <div className="flex justify-end">
                                    <div className="w-1/2 border-t-2 border-slate-900 pt-2 flex justify-between items-center">
                                        <span className="font-bold text-lg">Total</span>
                                        <span className="font-bold text-xl">₦{calculateTotal().toLocaleString()}</span>
                                    </div>
                                </div>
                                
                                <div className="mt-12 pt-8 border-t border-slate-200 text-center text-slate-500 text-xs">
                                    <p>Thank you for your business.</p>
                                    <p>Payment due within 14 days.</p>
                                </div>
                            </div>
                            
                            <div className="absolute top-4 right-4 print:hidden flex gap-2">
                                <Button onClick={handleSend} isLoading={isSending} size="small" variant="primary" icon={<PaperAirplaneIcon className="w-4 h-4"/>}>Send</Button>
                                <Button onClick={printDoc} size="small" variant="secondary" icon={<PrinterIcon className="w-4 h-4"/>}>Print</Button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DealDocs;
