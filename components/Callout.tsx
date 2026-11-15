"use client";

import React from "react";
import { Lightbulb, Cpu, ShieldAlert, Sparkles } from "lucide-react";
import { CalloutType } from "@/data/curriculum";

interface CalloutProps {
  type: CalloutType;
  title: string;
  message: string;
}

export const Callout: React.FC<CalloutProps> = ({ type, title, message }) => {
  const configs = {
    "tip": {
      icon: Lightbulb,
      border: "border-sky-300",
      bg: "bg-sky-50",
      iconColor: "text-sky-700",
      titleColor: "text-sky-950",
      badge: "PRO TIP",
      badgeStyle: "bg-sky-100 text-sky-800 border-sky-300",
    },
    "warning": {
      icon: ShieldAlert,
      border: "border-amber-300",
      bg: "bg-amber-50",
      iconColor: "text-amber-700",
      titleColor: "text-amber-950",
      badge: "SECURITY WARNING",
      badgeStyle: "bg-amber-100 text-amber-800 border-amber-300",
    },
    "architecture": {
      icon: Cpu,
      border: "border-indigo-300",
      bg: "bg-indigo-50",
      iconColor: "text-indigo-700",
      titleColor: "text-indigo-950",
      badge: "SYSTEM ARCHITECTURE",
      badgeStyle: "bg-indigo-100 text-indigo-800 border-indigo-300",
    },
    "pro-tip": {
      icon: Sparkles,
      border: "border-emerald-300",
      bg: "bg-emerald-50",
      iconColor: "text-emerald-700",
      titleColor: "text-emerald-950",
      badge: "PRODUCTION INSIGHT",
      badgeStyle: "bg-emerald-100 text-emerald-800 border-emerald-300",
    },
  };

  const config = configs[type] || configs["tip"];
  const Icon = config.icon;

  return (
    <div className={`my-5 rounded-xl border ${config.border} ${config.bg} p-4.5 shadow-xs`}>
      <div className="flex items-start gap-3">
        <div className={`p-1.5 rounded-lg bg-white ${config.iconColor} shrink-0 mt-0.5 border border-slate-200 shadow-xs`}>
          <Icon className="w-4 h-4" />
        </div>
        <div className="space-y-1 flex-1">
          <div className="flex items-center gap-2">
            <span className={`text-[10px] font-mono uppercase font-bold tracking-wider px-1.5 py-0.5 rounded border ${config.badgeStyle}`}>
              {config.badge}
            </span>
            <h4 className={`text-sm font-bold ${config.titleColor}`}>
              {title}
            </h4>
          </div>
          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed pt-0.5">
            {message}
          </p>
        </div>
      </div>
    </div>
  );
};
