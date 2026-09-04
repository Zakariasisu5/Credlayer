"use client";

import { ReactNode } from "react";
import { Header } from "./header";
import Link from "next/link";

interface PageLayoutProps {
  children: ReactNode;
  title: string;
  description: string;
  showBackLink?: boolean;
}

export function PageLayout({ children, title, description, showBackLink = true }: PageLayoutProps) {
  return (
    <>
      <Header />
      <main className="relative overflow-hidden bg-background min-h-screen pt-20">
        <div className="max-w-7xl mx-auto px-5 py-16 lg:px-10 lg:py-24">
          {/* Page Header */}
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4">
              {title}
            </h1>
            <p className="text-lg text-muted-foreground">
              {description}
            </p>
          </div>

          {/* Page Content */}
          {children}

          {/* Back Navigation */}
          {showBackLink && (
            <div className="mt-16 text-center">
              <Link
                href="/"
                className="inline-flex items-center text-primary hover:text-primary/80 transition-colors text-sm font-medium"
              >
                ← Back to Home
              </Link>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
