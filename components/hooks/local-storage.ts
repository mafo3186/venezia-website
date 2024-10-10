import { useEffect, useState } from "react";

export function useLocalStorage<T>(key: string, fallbackValue: T) {
  const state = useState(fallbackValue);
  const [value, setValue] = state;
  useEffect(() => {
    const stored = localStorage.getItem(key);
    setValue(stored ? JSON.parse(stored) : fallbackValue);
  }, [fallbackValue, key, setValue]);
  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);
  return state;
}
