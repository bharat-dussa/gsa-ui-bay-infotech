import { useApp } from "../store/app-wrapper.context";
import { useCallback } from "react";
import { delay } from "../utils/apply-filter";

export const useDelay = (callback: (...args: any[]) => void, ms: number = 800) => {
  const { setIsLoading } = useApp();

  return useCallback(
    async (...args: any[]) => {
      try {
        setIsLoading(true);
        await delay(ms);
        callback(...args);
      } finally {
        setIsLoading(false);
      }
    },
    [callback, setIsLoading]
  );
};
