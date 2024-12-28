import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

type DetectionConfigStore = {
  detectionDelay: number;
  setDetectionDelay: (ms: number) => void;
  reportThrottle: number;
  setReportThrottle: (ms: number) => void;
};

export const useDetectionConfig = create<DetectionConfigStore>()(
  persist(
    (set) => ({
      detectionDelay: 500,
      setDetectionDelay: (ms: number) =>
        set(() => ({ detectionDelay: Math.max(100, ms) })),
      reportThrottle: 5000,
      setReportThrottle: (ms: number) =>
        set(() => ({ reportThrottle: Math.max(1000, ms) })),
    }),
    {
      name: "detection-config",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
