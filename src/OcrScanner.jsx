import React, { useRef, useState } from "react";
import Tesseract from "tesseract.js";

const CameraOcrScanner = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);
  const [stream, setStream] = useState(null); // State to hold the camera stream

  const startCamera = () => {
    const constraints = {
    video: {
        facingMode: { exact: "environment" }, // Use back camera if available
      },
    }
    navigator.mediaDevices
      .getUserMedia({ video: constraints})
      .then((stream) => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          setStream(stream); // Save the stream to state
        }
      })
      .catch((err) => {
        setError("Error accessing camera: " + err.message);
      });
  };

  const stopCamera = () => {
    // Stop the current camera stream
    if (stream) {
      stream.getTracks().forEach((track) => {
        track.stop();
      });
      setStream(null); // Clear the stream state
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext("2d");
      canvasRef.current.width = videoRef.current.videoWidth;
      canvasRef.current.height = videoRef.current.videoHeight;
      context.drawImage(
        videoRef.current,
        0,
        0,
        videoRef.current.videoWidth,
        videoRef.current.videoHeight
      );
      return canvasRef.current.toDataURL("image/png");
    }
    return null;
  };

  const handleCapture = () => {
    const photo = capturePhoto();
    if (photo) {
      setLoading(true);
      Tesseract.recognize(photo, "eng", {
        logger: (m) => console.log(m),
      })
        .then(({ data: { text } }) => {
          setLoading(false);
          setResult(text); // Set the OCR result
        })
        .catch((err) => {
          setLoading(false);
          setError("Error processing image: " + err.message);
        });
    }
  };

  const handleCloseCamera = () => {
    stopCamera(); // Stop the camera stream when closing
    setResult(null); // Clear the result when closing
  };

  return (
    <div>
      <video
        ref={videoRef}
        autoPlay
        playsInline
        style={{
          width: "100%",
          height: "auto",
          marginBottom: "20px",
          borderRadius: "10px",
        }}
      />
      <canvas ref={canvasRef} style={{ display: "none" }} />
      {loading && <p>Scanning...</p>}
      {error && <p>Error: {error}</p>}
      <div style={{ display: "flex", justifyContent: "center", gap: "10px" }}>
        <button
          onClick={handleCapture}
          disabled={loading}
          style={{
            padding: "10px 20px",
            fontSize: "16px",
            backgroundColor: "#2196f3",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Capture & Scan
        </button>
        <button
          onClick={startCamera}
          style={{
            padding: "10px 20px",
            fontSize: "16px",
            backgroundColor: "#4caf50",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Start Camera
        </button>
        <button
          onClick={handleCloseCamera}
          style={{
            padding: "10px 20px",
            fontSize: "16px",
            backgroundColor: "#f44336",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Close Camera
        </button>
      </div>
      {result && (
        <div style={{ marginTop: "20px", textAlign: "center" }}>
          <h3>Extracted Text:</h3>
          <p>{result}</p>
        </div>
      )}
    </div>
  );
};

export default CameraOcrScanner;
