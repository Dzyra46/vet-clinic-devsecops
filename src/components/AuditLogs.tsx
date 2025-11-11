'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';
import { Input } from './ui/Input';
import { Button } from './ui/Button';
import { Badge } from './ui/Badge';
import { Search, Download, Filter, Activity, User, FileText, QrCode, LogIn, LogOut } from 'lucide-react';

import { getLogs, onLogsChanged, seedIfEmpty, LogEntry as StoredLogEntry } from '@/lib/auditLog';

interface LogEntry extends StoredLogEntry {}

const mockLogs: LogEntry[] = [
  {
    id: 'seed-1',
    timestamp: '2025-11-10T10:30:00Z',
    user: 'admin@vetclinic.com',
    userRole: 'admin',
    action: 'create',
    resource: 'Doctor Account',
    details: 'Created new doctor account: Dr. Sarah Martinez',
    ipAddress: '192.168.1.100',
    status: 'success'
  }
];

export function AuditLogs() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterAction, setFilterAction] = useState<string>('all');
  const [filterRole, setFilterRole] = useState<string>('all');
  const [logs, setLogs] = useState<LogEntry[]>(() => {
    // seed once if empty so the table isn't blank on first run
    if (typeof window !== 'undefined') seedIfEmpty(mockLogs);
    return getLogs();
  });

  // live refresh when other pages add logs
  useEffect(() => {
    const unsubscribe = onLogsChanged(() => setLogs(getLogs()));
    return () => { if (unsubscribe) unsubscribe(); };
  }, []);

  const filteredLogs = logs.filter(log => {
    const matchesSearch = 
      log.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.resource.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.details.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesAction = filterAction === 'all' || log.action === filterAction;
    const matchesRole = filterRole === 'all' || log.userRole === filterRole;

    return matchesSearch && matchesAction && matchesRole;
  });

  const exportLogs = () => {
    const csv = [
      ['Timestamp', 'User', 'Role', 'Action', 'Resource', 'Details', 'IP Address', 'Status'],
      ...filteredLogs.map(log => [
        log.timestamp,
        log.user,
        log.userRole,
        log.action,
        log.resource,
        log.details,
        log.ipAddress,
        log.status
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `audit-logs-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'login': return <LogIn className="w-4 h-4" />;
      case 'logout': return <LogOut className="w-4 h-4" />;
      case 'create': return <FileText className="w-4 h-4" />;
      case 'update': return <FileText className="w-4 h-4" />;
      case 'delete': return <FileText className="w-4 h-4" />;
      case 'view': return <Activity className="w-4 h-4" />;
      case 'generate_qr': return <QrCode className="w-4 h-4" />;
      default: return <Activity className="w-4 h-4" />;
    }
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case 'login': return 'bg-blue-100 text-blue-800';
      case 'logout': return 'bg-gray-100 text-gray-800';
      case 'create': return 'bg-green-100 text-green-800';
      case 'update': return 'bg-yellow-100 text-yellow-800';
      case 'delete': return 'bg-red-100 text-red-800';
      case 'view': return 'bg-purple-100 text-purple-800';
      case 'generate_qr': return 'bg-indigo-100 text-indigo-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">System Audit Logs</h1>
        <p className="text-gray-600">Monitor all system activities and user actions</p>
      </div>

      {/* Search and Filters */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="md:col-span-2 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Search by user, resource, or details..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <select
          value={filterAction}
          onChange={(e) => setFilterAction(e.target.value)}
          className="border rounded-md px-3 py-2 bg-white"
        >
          <option value="all">All Actions</option>
          <option value="login">Login</option>
          <option value="logout">Logout</option>
          <option value="create">Create</option>
          <option value="update">Update</option>
          <option value="delete">Delete</option>
          <option value="view">View</option>
          <option value="generate_qr">Generate QR</option>
        </select>

        <select
          value={filterRole}
          onChange={(e) => setFilterRole(e.target.value)}
          className="border rounded-md px-3 py-2 bg-white"
        >
          <option value="all">All Roles</option>
          <option value="admin">Admin</option>
          <option value="doctor">Doctor</option>
          <option value="pet-owner">Pet Owner</option>
        </select>
      </div>

      {/* Export Button */}
      <div className="mb-6 flex justify-between items-center">
        <p className="text-sm text-gray-600">
          Showing {filteredLogs.length} of {logs.length} log entries
        </p>
        <Button onClick={exportLogs} variant="secondary">
          <Download className="w-4 h-4 mr-2" />
          Export CSV
        </Button>
      </div>

      {/* Logs Table */}
      <Card>
        <CardHeader>
          <CardTitle>Activity Log</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">Timestamp</th>
                  <th className="text-left py-3 px-4">User</th>
                  <th className="text-left py-3 px-4">Action</th>
                  <th className="text-left py-3 px-4">Resource</th>
                  <th className="text-left py-3 px-4">Details</th>
                  <th className="text-left py-3 px-4">IP Address</th>
                  <th className="text-left py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredLogs.map((log) => (
                  <tr key={log.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4 text-sm">
                      {new Date(log.timestamp).toLocaleString()}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-gray-400" />
                        <div>
                          <p className="text-sm font-medium">{log.user}</p>
                          <p className="text-xs text-gray-500">{log.userRole}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <Badge className={getActionColor(log.action)}>
                        <span className="flex items-center gap-1">
                          {getActionIcon(log.action)}
                          {log.action.replace('_', ' ')}
                        </span>
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-sm">{log.resource}</td>
                    <td className="py-3 px-4 text-sm text-gray-600">{log.details}</td>
                    <td className="py-3 px-4 text-xs text-gray-500">{log.ipAddress}</td>
                    <td className="py-3 px-4">
                      <Badge
                        className={
                          log.status === 'success'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }
                      >
                        {log.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredLogs.length === 0 && (
            <div className="text-center py-12">
              <Activity className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No logs found</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
