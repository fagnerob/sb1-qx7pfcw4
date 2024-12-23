import React from 'react';
import { Routes, Route } from 'react-router-dom';
import DashboardLayout from '../components/layout/DashboardLayout';
import EquipmentList from '../components/equipment/EquipmentList';
import DailyInspection from '../components/inspection/DailyInspection';
import ReportIssue from '../components/issues/ReportIssue';

function WorkerDashboard() {
  return (
    <DashboardLayout>
      <Routes>
        <Route index element={<EquipmentList />} />
        <Route path="inspection" element={<DailyInspection />} />
        <Route path="report-issue" element={<ReportIssue />} />
      </Routes>
    </DashboardLayout>
  );
}

export default WorkerDashboard;