import React from 'react';
import { Shield, Sparkles, CheckCircle2, Lock, ArrowUpRight } from 'lucide-react';
import { CircuitExecutionStage } from '../hooks/useMidnight';

interface CircuitExecutionModalProps {
  isOpen: boolean;
  stage: CircuitExecutionStage;
  amount?: number;
}

export const CircuitExecutionModal: React.FC<CircuitExecutionModalProps> = ({
  isOpen,
  stage,
  amount = 100,
}) => {
  if (!isOpen || stage === 'idle') return null;

  const steps = [
    {
      id: 'generating_witness',
      title: 'Generating ZK Witness & Nullifier',
      description: 'Deriving private contribution witness & 32-byte anti-replay nullifier in local browser memory.',
      isActive: stage === 'generating_witness',
      isCompleted: stage === 'awaiting_signature' || stage === 'submitting' || stage === 'confirmed',
    },
    {
      id: 'awaiting_signature',
      title: 'Awaiting Lace Wallet Signature',
      description: 'Please approve the transaction prompt inside your Midnight Lace wallet extension.',
      isActive: stage === 'awaiting_signature',
      isCompleted: stage === 'submitting' || stage === 'confirmed',
    },
    {
      id: 'submitting',
      title: 'Submitting & Verifying On-Chain',
      description: 'Broadcasting ZK proof to Midnight Network nodes. Verifying zero-knowledge arithmetic constraints.',
      isActive: stage === 'submitting',
      isCompleted: stage === 'confirmed',
    },
  ];

  return (
    <div className="fixed inset-0 z-[100] bg-[#1C1917]/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-white rounded-3xl border border-[#EFEBE6] shadow-2xl p-6 sm:p-7 space-y-6 text-[#1C1917]">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-amber-100 text-[#ea580c] flex items-center justify-center shadow-inner relative">
            <Shield className="w-7 h-7" />
            <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-[#ea580c]"></span>
            </span>
          </div>
          <h3 className="text-lg font-black tracking-tight text-[#1C1917]">
            Processing ZK Contribution
          </h3>
          <p className="text-xs text-[#78716C]">
            Contributing <span className="font-bold text-[#ea580c] font-mono">${amount} tNIGHT</span> with Zero-Knowledge privacy
          </p>
        </div>

        {/* Steps Progress List */}
        <div className="space-y-4">
          {steps.map((step, idx) => (
            <div
              key={step.id}
              className={`p-4 rounded-2xl border transition-all ${
                step.isActive
                  ? 'bg-amber-50/80 border-amber-300 shadow-sm ring-2 ring-[#ea580c]/20'
                  : step.isCompleted
                  ? 'bg-emerald-50/70 border-emerald-200'
                  : 'bg-[#FAF8F5] border-[#EFEBE6] opacity-60'
              }`}
            >
              <div className="flex items-start gap-3">
                {step.isCompleted ? (
                  <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                ) : step.isActive ? (
                  <div className="w-6 h-6 rounded-full border-2 border-[#ea580c] border-t-transparent animate-spin shrink-0 mt-0.5" />
                ) : (
                  <div className="w-6 h-6 rounded-full bg-stone-200 text-stone-600 font-mono text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                    {idx + 1}
                  </div>
                )}

                <div className="space-y-0.5">
                  <h4 className={`text-xs font-extrabold ${step.isActive ? 'text-[#ea580c]' : step.isCompleted ? 'text-emerald-950' : 'text-[#78716C]'}`}>
                    {step.title}
                  </h4>
                  <p className="text-[11px] text-[#78716C] leading-snug">
                    {step.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Privacy Note */}
        <div className="p-3 rounded-xl bg-[#FAF8F5] border border-[#EFEBE6] flex items-center gap-2 text-[11px] text-[#78716C]">
          <Lock className="w-3.5 h-3.5 text-[#ea580c] shrink-0" />
          <span>No personal identifiers or raw private keys leave your device.</span>
        </div>
      </div>
    </div>
  );
};
