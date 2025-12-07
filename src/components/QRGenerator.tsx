'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { toast } from 'sonner';
import { Loader, AlertCircle, Download } from 'lucide-react';
import QRCodeLib from 'qrcode';
import jsQR from 'jsqr';

// QR decoder using jsQR library
function decodeQRCode(imageData: ImageData): string | null {
  try {
    const code = jsQR(imageData.data, imageData.width, imageData.height, {
      inversionAttempts: 'dontInvert',
    });

    if (code) {
      return code.data;
    }

    return null;
  } catch (error) {
    // Handle any errors silently
    console.error('QR decode error:', error)
    return null;
  }
}

// QR Scanner Component
export function QrScanner() {
  const [manualPatientId, setManualPatientId] = useState('');
  const [isScanning, setIsScanning] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const scanIntervalRef = useRef<number | null>(null);
  const router = useRouter();

  // Initialize camera
  useEffect(() => {
    if (!isScanning) return;

    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' },
        });

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.addEventListener('loadedmetadata', () => {
            startScanning();
          });
        }
      } catch (err) {
        console.error('Camera error:', err);
        toast.error('Cannot access camera');
        setIsScanning(false);
      }
    };

    startCamera();

    return () => {
      stopScanning();
      if (videoRef.current?.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [isScanning]);

  // Start continuous scanning
  const startScanning = () => {
    if (scanIntervalRef.current) return;

    scanIntervalRef.current = window.setInterval(() => {
      if (videoRef.current && canvasRef.current && !isLoading) {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');

        if (context && video.readyState === video.HAVE_ENOUGH_DATA) {
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          context.drawImage(video, 0, 0, canvas.width, canvas.height);
          const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
          const qrCodeData = decodeQRCode(imageData);

          if (qrCodeData) {
            stopScanning();
            handleScanSuccess(qrCodeData);
          }
        }
      }
    }, 500);
  };

  // Stop scanning
  const stopScanning = () => {
    if (scanIntervalRef.current) {
      clearInterval(scanIntervalRef.current);
      scanIntervalRef.current = null;
    }
  };

  // Handle QR scan
  const handleScanSuccess = async (qrData: string) => {
    setIsLoading(true);
    try {
      // Parse QR data: "PET|P-001|Max|John Doe|2025-01-10"
      const parts = qrData.split('|');

      if (parts.length < 2 || parts[0] !== 'PET') {
        throw new Error('Invalid QR code format');
      }

      const patientId = parts[1];

      // Redirect to pet view page
      toast.success(`QR code scanned successfully!`);
      router.push(`/pet?id=${patientId}`);
      setIsLoading(false);
    } catch (error: any) {
      console.error('Scan error:', error);
      toast.error(error.message || 'Failed to process QR code');
      setIsLoading(false);
      setIsScanning(true);
      // Resume scanning after error
      setTimeout(() => {
        startScanning();
      }, 1000);
    }
  };

  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualPatientId.trim()) {
      toast.error('Enter Patient ID');
      return;
    }
    const qrData = `PET|${manualPatientId.trim()}|Manual|Input|${new Date().toISOString().split('T')[0]}`;
    setManualPatientId('');
    await handleScanSuccess(qrData);
  };

  // LoadingDots component
  const LoadingDots: React.FC = () => {
    const [dots, setDots] = useState('');

    useEffect(() => {
      const interval = setInterval(() => {
        setDots(prevDots => {
          if (prevDots.length >= 3) {
            return ''; // Reset ke 0 titik
          }
          return prevDots + '.'; // Tambah 1 titik
        });
      }, 100); // Ganti titik setiap 100ms

      // Cleanup function untuk membersihkan interval saat komponen dilepas
      return () => clearInterval(interval);
    }, []);

    // Catatan: Menggunakan &nbsp; (non-breaking space) memastikan lebar tidak goyang saat titik menghilang
    return (
      <span className="inline-block w-4 text-left text-gray-600">
        {dots}
        {/* Tambahkan spasi untuk mengisi ruang yang hilang saat titik kurang dari 3 */}
        {Array(3 - dots.length).fill('\u00A0').map((char, index) => (
          <React.Fragment key={index}>{char}</React.Fragment>
        ))}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* QR Scanner */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Scan QR Code</h3>
        
        {isScanning ? (
          <div className="relative bg-black rounded-lg overflow-hidden">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="w-full aspect-square object-cover"
            />
            <canvas ref={canvasRef} className="hidden" />

            {/* Scan overlay */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-64 h-64 border-4 border-blue-500 shadow-lg rounded-lg"></div>
              </div>
            </div>
            
            {isLoading && (
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                <div className="text-white text-center">
                  <Loader className="w-8 h-8 mb-4 animate-spin mx-auto mb-2" />
                    <span>Loading</span>
                    <LoadingDots />
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-gray-100 rounded-lg p-8 text-center">
            <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">Camera not available</p>
            <Button
              onClick={() => setIsScanning(true)}
              className="mt-4"
            >
              Try Again
            </Button>
          </div>
        )}
      </Card>

      {/* Manual Input */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Manual Input</h3>
        <form onSubmit={handleManualSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Patient ID
            </label>
            <Input
              type="text"
              value={manualPatientId}
              onChange={(e) => setManualPatientId(e.target.value)}
              placeholder="e.g., P-001"
              disabled={isLoading}
            />
          </div>
          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? 'Searching...' : 'Search Patient'}
          </Button>
        </form>
      </Card>
    </div>
  );
}

// QR Code Generator Component
interface Patient {
  id: string;
  name: string;
  species: string;
  breed: string;
  owner: string;
  contact: string;
  qr_code: string;
}

export function QRGenerator() {
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const qrCanvasRef = useRef<HTMLCanvasElement>(null);

  // Fetch patients on mount
  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/patients', {
        credentials: 'include',
      });

      if (!res.ok) {
        throw new Error('Failed to fetch patients');
      }

      const data = await res.json();
      setPatients(data.patients || []);
    } catch (error) {
      console.error('Error fetching patients:', error);
      toast.error('Failed to load patients');
    } finally {
      setLoading(false);
    }
  };

  const generateQRCode = async (patient: Patient) => {
    setSelectedPatient(patient);
    
    try {
      // Generate QR code data: "PET|ID|Name|Owner|Date"
      const qrData = `PET|${patient.id}|${patient.name}|${patient.owner}|${new Date().toISOString().split('T')[0]}`;
      
      // Generate QR code as Data URL
      const url = await QRCodeLib.toDataURL(qrData, {
        width: 300,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF',
        },
      });
      
      setQrCodeUrl(url);
      
      // Also render to canvas for download
      if (qrCanvasRef.current) {
        await QRCodeLib.toCanvas(qrCanvasRef.current, qrData, {
          width: 300,
          margin: 2,
        });
      }
      
      toast.success('QR Code generated successfully!');
    } catch (error) {
      console.error('QR generation error:', error);
      toast.error('Failed to generate QR code');
    }
  };

  const downloadQRCode = () => {
    if (!qrCodeUrl || !selectedPatient) {
      toast.error('No QR code to download');
      return;
    }
    
    try {
      const link = document.createElement('a');
      link.download = `qr-${selectedPatient.id}-${selectedPatient.name}.png`;
      link.href = qrCodeUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success('QR Code downloaded!');
    } catch (error) {
      console.error('Download error:', error);
      toast.error('Failed to download QR code');
    }
  };

  const filteredPatients = patients.filter((p) =>
    p.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.owner?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // LoadingDots component
  const LoadingDots: React.FC = () => {
    const [dots, setDots] = useState('');

    useEffect(() => {
      const interval = setInterval(() => {
        setDots(prevDots => {
          if (prevDots.length >= 3) {
            return ''; // Reset ke 0 titik
          }
          return prevDots + '.'; // Tambah 1 titik
        });
      }, 100); // Ganti titik setiap 100ms

      // Cleanup function untuk membersihkan interval saat komponen dilepas
      return () => clearInterval(interval);
    }, []);

    // Catatan: Menggunakan &nbsp; (non-breaking space) memastikan lebar tidak goyang saat titik menghilang
    return (
      <span className="inline-block w-4 text-left text-gray-600">
        {dots}
        {/* Tambahkan spasi untuk mengisi ruang yang hilang saat titik kurang dari 3 */}
        {Array(3 - dots.length).fill('\u00A0').map((char, index) => (
          <React.Fragment key={index}>{char}</React.Fragment>
        ))}
      </span>
    );
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Generate QR Code</h1>
        <p className="text-gray-600">Generate QR codes for pet medical records</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Patient Selection */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Select Patient</h2>
          
          <div className="mb-4">
            <Input
              type="text"
              placeholder="Search by name, ID, or owner..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {loading ? (
            <div className="text-center py-8">
              <Loader className="w-8 h-8 animate-spin mx-auto text-blue-600" />
                <span>Loading</span>
                <LoadingDots />
            </div>
          ) : (
            <div className="space-y-2 max-h-[500px] overflow-y-auto">
              {filteredPatients.length === 0 ? (
                <div className="text-center py-8">
                  <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-600">No patients found</p>
                </div>
              ) : (
                filteredPatients.map((patient) => (
                  <button
                    key={patient.id}
                    onClick={() => generateQRCode(patient)}
                    className={`w-full text-left p-4 rounded-lg border transition-colors ${
                      selectedPatient?.id === patient.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className="font-semibold">{patient.name}</div>
                    <div className="text-sm text-gray-600">
                      ID: {patient.id} • Owner: {patient.owner}
                    </div>
                    <div className="text-xs text-gray-500 capitalize">
                      {patient.species} • {patient.breed}
                    </div>
                  </button>
                ))
              )}
            </div>
          )}
        </Card>

        {/* QR Code Display */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">QR Code</h2>
          
          {selectedPatient ? (
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Patient Information</p>
                <p className="font-semibold text-lg">{selectedPatient.name}</p>
                <p className="text-sm text-gray-600">ID: {selectedPatient.id}</p>
                <p className="text-sm text-gray-600">Owner: {selectedPatient.owner}</p>
                <p className="text-sm text-gray-600 capitalize">
                  {selectedPatient.species} • {selectedPatient.breed}
                </p>
              </div>

              <div className="flex justify-center p-6 bg-white rounded-lg border-2 border-gray-200">
                {qrCodeUrl ? (
                  <div className="text-center">
                    <img 
                      src={qrCodeUrl} 
                      alt="QR Code" 
                      className="mx-auto mb-2"
                    />
                    <canvas ref={qrCanvasRef} className="hidden"></canvas>
                    <p className="text-xs text-gray-500">Scan this code to view medical records</p>
                  </div>
                ) : (
                  <div className="py-12">
                    <Loader className="w-8 h-8 animate-spin mx-auto text-blue-600" />
                  </div>
                )}
              </div>

              <Button 
                onClick={downloadQRCode} 
                className="w-full flex items-center justify-center"
                disabled={!qrCodeUrl}
              >
                Download QR Code
              </Button>
            </div>
          ) : (
            <div className="text-center py-16">
              <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Select a patient to generate QR code</p>
              <p className="text-sm text-gray-500 mt-2">
                QR codes can be scanned to view pet medical records
              </p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}