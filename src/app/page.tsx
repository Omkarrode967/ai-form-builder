import Header from "@/components/ui/header";
import AuthProvider from "@/components/providers/session-provider";
import LandingPage from "@/components/landing-page";

export default function Home() {
  return (
    <AuthProvider>
      <Header />
      <main className="flex min-h-screen flex-col items-center relative p-24 bg:dark z-10 antialiased">
        <LandingPage />
      </main>
    </AuthProvider>
  );
}
