
import React from 'react';
import { SparklesIcon, CheckIcon } from '../IconComponents';

interface LeadAIInsightProps {
    justification: string;
    nextAction: string;
}

const LeadAIInsight: React.FC<LeadAIInsightProps> = ({ justification, nextAction }) => {
    return (
        <div className="bg-gradient-to-br from-emerald-900/20 to-slate-900 border border-emerald-500/20 rounded-xl p-5 mb-6 shadow-lg shadow-emerald-900/10">
            <h3 className="text-sm font-bold text-emerald-400 mb-3 flex items-center uppercase tracking-wider">
                <SparklesIcon className="w-4 h-4 mr-2"/> AI Lead Analysis
            </h3>
            <p className="text-slate-300 text-sm leading-relaxed mb-4">
                {justification || "Insufficient data for analysis."}
            </p>
            <div className="bg-slate-950/50 p-3 rounded-lg border border-emerald-500/10 flex items-start gap-3">
                <div className="mt-0.5 text-emerald-500"><CheckIcon className="w-4 h-4"/></div>
                <div>
                    <p className="text-[10px] text-slate-500 font-bold uppercase">Recommended Action</p>
                    <p className="text-white text-sm font-medium">{nextAction || "Gather more requirements."}</p>
                </div>
            </div>
        </div>
    );
};

export default LeadAIInsight;
