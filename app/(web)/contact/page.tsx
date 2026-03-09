"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Mail, MessageSquare, Briefcase, Sparkles } from "lucide-react";
import { ContactForm } from "./_components/ContactForm";

export default function ContactPage() {
  return (
    <div className="relative min-h-screen bg-slate-950 text-slate-50 selection:bg-indigo-500/30">
      <div className="container relative z-10 m-auto px-4 py-16 md:py-24">
        <div className="max-w-5xl mx-auto space-y-16">
          <div className="text-center space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="inline-flex items-center justify-center p-2 mb-4 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
              <Sparkles className="w-4 h-4 mr-2" />
              <span className="text-xs font-semibold uppercase tracking-wider">
                Get in touch
              </span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-white drop-shadow-sm">
              We'd love to{" "}
              <span className="text-transparent bg-clip-text bg-linear-to-r from-green-400 to-cyan-400">
                hear from you
              </span>
            </h1>
            <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto">
              Whether you have a question, feedback, or just want to say hi, our
              team is always ready to chat.
            </p>
          </div>

          <Card className="border border-white/10 bg-slate-900/50 backdrop-blur-xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
            <CardContent className="p-6 md:p-10">
              <ContactForm />
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-10 duration-700 delay-200">
            <div className="group p-6 rounded-2xl border border-white/5 bg-slate-900/40 hover:bg-slate-800/60 hover:border-indigo-500/30 transition-all duration-300 hover:-translate-y-1">
              <div className="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center mb-4 text-indigo-400 group-hover:bg-indigo-500 group-hover:text-white transition-colors duration-300">
                <Mail className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-white">Support</h3>
              <p className="text-slate-400 leading-relaxed">
                Need help with your account or predictions? Our support team is
                here for you 24/7.
              </p>
            </div>

            <div className="group p-6 rounded-2xl border border-white/5 bg-slate-900/40 hover:bg-slate-800/60 hover:border-purple-500/30 transition-all duration-300 hover:-translate-y-1">
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center mb-4 text-purple-400 group-hover:bg-purple-500 group-hover:text-white transition-colors duration-300">
                <MessageSquare className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-white">
                Feedback
              </h3>
              <p className="text-slate-400 leading-relaxed">
                Have suggestions to improve our platform? We value your feedback
                and build around it.
              </p>
            </div>

            <div className="group p-6 rounded-2xl border border-white/5 bg-slate-900/40 hover:bg-slate-800/60 hover:border-emerald-500/30 transition-all duration-300 hover:-translate-y-1">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center mb-4 text-emerald-400 group-hover:bg-emerald-500 group-hover:text-white transition-colors duration-300">
                <Briefcase className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-white">
                Business
              </h3>
              <p className="text-slate-400 leading-relaxed">
                Interested in partnerships or advertising? Let's explore
                opportunities together.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
