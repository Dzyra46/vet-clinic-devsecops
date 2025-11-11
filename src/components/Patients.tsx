import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';
import { Input } from './ui/Input';
import { Badge } from './ui/Badge';
import { Search, Dog, Cat, Bird } from 'lucide-react';
import { Avatar, AvatarFallback } from './ui/Avatar';

interface Patient {
  id: string;
  name: string;
  species: 'dog' | 'cat' | 'bird' | 'other';
  breed: string;
  age: number;
  owner: string;
  lastVisit: string;
  status: 'healthy' | 'treatment' | 'critical';
}

const mockPatients: Patient[] = [
  {
    id: '1',
    name: 'Max',
    species: 'dog',
    breed: 'Golden Retriever',
    age: 5,
    owner: 'John Smith',
    lastVisit: '2025-10-10',
    status: 'treatment'
  },
  {
    id: '2',
    name: 'Luna',
    species: 'cat',
    breed: 'Persian',
    age: 3,
    owner: 'Sarah Johnson',
    lastVisit: '2025-10-12',
    status: 'healthy'
  },
  {
    id: '3',
    name: 'Charlie',
    species: 'dog',
    breed: 'Labrador',
    age: 7,
    owner: 'Mike Davis',
    lastVisit: '2025-10-14',
    status: 'treatment'
  },
  {
    id: '4',
    name: 'Tweety',
    species: 'bird',
    breed: 'Canary',
    age: 2,
    owner: 'Emily Brown',
    lastVisit: '2025-10-05',
    status: 'healthy'
  },
  {
    id: '5',
    name: 'Rocky',
    species: 'dog',
    breed: 'German Shepherd',
    age: 6,
    owner: 'David Wilson',
    lastVisit: '2025-10-15',
    status: 'treatment'
  }
];

export function Patients() {
  const [searchQuery, setSearchQuery] = useState('');
  
  const filteredPatients = mockPatients.filter(patient =>
    patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    patient.owner.toLowerCase().includes(searchQuery.toLowerCase()) ||
    patient.breed.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getSpeciesIcon = (species: string) => {
    switch (species) {
      case 'dog':
        return <Dog className="w-5 h-5" />;
      case 'cat':
        return <Cat className="w-5 h-5" />;
      case 'bird':
        return <Bird className="w-5 h-5" />;
      default:
        return <Dog className="w-5 h-5" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
        return 'bg-green-100 text-green-800';
      case 'treatment':
        return 'bg-blue-100 text-blue-800';
      case 'critical':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="mb-2">Patients</h1>
        <p className="text-muted-foreground">Manage all registered patients</p>
      </div>

      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search by patient name, owner, or breed..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredPatients.map((patient) => (
          <Card key={patient.id} className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12 bg-blue-100">
                    <AvatarFallback className="bg-blue-100 text-blue-700">
                      {getSpeciesIcon(patient.species)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle>{patient.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">{patient.breed}</p>
                  </div>
                </div>
                <Badge className={getStatusColor(patient.status)}>
                  {patient.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Age</span>
                  <span className="text-sm">{patient.age} years</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Owner</span>
                  <span className="text-sm">{patient.owner}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Last Visit</span>
                  <span className="text-sm">{new Date(patient.lastVisit).toLocaleDateString()}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredPatients.length === 0 && (
        <div className="text-center py-12">
          <Dog className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">No patients found</p>
        </div>
      )}
    </div>
  );
}