"use client";

import React, { useState } from "react";
import { Cpu, Maximize2, Minimize2, Image as ImageIcon, ArrowRight, RefreshCw, Zap, Sparkles } from "lucide-react";

interface ArchitectureDiagramProps {
  title: string;
  description: string;
  caption: string;
  svgVariant?: "agent-loop" | "rag-pipeline" | "microservices" | "llm-orchestrator";
  imageUrl?: string;
}

export const ArchitectureDiagram: React.FC<ArchitectureDiagramProps> = ({
  title,
  description,
  caption,
  svgVariant = "agent-loop",
  imageUrl,
}) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <figure className="my-7 rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm transition-all">
      {/* Diagram Top Bar */}
      <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1 rounded bg-indigo-50 text-accent-indigo border border-indigo-200">
            <Cpu className="w-4 h-4" />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-900">{title}</span>
            <p className="text-[11px] text-slate-500 hidden sm:block">{description}</p>
          </div>
        </div>

        <button
          onClick={() => setExpanded(!expanded)}
          className="p-1.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 text-slate-600 text-xs flex items-center gap-1 transition-colors shadow-xs"
          title={expanded ? "Collapse diagram" : "Expand diagram"}
        >
          {expanded ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          <span className="hidden sm:inline font-medium">{expanded ? "Compact" : "Expand"}</span>
        </button>
      </div>

      {/* Visual Canvas Area */}
      <div className={`p-6 flex items-center justify-center bg-slate-50/70 border-b border-slate-100 ${expanded ? "min-h-[440px]" : "min-h-[280px]"}`}>
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={`${title}: ${description}`}
            className="max-h-[400px] w-auto object-contain rounded-xl shadow-md border border-slate-200"
          />
        ) : (
          <div className="w-full max-w-3xl">
            {svgVariant === "agent-loop" && (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3 relative">
                <div className="p-4 rounded-xl border border-sky-200 bg-white text-center shadow-xs">
                  <div className="w-8 h-8 mx-auto mb-2 rounded-lg bg-sky-50 text-sky-700 flex items-center justify-center border border-sky-200">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div className="text-[10px] font-mono uppercase text-sky-700 font-bold">Phase 1</div>
                  <div className="text-xs font-bold text-slate-900 mt-0.5">Perception</div>
                  <p className="text-[11px] text-slate-500 mt-1">Goal parsing & context stack</p>
                </div>

                <div className="p-4 rounded-xl border border-indigo-200 bg-white text-center shadow-xs">
                  <div className="w-8 h-8 mx-auto mb-2 rounded-lg bg-indigo-50 text-accent-indigo flex items-center justify-center border border-indigo-200">
                    <Cpu className="w-4 h-4" />
                  </div>
                  <div className="text-[10px] font-mono uppercase text-accent-indigo font-bold">Phase 2</div>
                  <div className="text-xs font-bold text-slate-900 mt-0.5">Thought & Plan</div>
                  <p className="text-[11px] text-slate-500 mt-1">ReAct reasoning & tool schema</p>
                </div>

                <div className="p-4 rounded-xl border border-amber-200 bg-white text-center shadow-xs">
                  <div className="w-8 h-8 mx-auto mb-2 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center border border-amber-200">
                    <Zap className="w-4 h-4" />
                  </div>
                  <div className="text-[10px] font-mono uppercase text-amber-700 font-bold">Phase 3</div>
                  <div className="text-xs font-bold text-slate-900 mt-0.5">Action Dispatch</div>
                  <p className="text-[11px] text-slate-500 mt-1">Sandboxed API / code execution</p>
                </div>

                <div className="p-4 rounded-xl border border-emerald-200 bg-white text-center shadow-xs">
                  <div className="w-8 h-8 mx-auto mb-2 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-200">
                    <RefreshCw className="w-4 h-4 animate-spin text-emerald-700" style={{ animationDuration: "12s" }} />
                  </div>
                  <div className="text-[10px] font-mono uppercase text-emerald-700 font-bold">Phase 4</div>
                  <div className="text-xs font-bold text-slate-900 mt-0.5">Observation Loop</div>
                  <p className="text-[11px] text-slate-500 mt-1">Evaluate outputs vs objective</p>
                </div>
              </div>
            )}

            {svgVariant === "rag-pipeline" && (
              <div className="space-y-3">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 rounded-xl border border-slate-200 bg-white shadow-xs">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-sky-50 text-sky-800 font-bold text-xs border border-sky-200">Query</div>
                    <div>
                      <div className="text-xs font-bold text-slate-900">Query Vectorization</div>
                      <div className="text-[11px] text-slate-500">Dense Embeddings (1536d)</div>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400 hidden sm:block" />
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-indigo-50 text-indigo-800 font-bold text-xs border border-indigo-200">Hybrid</div>
                    <div>
                      <div className="text-xs font-bold text-slate-900">BM25 + Dense Cosine (RRF)</div>
                      <div className="text-[11px] text-slate-500">Top-20 candidate retrieval</div>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400 hidden sm:block" />
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-emerald-50 text-emerald-800 font-bold text-xs border border-emerald-200">Rerank</div>
                    <div>
                      <div className="text-xs font-bold text-slate-900">Cross-Encoder Top-5</div>
                      <div className="text-[11px] text-slate-500">Context injected with citations</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {svgVariant === "microservices" && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center">
                <div className="p-4 rounded-xl border border-slate-200 bg-white shadow-xs">
                  <div className="text-xs font-bold text-sky-700">Edge Middleware</div>
                  <p className="text-[11px] text-slate-500 mt-1">Multi-region JWT verification</p>
                </div>
                <div className="p-4 rounded-xl border border-slate-200 bg-white shadow-xs">
                  <div className="text-xs font-bold text-accent-indigo">Next.js RSC Pipeline</div>
                  <p className="text-[11px] text-slate-500 mt-1">Zero-JS server execution stream</p>
                </div>
                <div className="p-4 rounded-xl border border-slate-200 bg-white shadow-xs">
                  <div className="text-xs font-bold text-emerald-700">Supabase PostgreSQL</div>
                  <p className="text-[11px] text-slate-500 mt-1">Kernel Row-Level Security</p>
                </div>
              </div>
            )}

            {svgVariant === "llm-orchestrator" && (
              <div className="p-5 rounded-xl border border-indigo-200 bg-indigo-50/50 flex flex-col sm:flex-row items-center justify-around gap-4 text-center">
                <div className="p-3 rounded-lg bg-white border border-slate-200 shadow-xs">
                  <span className="text-xs font-bold text-slate-900">Supervisor Router</span>
                  <div className="text-[10px] text-accent-indigo font-bold mt-1">State Machine Dispatcher</div>
                </div>
                <ArrowRight className="w-4 h-4 text-indigo-400 rotate-90 sm:rotate-0" />
                <div className="space-y-2">
                  <div className="px-3 py-1.5 rounded-md bg-white border border-slate-200 text-xs font-mono text-slate-700 shadow-xs">
                    Agent A (Code Auditor)
                  </div>
                  <div className="px-3 py-1.5 rounded-md bg-white border border-slate-200 text-xs font-mono text-slate-700 shadow-xs">
                    Agent B (Security Gate)
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-emerald-400 rotate-90 sm:rotate-0" />
                <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-300">
                  <span className="text-xs font-bold text-emerald-800">Human Approver (HITL)</span>
                  <div className="text-[10px] text-emerald-700 mt-1 font-semibold">Resume on Approval</div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Asset Swap Note & Caption */}
      <figcaption className="px-4 py-2.5 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between text-xs text-slate-500 gap-1.5">
        <span className="font-semibold text-slate-700">{caption}</span>
        <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1">
          <ImageIcon className="w-3 h-3 text-accent-indigo" />
          Asset swap ready (`imageUrl` prop)
        </span>
      </figcaption>
    </figure>
  );
};
