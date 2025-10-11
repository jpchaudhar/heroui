'use client';

import { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { FiUsers, FiFileText, FiDollarSign } from 'react-icons/fi';

export default function AdminPage() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalDocuments: 0,
    activeSubscriptions: 0,
  });

  useEffect(() => {
    fetchAdminStats();
  }, []);

  const fetchAdminStats = async () => {
    try {
      const response = await fetch('/api/admin/stats');
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Error fetching admin stats:', error);
    }
  };

  return (
    <DashboardLayout isAdmin={true}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage templates, users, and system settings
          </p>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-6">
          <StatsCard
            title="Total Users"
            value={stats.totalUsers}
            icon={<FiUsers className="w-6 h-6 text-blue-600" />}
          />
          <StatsCard
            title="Total Documents"
            value={stats.totalDocuments}
            icon={<FiFileText className="w-6 h-6 text-blue-600" />}
          />
          <StatsCard
            title="Active Subscriptions"
            value={stats.activeSubscriptions}
            icon={<FiDollarSign className="w-6 h-6 text-blue-600" />}
          />
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Quick Actions</h2>
          </CardHeader>
          <CardBody>
            <div className="grid md:grid-cols-2 gap-4">
              <Button onClick={() => alert('Template management coming soon')}>
                Manage Templates
              </Button>
              <Button variant="outline" onClick={() => alert('User management coming soon')}>
                View All Users
              </Button>
            </div>
          </CardBody>
        </Card>
      </div>
    </DashboardLayout>
  );
}
