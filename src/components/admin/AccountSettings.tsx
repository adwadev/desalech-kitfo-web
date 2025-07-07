import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { User, Key, Save, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';
import { API_ENDPOINTS } from '@/lib/api';

const profileSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  fullName: z.string().min(1, 'Full name is required'),
  currentPassword: z.string().optional(),
  newPassword: z.string().optional(),
  confirmPassword: z.string().optional(),
}).refine((data) => {
  if (data.newPassword || data.confirmPassword) {
    return data.currentPassword && data.newPassword && data.confirmPassword;
  }
  return true;
}, {
  message: "Current password is required when setting a new password",
  path: ["currentPassword"]
}).refine((data) => {
  if (data.newPassword && data.confirmPassword) {
    return data.newPassword === data.confirmPassword;
  }
  return true;
}, {
  message: "New passwords don't match",
  path: ["confirmPassword"]
}).refine((data) => {
  if (data.newPassword) {
    return data.newPassword.length >= 6;
  }
  return true;
}, {
  message: "New password must be at least 6 characters long",
  path: ["newPassword"]
});

type ProfileFormData = z.infer<typeof profileSchema>;

interface AdminData {
  id: number;
  username: string;
  fullName: string;
}

interface AccountSettingsProps {
  admin: AdminData;
  token: string;
}

const AccountSettings = ({ admin, token }: AccountSettingsProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      username: admin.username,
      fullName: admin.fullName || '',
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data: ProfileFormData) => {
    setIsLoading(true);
    
    try {
      const updateData: any = {
        username: data.username,
        fullName: data.fullName,
      };

      // Only include password fields if changing password
      if (data.newPassword) {
        updateData.currentPassword = data.currentPassword;
        updateData.newPassword = data.newPassword;
      }

      const response = await fetch(API_ENDPOINTS.adminProfile, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update profile');
      }

      const result = await response.json();
      
      // Clear password fields
      form.setValue('currentPassword', '');
      form.setValue('newPassword', '');
      form.setValue('confirmPassword', '');
      
      toast.success('Profile updated successfully!', {
        description: data.newPassword ? 'Your username, full name, and password have been updated.' : 'Your profile information has been updated.',
      });

    } catch (error) {
      console.error('Update profile error:', error);
      toast.error('Update Failed', {
        description: error instanceof Error ? error.message : 'Please try again later.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Account Settings
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Manage your admin account information and security settings
          </p>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Profile Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-coffee-brown">Profile Information</h3>
                
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-coffee-brown font-semibold">Username</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Enter username" 
                          className="border-border focus:border-spiced-red" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-coffee-brown font-semibold">Full Name</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Enter your full name" 
                          className="border-border focus:border-spiced-red" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Separator />

              {/* Password Change */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Key className="h-5 w-5 text-coffee-brown" />
                  <h3 className="text-lg font-semibold text-coffee-brown">Change Password</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Leave password fields empty if you don't want to change your password
                </p>

                <FormField
                  control={form.control}
                  name="currentPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-coffee-brown font-semibold">Current Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input 
                            type={showCurrentPassword ? 'text' : 'password'}
                            placeholder="Enter current password" 
                            className="border-border focus:border-spiced-red pr-10" 
                            {...field} 
                          />
                          <button
                            type="button"
                            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-coffee-brown transition-colors"
                          >
                            {showCurrentPassword ? (
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="newPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-coffee-brown font-semibold">New Password</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input 
                              type={showNewPassword ? 'text' : 'password'}
                              placeholder="Enter new password" 
                              className="border-border focus:border-spiced-red pr-10" 
                              {...field} 
                            />
                            <button
                              type="button"
                              onClick={() => setShowNewPassword(!showNewPassword)}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-coffee-brown transition-colors"
                            >
                              {showNewPassword ? (
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

                  <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-coffee-brown font-semibold">Confirm New Password</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input 
                              type={showConfirmPassword ? 'text' : 'password'}
                              placeholder="Confirm new password" 
                              className="border-border focus:border-spiced-red pr-10" 
                              {...field} 
                            />
                            <button
                              type="button"
                              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-coffee-brown transition-colors"
                            >
                              {showConfirmPassword ? (
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
                </div>
              </div>

              {/* Save Button */}
              <div className="flex justify-end pt-4">
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="bg-spiced-red hover:bg-spiced-red/90 text-white font-semibold px-8 py-3"
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Updating...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Save className="h-4 w-4" />
                      Save Changes
                    </div>
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* Current Account Info */}
      <Card>
        <CardHeader>
          <CardTitle>Current Account Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between items-center py-2 border-b border-border">
              <span className="text-muted-foreground">Admin ID:</span>
              <span className="font-medium">{admin.id}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-border">
              <span className="text-muted-foreground">Current Username:</span>
              <span className="font-medium">{admin.username}</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-muted-foreground">Current Full Name:</span>
              <span className="font-medium">{admin.fullName || 'Not set'}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AccountSettings;