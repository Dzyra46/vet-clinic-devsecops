import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/Card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/Select';
import { Button } from './ui/Button';
import { QrCode, Download } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

const mockPatients = [
  { id: '1', name: 'Max', owner: 'John Smith', species: 'Dog' },
  { id: '2', name: 'Luna', owner: 'Sarah Johnson', species: 'Cat' },
  { id: '3', name: 'Charlie', owner: 'Mike Davis', species: 'Dog' },
  { id: '4', name: 'Tweety', owner: 'Emily Brown', species: 'Bird' }
];

export function QRGenerator() {
  const [selectedPatient, setSelectedPatient] = useState('');
  const [generatedQR, setGeneratedQR] = useState(false);

  const patient = mockPatients.find(p => p.id === selectedPatient);

  const handleGenerate = () => {
    if (selectedPatient) {
      setGeneratedQR(true);
    }
  };

  const handleDownload = () => {
    const svg = document.getElementById('qr-code');
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx?.drawImage(img, 0, 0);
      const pngFile = canvas.toDataURL('image/png');

      const downloadLink = document.createElement('a');
      downloadLink.download = `patient-${patient?.name}-qr.png`;
      downloadLink.href = pngFile;
      downloadLink.click();
    };

    img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
  };

  const qrData = patient ? JSON.stringify({
    patientId: patient.id,
    name: patient.name,
    owner: patient.owner,
    species: patient.species,
    clinicUrl: 'https://petcare-clinic.example.com'
  }) : '';

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="mb-2">Generate QR Code</h1>
        <p className="text-muted-foreground">Create QR codes for patient records</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* QR Generator Form */}
        <Card>
          <CardHeader>
            <CardTitle>Select Patient</CardTitle>
            <CardDescription>Choose a patient to generate their QR code</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm">Patient</label>
              <Select value={selectedPatient} onValueChange={(value) => {
                setSelectedPatient(value);
                setGeneratedQR(false);
              }}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a patient" />
                </SelectTrigger>
                <SelectContent>
                  {mockPatients.map((p) => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.name} - {p.owner} ({p.species})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {patient && !generatedQR && (
              <div className="pt-4 space-y-2">
                <div className="text-sm text-muted-foreground">Patient Details:</div>
                <div className="bg-muted p-3 rounded-md space-y-1">
                  <div className="flex justify-between">
                    <span className="text-sm">Name:</span>
                    <span className="text-sm">{patient.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Owner:</span>
                    <span className="text-sm">{patient.owner}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Species:</span>
                    <span className="text-sm">{patient.species}</span>
                  </div>
                </div>
              </div>
            )}

            <Button 
              onClick={handleGenerate} 
              disabled={!selectedPatient}
              className="w-full"
            >
              <QrCode className="w-4 h-4 mr-2" />
              Generate QR Code
            </Button>
          </CardContent>
        </Card>

        {/* QR Code Display */}
        <Card>
          <CardHeader>
            <CardTitle>QR Code</CardTitle>
            <CardDescription>Scan to access patient information</CardDescription>
          </CardHeader>
          <CardContent>
            {generatedQR && patient ? (
              <div className="space-y-4">
                <div className="flex justify-center p-6 bg-white rounded-lg border-2 border-dashed border-border">
                  <QRCodeSVG
                    id="qr-code"
                    value={qrData}
                    size={200}
                    level="H"
                    includeMargin={true}
                  />
                </div>
                
                <div className="text-center space-y-2">
                  <p className="text-sm">QR Code for <span className="font-medium">{patient.name}</span></p>
                  <p className="text-xs text-muted-foreground">Owned by {patient.owner}</p>
                </div>

                <Button 
                  onClick={handleDownload}
                  variant="outline"
                  className="w-full"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download QR Code
                </Button>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                  <QrCode className="w-8 h-8 text-muted-foreground" />
                </div>
                <p className="text-muted-foreground">Select a patient and generate QR code</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Information Card */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>About QR Codes</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            These QR codes contain patient information and can be scanned to quickly access patient records. 
            They can be printed on pet tags, medical files, or used for quick patient identification during visits.
            The QR code includes the patient ID, name, owner information, and a link to the clinic system.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
