import { SessionProvider } from "next-auth/react";

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <SessionProvider>{children}</SessionProvider>;
} 