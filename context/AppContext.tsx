"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { 
  Track, 
  Enrollment, 
  UserProgress, 
  Certificate, 
  TRACKS, 
  MODULES 
} from "@/data/curriculum";
import { SupabaseUser, supabase } from "@/lib/supabase";
import { generateVerificationId } from "@/lib/utils";

interface AppContextType {
  user: SupabaseUser | null;
  enrollments: Enrollment[];
  progress: Record<string, UserProgress>;
  certificates: Certificate[];
  isAuthModalOpen: boolean;
  authModalMode: "login" | "signup";
  activeCheckoutTrack: Track | null;
  // Auth actions
  login: (email: string, password?: string, fullName?: string, turnstileToken?: string) => Promise<void>;
  signup: (email: string, password?: string, fullName?: string, turnstileToken?: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  openAuthModal: (mode?: "login" | "signup") => void;
  closeAuthModal: () => void;
  // Checkout & Enrollment
  handleEnrollClick: (track: Track) => Promise<void>;
  openCheckout: (track: Track) => void;
  closeCheckout: () => void;
  enrollTrack: (track: Track, transactionRef?: string) => Promise<void>;
  isEnrolled: (trackId: string) => boolean;
  // Progress & Quizzes
  getTrackProgress: (trackId: string) => { completedCount: number; totalCount: number; percentage: number };
  isModuleUnlocked: (trackId: string, moduleId: string) => boolean;
  isModuleCompleted: (trackId: string, moduleId: string) => boolean;
  recordQuizAttempt: (
    trackSlug: string,
    moduleId: string, 
    scorePercentage: number, 
    passed: boolean
  ) => { unlockedNext: boolean; earnedCertificate?: Certificate };
  // Certificates
  getCertificateById: (certId: string) => Certificate | undefined;
  getCertificateByTrackId: (trackId: string) => Certificate | undefined;
  refreshUserData: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  USER: "EduVox_user",
  ENROLLMENTS: "EduVox_enrollments",
  PROGRESS: "EduVox_progress",
  CERTIFICATES: "EduVox_certificates",
};

export const AppContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [progress, setProgress] = useState<Record<string, UserProgress>>({});
  const [certificates, setCertificates] = useState<Certificate[]>([]);

  // UI state modals
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<"login" | "signup">("login");
  const [activeCheckoutTrack, setActiveCheckoutTrack] = useState<Track | null>(null);

