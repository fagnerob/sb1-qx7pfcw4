import React from 'react';
import { Routes, Route } from 'react-router-dom';
import DashboardLayout from '../components/layout/DashboardLayout';
import UserManagement from '../components/admin/UserManagement';

function AdminDashboard() {
  return (
    <DashboardLayout>
      <Routes>
        <Route index element={<UserManagement />} />
      </Routes>
    </DashboardLayout>
  );
}

export default AdminDashboard;