import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Star, User, Calendar, MapPin, Heart, ChevronLeft, ChevronRight } from 'lucide-react';
import { format } from 'date-fns';
import { API_ENDPOINTS } from '@/lib/api';

interface Feedback {
  id: number;
  customer_name: string;
  rating: number;
  review_text: string;
  dish_favorite?: string;
  visit_date?: string;
  location: string;
  created_at: string;
}

interface FeedbackStats {
  totalReviews: number;
  averageRating: string;
  ratingBreakdown: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
}

interface PaginationInfo {
  total: number;
  limit: number;
  offset: number;
  hasMore: boolean;
}

const PublicFeedback = () => {
  const [feedback, setFeedback] = useState<Feedback[]>([]);
  const [stats, setStats] = useState<FeedbackStats | null>(null);
  const [pagination, setPagination] = useState<PaginationInfo>({
    total: 0,
    limit: 6,
    offset: 0,
    hasMore: false,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const fetchFeedback = async (offset = 0, replace = true) => {
    try {
      if (offset === 0) setIsLoading(true);
      else setIsLoadingMore(true);

      const response = await fetch(
        `${API_ENDPOINTS.publicFeedback}?limit=${pagination.limit}&offset=${offset}`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch feedback');
      }

      const data = await response.json();
      
      if (replace) {
        setFeedback(data.feedback);
      } else {
        setFeedback(prev => [...prev, ...data.feedback]);
      }
      
      setPagination({
        ...pagination,
        total: data.pagination.total,
        offset: data.pagination.offset,
        hasMore: data.pagination.hasMore,
      });

    } catch (error) {
      console.error('Error fetching feedback:', error);
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch(API_ENDPOINTS.feedbackStats);
      
      if (!response.ok) {
        throw new Error('Failed to fetch stats');
      }

      const statsData = await response.json();
      setStats(statsData);

    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  useEffect(() => {
    fetchFeedback();
    fetchStats();
  }, []);

  const loadMore = () => {
    const newOffset = pagination.offset + pagination.limit;
    fetchFeedback(newOffset, false);
  };

  const renderStars = (rating: number, size = 'small') => {
    const starClass = size === 'small' ? 'h-4 w-4' : 'h-5 w-5';
    
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`${starClass} ${
              star <= rating
                ? 'fill-golden-accent text-golden-accent'
                : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };

  const renderRatingBreakdown = () => {
    if (!stats) return null;

    const totalReviews = stats.totalReviews;
    
    return (
      <div className="space-y-2">
        {[5, 4, 3, 2, 1].map((rating) => {
          const count = stats.ratingBreakdown[rating as keyof typeof stats.ratingBreakdown];
          const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
          
          return (
            <div key={rating} className="flex items-center gap-3 text-sm">
              <span className="flex items-center gap-1 w-12">
                {rating} <Star className="h-3 w-3 fill-golden-accent text-golden-accent" />
              </span>
              <div className="flex-1 bg-gray-200 rounded-full h-2">
                <div
                  className="bg-golden-accent h-2 rounded-full transition-all duration-300"
                  style={{ width: `${percentage}%` }}
                />
              </div>
              <span className="w-8 text-muted-foreground">{count}</span>
            </div>
          );
        })}
      </div>
    );
  };

  if (isLoading) {
    return (
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-spiced-red border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-muted-foreground mt-4">Loading customer reviews...</p>
          </div>
        </div>
      </section>
    );
  }

  if (!feedback.length && !isLoading) {
    return (
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-coffee-brown mb-4">Customer Reviews</h2>
          <p className="text-muted-foreground">
            Be the first to share your experience at Desalegn Kitfo!
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-coffee-brown mb-4">
            What Our Guests Say
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Authentic experiences shared by our valued customers
          </p>
        </div>

        {/* Statistics */}
        {stats && (
          <div className="max-w-4xl mx-auto mb-16">
            <Card className="bg-white shadow-elegant border border-border">
              <CardContent className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {/* Overall Rating */}
                  <div className="text-center">
                    <div className="text-5xl font-bold text-spiced-red mb-2">
                      {stats.averageRating}
                    </div>
                    <div className="flex justify-center mb-2">
                      {renderStars(Math.round(parseFloat(stats.averageRating)), 'large')}
                    </div>
                    <p className="text-muted-foreground">
                      Based on {stats.totalReviews} review{stats.totalReviews !== 1 ? 's' : ''}
                    </p>
                  </div>

                  {/* Rating Breakdown */}
                  <div className="md:col-span-2">
                    <h3 className="font-semibold text-coffee-brown mb-4">Rating Breakdown</h3>
                    {renderRatingBreakdown()}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Feedback Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {feedback.map((review) => (
            <Card
              key={review.id}
              className="bg-white shadow-elegant border border-border hover:shadow-warm transition-all duration-300 hover:-translate-y-1"
            >
              <CardContent className="p-6">
                {/* Header with rating and name */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-injera-cream rounded-full flex items-center justify-center">
                      <User className="h-5 w-5 text-coffee-brown" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-coffee-brown">
                        {review.customer_name}
                      </h4>
                      <div className="flex items-center gap-2">
                        {renderStars(review.rating)}
                        <span className="text-sm text-muted-foreground">
                          {review.rating} star{review.rating !== 1 ? 's' : ''}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Review Text */}
                <p className="text-foreground mb-4 leading-relaxed">
                  "{review.review_text}"
                </p>

                {/* Favorite Dish */}
                {review.dish_favorite && (
                  <div className="flex items-center gap-2 mb-3 text-sm">
                    <Heart className="h-4 w-4 text-spiced-red" />
                    <span className="text-muted-foreground">Loved:</span>
                    <span className="font-medium text-coffee-brown">
                      {review.dish_favorite}
                    </span>
                  </div>
                )}

                {/* Footer with date and location */}
                <div className="border-t border-border pt-4 space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>
                      {review.visit_date
                        ? format(new Date(review.visit_date), 'MMM dd, yyyy')
                        : format(new Date(review.created_at), 'MMM dd, yyyy')
                      }
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span>{review.location}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Load More Button */}
        {pagination.hasMore && (
          <div className="text-center">
            <Button
              onClick={loadMore}
              disabled={isLoadingMore}
              variant="outline"
              className="border-border hover:bg-gray-50 px-8 py-3"
            >
              {isLoadingMore ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-coffee-brown border-t-transparent rounded-full animate-spin" />
                  Loading more...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <ChevronRight className="h-4 w-4" />
                  Load More Reviews
                </div>
              )}
            </Button>
          </div>
        )}

        {/* Footer Message */}
        <div className="text-center mt-16">
          <div className="inline-block bg-injera-cream px-8 py-4 rounded-lg">
            <p className="text-coffee-brown font-medium">
              <span className="text-spiced-red font-bold">Share Your Experience:</span> Your feedback helps us serve you better and guides other food lovers to discover authentic Ethiopian cuisine
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PublicFeedback;