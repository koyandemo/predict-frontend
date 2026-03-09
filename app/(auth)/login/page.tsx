"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Users, MessageCircle, TrendingUp } from "lucide-react";
import Image from "next/image";
import { AuthForm } from "../_components/AuthForm";

export default function LoginPage() {
  const [callbackUrl, setCallbackUrl] = useState("/");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      const callback = urlParams.get("callbackUrl") || "/";
      setCallbackUrl(callback);
    }
  }, []);

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-green-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div className="absolute inset-0 bg-[url('/football-pattern.svg')] bg-repeat opacity-[0.02] dark:opacity-[0.05]"></div>

      <div className="absolute top-0 left-0 w-96 h-96 bg-green-500/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>

      <div className="relative min-h-screen flex items-center justify-center p-4 py-12">
        <div className="w-full max-w-4xl flex flex-col items-center gap-8">
          <div className="text-center space-y-8">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-3">
                <div className="w-15 h-15 rounded-lg bg-primary flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
                  <Image
                    alt="logo"
                    width={30}
                    height={50}
                    className="w-[30px] h-[50px]"
                    src={"/logo.png"}
                  />
                </div>
                <h1 className="text-4xl font-bold bg-linear-to-r from-green-700 to-green-600 dark:from-green-400 dark:to-green-500 bg-clip-text text-transparent">
                  FootballDebate
                </h1>
              </div>

              <div className="space-y-8">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                  Your Ultimate Football Community
                </h2>
                <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                  Predict match outcomes, engage in debates, and connect with
                  passionate fans worldwide.
                </p>
              </div>
            </div>

            <div className="w-full max-w-md mx-auto">
              <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-3xl border border-slate-200 dark:border-slate-700 shadow-2xl shadow-slate-900/10 dark:shadow-black/50 p-8">
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                    Welcome Back
                  </h2>
                  <p className="text-slate-600 dark:text-slate-400">
                    Sign in to continue your journey
                  </p>
                </div>
                <AuthForm callbackUrl={callbackUrl} />
              </div>

              <p className="mt-6 text-center text-xs text-slate-500 dark:text-slate-500">
                By signing in, you agree to our{" "}
                <Link
                  href="/terms"
                  className="underline hover:text-slate-700 dark:hover:text-slate-400"
                >
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link
                  href="/privacy"
                  className="underline hover:text-slate-700 dark:hover:text-slate-400"
                >
                  Privacy Policy
                </Link>
              </p>
            </div>

            <div className="grid sm:grid-cols-3 gap-4 max-w-3xl mx-auto">
              <div className="group p-5 rounded-2xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-slate-200 dark:border-slate-700 hover:shadow-lg hover:shadow-green-500/10 transition-all duration-300 hover:-translate-y-1">
                <div className="w-12 h-12 rounded-xl bg-linear-to-br from-green-500 to-green-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold text-slate-900 dark:text-white mb-1">
                  Smart Predictions
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Compete and climb the leaderboard
                </p>
              </div>

              <div className="group p-5 rounded-2xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-slate-200 dark:border-slate-700 hover:shadow-lg hover:shadow-blue-500/10 transition-all duration-300 hover:-translate-y-1">
                <div className="w-12 h-12 rounded-xl bg-linear-to-br from-blue-500 to-blue-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <MessageCircle className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold text-slate-900 dark:text-white mb-1">
                  Live Debates
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Voice your opinion on hot topics
                </p>
              </div>

              <div className="group p-5 rounded-2xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-slate-200 dark:border-slate-700 hover:shadow-lg hover:shadow-purple-500/10 transition-all duration-300 hover:-translate-y-1">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold text-slate-900 dark:text-white mb-1">
                  Global Community
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Connect with fans everywhere
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
