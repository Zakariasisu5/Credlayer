import { useAppKit } from "@reown/appkit/react";

// AppKit's useAppKit throws during SSR (and before createAppKit runs on the
// client) with: 'Please call "createAppKit" before using "useAppKit" hook'.
// This wrapper swallows that so components render safely; open() becomes a
// no-op until AppKit initializes on the client.
export function useAppKitSafe(): { open: (opts?: unknown) => void } {
  try {
    const { open } = useAppKit();
    return { open: (opts?: unknown) => open(opts as never) };
  } catch {
    return { open: () => {} };
  }
}
