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
