import React, { useRef, useState } from "react";
import { BrowserMultiFormatReader, NotFoundException } from "@zxing/library"; // Import NotFoundException

const BarcodeScanner = () => {
  const videoRef = useRef(null);
  const codeReader = useRef(null);
  const [scannedText, setScannedText] = useState("");
  const [scanning, setScanning] = useState(false);

  const startScanner = () => {
    if (!codeReader.current) {
      codeReader.current = new BrowserMultiFormatReader();
    }

    setScanning(true);

    codeReader.current.decodeFromVideoDevice(
      undefined,
      videoRef.current,
      (result, err) => {
        if (result) {
          console.log("Found barcode: " + result.text);
          setScannedText(result.text);
        }
        if (err && !(err instanceof NotFoundException)) {
          console.error("Barcode decode error:", err);
          setScannedText("Error decoding barcode.");
        }
      }
    );
  };

  const stopScanner = () => {
    if (codeReader.current) {
      codeReader.current.reset();
      setScanning(false);
    }
  };

  React.useEffect(() => {
    if (scanning) {
      startScanner();
    } else {
      stopScanner();
    }

    return () => {
      stopScanner();
    };
  }, [scanning]);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        flexDirection: "column",
      }}
    >
      <h1>React ZXing Barcode Scanner</h1>
      <video ref={videoRef} style={{ width: "100%" }} playsInline />
      <p style={{ textAlign: "center" }}>Scanned Barcode: {scannedText}</p>
      <button onClick={() => setScanning(!scanning)} style={{ width: "100px" }}>
        {scanning ? "Stop Scanner" : "Start Scanner"}
      </button>
    </div>
  );
};

export default BarcodeScanner;
