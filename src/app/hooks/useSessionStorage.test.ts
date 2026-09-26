import { renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import z from "zod";
import { useSessionStorage } from "./useSessionStorage";

function renderSessionStorage(
  key: string = "test-key",
  schema: z.ZodType = z.string(),
) {
  return renderHook(() => useSessionStorage(key, schema));
}

describe("useSessionStorage hook", () => {
  afterEach(() => {
    sessionStorage.clear();
  });

  it("retrieves the correct value from sessionStorage", () => {
    const key = "test-key";
    const value = "Test value";

    sessionStorage.setItem(key, JSON.stringify(value));

    const { result } = renderSessionStorage(key, z.string());

    expect(result.current.getStoredValue()).toBe(value);
  });

  it("returns null if the stored value is of the wrong type", () => {
    const key = "test-key";
    const value = 123;

    sessionStorage.setItem(key, JSON.stringify(value));

    const { result } = renderSessionStorage(key, z.string());

    expect(result.current.getStoredValue()).toBeNull();
  });

  it("returns null if there is no stored value", () => {
    const { result } = renderSessionStorage();

    expect(result.current.getStoredValue()).toBeNull();
  });

  it("stores a value in sessionStorage", () => {
    const key = "test-key";
    const value = "Test value";

    const { result } = renderSessionStorage(key, z.string());
    result.current.setStorage(value);

    const stored = sessionStorage.getItem(key) as string;
    expect(JSON.parse(stored)).toBe(value);
  });

  it("clears the correct key", () => {
    const key = "test-key";
    const value = "Test value";

    sessionStorage.setItem(key, JSON.stringify(value));

    const { result } = renderSessionStorage(key, z.string());
    result.current.clearStorage();

    expect(sessionStorage.getItem(key)).toBeNull();
  });
});
