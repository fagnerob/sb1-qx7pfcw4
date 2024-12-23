import React from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';

function SupervisorDashboard() {
  return (
    <DashboardLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Painel do Supervisor</h1>
        {/* Supervisor dashboard content will be implemented here */}
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <span className="text-yellow-700">
                Em desenvolvimento: O painel do supervisor será implementado em breve.
              </span>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default SupervisorDashboard;