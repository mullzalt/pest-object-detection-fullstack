import { type Detection, useDetection } from "@/hooks/use-detection";
import * as React from "react";
import Webcam from "react-webcam";
import { Button } from "../ui/button";
import { CircleIcon, SquareIcon, SwitchCameraIcon } from "lucide-react";
import { useDetectionConfig } from "@/stores/config-store";
import { useThrottledCallback } from "use-debounce";
import { cn } from "@/lib/utils";

type CameraFacing = "user" | "environment";

const toPercent = (num: number): string => {
  return (num * 100).toFixed(2) + "%";
};

function DetectionStatus() {
  const { status } = useDetection();

  const className = React.useCallback(() => {
    switch (status) {
      case "online": {
        return cn("text-green-600");
      }
      case "offline": {
        return cn("text-destructive");
      }
      case "retrying": {
        return cn("animate-pulse");
      }
      case "checking": {
        return cn("font-thin text-muted-foreground");
      }
      default: {
        return cn("font-thin");
      }
    }
  }, [status]);

  return <span className={className()}>{status}</span>;
}

export function DetectionCamera({
  onCapture,
  onRecordStart,
  onRecordStop,
  isLoading = false,
}: {
  onCapture?: (res: Detection[], file: File) => void;
  onRecordStart?: () => void;
  onRecordStop?: () => void;
  isLoading?: boolean;
}) {
  const webcamRef = React.useRef<Webcam>(null);
  const canvasRef = React.useRef<HTMLCanvasElement>(null);

  const { detectionDelay, reportThrottle } = useDetectionConfig();

  const [facingMode, setFactingMode] = React.useState<CameraFacing>("user");

  const { detections, detect, status, blob, isRecording, setIsRecording } =
    useDetection();

  const reportCapture = useThrottledCallback((res: Detection[]) => {
    if (!blob) return;
    const file = new File([blob], "file.jpg", { type: blob.type });
    onCapture && onCapture(res, file);
  }, reportThrottle);

  const setCanvasSize = React.useCallback(() => {
    if (!canvasRef.current || !webcamRef.current) return;

    if (!webcamRef.current.video) {
      canvasRef.current.width = 0;
      canvasRef.current.height = 0;
      return;
    }

    const { offsetWidth, offsetHeight } = webcamRef.current.video;

    canvasRef.current.width = offsetWidth;
    canvasRef.current.height = offsetHeight;
  }, [webcamRef, canvasRef]);

  const getPosition = React.useCallback(
    ({ xmax, xmin, ymax, ymin }: Detection) => {
      const width = Math.abs(xmax - xmin);
      const height = Math.abs(ymax - ymin);

      const textY = ymin - 5 <= 0 ? ymin + 10 : ymin - 5;
      const textX = xmin;

      return {
        xmin,
        xmax,
        ymin,
        ymax,
        width,
        height,
        textY,
        textX,
      };
    },
    [],
  );

  const drawDetection = React.useCallback(
    (res: Detection[]) => {
      if (!canvasRef.current) return;

      const ctx = canvasRef.current.getContext("2d");

      if (!ctx) return;

      setCanvasSize();

      if (!res.length) return;

      reportCapture(res);

      res.map((r) => {
        ctx.beginPath();
        const { confidence, name, class: _class } = r;
        const { width, height, xmin, ymin, textX, textY } = getPosition(r);

        // Draw the rectangle
        ctx.strokeStyle = "red"; // Set rectangle stroke color
        ctx.lineWidth = 1; // Set rectangle stroke width
        ctx.rect(xmin, ymin, width, height);
        ctx.stroke();

        // Draw the text
        const text = `${_class}:${name}: ${toPercent(confidence)}`;
        ctx.font = "14px sans";
        ctx.textBaseline = "top"; // Align text to top for better positioning

        // Draw text outline
        ctx.lineWidth = 2; // Set the text outline thickness
        ctx.strokeStyle = "black"; // Set text outline color
        ctx.strokeText(text, textX, textY);

        // Fill text
        ctx.fillStyle = "#FFFFFF"; // Set text fill color
        ctx.fillText(text, textX, textY);
      });
    },
    [canvasRef, webcamRef],
  );

  const capture = React.useCallback(async () => {
    if (!webcamRef.current) return;
    const imageSrc = webcamRef.current.getScreenshot();

    detect(imageSrc);
  }, [detect, webcamRef]);

  const switchCamera = React.useCallback(() => {
    setFactingMode(facingMode === "user" ? "environment" : "user");
  }, [facingMode]);

  const toggleRecord = React.useCallback(() => {
    if (!isRecording) {
      onRecordStart && onRecordStart();
    }
    setIsRecording(!isRecording);
  }, [isRecording]);

  React.useEffect(() => {
    const interval = setInterval(() => capture(), detectionDelay);
    return () => clearInterval(interval);
  }, [capture, detectionDelay]);

  React.useEffect(() => {
    drawDetection(detections);
  }, [detections]);

  return (
    <div className="flex flex-col w-full">
      <div className="flex gap-2 text-sm p-4">
        <span className="font-semibold">Status:</span>
        <DetectionStatus />
        {isRecording ? (
          <span className="text-destructive animate-pulse">Recording...</span>
        ) : (
          <span>Idle</span>
        )}
      </div>
      <div className="flex relative mx-auto w-fit h-fit">
        <Webcam
          audio={false}
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          width={640}
          height={640}
          videoConstraints={{
            width: 640,
            height: 640,
            aspectRatio: 1 / 1,
            facingMode,
          }}
          mirrored={facingMode === "user"}
          disablePictureInPicture
        />
        <canvas ref={canvasRef} className="absolute top-0 left-0 z-50" />
      </div>
      <div className="grid grid-cols-3 items-center p-4">
        <div>
          {isLoading && (
            <span className="animate-pulse">Connecting recorder...</span>
          )}
        </div>
        <div className="flex items-center justify-center">
          {isRecording ? (
            <Button
              variant={"outline"}
              size={"iconXl"}
              onClick={() => {
                onRecordStop && onRecordStop();
              }}
            >
              <SquareIcon />
            </Button>
          ) : (
            <Button
              variant={"outline"}
              size={"iconXl"}
              onClick={() => {
                onRecordStart && onRecordStart();
              }}
            >
              <CircleIcon className="text-destructive" />
            </Button>
          )}
        </div>
        <div className="flex justify-center">
          <Button variant={"ghost"} size={"icon"} onClick={switchCamera}>
            <SwitchCameraIcon />
          </Button>
        </div>
      </div>
    </div>
  );
}
