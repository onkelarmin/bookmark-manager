import { VerificationContextSchema } from "@/schemas/auth";
import { useSyncExternalStore } from "react";
import z from "zod";

type Context = z.infer<typeof VerificationContextSchema>;

export type VerificationContext = Context | null | undefined;

const STORAGE_KEY = "verificationContext";

let cachedRaw: unknown;
let cachedContext: VerificationContext = null;

export function useVerificationContext() {
  const subscribe = () => () => {};

  const getVerificationContext = () => {
    const raw = sessionStorage.getItem(STORAGE_KEY);

    if (raw == null) {
      cachedRaw = null;
      cachedContext = null;
      return null;
    }

    if (raw === cachedRaw) return cachedContext;

    cachedRaw = raw;

    try {
      const result = VerificationContextSchema.safeParse(JSON.parse(raw));

      cachedContext = result.success ? result.data : null;
    } catch {
      cachedContext = null;
    }

    return cachedContext;
  };

  const verificationContext = useSyncExternalStore(
    subscribe,
    getVerificationContext,
    () => undefined,
  );

  const setVerificationContext = (context: Context) => {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(context));
  };

  const clearVerificationContext = () => {
    sessionStorage.removeItem(STORAGE_KEY);
  };

  return {
    verificationContext,
    setVerificationContext,
    clearVerificationContext,
  };
}
