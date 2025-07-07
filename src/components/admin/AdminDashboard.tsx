import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BarChart3, 
  MessageSquare, 
  CheckCircle, 
  XCircle, 
  Trash2, 
  Star, 
  User, 
  Calendar, 
  MapPin, 
  Heart,
  Settings,
  LogOut,
  Phone,
  Clock,
  Users,
  TrendingUp
} from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';
import AccountSettings from './AccountSettings';
import { API_ENDPOINTS } from '@/lib/api';

interface Feedback {
  id: number;
  customer_name: string;
  phone: string;
  rating: number;
  review_text: string;
  dish_favorite?: string;
  visit_date?: string;
  location: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  updated_at: string;
}

interface AdminStats {
  totalFeedback: number;
  pendingCount: number;
  approvedCount: number;
  rejectedCount: number;
  averageRating: string;
  todayCount: number;
}

interface AdminData {
  id: number;
  username: string;
  fullName: string;
}

interface AdminDashboardProps {
  admin: AdminData;
  token: string;
  onLogout: () => void;
}

const AdminDashboard = ({ admin, token, onLogout }: AdminDashboardProps) => {
  const [feedback, setFeedback] = useState<Feedback[]>([]);
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string>('pending');
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState<number | null>(null);

  const fetchFeedback = async (status = 'pending') => {
    try {
      setIsLoading(true);
      const response = await fetch(
        `${API_ENDPOINTS.adminFeedback}?status=${status}&limit=50`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch feedback');
      }

      const data = await response.json();
      setFeedback(data.feedback);
    } catch (error) {
      console.error('Error fetching feedback:', error);
      toast.error('Failed to fetch feedback');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch(API_ENDPOINTS.adminStats, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch stats');
      }

      const statsData = await response.json();
      setStats(statsData);
    } catch (error) {
      console.error('Error fetching stats:', error);
      toast.error('Failed to fetch statistics');
    }
  };

  useEffect(() => {
    fetchStats();
    fetchFeedback(selectedStatus);
  }, [selectedStatus, token]);

  const updateFeedbackStatus = async (id: number, status: 'approved' | 'rejected' | 'pending') => {
    try {
      setIsUpdating(id);
      const response = await fetch(
        API_ENDPOINTS.updateFeedbackStatus(id),
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({ status }),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to update feedback');
      }

      // Remove from current list if status changed
      setFeedback(prev => prev.filter(item => item.id !== id));
      
      // Refresh stats
      fetchStats();
      
      toast.success(`Feedback ${status} successfully`);
    } catch (error) {
      console.error('Error updating feedback:', error);
      toast.error('Failed to update feedback');
    } finally {
      setIsUpdating(null);
    }
  };

  const deleteFeedback = async (id: number) => {
    if (!confirm('Are you sure you want to delete this feedback? This action cannot be undone.')) {
      return;
    }

    try {
      setIsUpdating(id);
      const response = await fetch(
        API_ENDPOINTS.deleteFeedback(id),
        {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to delete feedback');
      }

      setFeedback(prev => prev.filter(item => item.id !== id));
      fetchStats();
      
      toast.success('Feedback deleted successfully');
    } catch (error) {
      console.error('Error deleting feedback:', error);
      toast.error('Failed to delete feedback');
    } finally {
      setIsUpdating(null);
    }
  };

  const renderStars = (rating: number) => (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`h-4 w-4 ${
            star <= rating
              ? 'fill-golden-accent text-golden-accent'
              : 'text-gray-300'
          }`}
        />
      ))}
    </div>
  );

  const getStatusBadge = (status: string) => {
    const variants = {
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      approved: 'bg-green-100 text-green-800 border-green-200',
      rejected: 'bg-red-100 text-red-800 border-red-200',
    };

    return (
      <Badge className={variants[status as keyof typeof variants]}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-spiced-red rounded-lg flex items-center justify-center">
                <MessageSquare className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-coffee-brown">
                  Desalegn Kitfo Admin
                </h1>
                <p className="text-sm text-muted-foreground">
                  Feedback Management Dashboard
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">
                Welcome, <span className="font-medium text-coffee-brown">{admin.fullName || admin.username}</span>
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={onLogout}
                className="border-border hover:bg-gray-50"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="feedback">Manage Feedback</TabsTrigger>
            <TabsTrigger value="settings">Account Settings</TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-6">
            {/* Statistics Cards */}
            {stats && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Total Reviews</p>
                        <p className="text-2xl font-bold text-coffee-brown">{stats.totalFeedback}</p>
                      </div>
                      <Users className="h-8 w-8 text-spiced-red" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Pending Approval</p>
                        <p className="text-2xl font-bold text-yellow-600">{stats.pendingCount}</p>
                      </div>
                      <Clock className="h-8 w-8 text-yellow-600" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Approved</p>
                        <p className="text-2xl font-bold text-green-600">{stats.approvedCount}</p>
                      </div>
                      <CheckCircle className="h-8 w-8 text-green-600" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Average Rating</p>
                        <p className="text-2xl font-bold text-golden-accent">{stats.averageRating}</p>
                      </div>
                      <TrendingUp className="h-8 w-8 text-golden-accent" />
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  {stats?.todayCount || 0} new review{stats?.todayCount !== 1 ? 's' : ''} submitted today
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Feedback Management Tab */}
          <TabsContent value="feedback" className="space-y-6">
            {/* Status Filter */}
            <div className="flex gap-2">
              {['pending', 'approved', 'rejected', 'all'].map((status) => (
                <Button
                  key={status}
                  variant={selectedStatus === status ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedStatus(status)}
                  className={selectedStatus === status ? 'bg-spiced-red hover:bg-spiced-red/90' : ''}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </Button>
              ))}
            </div>

            {/* Feedback List */}
            <div className="space-y-4">
              {isLoading ? (
                <div className="text-center py-8">
                  <div className="w-8 h-8 border-2 border-spiced-red border-t-transparent rounded-full animate-spin mx-auto" />
                  <p className="text-muted-foreground mt-4">Loading feedback...</p>
                </div>
              ) : feedback.length === 0 ? (
                <Card>
                  <CardContent className="text-center py-8">
                    <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">
                      No {selectedStatus !== 'all' ? selectedStatus : ''} feedback found
                    </p>
                  </CardContent>
                </Card>
              ) : (
                feedback.map((item) => (
                  <Card key={item.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-injera-cream rounded-full flex items-center justify-center">
                            <User className="h-5 w-5 text-coffee-brown" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-coffee-brown">
                              {item.customer_name}
                            </h4>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <Phone className="h-4 w-4" />
                                {item.phone}
                              </div>
                              <div className="flex items-center gap-1">
                                <Calendar className="h-4 w-4" />
                                {format(new Date(item.created_at), 'MMM dd, yyyy')}
                              </div>
                              <div className="flex items-center gap-1">
                                <MapPin className="h-4 w-4" />
                                {item.location}
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-3">
                          {renderStars(item.rating)}
                          {getStatusBadge(item.status)}
                        </div>
                      </div>

                      <p className="text-foreground mb-4 leading-relaxed">
                        "{item.review_text}"
                      </p>

                      {item.dish_favorite && (
                        <div className="flex items-center gap-2 mb-4 text-sm">
                          <Heart className="h-4 w-4 text-spiced-red" />
                          <span className="text-muted-foreground">Favorite dish:</span>
                          <span className="font-medium text-coffee-brown">
                            {item.dish_favorite}
                          </span>
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div className="flex gap-2 pt-4 border-t border-border">
                        {item.status === 'pending' && (
                          <>
                            <Button
                              size="sm"
                              onClick={() => updateFeedbackStatus(item.id, 'approved')}
                              disabled={isUpdating === item.id}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => updateFeedbackStatus(item.id, 'rejected')}
                              disabled={isUpdating === item.id}
                            >
                              <XCircle className="h-4 w-4 mr-2" />
                              Reject
                            </Button>
                          </>
                        )}
                        
                        {(item.status === 'approved' || item.status === 'rejected') && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateFeedbackStatus(item.id, 'pending')}
                            disabled={isUpdating === item.id}
                          >
                            <Clock className="h-4 w-4 mr-2" />
                            Mark Pending
                          </Button>
                        )}

                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => deleteFeedback(item.id)}
                          disabled={isUpdating === item.id}
                          className="text-red-600 hover:text-red-700 hover:border-red-300"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          {/* Account Settings Tab */}
          <TabsContent value="settings">
            <AccountSettings admin={admin} token={token} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;