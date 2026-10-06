import React, { useState, useEffect } from 'react';
import { Bot, CheckCircle2, Loader2, Cpu, Sparkles } from 'lucide-react';

export default function AIExecutionModal({ isOpen, steps = [], onComplete }) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const defaultStepLabels = [
    "Checking vehicle availability across dates",
    "Comparing daily rental prices & budgets",
    "Matching passenger capacity & seating",
    "Analyzing vehicle body types & specifications",
    "Calculating multi-factor compatibility scores",
    "Selecting top recommendation & alternative options"
  ];

  useEffect(() => {
    if (isOpen) {
      setCurrentStepIndex(0);
      const interval = setInterval(() => {
        setCurrentStepIndex((prev) => {
          if (prev >= defaultStepLabels.length - 1) {
            clearInterval(interval);
            setTimeout(() => {
              if (onComplete) onComplete();
            }, 600);
            return prev;
          }
          return prev + 1;
        });
      }, 700);

      return () => clearInterval(interval);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-950/80 backdrop-blur-md p-4">
      <div className="bg-gray-900 border border-gray-800 rounded-3xl p-8 max-w-lg w-full shadow-2xl space-y-6">
        
        <div className="flex items-center gap-4 border-b border-gray-800 pb-5">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 p-0.5 shadow-xl shadow-blue-500/20 ai-pulse">
            <div className="w-full h-full bg-gray-950 rounded-[14px] flex items-center justify-center">
              <Bot className="w-8 h-8 text-blue-400 animate-bounce" />
            </div>
          </div>
          <div>
            <h3 className="text-xl font-extrabold text-white font-outfit">AI Agent Executing</h3>
            <p className="text-sm text-gray-400">Analyzing requirements with 6 tools</p>
          </div>
        </div>

        <div className="space-y-3">
          {defaultStepLabels.map((label, idx) => {
            const isDone = idx < currentStepIndex;
            const isCurrent = idx === currentStepIndex;
            return (
              <div
                key={idx}
                className={`flex items-center gap-3.5 p-3 rounded-xl border transition-all duration-300 ${
                  isDone
                    ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-300'
                    : isCurrent
                    ? 'bg-blue-950/50 border-blue-500/50 text-blue-200 shadow-md'
                    : 'bg-gray-950/40 border-gray-800/40 text-gray-600'
                }`}
              >
                {isDone ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                ) : isCurrent ? (
                  <Loader2 className="w-5 h-5 text-blue-400 animate-spin shrink-0" />
                ) : (
                  <div className="w-5 h-5 rounded-full border border-gray-700 shrink-0" />
                )}
                <span className="text-sm font-semibold">{label}</span>
              </div>
            );
          })}
        </div>

        <div className="pt-2 text-center text-xs text-gray-500 flex items-center justify-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Generating transparent scoring breakdown & reasoning...</span>
        </div>

      </div>
    </div>
  );
}
