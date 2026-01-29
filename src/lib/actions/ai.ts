'use server';

import type { Perspective, Box, RhymeCandidate } from '@/types/songsmith';

/**
 * Generate 3 perspectives to explore a song idea from.
 * These give the songwriter different angles to approach their spark.
 */
export async function suggestPerspectives(spark: string): Promise<Perspective[]> {
  // TODO: Wire up Claude API
  // For now, return default perspectives based on Pat Pattison's common approach
  console.log('suggestPerspectives called with spark:', spark);

  return [
    {
      label: 'What you see',
      description: 'The visual imagery, the scene. What does this idea look like? Describe the setting, colors, shapes, movement.',
    },
    {
      label: 'What you feel',
      description: 'Physical sensations and emotions in the body. Where do you feel this idea? Heat, cold, tension, release.',
    },
    {
      label: 'What you think',
      description: 'Inner thoughts, reflections, meanings. What does this idea make you consider? Questions, realizations, memories.',
    },
  ];
}

/**
 * Surface candidate anchor words from the freewriting boxes.
 * These are words that capture the essence of the writing and could serve
 * as anchors for the rhyme palette.
 */
export async function suggestAnchorWords(boxes: Box[]): Promise<string[]> {
  // TODO: Wire up Claude API
  // Should analyze the box content and surface interesting/evocative words
  console.log('suggestAnchorWords called with boxes:', boxes.length);

  // For now, return empty - user will select manually
  return [];
}

/**
 * Find rhyme candidates for an anchor word.
 * Prioritizes words that appear in the boxes (contextually relevant),
 * then suggests additional rhymes.
 *
 * Returns candidates with their rhyme type:
 * - perfect: same vowel sound and ending consonants (love/above)
 * - near: similar but not exact (love/move)
 * - consonance: same consonant sounds (love/live)
 * - assonance: same vowel sounds (love/blood)
 */
export async function suggestRhymes(
  word: string,
  boxes: Box[]
): Promise<RhymeCandidate[]> {
  // TODO: Wire up Claude API
  // Should:
  // 1. First scan boxes for words that rhyme with the anchor word
  // 2. Then suggest additional rhymes from general vocabulary
  // 3. Label each with its rhyme type
  console.log('suggestRhymes called for word:', word, 'boxes:', boxes.length);

  // For now, return empty - user will add manually
  return [];
}

/**
 * Get mentor feedback on the writing.
 * Provides craft-focused feedback on:
 * - Sensory detail and concrete imagery
 * - Clichés to avoid
 * - Prosody (how the words sound when sung)
 * - Emotional truth vs. sentimentality
 */
export async function getFeedback(
  content: string,
  context: 'box' | 'draft'
): Promise<string> {
  // TODO: Wire up Claude API
  // Should provide constructive, craft-focused feedback
  // in the style of a supportive songwriting mentor
  console.log('getFeedback called for', context, 'content length:', content.length);

  // For now, return placeholder
  return 'Feedback feature coming soon. For now, trust your instincts and keep writing!';
}
