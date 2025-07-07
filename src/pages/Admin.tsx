import { useState, useEffect } from 'react';
import AdminLogin from '@/components/admin/AdminLogin';
import AdminDashboard from '@/components/admin/AdminDashboard';
import { toast } from 'sonner';

interface AdminData {
  id: number;
  username: string;
  fullName: string;
}

const Admin = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [admin, setAdmin] = useState<AdminData | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing token on component mount
  useEffect(() => {
    const checkExistingAuth = async () => {
      const storedToken = localStorage.getItem('admin_token');
      
      if (storedToken) {
        try {
          // Verify token with backend
          const response = await fetch('http://localhost:3001/api/auth/verify', {
            headers: {
              'Authorization': `Bearer ${storedToken}`,
            },
          });

          if (response.ok) {
            const result = await response.json();
            setToken(storedToken);
            setAdmin(result.admin);
            setIsAuthenticated(true);
          } else {
            // Token is invalid, remove it
            localStorage.removeItem('admin_token');
          }
        } catch (error) {
          console.error('Token verification failed:', error);
          localStorage.removeItem('admin_token');
        }
      }
      
      setIsLoading(false);
    };

    checkExistingAuth();
  }, []);

  const handleLoginSuccess = (newToken: string, adminData: AdminData) => {
    setToken(newToken);
    setAdmin(adminData);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    setToken(null);
    setAdmin(null);
    setIsAuthenticated(false);
    toast.success('Logged out successfully');
  };

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-coffee-brown via-spiced-red to-coffee-brown flex items-center justify-center">
        <div className="text-center text-white">
          <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p>Checking authentication...</p>
        </div>
      </div>
    );
  }

  // Show login form if not authenticated
  if (!isAuthenticated || !admin || !token) {
    return <AdminLogin onLoginSuccess={handleLoginSuccess} />;
  }

  // Show dashboard if authenticated
  return (
    <AdminDashboard 
      admin={admin} 
      token={token} 
      onLogout={handleLogout} 
    />
  );
};

export default Admin;