  // Sync with Supabase Auth & LocalStorage on mount
  useEffect(() => {
    // 1. Initial LocalStorage Cache Hydration
    try {
      const storedEnrollments = localStorage.getItem(STORAGE_KEYS.ENROLLMENTS);
      if (storedEnrollments) setEnrollments(JSON.parse(storedEnrollments));

      const storedProgress = localStorage.getItem(STORAGE_KEYS.PROGRESS);
      if (storedProgress) setProgress(JSON.parse(storedProgress));

      const storedCertificates = localStorage.getItem(STORAGE_KEYS.CERTIFICATES);
      if (storedCertificates) setCertificates(JSON.parse(storedCertificates));
    } catch (err) {
      console.warn("Could not access localStorage:", err);
    }

    // 2. [SUPABASE INTEGRATION POINT] Check Active Session
    supabase.auth
      .getSession()
      .then(({ data: { session } }) => {
        if (session?.user) {
          const currentUser: SupabaseUser = {
            id: session.user.id,
            email: session.user.email || "developer@EduVoxPro.dev",
            fullName:
              session.user.user_metadata?.full_name ||
              session.user.email?.split("@")[0] ||
              "Master Developer",
            avatarUrl: session.user.user_metadata?.avatar_url,
          };
          setUser(currentUser);
          localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(currentUser));
          syncUserDataFromSupabase(currentUser.id);
        } else {
          // No active Supabase session – clear any leftover auth state
          supabase.auth.signOut().catch(() => {});
          localStorage.removeItem(STORAGE_KEYS.USER);
          setUser(null);
        }
      })
      .catch(() => {
        // Supabase unreachable – keep unauthenticated state, app still works
        localStorage.removeItem(STORAGE_KEYS.USER);
        setUser(null);
      });

    // 3. [SUPABASE INTEGRATION POINT] Listen for Real-Time Auth State Changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        const loggedUser: SupabaseUser = {
          id: session.user.id,
          email: session.user.email || "developer@EduVoxPro.dev",
          fullName: session.user.user_metadata?.full_name || session.user.email?.split("@")[0] || "Master Developer",
          avatarUrl: session.user.user_metadata?.avatar_url,
        };
        setUser(loggedUser);
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(loggedUser));
        syncUserDataFromSupabase(loggedUser.id);
      } else if (_event === "SIGNED_OUT") {
        setUser(null);
        localStorage.removeItem(STORAGE_KEYS.USER);
      }
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  const syncUserDataFromSupabase = async (userId: string) => {
    try {
      const { data: dbEnrollments, error: errEnr } = await supabase
        .from("enrollments")
        .select("*")
        .eq("user_id", userId);

      if (!errEnr && dbEnrollments && dbEnrollments.length > 0) {
        const mappedEnrollments: Enrollment[] = dbEnrollments.map((e: any) => ({
          id: e.id,
          userId: e.user_id,
          trackId: e.track_id,
          enrolledAt: e.enrolled_at || e.created_at,
          status: e.status || "active",
          paymentReference: e.payment_reference || "VERIFIED",
          amountPaidINR: e.amount_paid_inr || 0,
        }));
        saveEnrollments(mappedEnrollments);
      }

      const { data: dbCertificates, error: errCert } = await supabase
        .from("certificates")
        .select("*")
        .eq("user_id", userId);

      if (!errCert && dbCertificates && dbCertificates.length > 0) {
        const mappedCerts: Certificate[] = dbCertificates.map((c: any) => ({
          id: c.id,
          verificationId: c.verification_id,
          trackId: c.track_id,
          userId: c.user_id,
          studentName: c.student_name,
          trackTitle: c.track_title,
          issueDate: c.issue_date,
          scoreAverage: c.score_average,
          skillsCertified: c.skills_certified || [],
          badgeRole: c.badge_role || "Certified Specialist",
          isFreeTrack: c.is_free_track || false,
        }));
        saveCertificates(mappedCerts);
      }
    } catch (err) {
      console.warn("[Supabase] Fallback to local cache:", err);
    }
  };

  const saveUserData = (newUser: SupabaseUser | null) => {
    setUser(newUser);
    if (newUser) {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(newUser));
    } else {
      localStorage.removeItem(STORAGE_KEYS.USER);
    }
  };

  const saveEnrollments = (newEnrollments: Enrollment[]) => {
    setEnrollments(newEnrollments);
    localStorage.setItem(STORAGE_KEYS.ENROLLMENTS, JSON.stringify(newEnrollments));
  };

  const saveProgress = (newProgress: Record<string, UserProgress>) => {
    setProgress(newProgress);
    localStorage.setItem(STORAGE_KEYS.PROGRESS, JSON.stringify(newProgress));
  };

  const saveCertificates = (newCertificates: Certificate[]) => {
    setCertificates(newCertificates);
    localStorage.setItem(STORAGE_KEYS.CERTIFICATES, JSON.stringify(newCertificates));
  };

  // Auth Functions
  const login = async (email: string, password?: string, fullName?: string, turnstileToken?: string) => {
    if (!password) {
      throw new Error("Password is required");
    }

    const verifyRes = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ turnstileToken: turnstileToken || "" }),
    });
    if (!verifyRes.ok) {
      const data = await verifyRes.json().catch(() => ({}));
      throw new Error(data.error || "Verification failed. Please try again.");
    }

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      throw error;
    }

    if (!data?.user) {
      throw new Error("Authentication failed: no user returned.");
    }

    const loggedUser: SupabaseUser = {
      id: data.user.id,
      email: data.user.email || email,
      fullName: data.user.user_metadata?.full_name || fullName || email.split("@")[0],
    };
    saveUserData(loggedUser);
    setIsAuthModalOpen(false);
  };

  const signup = async (email: string, password?: string, fullName?: string, turnstileToken?: string) => {
    if (!password) {
      throw new Error("Password is required");
    }

    const verifyRes = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ turnstileToken: turnstileToken || "" }),
    });
    if (!verifyRes.ok) {
      const data = await verifyRes.json().catch(() => ({}));
      throw new Error(data.error || "Verification failed. Please try again.");
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    });

    if (error) {
      throw error;
    }

    if (!data?.user) {
      throw new Error("Sign up failed: no user returned.");
    }

    const newUser: SupabaseUser = {
      id: data.user.id,
      email: data.user.email || email,
      fullName: fullName || "",
    };
    saveUserData(newUser);
    setIsAuthModalOpen(false);
  };

  const loginWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${typeof window !== "undefined" ? window.location.origin : ""}/auth/callback`,
      },
    });

    if (error) {
      throw error;
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    saveUserData(null);
    setEnrollments([]);
    setProgress({});
    setCertificates([]);
    localStorage.removeItem(STORAGE_KEYS.ENROLLMENTS);
    localStorage.removeItem(STORAGE_KEYS.PROGRESS);
    localStorage.removeItem(STORAGE_KEYS.CERTIFICATES);
  };

  const openAuthModal = (mode: "login" | "signup" = "login") => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => setIsAuthModalOpen(false);

  // Free vs Paid Enrollment Handling
  const handleEnrollClick = async (track: Track) => {
    if (!user) {
      openAuthModal("signup");
      return;
    }

    if (track.isFree || track.priceINR === 0) {
      // 100% Free Track: Bypasses payment completely, instant enrollment
      await enrollTrack(track, "100%_FREE_ENROLLMENT");
    } else {
      // Paid Track: Open Direct UPI Order Summary Modal
      setActiveCheckoutTrack(track);
    }
  };

  const openCheckout = (track: Track) => {
    if (!user) {
      openAuthModal("signup");
      return;
    }
    setActiveCheckoutTrack(track);
  };

  const closeCheckout = () => setActiveCheckoutTrack(null);

  const enrollTrack = async (track: Track, transactionRef = "FREE_VERIFIED") => {
    if (!user) return;

    const newEnrollment: Enrollment = {
      id: `enr_local_${Date.now().toString(36)}`,
      userId: user.id,
      trackId: track.id,
      enrolledAt: new Date().toISOString(),
      status: "active",
      paymentReference: transactionRef,
      amountPaidINR: track.priceINR,
    };

    // [SUPABASE INTEGRATION POINT] Persist in database (omit id to match DB default type)
    try {
      await supabase.from("enrollments").insert({
        user_id: user.id,
        track_id: track.id,
        status: "active",
        payment_reference: transactionRef,
        amount_paid_inr: track.priceINR,
        enrolled_at: newEnrollment.enrolledAt,
      });
    } catch {
      // Supabase persistence failed; local state is authoritative for this session.
    }

    const updatedEnrollments = [...enrollments.filter(e => e.trackId !== track.id), newEnrollment];
    saveEnrollments(updatedEnrollments);

    // Initialize track progress - unlock module 1 by default
    const trackModules = MODULES[track.slug] || [];
    const firstModuleId = trackModules[0]?.id || "";

    const updatedProgress = {
      ...progress,
      [track.id]: {
        userId: user.id,
        trackId: track.id,
        completedModuleIds: [],
        quizScores: {},
        unlockedModuleIds: firstModuleId ? [firstModuleId] : [],
        lastActiveModuleId: firstModuleId,
      },
    };
    saveProgress(updatedProgress);

    closeCheckout();
  };

  const isEnrolled = (trackId: string): boolean => {
    return enrollments.some(e => e.trackId === trackId);
  };

  const getTrackProgress = (trackId: string) => {
    const track = TRACKS.find(t => t.id === trackId);
    if (!track) return { completedCount: 0, totalCount: 0, percentage: 0 };
    
    const trackModules = MODULES[track.slug] || [];
    const totalCount = trackModules.length;
    const trackProg = progress[trackId];
    const completedCount = trackProg?.completedModuleIds?.length || 0;
    const percentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

    return { completedCount, totalCount, percentage };
  };

  const isModuleUnlocked = (trackId: string, moduleId: string): boolean => {
    const trackProg = progress[trackId];
    if (!trackProg) {
      const track = TRACKS.find(t => t.id === trackId);
      if (track && isEnrolled(trackId)) {
        const firstMod = MODULES[track.slug]?.[0];
        return firstMod?.id === moduleId;
      }
      return false;
    }
    return trackProg.unlockedModuleIds?.includes(moduleId) || false;
  };

  const isModuleCompleted = (trackId: string, moduleId: string): boolean => {
    return progress[trackId]?.completedModuleIds?.includes(moduleId) || false;
  };

  const recordQuizAttempt = (
    trackSlug: string,
    moduleId: string, 
    scorePercentage: number, 
    passed: boolean
  ) => {
    const track = TRACKS.find(t => t.slug === trackSlug);
    if (!track || !user) return { unlockedNext: false };

    const trackModules = MODULES[trackSlug] || [];
    const currentModuleIndex = trackModules.findIndex(m => m.id === moduleId);
    const existingProg = progress[track.id] || {
      userId: user.id,
      trackId: track.id,
      completedModuleIds: [],
      quizScores: {},
      unlockedModuleIds: [trackModules[0]?.id || ""],
      lastActiveModuleId: moduleId,
    };

    const newScores = {
      ...existingProg.quizScores,
      [moduleId]: scorePercentage,
    };

    let newCompleted = [...existingProg.completedModuleIds];
    let newUnlocked = [...existingProg.unlockedModuleIds];
    let unlockedNext = false;
    let earnedCert: Certificate | undefined = undefined;

    if (passed) {
      if (!newCompleted.includes(moduleId)) {
        newCompleted.push(moduleId);
      }

      // Check for next module unlock
      if (currentModuleIndex >= 0 && currentModuleIndex + 1 < trackModules.length) {
        const nextModId = trackModules[currentModuleIndex + 1].id;
        if (!newUnlocked.includes(nextModId)) {
          newUnlocked.push(nextModId);
          unlockedNext = true;
        }
      }

      // If all modules completed, generate certificate!
      if (newCompleted.length >= trackModules.length) {
        const existingCert = certificates.find(c => c.trackId === track.id && c.userId === user.id);
        if (!existingCert) {
          const avgScore = Math.round(
            Object.values(newScores).reduce((a, b) => a + b, 0) / Object.values(newScores).length
          );

          earnedCert = {
            id: `cert_${Date.now().toString(36)}`,
            verificationId: generateVerificationId(track.slug, user.id),
            trackId: track.id,
            userId: user.id,
            studentName: user.fullName || "Alex Rivera",
            trackTitle: track.title,
            issueDate: new Date().toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            }),
            scoreAverage: avgScore || 92,
            skillsCertified: track.skillsCovered,
            badgeRole: track.roleBadge,
            isFreeTrack: track.isFree,
          };

          const updatedCertificates = [...certificates, earnedCert];
          saveCertificates(updatedCertificates);

          // [SUPABASE INTEGRATION POINT] Persist certificate in Supabase table
          try {
            supabase.from("certificates").insert({
              id: earnedCert.id,
              verification_id: earnedCert.verificationId,
              track_id: track.id,
              user_id: user.id,
              student_name: earnedCert.studentName,
              track_title: earnedCert.trackTitle,
              issue_date: earnedCert.issueDate,
              score_average: earnedCert.scoreAverage,
              skills_certified: earnedCert.skillsCertified,
              badge_role: earnedCert.badgeRole,
              is_free_track: track.isFree,
            });
        } catch {
          // Supabase persistence failed; certificate remains in local state.
        }

          // Update enrollment status to completed
          const updatedEnrollments = enrollments.map(e => 
            e.trackId === track.id ? { ...e, status: "completed" as const } : e
          );
          saveEnrollments(updatedEnrollments);
        } else {
          earnedCert = existingCert;
        }
      }
    }

    const updatedTrackProg: UserProgress = {
      ...existingProg,
      completedModuleIds: newCompleted,
      unlockedModuleIds: newUnlocked,
      quizScores: newScores,
      lastActiveModuleId: moduleId,
    };

    saveProgress({
      ...progress,
      [track.id]: updatedTrackProg,
    });

    return { unlockedNext, earnedCertificate: earnedCert };
  };

  const getCertificateById = (certId: string): Certificate | undefined => {
    return certificates.find(c => c.id === certId || c.verificationId === certId);
  };

  const getCertificateByTrackId = (trackId: string): Certificate | undefined => {
    return certificates.find(c => c.trackId === trackId);
  };

  const refreshUserData = async () => {
    if (!user) return;
    await syncUserDataFromSupabase(user.id);
  };

  return (
    <AppContext.Provider
      value={{
        user,
        enrollments,
        progress,
        certificates,
        isAuthModalOpen,
        authModalMode,
        activeCheckoutTrack,
        login,
        signup,
        loginWithGoogle,
        logout,
        openAuthModal,
        closeAuthModal,
        handleEnrollClick,
        openCheckout,
        closeCheckout,
        enrollTrack,
        isEnrolled,
        getTrackProgress,
        isModuleUnlocked,
        isModuleCompleted,
        recordQuizAttempt,
        getCertificateById,
        getCertificateByTrackId,
        refreshUserData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppContextProvider");
  }
  return context;
};

