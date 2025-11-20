"use client";

import { useEffect, useState } from "react";
import { ifWindow } from "@/toolbox/utils/ifWindow";

export const useLocalStorage = <T>(
  key: string,
  defaultValue: T | (() => T),
) => {
  const [value, setValue] = useState<T>(() =>
    ifWindow(
      typeof defaultValue === "function"
        ? (defaultValue as () => T)()
        : defaultValue,
      (w) => {
        try {
          const stored = w.localStorage.getItem(key);
          if (stored !== null) {
            return JSON.parse(stored) as T;
          }
        } catch (error) {
          console.error(error);
        }
        return typeof defaultValue === "function"
          ? (defaultValue as () => T)()
          : defaultValue;
      },
    ),
  );

  useEffect(() => {
    ifWindow(undefined, (w) => {
      try {
        w.localStorage.setItem(key, JSON.stringify(value));
      } catch (error) {
        console.error(error);
      }
    });
  }, [key, value]);

  return [value, setValue] as const;
};
