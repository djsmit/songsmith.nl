export type FeedbackCategory = 'feature' | 'bug' | 'improvement' | 'other';

export type FeedbackStatus = 'new' | 'reviewed' | 'actioned' | 'closed';

export type Feedback = {
  id: string;
  user_id: string;
  category: FeedbackCategory;
  message: string;
  page_context: string | null;
  created_at: string;
  is_early_bird: boolean;
  status: FeedbackStatus;
};

export type FeedbackFormData = {
  category: FeedbackCategory;
  message: string;
  page_context?: string;
  screenshot?: string; // Base64 encoded image
};
