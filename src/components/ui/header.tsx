import React from "react";
import { auth, signIn, signOut } from "@/auth";
import { Button } from "./button";
import Image from "next/image";
import Link from "next/link";
import { ThemeChange } from "./ThemeChange";
import { LayoutDashboard, Menu, Settings, LogOut, Home } from "lucide-react";
import { signOutAction } from "@/app/actions/auth";

type Props = {};

function SignOut() {
  return (
    <form action={signOutAction}>
      <Button type="submit" variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
        <LogOut className="h-4 w-4 md:hidden" />
        <span className="hidden md:block">Sign out</span>
      </Button>
    </form>
  );
}

const Header = async (props: Props) => {
  const session = await auth();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="mr-4 flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <Home className="h-5 w-5 text-violet-500" />
            <span className="font-bold bg-clip-text text-transparent bg-gradient-to-r from-violet-500 to-violet-700">IntelliForm</span>
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <nav className="flex items-center space-x-2">
            {session?.user ? (
              <>
                <ThemeChange />
                <Link href="/view-forms">
                  <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    <span className="hidden md:inline-block">Dashboard</span>
                  </Button>
                </Link>
                <Link href="/settings">
                  <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                    <Settings className="mr-2 h-4 w-4" />
                    <span className="hidden md:inline-block">Settings</span>
                  </Button>
                </Link>
                {session.user.name && session.user.image && (
                  <div className="flex items-center gap-2 ml-2">
                    <Image
                      src={session.user.image}
                      alt={session.user.name}
                      width={28}
                      height={28}
                      className="rounded-full border border-border"
                    />
                    <span className="hidden md:inline-block text-sm font-medium">{session.user.name}</span>
                  </div>
                )}
                <SignOut />
              </>
            ) : (
              <>
                <ThemeChange />
                <Link href="/login">
                  <Button variant="default" size="sm" className="bg-violet-600 hover:bg-violet-700">
                    <span>Sign in</span>
                  </Button>
                </Link>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
