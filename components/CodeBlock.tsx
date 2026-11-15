"use client";

import React, { useState } from "react";
import { Check, Copy, Terminal } from "lucide-react";

interface CodeBlockProps {
  code: string;
  language?: string;
  filename?: string;
  explanation?: string;
}

export const CodeBlock: React.FC<CodeBlockProps> = ({
  code,
  language = "typescript",
  filename,
  explanation,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.warn("Failed to copy code to clipboard", err);
    }
  };

  const lines = code.trim().split("\n");
  const ext = language === "typescript" ? "ts" : language === "python" ? "py" : language;

  return (
    <div className="my-6 rounded-xl border border-slate-200 bg-slate-900 shadow-lg overflow-hidden font-mono text-xs sm:text-sm">
      {/* Code Header Bar — light surface */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-white border-b border-slate-200">
        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
            <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
          </div>
          <span className="text-slate-600 font-sans text-xs font-medium pl-1 flex items-center gap-1.5">
            <Terminal className="w-3.5 h-3.5 text-accent-cyan" />
            {filename || `example.${ext}`}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
            {language}
          </span>
          <button
            onClick={handleCopy}
            className="flex items-center gap-1 px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors text-xs font-sans border border-slate-200"
            title="Copy code to clipboard"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-accent-emerald" />
                <span className="text-accent-emerald font-semibold">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-slate-500" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Code Body — intentionally dark terminal */}
      <div className="p-4 overflow-x-auto text-slate-200 leading-relaxed">
        <pre className="flex">
          <span className="select-none pr-4 text-slate-600 text-right min-w-[2.2rem] border-r border-slate-700">
            {lines.map((_, i) => (
              <span key={i} className="block leading-relaxed">
                {i + 1}
              </span>
            ))}
          </span>
          <code className="pl-4 font-mono leading-relaxed block flex-1">
            {lines.map((line, i) => (
              <span key={i} className="block leading-relaxed whitespace-pre">
                {line || " "}
              </span>
            ))}
          </code>
        </pre>
      </div>

      {/* Explanation footnote */}
      {explanation && (
        <div className="px-4 py-2 bg-slate-800 border-t border-slate-700 text-xs font-sans text-slate-400 italic">
          💡 {explanation}
        </div>
      )}
    </div>
  );
};
