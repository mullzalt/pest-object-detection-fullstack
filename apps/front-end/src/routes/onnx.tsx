import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";
import Webcam from "react-webcam";
import axios from "axios";

import * as ort from "onnxruntime-web";

export const Route = createFileRoute("/onnx")({
  component: HomeComponent,
});

const videoConstraints = {
  width: 1280,
  height: 720,
  facingMode: "user",
};

function HomeComponent() {
  const loadModel = React.useCallback(async () => {
    const session = await ort.InferenceSession.create("../assets/best.onnx")
      .then((s) => {})
      .catch((e) => alert(e.message));
  }, []);

  React.useEffect(() => {
    loadModel();
  }, []);
  return <div>onnx</div>;
}
