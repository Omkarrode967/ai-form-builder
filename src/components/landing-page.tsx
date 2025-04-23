"use client";

import { BackgroundBeams } from "@/components/ui/background-beams";
import FormGenerator from "@/app/form-generator";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Shield, BarChart } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";


export default function LandingPage() {
  return (
    <div className="relative">
      <BackgroundBeams />
      <div className="relative z-10">
        {/* Hero Section */}
        <section className="flex flex-col items-center justify-center min-h-[70vh] space-y-8 pt-4 sm:pt-24 w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
              IntelliForm
            </h1>
            <p className="mt-6 text-lg sm:text-xl text-muted-foreground max-w-[600px] mx-auto">
              Create forms with insightful results and analytics effortlessly using AI.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="w-full max-w-3xl flex justify-center"
          >
            <div className="transform hover:scale-105 transition-transform duration-200">
              <FormGenerator />
            </div>
          </motion.div>
        </section>

        {/* Features Section */}
        <section className="py-24 sm:py-32">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                  Everything you need to create amazing forms
                </h2>
                <p className="mt-6 text-lg leading-8 text-muted-foreground">
                  Build, analyze, and optimize your forms with our powerful AI-powered platform.
                </p>
              </motion.div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
} 