'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { SparkInput } from '@/components/songsmith';
import { suggestPerspectives } from '@/lib/actions/ai';
import { Sparkles } from 'lucide-react';
import { toast } from 'sonner';

export default function NewSessionPage() {
  const router = useRouter();
  const supabase = createClient();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (spark: string) => {
    setIsLoading(true);

    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
        return;
      }

      // Get AI-suggested perspectives
      const perspectives = await suggestPerspectives(spark);

      // Create the session
      const { data: session, error } = await supabase
        .from('sessions')
        .insert({
          user_id: user.id,
          spark,
          perspectives,
          status: 'active',
        })
        .select()
        .single();

      if (error) throw error;

      // Create empty boxes for each perspective
      const boxes = perspectives.map((_, index) => ({
        session_id: session.id,
        perspective_index: index,
        content: '',
        duration_seconds: 0,
      }));

      const { error: boxError } = await supabase.from('boxes').insert(boxes);
      if (boxError) throw boxError;

      // Create an initial empty draft
      const { error: draftError } = await supabase.from('drafts').insert({
        session_id: session.id,
        content: '',
        version: 1,
      });
      if (draftError) throw draftError;

      toast.success('Session created! Start exploring your spark.');

      // Redirect to the session workspace
      router.push(`/app/sessions/${session.id}`);
    } catch (error) {
      console.error('Error creating session:', error);
      toast.error('Failed to create session. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <div className="pt-16 lg:pt-0 flex items-center justify-center min-h-[80vh] px-4">
      <Card className="w-full max-w-lg">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 p-3 rounded-full bg-teal/10 w-fit">
            <Sparkles className="h-6 w-6 text-teal" />
          </div>
          <CardTitle className="text-2xl font-serif">Start a New Session</CardTitle>
          <CardDescription>
            Begin with a spark — an idea, emotion, or image that you want to explore.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SparkInput onSubmit={handleSubmit} isLoading={isLoading} />
        </CardContent>
      </Card>
    </div>
  );
}
