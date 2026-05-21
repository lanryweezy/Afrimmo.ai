
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
    const [dueDate, setDueDate] = useState(new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);
    const [currency, setCurrency] = useState('₦');
    const [taxRate, setTaxRate] = useState(7.5); // Default VAT in Nigeria
    const [bankDetails, setBankDetails] = useState('Zenith Bank, Afrimmo Agency, 1234567890');
    const [businessAddress, setBusinessAddress] = useState('12 Victoria Island, Lagos, Nigeria');

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

    const calculateSubtotal = () => invoiceItems.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
    const calculateTax = () => calculateSubtotal() * (taxRate / 100);
    const calculateTotal = () => calculateSubtotal() + calculateTax();

    const printDoc = () => {
        const content = activeTab === 'agreement' 
            ? document.getElementById('agreement-content')?.innerHTML 
            : document.getElementById('invoice-content')?.innerHTML;
        
        if (!content) return;
        
        const printWindow = window.open('', '', 'height=600,width=800');
        printWindow?.document.write('<html><head><title>Print</title>');
        printWindow?.document.write('<style>body{font-family:sans-serif; padding: 40px; color: #334155;} .invoice-container{max-width:800px;margin:auto;} .header{display:flex;justify-content:between;margin-bottom:40px;} .title{font-size:32px;font-weight:bold;color:#0f172a;} .details-grid{display:grid;grid-template-columns:1fr 1fr;gap:40px;margin-bottom:40px;} .label{font-size:12px;font-weight:bold;color:#64748b;text-transform:uppercase;margin-bottom:4px;} .value{font-size:16px;font-weight:500;} .table{width:100%;border-collapse:collapse;margin-bottom:40px;} .table th{text-align:left;padding:12px;border-bottom:2px solid #e2e8f0;color:#64748b;font-size:14px;} .table td{padding:12px;border-bottom:1px solid #f1f5f9;font-size:14px;} .text-right{text-align:right;} .totals{margin-left:auto;width:250px;} .total-row{display:flex;justify-content:between;padding:8px 0;} .total-final{border-top:2px solid #0f172a;margin-top:8px;padding-top:12px;font-weight:bold;font-size:20px;} .footer{margin-top:60px;padding-top:20px;border-top:1px solid #e2e8f0;text-align:center;font-size:12px;color:#94a3b8;}</style>');
        printWindow?.document.write('</head><body>');
        printWindow?.document.write(`<div class="invoice-container">${content}</div>`);
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
                            <div className="flex justify-between items-center">
                                <h3 className="text-lg font-bold text-white">Invoice Details</h3>
                                <select
                                    value={currency}
                                    onChange={(e) => setCurrency(e.target.value)}
                                    className="bg-slate-800 border-slate-700 rounded-lg p-1 text-xs text-white"
                                >
                                    <option value="₦">NGN (₦)</option>
                                    <option value="$">USD ($)</option>
                                    <option value="£">GBP (£)</option>
                                    <option value="€">EUR (€)</option>
                                    <option value="KSh">KES (KSh)</option>
                                </select>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-400 mb-1">Invoice Date</label>
                                    <input type="date" value={invoiceDate} onChange={e => setInvoiceDate(e.target.value)} className="w-full bg-slate-800 border-slate-700 rounded-lg p-2 text-white text-sm" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-400 mb-1">Due Date</label>
                                    <input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} className="w-full bg-slate-800 border-slate-700 rounded-lg p-2 text-white text-sm" />
                                </div>
                            </div>

                            <div className="space-y-4 bg-slate-800/50 p-4 rounded-xl border border-slate-700">
                                <div>
                                    <label className="block text-sm font-medium text-slate-400 mb-1">Business Address</label>
                                    <input type="text" value={businessAddress} onChange={e => setBusinessAddress(e.target.value)} className="w-full bg-slate-800 border-slate-700 rounded-lg p-2 text-white text-sm" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-400 mb-1">Bank / Payment Details</label>
                                    <textarea value={bankDetails} onChange={e => setBankDetails(e.target.value)} rows={2} className="w-full bg-slate-800 border-slate-700 rounded-lg p-2 text-white text-sm resize-none" />
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
                                            className="flex-grow bg-slate-800 border-slate-700 rounded-lg p-2 text-white text-sm focus:ring-1 focus:ring-teal-500 outline-none"
                                        />
                                        <div className="relative">
                                            <span className="absolute left-2 top-2 text-slate-500 text-xs">{currency}</span>
                                            <input
                                                type="number"
                                                value={item.amount}
                                                onChange={e => updateItem(item.id, 'amount', Number(e.target.value))}
                                                placeholder="0.00"
                                                className="w-28 bg-slate-800 border-slate-700 rounded-lg p-2 pl-6 text-white text-sm text-right focus:ring-1 focus:ring-teal-500 outline-none"
                                            />
                                        </div>
                                        <button onClick={() => removeInvoiceItem(item.id)} className="text-slate-600 hover:text-red-400 p-1">
                                            <TrashIcon className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                            
                            <div className="bg-slate-800 p-4 rounded-lg space-y-2">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-slate-400">Subtotal</span>
                                    <span className="text-white">{currency}{calculateSubtotal().toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <div className="flex items-center gap-2">
                                        <span className="text-slate-400">Tax / VAT (%)</span>
                                        <input
                                            type="number"
                                            value={taxRate}
                                            onChange={e => setTaxRate(Number(e.target.value))}
                                            className="w-12 bg-slate-700 border-slate-600 rounded p-0.5 text-xs text-white text-center"
                                        />
                                    </div>
                                    <span className="text-white">{currency}{calculateTax().toLocaleString()}</span>
                                </div>
                                <div className="border-t border-slate-700 pt-2 flex justify-between items-center">
                                    <span className="font-bold text-white">Total Amount</span>
                                    <span className="font-bold text-teal-400 text-xl">{currency}{calculateTotal().toLocaleString()}</span>
                                </div>
                            </div>
                        </div>

                        {/* Preview */}
                        <div className="relative">
                            <div id="invoice-content" className="bg-white text-slate-800 p-10 rounded-lg shadow-2xl min-h-[600px] text-sm">
                                <div className="flex justify-between items-start mb-12">
                                    <div>
                                        <div className="w-12 h-12 bg-teal-600 rounded-lg flex items-center justify-center text-white font-bold text-xl mb-4">A</div>
                                        <h1 className="text-4xl font-black text-slate-900 tracking-tighter mb-1">INVOICE</h1>
                                        <p className="text-slate-400 font-medium">Ref: #INV-{lead.id.substring(0,4)}-{Math.floor(Math.random() * 1000)}</p>
                                    </div>
                                    <div className="text-right">
                                        <h2 className="font-bold text-xl text-slate-900">Afrimmo Agency</h2>
                                        {businessAddress.split(',').map((line, i) => (
                                            <p key={i} className="text-slate-500">{line.trim()}</p>
                                        ))}
                                    </div>
                                </div>

                                <div className="mb-12 grid grid-cols-2 gap-8">
                                    <div>
                                        <p className="font-bold text-slate-400 text-[10px] uppercase tracking-widest mb-2">Billed To</p>
                                        <p className="font-bold text-xl text-slate-900">{lead.name}</p>
                                        <p className="text-slate-500">{lead.source} Customer</p>
                                        <p className="text-slate-500">ID: {lead.id}</p>
                                    </div>
                                    <div className="text-right flex flex-col items-end">
                                        <div className="mb-4">
                                            <p className="font-bold text-slate-400 text-[10px] uppercase tracking-widest mb-1">Date Issued</p>
                                            <p className="font-medium">{invoiceDate}</p>
                                        </div>
                                        <div>
                                            <p className="font-bold text-slate-400 text-[10px] uppercase tracking-widest mb-1">Due Date</p>
                                            <p className="font-bold text-rose-600">{dueDate}</p>
                                        </div>
                                    </div>
                                </div>

                                <table className="w-full mb-12">
                                    <thead>
                                        <tr className="border-b-2 border-slate-900">
                                            <th className="text-left py-4 font-bold text-slate-900 uppercase text-xs tracking-wider">Description</th>
                                            <th className="text-right py-4 font-bold text-slate-900 uppercase text-xs tracking-wider">Amount</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {invoiceItems.map(item => (
                                            <tr key={item.id}>
                                                <td className="py-4 text-slate-700 font-medium">{item.desc}</td>
                                                <td className="py-4 text-right text-slate-900 font-bold">{currency}{item.amount.toLocaleString()}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>

                                <div className="flex justify-end mb-12">
                                    <div className="w-64 space-y-3">
                                        <div className="flex justify-between text-slate-500">
                                            <span>Subtotal</span>
                                            <span>{currency}{calculateSubtotal().toLocaleString()}</span>
                                        </div>
                                        <div className="flex justify-between text-slate-500">
                                            <span>VAT ({taxRate}%)</span>
                                            <span>{currency}{calculateTax().toLocaleString()}</span>
                                        </div>
                                        <div className="pt-3 border-t-2 border-slate-900 flex justify-between items-center">
                                            <span className="font-black text-slate-900 uppercase tracking-tighter">Total Due</span>
                                            <span className="font-black text-2xl text-slate-900">{currency}{calculateTotal().toLocaleString()}</span>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="bg-slate-50 p-6 rounded-xl mb-12">
                                    <p className="font-bold text-slate-400 text-[10px] uppercase tracking-widest mb-2">Payment Instructions</p>
                                    <p className="text-slate-700 font-medium whitespace-pre-wrap">{bankDetails}</p>
                                </div>

                                <div className="pt-8 border-t border-slate-100 text-center text-slate-400 text-[10px] font-medium uppercase tracking-widest">
                                    <p>Afrimmo AI Digital Document • Authorized Electronic Invoice</p>
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
