"use client";

import React, { useState } from "react";
import Link from "next/link";
import confetti from "canvas-confetti";
import { 
  Quiz, 
  Certificate 
} from "@/data/curriculum";
import { useApp } from "@/context/AppContext";
import { 
  CheckCircle2, 
  XCircle, 
  Award, 
  ArrowRight, 
  RotateCcw, 
  Sparkles, 
  ShieldCheck, 
  HelpCircle,
  AlertCircle
} from "lucide-react";

interface QuizModuleProps {
  quiz: Quiz;
  trackSlug: string;
  isCompleted: boolean;
  onModuleUnlocked?: () => void;
}

export const QuizModule: React.FC<QuizModuleProps> = ({
  quiz,
  trackSlug,
  isCompleted,
  onModuleUnlocked,
}) => {
  const { recordQuizAttempt } = useApp();
  
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [scorePercentage, setScorePercentage] = useState<number | null>(null);
  const [passed, setPassed] = useState(isCompleted);
  const [earnedCertificate, setEarnedCertificate] = useState<Certificate | null>(null);

  const totalQuestions = quiz.questions.length;
  const allAnswered = Object.keys(selectedAnswers).length === totalQuestions;

  const handleSelectOption = (qIndex: number, optionIndex: number) => {
    if (isSubmitted && passed) return;
    setSelectedAnswers(prev => ({ ...prev, [qIndex]: optionIndex }));
  };

  const triggerCelebration = () => {
    try {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: ["#4F46E5", "#0284C7", "#059669", "#7C3AED"],
      });
    } catch (e) {
      // safe fallback
    }
  };

  const handleSubmitQuiz = () => {
    let correctCount = 0;
    quiz.questions.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correctIndex) {
        correctCount++;
      }
    });

    const calculatedScore = Math.round((correctCount / totalQuestions) * 100);
    const hasPassed = calculatedScore >= quiz.passingScorePercentage;

    setScorePercentage(calculatedScore);
    setIsSubmitted(true);
    setPassed(hasPassed);

    const result = recordQuizAttempt(trackSlug, quiz.moduleId, calculatedScore, hasPassed);

    if (hasPassed) {
      triggerCelebration();
      if (result.earnedCertificate) {
        setEarnedCertificate(result.earnedCertificate);
      }
      if (onModuleUnlocked) {
        onModuleUnlocked();
      }
    }
  };

  const handleRetry = () => {
    setSelectedAnswers({});
    setIsSubmitted(false);
    setScorePercentage(null);
  };

  return (
    <div className="my-10 rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-card relative overflow-hidden">
      {/* Subtle background accent */}
      <div className="absolute top-0 right-0 w-72 h-72 bg-indigo-50 rounded-full blur-3xl pointer-events-none opacity-60" />

      {/* ─── Header ─── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[10px] font-mono uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-indigo-50 text-accent-indigo border border-indigo-200">
              PROGRESSION GATE (5 QUESTIONS)
            </span>
            <span className="text-xs text-slate-500 font-mono">
              Passing threshold: {quiz.passingScorePercentage}% (4 of 5 required)
            </span>
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-slate-900 mt-1">
            {quiz.title}
          </h3>
        </div>

        {isCompleted && !scorePercentage && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold">
            <CheckCircle2 className="w-4 h-4" />
            <span>Mastery Verified</span>
          </div>
        )}
      </div>

      {/* ─── Questions Stack ─── */}
      <div className="space-y-8 py-6">
        {quiz.questions.map((question, qIdx) => {
          const selectedOption = selectedAnswers[qIdx];
          const isCorrect = isSubmitted && selectedOption === question.correctIndex;
          const isWrong = isSubmitted && selectedOption !== undefined && selectedOption !== question.correctIndex;

          return (
            <div key={question.id} className="space-y-3">
              {/* Question Prompt */}
              <div className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-lg bg-slate-100 border border-slate-200 text-xs font-mono font-bold text-slate-600 flex items-center justify-center shrink-0 mt-0.5">
                  {qIdx + 1}
                </span>
                <div className="space-y-2 flex-1">
                  <h4 className="text-sm sm:text-base font-semibold text-slate-900 leading-snug">
                    {question.prompt}
                  </h4>
                  {question.codeSnippet && (
                    <pre className="p-3 rounded-lg bg-slate-900 border border-slate-700 text-xs font-mono text-emerald-400 overflow-x-auto">
                      <code>{question.codeSnippet}</code>
                    </pre>
                  )}
                </div>
              </div>

              {/* Options */}
              <div className="grid grid-cols-1 gap-2.5 pl-9">
                {question.options.map((option, optIdx) => {
                  const isSelected = selectedOption === optIdx;
                  let optionStyles = "border-slate-200 bg-white hover:bg-slate-50 text-slate-700 cursor-pointer";

                  if (isSubmitted) {
                    if (optIdx === question.correctIndex) {
                      optionStyles = "border-emerald-300 bg-emerald-50 text-emerald-900 font-medium";
                    } else if (isSelected && optIdx !== question.correctIndex) {
                      optionStyles = "border-red-300 bg-red-50 text-red-800";
                    } else {
                      optionStyles = "border-slate-100 bg-slate-50 text-slate-400 opacity-60";
                    }
                  } else if (isSelected) {
                    optionStyles = "border-accent-indigo bg-indigo-50 text-accent-indigo font-medium shadow-sm";
                  }

                  return (
                    <button
                      key={optIdx}
                      type="button"
                      disabled={isSubmitted && passed}
                      onClick={() => handleSelectOption(qIdx, optIdx)}
                      className={`w-full text-left p-3.5 rounded-xl border text-xs sm:text-sm transition-all flex items-center justify-between gap-3 ${optionStyles}`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-5 h-5 rounded-md border border-slate-300 flex items-center justify-center text-[10px] font-mono text-slate-500 shrink-0">
                          {String.fromCharCode(65 + optIdx)}
                        </span>
                        <span>{option}</span>
                      </div>

                      {isSubmitted && optIdx === question.correctIndex && (
                        <CheckCircle2 className="w-4 h-4 text-accent-emerald shrink-0" />
                      )}
                      {isSubmitted && isSelected && optIdx !== question.correctIndex && (
                        <XCircle className="w-4 h-4 text-red-500 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Explanation after submit */}
              {isSubmitted && (
                <div className="ml-9 p-3 rounded-xl bg-sky-50 border border-sky-200 text-xs text-slate-700 leading-relaxed">
                  <span className="font-bold text-accent-cyan flex items-center gap-1 mb-1">
                    <HelpCircle className="w-3.5 h-3.5" /> Explanation:
                  </span>
                  {question.explanation}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* ─── Results Bar ─── */}
      <div className="pt-6 border-t border-slate-200 space-y-4">
        {isSubmitted ? (
          <div className="space-y-4">
            <div className={`p-4 rounded-xl border flex flex-col sm:flex-row items-center justify-between gap-3 ${
              passed 
                ? "border-emerald-300 bg-emerald-50 text-emerald-800" 
                : "border-red-300 bg-red-50 text-red-800"
            }`}>
              <div className="flex items-center gap-3">
                {passed ? (
                  <CheckCircle2 className="w-6 h-6 text-accent-emerald shrink-0" />
                ) : (
                  <AlertCircle className="w-6 h-6 text-red-500 shrink-0" />
                )}
                <div>
                  <div className="font-bold text-sm">
                    {passed ? "Module Mastered & Subsequent Content Unlocked!" : "Mastery Score Not Reached"}
                  </div>
                  <div className="text-xs opacity-90">
                    You scored <strong className="font-mono">{scorePercentage}%</strong> ({passed ? "Requirement satisfied: ≥80%" : "Requires ≥80% (4 of 5 correct) to unlock next module"}).
                  </div>
                </div>
              </div>

              {!passed && (
                <button
                  onClick={handleRetry}
                  className="px-4 py-2 rounded-xl bg-white hover:bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Retry Quiz</span>
                </button>
              )}
            </div>

            {/* Certificate Earned */}
            {earnedCertificate && (
              <div className="p-5 rounded-2xl border border-emerald-300 bg-gradient-to-r from-emerald-50 to-indigo-50 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-emerald-100 text-accent-emerald flex items-center justify-center shrink-0 border border-emerald-200">
                    <Award className="w-7 h-7" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-accent-emerald font-bold">
                      ALL MODULES COMPLETE
                    </span>
                    <h4 className="text-base font-bold text-slate-900">
                      Your Official Certificate of Mastery is Ready!
                    </h4>
                    <p className="text-xs text-slate-600">
                      Verification ID: <span className="font-mono text-accent-cyan font-bold">{earnedCertificate.verificationId}</span>
                    </p>
                  </div>
                </div>

                <Link
                  href={`/certificate/${earnedCertificate.id}`}
                  className="py-2.5 px-5 rounded-xl bg-gradient-to-r from-accent-emerald to-teal-500 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-emerald-200 hover:scale-105 transition-all"
                >
                  <Sparkles className="w-4 h-4 fill-current" />
                  <span>View & Claim Certificate</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="text-xs text-slate-500">
              {allAnswered 
                ? "All 5 questions answered. Ready to verify mastery." 
                : `Answer all 5 questions to submit (${Object.keys(selectedAnswers).length}/5 selected).`}
            </div>

            <button
              type="button"
              disabled={!allAnswered}
              onClick={handleSubmitQuiz}
              className="w-full sm:w-auto py-2.5 px-6 rounded-xl bg-gradient-to-r from-accent-indigo to-indigo-700 hover:from-indigo-500 hover:to-indigo-800 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-indigo-200 transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Submit & Check Mastery</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
