import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/Select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/Tabs';
import { Badge } from './ui/Badge';
import { Calendar, Syringe, Pill, FileText } from 'lucide-react';

interface HistoryEntry {
  id: string;
  date: string;
  type: 'visit' | 'vaccination' | 'prescription' | 'surgery';
  title: string;
  description: string;
  veterinarian: string;
  details?: string;
  notes?: string;
}

const mockHistory: Record<string, HistoryEntry[]> = {
  '1': [
    {
      id: 'h1',
      date: '2025-10-10',
      type: 'visit',
      title: 'Ear Infection Treatment',
      description: 'Diagnosed with bacterial ear infection. Prescribed antibiotic drops.',
      veterinarian: 'Dr. Emily Watson'
    },
    {
      id: 'h2',
      date: '2025-08-15',
      type: 'vaccination',
      title: 'Annual Vaccinations',
      description: 'Rabies and DHPP vaccines administered.',
      veterinarian: 'Dr. Michael Chen'
    },
    {
      id: 'h3',
      date: '2025-05-20',
      type: 'visit',
      title: 'Wellness Checkup',
      description: 'Routine examination, all parameters normal.',
      veterinarian: 'Dr. Emily Watson'
    }
  ],
  '2': [
    {
      id: 'h4',
      date: '2025-10-12',
      type: 'visit',
      title: 'Annual Checkup',
      description: 'Complete physical examination, vaccinations updated.',
      veterinarian: 'Dr. Michael Chen'
    }
  ],
  '3': [
    {
      id: 'h5',
      date: '2025-10-14',
      type: 'surgery',
      title: 'Dental Surgery',
      description: 'Professional cleaning and tooth extraction performed.',
      veterinarian: 'Dr. Sarah Martinez'
    }
  ],
  '5': [
    {
      id: 'h6',
      date: '2025-10-15',
      type: 'surgery',
      title: 'ACL Reconstruction Surgery',
      description: 'Complete ACL (Anterior Cruciate Ligament) tear in left hind leg. Surgical reconstruction performed using tibial plateau leveling osteotomy (TPLO) technique.',
      veterinarian: 'Dr. Sarah Martinez',
      details: 'Pre-surgery: Patient presented with severe lameness and pain in left hind limb. X-rays confirmed complete ACL rupture with mild joint effusion. Blood work normal. Anesthesia protocol: Propofol induction, maintained with isoflurane. Surgery duration: 2 hours 15 minutes. Post-surgery: Patient recovered well from anesthesia. Pain management with carprofen and tramadol. Strict cage rest prescribed for 8 weeks.',
  notes: 'Follow-up evaluations planned at 1, 2, 4, and 8 weeks post-op. Physical therapy to begin at week 4. Expected full recovery in 12-16 weeks.'
    },
    {
      id: 'h7',
      date: '2025-09-10',
      type: 'visit',
      title: 'Pre-Surgery Consultation',
      description: 'Initial examination for ACL injury. Lameness observed, drawer test positive. Recommended surgical intervention.',
      veterinarian: 'Dr. Sarah Martinez',
      details: 'Patient showing signs of acute lameness. Physical exam revealed positive cranial drawer sign and tibial thrust test. Recommended ACL surgery after pre-operative blood work and x-rays.'
    },
    {
      id: 'h8',
      date: '2025-07-22',
      type: 'vaccination',
      title: 'Annual Vaccinations',
      description: 'Rabies, DHPP, and Bordetella vaccines administered. Health certificate issued.',
      veterinarian: 'Dr. Emily Watson'
    },
    {
      id: 'h9',
      date: '2025-05-15',
      type: 'visit',
      title: 'Wellness Examination',
      description: 'Annual wellness exam. All vital signs normal. Weight: 32kg. Dental cleaning recommended.',
      veterinarian: 'Dr. Michael Chen'
    },
    {
      id: 'h10',
      date: '2025-03-08',
      type: 'prescription',
      title: 'Heartworm Prevention',
      description: 'Prescribed 6-month supply of heartworm prevention medication (Heartgard Plus).',
      veterinarian: 'Dr. Emily Watson'
    },
    {
      id: 'h11',
      date: '2024-12-20',
      type: 'visit',
      title: 'Skin Allergy Treatment',
      description: 'Diagnosed with environmental allergies. Prescribed antihistamines and medicated shampoo.',
      veterinarian: 'Dr. Michael Chen',
      details: 'Patient presented with itching and red skin patches. Allergy testing recommended if symptoms persist.'
    }
  ]
};

