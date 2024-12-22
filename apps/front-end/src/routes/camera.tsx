import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";
import Webcam from "react-webcam";
import axios from "axios";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/camera")({
  component: HomeComponent,
});

interface DetectionResponse {
  xmin: number;
  ymin: number;
  xmax: number;
  ymax: number;
  confidence: number;
  class: number;
  name: string;
}

const videoConstraints = {
  width: 1280,
  height: 720,
  facingMode: "user",
};

const IMAGE_OPTION = {
  width: 640,
  heigth: 640,
};

function HomeComponent() {
  const webcamRef = React.useRef<Webcam>(null);
  const canvasRef = React.useRef<HTMLCanvasElement>(null);

  const { width, heigth } = IMAGE_OPTION;

  const [detection, setDetection] = React.useState<DetectionResponse[]>([]);
  const capture = React.useCallback(() => {
    if (!webcamRef.current) return;
    const imageSrc = webcamRef.current.getScreenshot();
  }, [webcamRef]);

  const drawDetection = React.useCallback(
    (res: DetectionResponse[]) => {
      if (!canvasRef.current) return;

      const ctx = canvasRef.current.getContext("2d");

      if (!ctx) return;

      ctx.clearRect(0, 0, width, heigth);

      if (!res.length) return;

      res.map((r) => {
        ctx.beginPath();
        ctx.fillStyle = "#FF0000";
        const { xmax, xmin, ymin, ymax, confidence, name, class: _class } = r;
        const height = Math.abs(ymax - ymin);
        const width = Math.abs(xmax - xmin);
        ctx.fillText(`${_class}:${name} ${confidence}`, xmax, ymax - 5);
        ctx.rect(xmin, ymin, height, width);
        ctx.stroke();
      });
    },
    [canvasRef],
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
        setDetection(res.data);
      })
      .catch(() => {
        setDetection([]);
      });
  }, [webcamRef]);

  const prepareCanvas = React.useCallback(() => {
    if (!canvasRef.current || !webcamRef.current?.video) return;

    const { videoWidth, videoHeight } = webcamRef.current.video;
    canvasRef.current.width = videoWidth;
    canvasRef.current.height = videoHeight;
  }, [webcamRef, canvasRef]);

  // React.useEffect(() => {
  //   const interval = setInterval(() => captureFrame(), 500);
  //   return () => clearInterval(interval);
  // }, [captureFrame]);

  React.useEffect(() => {
    prepareCanvas();
    drawDummy();
  }, [webcamRef, canvasRef]);

  const drawDummy = React.useCallback(() => {
    drawDetection([
      {
        xmax: 20,
        xmin: 0,
        ymax: 20,
        ymin: 0,
        class: 0,
        name: "Test",
        confidence: 0.004,
      },
    ]);
  }, [drawDetection]);
  return (
    <div className="flex flex-col gap-4 min-h-screen relative">
      <div className="relative w-full h-full">
        <Webcam
          audio={false}
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          videoConstraints={{
            width: 640,
            height: 640,
            facingMode: "user",
          }}
          mirrored
          disablePictureInPicture
        />
        <canvas ref={canvasRef} className="absolute top-0 left-0 z-50" />
      </div>
      <Button onClick={drawDummy}>draw</Button>
    </div>
  );
}
