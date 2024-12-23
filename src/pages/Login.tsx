import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Shield } from 'lucide-react';
import LoginForm from '../components/auth/LoginForm';

function Login() {
  const { user } = useAuth();

  if (user) {
    return <Navigate to={`/${user.role}`} replace />;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <Shield className="h-12 w-12 text-blue-600" />
        </div>
        <h2 className="mt-3 text-center text-3xl font-bold tracking-tight text-gray-900">
          Sistema de Gestão de EPIs
        </h2>
      </div>
      <LoginForm />
    </div>
  );
}

export default Login;