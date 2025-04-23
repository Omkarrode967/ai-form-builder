"use client";

import React from "react";
import Image from "next/image";
import FormGenerator from "../form-generator";
import { BackgroundBeams } from "@/components/ui/background-beams";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Shield, BarChart } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const LandingPage: React.FC = () => {
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
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
              >
                <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                  Everything you need to create amazing forms
                </h2>
                <p className="mt-6 text-lg leading-8 text-muted-foreground">
                  Powerful features to help you build, manage, and analyze your forms with ease.
                </p>
              </motion.div>
            </div>
            <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
              <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
                {features.map((feature) => (
                  <motion.div
                    key={feature.name}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    viewport={{ once: true }}
                    className="flex flex-col"
                  >
                    <dt className="flex items-center gap-x-3 text-base font-semibold leading-7">
                      <feature.icon className="h-5 w-5 flex-none text-primary" />
                      {feature.name}
                    </dt>
                    <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-muted-foreground">
                      <p className="flex-auto">{feature.description}</p>
                    </dd>
                  </motion.div>
                ))}
              </dl>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="relative isolate mt-32 px-6 py-32 sm:mt-56 sm:py-40 lg:px-8">
          <div className="absolute inset-0 -z-10 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-primary/10 to-transparent opacity-20" />
          </div>
          <div className="mx-auto max-w-2xl text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Ready to get started?
              </h2>
              <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-muted-foreground">
                Join thousands of users who are already creating beautiful forms with IntelliForm.
              </p>
              <div className="mt-10 flex items-center justify-center gap-x-6">
                <Link href="/dashboard">
                  <Button size="lg" className="group">
                    Start Creating
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    </div>
  );
};

const features = [
  {
    name: "AI-Powered Form Generation",
    description:
      "Create forms instantly using natural language descriptions. Our AI understands your requirements and generates the perfect form structure.",
    icon: Sparkles,
  },
  {
    name: "Real-time Validation",
    description:
      "Ensure data quality with built-in validation rules. Get instant feedback as users fill out your forms.",
    icon: Shield,
  },
  {
    name: "Advanced Analytics",
    description:
      "Track form performance, analyze user responses, and gain valuable insights with our comprehensive analytics dashboard.",
    icon: BarChart,
  },
];

export default LandingPage;
