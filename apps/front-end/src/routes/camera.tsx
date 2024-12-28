import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";
import Webcam from "react-webcam";
import axios from "axios";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/camera")({
  component: HomeComponent,
});

type CameraFacing = "user" | "environment";

const API_RESOLUTION = {
  w: 640,
  h: 640,
};

interface AdjustRatioOptions {
  canvasHeight: number;
  canvasWidth: number;
}

interface AdjustPositionOptions {
  videoWidth: number;
  videoHeight: number;
}

const adjustRatio = ({ canvasHeight, canvasWidth }: AdjustRatioOptions) => {
  const { w, h } = API_RESOLUTION;

  const wScaleFactor = w / canvasHeight;
  const hScaleFactor = h / canvasWidth;

  const adjustedWidth = canvasWidth * wScaleFactor;
  const adjustedHeight = canvasHeight * hScaleFactor;

  return {
    xOffset: (adjustedWidth - w) / 2,
    yOffset: (adjustedHeight - h) / 2,
  };
};

const adjustPosition = ({ videoHeight, videoWidth }: AdjustPositionOptions) => {
  const { w, h } = API_RESOLUTION;
  const videoAspectRatio = videoWidth / videoHeight;
  const apiAspectRatio = w / h; // 640x640 is square

  let xOffset = 0;
  let yOffset = 0;

  if (videoAspectRatio > apiAspectRatio) {
    // Video is wider than API's square input
    const scaleFactor = w / videoHeight; // Height determines scaling
    const adjustedWidth = videoWidth * scaleFactor;
    xOffset = (adjustedWidth - w) / 2; // Calculate horizontal padding
  } else if (videoAspectRatio < apiAspectRatio) {
    // Video is taller than API's square input
    const scaleFactor = h / videoWidth; // Width determines scaling
    const adjustedHeight = videoHeight * scaleFactor;
    yOffset = (adjustedHeight - h) / 2; // Calculate vertical padding
  }

  return { xOffset, yOffset };
};

interface DetectionResponse {
  xmin: number;
  ymin: number;
  xmax: number;
  ymax: number;
  confidence: number;
  class: number;
  name: string;
}

function HomeComponent() {
  const webcamRef = React.useRef<Webcam>(null);
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const [facingMode, setFactingMode] = React.useState<CameraFacing>("user");

  const [detection, setDetection] = React.useState<DetectionResponse[]>([]);

  const setCanvasScale = React.useCallback(() => {
    if (!canvasRef.current || !webcamRef.current) return;

    if (!webcamRef.current.video) return;

    const { offsetWidth, offsetHeight } = webcamRef.current.video;

    canvasRef.current.width = offsetWidth;
    canvasRef.current.height = offsetHeight;
  }, [webcamRef, canvasRef]);

  const getPosition = React.useCallback(
    ({ xmax, xmin, ymax, ymin }: DetectionResponse) => {
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
    (res: DetectionResponse[]) => {
      if (!canvasRef.current) return;

      const ctx = canvasRef.current.getContext("2d");

      if (!ctx) return;

      setCanvasScale();

      const { height: canvasHeight, width: canvasWidth } = canvasRef.current;

      ctx.clearRect(0, 0, canvasWidth, canvasHeight);

      if (!res.length) return;

      res.map((r) => {
        ctx.beginPath();
        ctx.fillStyle = "#FF0000";
        const { confidence, name, class: _class } = r;
        const { width, height, xmin, ymin, textX, textY } = getPosition(r);
        ctx.fillText(`${_class}:${name} ${confidence}`, textX, textY);
        ctx.rect(xmin, ymin, width, height);
        ctx.stroke();
      });
    },
    [canvasRef, webcamRef],
  );

  const captureFrame = React.useCallback(async () => {
    if (!webcamRef.current) return;
    const imageSrc = webcamRef.current.getScreenshot();

    if (!imageSrc) return;

    const base64Res = await fetch(imageSrc);
    const imageBlob = await base64Res.blob();

    const formData = new FormData();
    formData.append("image", imageBlob, "frame.jpg");

    await axios
      .post<DetectionResponse[]>("/v1/object-detection/yolov5", formData, {
        responseType: "json",
      })
      .then((res) => {
        drawDetection(res.data);
      })
      .catch((err) => {});
  }, [webcamRef]);

  const switchCamera = React.useCallback(() => {
    setFactingMode(facingMode === "user" ? "environment" : "user");
  }, [facingMode]);

  const drawDummy = React.useCallback(() => {
    drawDetection([
      {
        xmax: 630,
        xmin: 10,
        ymax: 630,
        ymin: 10,
        class: 0,
        name: "Test",
        confidence: 0.004,
      },
    ]);
  }, [drawDetection]);

  React.useEffect(() => {
    const interval = setInterval(() => captureFrame(), 500);
    return () => clearInterval(interval);
  }, [captureFrame]);

  return (
    <div className="flex flex-col gap-4 min-h-screen relative">
      <pre>{JSON.stringify(detection, null, 2)}</pre>
      <div className="relative w-fit h-fit mx-auto">
        <Webcam
          audio={false}
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          width={640}
          height={640}
          videoConstraints={{
            width: API_RESOLUTION.w,
            height: API_RESOLUTION.h,
            aspectRatio: 1 / 1,
            facingMode,
          }}
          mirrored={facingMode === "user"}
          disablePictureInPicture
        />
        <canvas ref={canvasRef} className="absolute top-0 left-0 z-50" />
      </div>
      <Button onClick={drawDummy}>draw</Button>
      <Button onClick={switchCamera}>Switch Camera</Button>
    </div>
  );
}
