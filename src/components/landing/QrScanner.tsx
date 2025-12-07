'use client';

import { useEffect, useRef, useState } from 'react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { useRouter } from 'next/navigation';
import { Html5Qrcode, Html5QrcodeCameraScanConfig } from 'html5-qrcode';
import { X } from 'lucide-react';

interface DecodedPetData {
  patientId: string;
  name?: string;
  owner?: string;
  lastVisit?: string;
}

// Helper to parse QR content; assume format like: PET|P-001|Max|John Doe|2025-01-10|2025-02-01
function parseQrPayload(text: string): DecodedPetData | null {
  const parts = text.split('|');
  if (parts.length < 2) return null;
  if (parts[0] !== 'PET') return null;
  return {
    patientId: parts[1],
    name: parts[2],
    owner: parts[3],
    lastVisit: parts[4]
  };
}

export default function QrScanner() {
  const router = useRouter();
  const [petData, setPetData] = useState<DecodedPetData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [hasCamera, setHasCamera] = useState<boolean>(true);
  const [decodedQrText, setDecodedQrText] = useState<string>('');
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const elementId = 'qr-reader-container';

  useEffect(() => {
    // Cleanup when unmount
    return () => {
      if (scannerRef.current?.getState() === 2) { // scanning
        scannerRef.current?.stop().catch(() => {});
      }
      scannerRef.current?.clear();
    };
  }, []);

  // Handle successful scan - display decoded data for review
  const handleScan = (decodedText: string) => {
    const parsed = parseQrPayload(decodedText);
    if (parsed) {
      setPetData(parsed);
      setDecodedQrText(decodedText); // Store the full QR text
      stopScanner();
      setError(null);
    } else {
      setError('QR format not recognized');
    }
  };

  const proceedToVerification = () => {
    if (petData && decodedQrText) {
      router.push(`/pet/verify?id=${encodeURIComponent(petData.patientId)}&qr=${encodeURIComponent(decodedQrText)}`);
    }
  };

  const startScanner = async () => {
    setError(null);
    setPetData(null);
    if (scannerRef.current) {
      try {
        await scannerRef.current.stop();
        scannerRef.current.clear();
      } catch {}
    }
    try {
      const cameras = await Html5Qrcode.getCameras();
      if (!cameras || cameras.length === 0) {
        setHasCamera(false);
        setError('Camera not found. You can upload an image instead.');
        return;
      }
      setHasCamera(true);
      const cameraId = cameras[0].id;
      scannerRef.current = new Html5Qrcode(elementId);
      const config: Html5QrcodeCameraScanConfig = { fps: 10, qrbox: { width: 250, height: 250 } };
      setIsScanning(true);
      await scannerRef.current.start(
        cameraId,
        config,
        handleScan,
        () => {}
      );
    } catch (e: any) {
      setError(e?.message || 'Failed to start scanner');
      setIsScanning(false);
    }
  };

  const stopScanner = async () => {
    if (scannerRef.current && isScanning) {
      try {
        await scannerRef.current.stop();
        scannerRef.current.clear();
      } catch {}
    }
    setIsScanning(false);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setError(null);
    setPetData(null);
    
    try {
      // Create a temporary hidden div for Html5Qrcode
      const tempDiv = document.createElement('div');
      tempDiv.id = 'qr-image-reader';
      tempDiv.style.display = 'none';
      document.body.appendChild(tempDiv);
      
      // Initialize Html5Qrcode with the temporary div
      const html5QrCode = new Html5Qrcode('qr-image-reader');
      
      // Scan the uploaded file
      const decodedText = await html5QrCode.scanFile(file, true);
      
      // Clean up
      html5QrCode.clear();
      document.body.removeChild(tempDiv);
      
      // Process the decoded QR code
      handleScan(decodedText);
      
    } catch (err: any) {
      // Clean up on error
      const tempDiv = document.getElementById('qr-image-reader');
      if (tempDiv) {
        document.body.removeChild(tempDiv);
      }
      
      setError(err?.message || 'Failed to read QR code from image. Please ensure the image contains a valid QR code.');
      console.error('QR upload error:', err);
    }
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 bg-gray-50 shadow-lg rounded-lg">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900">Quick Pet Records Access</h2>
        <p className="mt-4 text-lg text-gray-600">Scan your pet's QR code (camera or image upload) <br /> to view basic data instantly.</p>
      </div>
      <div className="max-w-3xl mx-auto">
        <Card className="p-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-4">Live Camera Scan</h3>
              <div className="border rounded-lg bg-white p-4 flex flex-col items-center">
                <div id={elementId} className={`w-full flex items-center justify-center ${!isScanning ? 'h-64 bg-gray-100 rounded-md' : ''}`}></div>
                <div className="mt-4 flex gap-3">
                  {!isScanning && <Button type="button" onClick={startScanner}>Start Scan</Button>}
                  {isScanning && <Button type="button" variant="secondary" onClick={stopScanner}>Stop</Button>}
                </div>
                {!hasCamera && (
                  <p className="text-xs text-red-600 mt-2">No camera detected.</p>
                )}
              </div>
              <div className="mt-6">
                <h3 className="font-semibold mb-2">Upload QR Image</h3>
                <input id="qr-file" type="file" accept="image/*" onChange={handleImageUpload} className="block w-full text-sm" title="Upload QR code image file" />
                <p className="text-xs text-gray-500 mt-1">PNG/JPG image containing the QR code.</p>
              </div>
              {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
            </div>
            <div className="flex flex-col">
              <h3 className="font-semibold mb-4">Decoded Data</h3>
              {!petData && <p className="text-sm text-gray-500">No data yet. Scan or upload a QR code.</p>}
              {petData && (
                <div className="space-y-3 bg-gray-50 p-4 rounded-lg">
                  <div>
                    <p className="text-xs text-gray-600">Patient ID</p>
                    <p className="font-medium">{petData.patientId}</p>
                  </div>
                  {petData.name && (
                    <div>
                      <p className="text-xs text-gray-600">Pet Name</p>
                      <p className="font-medium">{petData.name}</p>
                    </div>
                  )}
                  {petData.owner && (
                    <div>
                      <p className="text-xs text-gray-600">Owner</p>
                      <p className="font-medium">{petData.owner}</p>
                    </div>
                  )}
                  {petData.lastVisit && (
                    <div>
                      <p className="text-xs text-gray-600">Last Visit</p>
                      <p className="font-medium">{petData.lastVisit}</p>
                    </div>
                  )}
                  <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <p className="text-sm text-blue-800 font-medium">
                      Is this your pet? Click below to view medical records.
                    </p>
                  </div>
                  {/* Appointment info removed per DFD scope */}
                  <div className="mt-6 space-y-2">
                    <Button
                      type="button"
                      onClick={proceedToVerification}
                      className="w-full"
                    >
                      View Medical Records
                    </Button>
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={() => {
                        setPetData(null);
                        setDecodedQrText('');
                        setError(null);
                      }}
                      className="w-full"
                    >
                      Close
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
}