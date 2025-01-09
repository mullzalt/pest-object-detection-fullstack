import type { Detection } from "@/hooks/use-detection";
import React, { useEffect, useRef } from "react";

interface DetectionCanvasProps {
  imageUrl: string; // Path to the image
  detections: Detection[]; // Detection data
}

const DetectionCanvas: React.FC<DetectionCanvasProps> = ({
  imageUrl,
  detections,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");

    if (canvas && ctx) {
      const image = new Image();
      image.src = imageUrl;

      image.onload = () => {
        // Resize canvas to match the image dimensions
        canvas.width = image.width;
        canvas.height = image.height;

        // Draw the image onto the canvas
        ctx.drawImage(image, 0, 0);

        // Overlay the detections
        detections.forEach((detection) => {
          const { xmin, ymin, xmax, ymax, confidence, name } = detection;

          // Draw bounding box
          ctx.strokeStyle = "red";
          ctx.lineWidth = 2;
          ctx.strokeRect(xmin, ymin, xmax - xmin, ymax - ymin);

          // Draw label and confidence
          ctx.fillStyle = "white";
          ctx.font = "16px Arial";
          ctx.fillText(
            `${name} (${(confidence * 100).toFixed(1)}%)`,
            xmin,
            ymin - 5,
          );
        });
      };
    }
  }, [imageUrl, detections]);

  return <canvas ref={canvasRef} style={{ border: "1px solid black" }} />;
};

export default DetectionCanvas;
