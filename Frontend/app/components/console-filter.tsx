"use client";

import { useEffect } from "react";

export function ConsoleFilter() {
  useEffect(() => {
    // Filter out the next-themes script tag warning
    const originalError = console.error;
    console.error = (...args: any[]) => {
      // Check if this is the next-themes script warning
      const message = args[0]?.toString() || "";
      if (
        message.includes("Encountered a script tag") &&
        message.includes("next-themes")
      ) {
        return; // Suppress this specific warning
      }
      // Pass through all other errors
      originalError.apply(console, args);
    };

    return () => {
      console.error = originalError;
    };
  }, []);

  return null;
}
