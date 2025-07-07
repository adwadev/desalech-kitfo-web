import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Shield, Eye, EyeOff, LogIn } from 'lucide-react';
import { toast } from 'sonner';
import { API_ENDPOINTS } from '@/lib/api';

const loginSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(1, 'Password is required'),
});

type LoginFormData = z.infer<typeof loginSchema>;

interface AdminLoginProps {
  onLoginSuccess: (token: string, admin: any) => void;
}

const AdminLogin = ({ onLoginSuccess }: AdminLoginProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    
    try {
      const response = await fetch(API_ENDPOINTS.login, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Login failed');
      }

      const result = await response.json();
      
      // Store token in localStorage
      localStorage.setItem('admin_token', result.token);
      
      toast.success('Welcome back!', {
        description: `Logged in as ${result.admin.username}`,
      });

      // Call the success callback
      onLoginSuccess(result.token, result.admin);

    } catch (error) {
      console.error('Login error:', error);
      toast.error('Login Failed', {
        description: error instanceof Error ? error.message : 'Please check your credentials and try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-coffee-brown via-spiced-red to-coffee-brown flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white shadow-2xl border-0">
        <CardHeader className="text-center pb-6">
          <div className="w-16 h-16 bg-spiced-red rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="h-8 w-8 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold text-coffee-brown">
            Admin Dashboard
          </CardTitle>
          <p className="text-muted-foreground">
            Desalegn Kitfo Feedback Management
          </p>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Username */}
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-coffee-brown font-semibold">
                      Username
                    </FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Enter your username" 
                        className="border-border focus:border-spiced-red" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Password */}
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-coffee-brown font-semibold">
                      Password
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input 
                          type={showPassword ? 'text' : 'password'}
                          placeholder="Enter your password" 
                          className="border-border focus:border-spiced-red pr-10" 
                          {...field} 
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-coffee-brown transition-colors"
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Login Button */}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-spiced-red hover:bg-spiced-red/90 text-white font-semibold py-3"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Signing In...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <LogIn className="h-4 w-4" />
                    Sign In
                  </div>
                )}
              </Button>
            </form>
          </Form>

          {/* Default Credentials Info */}
          <div className="mt-6 p-4 bg-injera-cream rounded-lg">
            <p className="text-sm text-coffee-brown text-center">
              <span className="font-semibold">Default Admin:</span><br />
              Username: <code className="bg-white px-2 py-1 rounded text-xs">adwadev</code><br />
              Password: <code className="bg-white px-2 py-1 rounded text-xs">Nati@123</code>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminLogin;