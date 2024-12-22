import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";
import Webcam from "react-webcam";
import axios from "axios";

export const Route = createFileRoute("/")({
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

function HomeComponent() {
  const webcamRef = React.useRef<Webcam>(null);
  const canvasRef = React.useRef<HTMLCanvasElement>(null);

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

      ctx.clearRect(0, 0, 640, 640);

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

  // React.useEffect(() => {
  //   const interval = setInterval(() => captureFrame(), 500);
  //   return () => clearInterval(interval);
  // }, [captureFrame]);
  return (
    <>
      <div
        style={{
          position: "relative",
        }}
      >
        <Webcam
          audio={false}
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          videoConstraints={videoConstraints}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: 640,
            height: 480,
          }}
        />
        <canvas
          width={640}
          ref={canvasRef}
          height={640}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            zIndex: 1,
          }}
        />
      </div>

      <button onClick={captureFrame}>Capture photo</button>
      <pre>{JSON.stringify(detection, null, 2)}</pre>
    </>
  );
}
