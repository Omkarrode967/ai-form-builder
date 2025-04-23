"use client";

import { BackgroundBeams } from "@/components/ui/background-beams";
import LandingPage from "@/app/landing-page";

export default function MainContent() {
  return (
    <main className="flex min-h-screen flex-col items-center relative p-24 bg:dark z-10 antialiased">
      <LandingPage />
    </main>
  );
} 