import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Star, Send, MessageCircle } from 'lucide-react';
import { toast } from 'sonner';
import { API_ENDPOINTS } from '@/lib/api';

const feedbackSchema = z.object({
  customer_name: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z.string().regex(/^[\+]?[0-9\s\-\(\)]{10,15}$/, 'Please enter a valid phone number'),
  rating: z.number().min(1, 'Please select a rating').max(5),
  review_text: z.string().min(10, 'Please write at least 10 characters'),
  dish_favorite: z.string().optional(),
  visit_date: z.string().optional(),
  location: z.string().optional(),
});

type FeedbackFormData = z.infer<typeof feedbackSchema>;

const STORAGE_KEY = 'desalegn_kitfo_feedback_draft';

const FeedbackForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedRating, setSelectedRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);

  const form = useForm<FeedbackFormData>({
    resolver: zodResolver(feedbackSchema),
    defaultValues: {
      customer_name: '',
      phone: '',
      rating: 0,
      review_text: '',
      dish_favorite: '',
      visit_date: '',
      location: 'Main Branch',
    },
  });

  const watchedValues = form.watch();

  // Load draft from localStorage on component mount
  useEffect(() => {
    const savedDraft = localStorage.getItem(STORAGE_KEY);
    if (savedDraft) {
      try {
        const draft = JSON.parse(savedDraft);
        Object.keys(draft).forEach((key) => {
          if (draft[key]) {
            form.setValue(key as keyof FeedbackFormData, draft[key]);
            if (key === 'rating') {
              setSelectedRating(draft[key]);
            }
          }
        });
        toast.info('Draft feedback restored');
      } catch (error) {
        console.error('Error loading draft:', error);
      }
    }
  }, [form]);

  // Save draft to localStorage whenever form values change
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (Object.values(watchedValues).some(value => value)) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(watchedValues));
      }
    }, 1000); // Debounce saving for 1 second

    return () => clearTimeout(timeoutId);
  }, [watchedValues]);

  const onSubmit = async (data: FeedbackFormData) => {
    setIsSubmitting(true);
    
    try {
      const response = await fetch(API_ENDPOINTS.submitFeedback, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to submit feedback');
      }

      const result = await response.json();
      
      // Clear form and localStorage
      form.reset();
      setSelectedRating(0);
      localStorage.removeItem(STORAGE_KEY);
      
      toast.success('Thank you for your feedback! 🙏', {
        description: 'Your review will be published after approval.',
      });

    } catch (error) {
      console.error('Error submitting feedback:', error);
      toast.error('Failed to submit feedback', {
        description: error instanceof Error ? error.message : 'Please try again later.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRatingClick = (rating: number) => {
    setSelectedRating(rating);
    form.setValue('rating', rating);
  };

  const clearDraft = () => {
    form.reset();
    setSelectedRating(0);
    localStorage.removeItem(STORAGE_KEY);
    toast.info('Form cleared');
  };

  return (
    <Card className="w-full max-w-2xl mx-auto bg-white shadow-elegant border border-border">
      <CardHeader className="text-center pb-6">
        <CardTitle className="text-2xl font-bold text-coffee-brown flex items-center justify-center gap-2">
          <MessageCircle className="h-6 w-6 text-spiced-red" />
          Share Your Experience
        </CardTitle>
        <p className="text-muted-foreground">
          Help us serve you better by sharing your honest feedback about your visit to Desalegn Kitfo
        </p>
      </CardHeader>

      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Customer Name */}
            <FormField
              control={form.control}
              name="customer_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-coffee-brown font-semibold">Full Name *</FormLabel>
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

            {/* Phone Number */}
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-coffee-brown font-semibold">Phone Number *</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="+251911234567 or 0911234567" 
                      className="border-border focus:border-spiced-red" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Rating */}
            <FormField
              control={form.control}
              name="rating"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-coffee-brown font-semibold">Overall Rating *</FormLabel>
                  <FormControl>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => handleRatingClick(star)}
                          onMouseEnter={() => setHoverRating(star)}
                          onMouseLeave={() => setHoverRating(0)}
                          className="transition-colors duration-200"
                        >
                          <Star
                            className={`h-8 w-8 ${
                              star <= (hoverRating || selectedRating)
                                ? 'fill-golden-accent text-golden-accent'
                                : 'text-gray-300 hover:text-golden-accent'
                            }`}
                          />
                        </button>
                      ))}
                      <span className="ml-3 text-sm text-muted-foreground">
                        {selectedRating > 0 && (
                          <>
                            {selectedRating} star{selectedRating !== 1 ? 's' : ''} - {
                              selectedRating === 5 ? 'Excellent!' :
                              selectedRating === 4 ? 'Very Good' :
                              selectedRating === 3 ? 'Good' :
                              selectedRating === 2 ? 'Fair' : 'Poor'
                            }
                          </>
                        )}
                      </span>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Review Text */}
            <FormField
              control={form.control}
              name="review_text"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-coffee-brown font-semibold">Your Review *</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Tell us about your experience - the food, service, atmosphere, and anything else you'd like to share..."
                      className="min-h-[120px] border-border focus:border-spiced-red resize-none"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Favorite Dish */}
            <FormField
              control={form.control}
              name="dish_favorite"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-coffee-brown font-semibold">Favorite Dish (Optional)</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="border-border focus:border-spiced-red">
                        <SelectValue placeholder="What dish did you enjoy most?" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Traditional Kitfo">Traditional Kitfo</SelectItem>
                      <SelectItem value="Leb Leb Kitfo">Leb Leb Kitfo</SelectItem>
                      <SelectItem value="Fully Cooked Kitfo">Fully Cooked Kitfo</SelectItem>
                      <SelectItem value="Desalech Fento Platter">Desalech Fento Platter</SelectItem>
                      <SelectItem value="Gored Gored">Gored Gored</SelectItem>
                      <SelectItem value="Fresh Kocho with Ayib">Fresh Kocho with Ayib</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Visit Date */}
            <FormField
              control={form.control}
              name="visit_date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-coffee-brown font-semibold">Visit Date (Optional)</FormLabel>
                  <FormControl>
                    <Input 
                      type="date" 
                      className="border-border focus:border-spiced-red" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Location */}
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-coffee-brown font-semibold">Restaurant Location</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="border-border focus:border-spiced-red">
                        <SelectValue placeholder="Select location" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Main Branch">Main Branch</SelectItem>
                      <SelectItem value="Addis Ababa">Addis Ababa</SelectItem>
                      <SelectItem value="Dire Dawa">Dire Dawa</SelectItem>
                      <SelectItem value="Harar">Harar</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Submit Buttons */}
            <div className="flex gap-3 pt-4">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-spiced-red hover:bg-spiced-red/90 text-white font-semibold py-3"
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Submitting...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Send className="h-4 w-4" />
                    Submit Feedback
                  </div>
                )}
              </Button>
              
              <Button
                type="button"
                variant="outline"
                onClick={clearDraft}
                className="border-border hover:bg-gray-50"
              >
                Clear
              </Button>
            </div>

            <p className="text-xs text-muted-foreground text-center">
              Your feedback helps us improve our service and will be reviewed before being published on our website.
            </p>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default FeedbackForm;