import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { 
  HardHat, 
  ClipboardCheck, 
  AlertTriangle,
  LogOut,
  Menu,
  X
} from 'lucide-react';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const navigation = [
    { name: 'Meus EPIs', href: '/worker', icon: HardHat },
    { name: 'Inspeção Diária', href: '/worker/inspection', icon: ClipboardCheck },
    { name: 'Reportar Problema', href: '/worker/report-issue', icon: AlertTriangle },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-0 right-0 p-4 z-50">
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
        >
          {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-40 w-64 bg-white shadow-lg transform 
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 transition-transform duration-200 ease-in-out
      `}>
        <div className="flex flex-col h-full">
          <div className="px-4 py-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800">Painel do Colaborador</h2>
            <p className="mt-1 text-sm text-gray-600">{user?.full_name}</p>
          </div>

          <nav className="flex-1 px-2 py-4 space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className="flex items-center px-4 py-2 text-gray-600 rounded-md hover:bg-gray-100 hover:text-gray-900"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Icon className="h-5 w-5 mr-3" />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          <div className="p-4 border-t border-gray-200">
            <button
              onClick={handleSignOut}
              className="flex items-center w-full px-4 py-2 text-gray-600 rounded-md hover:bg-gray-100 hover:text-gray-900"
            >
              <LogOut className="h-5 w-5 mr-3" />
              Sair
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout;