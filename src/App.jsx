import React, { useState } from 'react';
import BarcodeScanner from './BarcodeScanner';
import OcrScanner from './OcrScanner';

function App() {
  const [isBarcodeScannerVisible, setIsBarcodeScannerVisible] = useState(true);

  const toggleScanner = () => {
    setIsBarcodeScannerVisible(prevState => !prevState);
  };

  return (
    <div className="App">
      <div style={{ marginBottom: '20px' }}>
        <button onClick={toggleScanner}>
          {isBarcodeScannerVisible ? 'Switch to OCR Scanner' : 'Switch to Barcode Scanner'}
        </button>
      </div>
      {isBarcodeScannerVisible ? <BarcodeScanner /> : <OcrScanner />}
    </div>
  );
}

export default App;
