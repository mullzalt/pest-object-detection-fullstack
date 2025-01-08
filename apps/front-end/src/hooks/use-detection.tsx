import axios, { AxiosError } from "axios";
import * as React from "react";

export interface Detection {
  xmin: number;
  ymin: number;
  xmax: number;
  ymax: number;
  confidence: number;
  class: number;
  name: string;
}

type DetectionStatus = "online" | "offline" | "retrying" | "checking";

export interface DetectionContextValue {
  detect: (imgSrc: string | null) => Promise<void>;
  detections: Detection[];
  isError: boolean;
  error?: string;
  status: DetectionStatus;
  blob?: Blob;
  isRecording: boolean;
  setIsRecording: React.Dispatch<React.SetStateAction<boolean>>;
  currentId?: string;
  setCurrentId: React.Dispatch<React.SetStateAction<string | undefined>>;
}

const DetectionContext = React.createContext<DetectionContextValue | null>(
  null,
);

export const DetectionProvider = ({
  url = "/v1/object-detection/yolov5",
  retry = 5,
  children,
}: {
  url?: string;
  retry?: number;
  children: React.ReactNode;
}) => {
  const [detections, setDetections] = React.useState<Detection[]>([]);
  const [isError, setIsError] = React.useState(false);
  const [error, setError] = React.useState<string | undefined>();
  const [retryCount, setRetryCount] = React.useState<number>(0);
  const [status, setStatus] = React.useState<DetectionStatus>("checking");
  const [isRecording, setIsRecording] = React.useState(false);
  const [blob, setBlob] = React.useState<Blob>();
  const [currentId, setCurrentId] = React.useState<string | undefined>();

  const detect = React.useCallback(
    async (imgSrc: string | null) => {
      if (retryCount >= retry) return;

      if (!imgSrc) return;
      const base64Res = await fetch(imgSrc);
      const imageBlob = await base64Res.blob();

      const formData = new FormData();
      formData.append("image", imageBlob, "frame.jpg");

      await axios
        .post<Detection[]>(url, formData, {
          responseType: "json",
        })
        .then((res) => {
          setStatus("online");
          setRetryCount(0);
          setDetections(res.data);
          setBlob(imageBlob);
          return;
        })
        .catch((err: AxiosError) => {
          setIsError(true);
          setError(err.message);

          if (err.status === 500) {
            setStatus("offline");
            setRetryCount(retry);
            return;
          }
          setRetryCount((prev) => prev + 1);
          setStatus("retrying");
          return;
        });
    },
    [retry, retryCount],
  );

  const value = React.useMemo(
    () => ({
      error,
      detect,
      detections,
      status,
      isError,
      blob,
      setIsRecording,
      isRecording,
      currentId,
      setCurrentId,
    }),
    [
      error,
      detect,
      detections,
      status,
      isError,
      blob,
      isRecording,
      setIsRecording,
      currentId,
      setCurrentId,
    ],
  );

  return (
    <DetectionContext.Provider value={value}>
      {children}
    </DetectionContext.Provider>
  );
};

export function useDetection() {
  const context = React.useContext(DetectionContext);

  if (!context) throw new Error("Must be used within the DetectionProvider");

  return context;
}
