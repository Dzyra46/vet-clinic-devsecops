'use client';

import { useState, useEffect } from 'react';
import { Card } from './ui/Card';
import { Input } from './ui/Input';
import { Search, FileText, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { Badge } from './ui/Badge';
import { Button } from './ui/Button';
import { toast } from 'sonner';

interface AuditLog {
  id: string;
  user_id: string;
  user_name: string;
  user_role: 'admin' | 'doctor' | 'pet-owner';
  action: string;
  resource: string;
  details: string;
  ip_address?: string;
  status: 'success' | 'failure';
  timestamp: string;
}

interface PaginationInfo {
  total: number;
  limit: number;
  offset: number;
  hasMore: boolean;
}

export function AuditLogs() {
  const [searchQuery, setSearchQuery] = useState('');
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [filteredLogs, setFilteredLogs] = useState<AuditLog[]>([]);
  const [filterAction, setFilterAction] = useState('');
  const [filterRole, setFilterRole] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [pagination, setPagination] = useState<PaginationInfo>({ limit: 50, offset: 0, total: 0, hasMore: false });

  // Fetch logs on mount and when filters change
  useEffect(() => {
    fetchLogs();
  }, [filterAction, filterRole, filterStatus, pagination.offset]);

  // Filter logs by search query
  useEffect(() => {
    if (!searchQuery) {
      setFilteredLogs(logs);
    } else {
      const q = searchQuery.toLowerCase();
      setFilteredLogs(
        logs.filter(
          (log) =>
            log.user_name.toLowerCase().includes(q) ||
            log.details.toLowerCase().includes(q) ||
            log.resource.toLowerCase().includes(q)
        )
      );
    }
  }, [searchQuery, logs]);

  const fetchLogs = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        limit: String(pagination.limit),
        offset: String(pagination.offset),
      });

      if (filterAction) params.append('action', filterAction);
      if (filterRole) params.append('userRole', filterRole);
      if (filterStatus) params.append('status', filterStatus);

      const res = await fetch(`/api/audit-logs?${params}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Gagal mengambil audit logs');
      }

      const data = await res.json();
      setLogs(data.logs || []);
      setPagination(data.pagination || { total: 0, limit: 50, offset: 0, hasMore: false });
    } catch (err) {
      console.error('Fetch error:', err);
      toast.error(err instanceof Error ? err.message : 'Gagal mengambil audit logs');
      setLogs([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteOldLogs = async () => {
    if (
      !confirm(
        'Apakah Anda yakin ingin menghapus audit logs lebih dari 30 hari? Action ini tidak dapat dibatalkan!'
      )
    ) {
      return;
    }
    

    setIsDeleting(true);
    try {
      const res = await fetch('/api/audit-logs?olderThanDays=30', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Gagal menghapus logs');
      }

      toast.success('Audit logs lama berhasil dihapus');
      await fetchLogs();
    } catch (err) {
      console.error('Delete error:', err);
      toast.error(err instanceof Error ? err.message : 'Gagal menghapus logs');
    } finally {
      setIsDeleting(false);
    }
  };

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'create':
        return <FileText className="w-4 h-4" />;
      case 'update':
        return <AlertCircle className="w-4 h-4" />;
      case 'delete':
        return <XCircle className="w-4 h-4" />;
      case 'approve':
      case 'reject':
      case 'view':
        return <CheckCircle className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case 'create':
        return 'bg-green-100 text-green-800';
      case 'update':
        return 'bg-blue-100 text-blue-800';
      case 'delete':
        return 'bg-red-100 text-red-800';
      case 'approve':
        return 'bg-green-100 text-green-800';
      case 'reject':
        return 'bg-red-100 text-red-800';
      case 'view':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-purple-100 text-purple-800';
      case 'doctor':
        return 'bg-blue-100 text-blue-800';
      case 'pet-owner':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    return status === 'success' ? (
      <CheckCircle className="w-4 h-4 text-green-600" />
    ) : (
      <XCircle className="w-4 h-4 text-red-600" />
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-6 space-y-2">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Audit Logs</h1>
          <Button
            onClick={handleDeleteOldLogs}
            disabled={isDeleting}
            variant="secondary"
            className="text-xs"
          >
            {isDeleting ? 'Deleting...' : 'Delete Old Logs'}
          </Button>
        </div>
        <p className="text-gray-600 text-sm">
          Total: {pagination.total} logs
        </p>
      </div>

      {/* Filters */}
      <div className="mb-5 space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <Input
            type="text"
            placeholder="Search user / resource / details..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-medium mb-2">Action</label>
            <select
              aria-label="Filter by action"
              value={filterAction}
              onChange={(e) => {
                setFilterAction(e.target.value);
                setPagination({ ...pagination, offset: 0 });
              }}
              className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Actions</option>
              <option value="create">Create</option>
              <option value="view">View</option>
              <option value="update">Update</option>
              <option value="delete">Delete</option>
              <option value="approve">Approve</option>
              <option value="reject">Reject</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium mb-2">Role</label>
            <select
              aria-label="Filter by role"
              value={filterRole}
              onChange={(e) => {
                setFilterRole(e.target.value);
                setPagination({ ...pagination, offset: 0 });
              }}
              className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Roles</option>
              <option value="admin">Admin</option>
              <option value="doctor">Doctor</option>
              <option value="pet-owner">Pet Owner</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium mb-2">Status</label>
            <select
              aria-label="Filter by status"
              value={filterStatus}
              onChange={(e) => {
                setFilterStatus(e.target.value);
                setPagination({ ...pagination, offset: 0 });
              }}
              className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Status</option>
              <option value="success">Success</option>
              <option value="failure">Failure</option>
            </select>
          </div>
        </div>
      </div>

      {/* Logs Table */}
      {isLoading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
          <p className="text-gray-500 text-sm mt-4">Loading logs...</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredLogs.map((log) => (
            <Card
              key={log.id}
              className="p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3 flex-1">
                  <div className="pt-1">
                    {getActionIcon(log.action)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge className={getActionColor(log.action)}>
                        {log.action.toUpperCase()}
                      </Badge>
                      <Badge className={getRoleColor(log.user_role)}>
                        {log.user_role}
                      </Badge>
                      <span className="text-xs font-medium">
                        {log.user_name}
                      </span>
                      {getStatusIcon(log.status)}
                    </div>
                    <p className="text-xs text-gray-600 mt-2">
                      {log.details}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      Resource: {log.resource}
                    </p>
                    {log.ip_address && (
                      <p className="text-xs text-gray-400">
                        IP: {log.ip_address}
                      </p>
                    )}
                  </div>
                </div>
                <div className="text-xs text-gray-500 whitespace-nowrap flex-shrink-0">
                  {new Date(log.timestamp).toLocaleDateString(undefined, {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {!isLoading && filteredLogs.length === 0 && (
        <div className="text-center py-12">
          <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 text-sm">No audit logs found</p>
        </div>
      )}

      {/* Pagination */}
      {!isLoading && pagination.total > 0 && (
        <div className="mt-6 flex items-center justify-between">
          <p className="text-xs text-gray-600">
            Showing {pagination.offset + 1}-
            {Math.min(
              pagination.offset + pagination.limit,
              pagination.total
            )}{' '}
            of {pagination.total}
          </p>
          <div className="flex gap-2">
            <Button
              onClick={() =>
                setPagination({
                  ...pagination,
                  offset: Math.max(0, pagination.offset - pagination.limit),
                })
              }
              disabled={pagination.offset === 0}
              variant="secondary"
              className="text-xs"
            >
              Previous
            </Button>
            <Button
              onClick={() =>
                setPagination({
                  ...pagination,
                  offset: pagination.offset + pagination.limit,
                })
              }
              disabled={!pagination.hasMore}
              variant="secondary"
              className="text-xs"
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}