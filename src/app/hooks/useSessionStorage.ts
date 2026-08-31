import z from "zod";

export function useSessionStorage<T>(key: string, schema: z.ZodType<T>) {
  const getStoredValue = () => {
    const raw = sessionStorage.getItem(key);

    if (raw == null) {
      return null;
    }

    try {
      const result = schema.safeParse(JSON.parse(raw));

      return result.success ? result.data : null;
    } catch {
      return null;
    }
  };

  const setStorage = (value: T) => {
    sessionStorage.setItem(key, JSON.stringify(value));
  };

  const clearStorage = () => {
    sessionStorage.removeItem(key);
  };

  return {
    getStoredValue,
    setStorage,
    clearStorage,
  };
}
// import { useState, useSyncExternalStore } from "react";
// import z from "zod";

// export function useSessionStorage<T>(key: string, schema: z.ZodType<T>) {
//   const [cachedRaw, setCachedRaw] = useState<string | null>(null);
//   const [cachedContext, setCachedContext] = useState<T | null>(null);

//   const subscribe = () => () => {};

//   const getStoredValue = () => {
//     const raw = sessionStorage.getItem(key);

//     if (raw == null) {
//       setCachedRaw(null);
//       setCachedContext(null);
//       return null;
//     }

//     if (raw === cachedRaw) return cachedContext;

//     setCachedRaw(raw);

//     try {
//       const result = schema.safeParse(JSON.parse(raw));

//       setCachedContext(result.success ? result.data : null);
//     } catch {
//       setCachedContext(null);
//     }

//     return cachedContext;
//   };

//   const value = useSyncExternalStore(
//     subscribe,
//     getStoredValue,
//     () => undefined,
//   );

//   const setStorage = (value: T) => {
//     sessionStorage.setItem(key, JSON.stringify(value));
//   };

//   const clearStorage = () => {
//     sessionStorage.removeItem(key);
//   };

//   return {
//     value,
//     setStorage,
//     clearStorage,
//   };
// }