const mockPatients = [
  { id: '1', name: 'Max - Golden Retriever' },
  { id: '2', name: 'Luna - Persian Cat' },
  { id: '3', name: 'Charlie - Labrador' },
  { id: '5', name: 'Rocky - German Shepherd' }
];

export function PatientHistory() {
  const [selectedPatient, setSelectedPatient] = useState('1');
  
  const history = mockHistory[selectedPatient] || [];

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'visit':
        return <Calendar className="w-4 h-4" />;
      case 'vaccination':
        return <Syringe className="w-4 h-4" />;
      case 'prescription':
        return <Pill className="w-4 h-4" />;
      case 'surgery':
        return <FileText className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'visit':
        return 'bg-blue-100 text-blue-800';
      case 'vaccination':
        return 'bg-green-100 text-green-800';
      case 'prescription':
        return 'bg-purple-100 text-purple-800';
      case 'surgery':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="mb-2">Patient History</h1>
        <p className="text-muted-foreground">View complete medical history for patients</p>
      </div>

      <div className="mb-6">
        <label className="text-sm mb-2 block">Select Patient</label>
        <Select value={selectedPatient} onValueChange={setSelectedPatient}>
          <SelectTrigger className="w-full md:w-96">
            <SelectValue placeholder="Select a patient" />
          </SelectTrigger>
          <SelectContent>
            {mockPatients.map((patient) => (
              <SelectItem key={patient.id} value={patient.id}>
                {patient.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList>
          <TabsTrigger value="all">All Records</TabsTrigger>
          <TabsTrigger value="visits">Visits</TabsTrigger>
          <TabsTrigger value="vaccinations">Vaccinations</TabsTrigger>
          <TabsTrigger value="surgeries">Surgeries</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="mt-6">
          <div className="space-y-4">
            {history.map((entry) => (
              <Card key={entry.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="flex items-center gap-2">
                        {getTypeIcon(entry.type)}
                        {entry.title}
                      </CardTitle>
                      <p className="text-sm text-muted-foreground">
                        {new Date(entry.date).toLocaleDateString()} • {entry.veterinarian}
                      </p>
                    </div>
                    <Badge className={getTypeColor(entry.type)}>
                      {entry.type}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Description:</p>
                      <p>{entry.description}</p>
                    </div>
                    {entry.details && (
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Details:</p>
                        <p className="text-sm">{entry.details}</p>
                      </div>
                    )}
                    {entry.notes && (
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Notes:</p>
                        <p className="text-sm">{entry.notes}</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="visits" className="mt-6">
          <div className="space-y-4">
            {history.filter(e => e.type === 'visit').map((entry) => (
              <Card key={entry.id}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    {getTypeIcon(entry.type)}
                    {entry.title}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {new Date(entry.date).toLocaleDateString()} • {entry.veterinarian}
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Description:</p>
                      <p>{entry.description}</p>
                    </div>
                    {entry.details && (
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Details:</p>
                        <p className="text-sm">{entry.details}</p>
                      </div>
                    )}
                    {entry.notes && (
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Notes:</p>
                        <p className="text-sm">{entry.notes}</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="vaccinations" className="mt-6">
          <div className="space-y-4">
            {history.filter(e => e.type === 'vaccination').map((entry) => (
              <Card key={entry.id}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    {getTypeIcon(entry.type)}
                    {entry.title}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {new Date(entry.date).toLocaleDateString()} • {entry.veterinarian}
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Description:</p>
                      <p>{entry.description}</p>
                    </div>
                    {entry.details && (
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Details:</p>
                        <p className="text-sm">{entry.details}</p>
                      </div>
                    )}
                    {entry.notes && (
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Notes:</p>
                        <p className="text-sm">{entry.notes}</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="surgeries" className="mt-6">
          <div className="space-y-4">
            {history.filter(e => e.type === 'surgery').map((entry) => (
              <Card key={entry.id}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    {getTypeIcon(entry.type)}
                    {entry.title}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {new Date(entry.date).toLocaleDateString()} • {entry.veterinarian}
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Description:</p>
                      <p>{entry.description}</p>
                    </div>
                    {entry.details && (
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Details:</p>
                        <p className="text-sm">{entry.details}</p>
                      </div>
                    )}
                    {entry.notes && (
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Notes:</p>
                        <p className="text-sm">{entry.notes}</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {history.length === 0 && (
        <div className="text-center py-12">
          <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">No history records found</p>
        </div>
      )}
    </div>
  );
}