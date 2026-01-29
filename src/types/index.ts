// Profile type - kept minimal for now, will expand as needed
export type Profile = {
  id: string;
  display_name: string | null;
  stage_name: string | null;
  use_stage_name?: boolean;
  avatar_url: string | null;
  created_at: string;
  email?: string | null;
  timer_duration?: number; // Default timer duration in seconds (default: 600 = 10 minutes)
};
