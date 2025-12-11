import type { Metadata } from "next";
import Link from "next/link";
import {
  ClerkProvider,
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
import { JetBrains_Mono } from "next/font/google";
import "./globals.css";

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AgentEats - AI Phone Ordering for Restaurants",
  description:
    "Automate your restaurant phone orders with AI. No human staff needed, cheaper than delivery apps. Perfect for small restaurants.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body className={`${jetbrainsMono.variable} antialiased font-mono`}>
          <header className="flex justify-between items-center p-4 gap-4 h-16 border-b sticky top-0 z-10 bg-white">
            <Link
              href="/"
              className="text-lg font-mono hover:opacity-80 transition-opacity"
            >
              AgentEats
            </Link>
            <div className="flex items-center gap-4">
              <SignedOut>
                <SignInButton />
                <SignUpButton>
                  <button className="bg-blue-600 text-white rounded-xl font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 cursor-pointer">
                    Sign Up
                  </button>
                </SignUpButton>
              </SignedOut>
              <SignedIn>
                <UserButton />
              </SignedIn>
            </div>
          </header>
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
