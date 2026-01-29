export interface Session {
  id: string;
  user_id: string;
  title: string | null;
  spark: string;
  perspectives: Perspective[];
  status: 'active' | 'completed' | 'archived';
  created_at: string;
  updated_at: string;
}

export interface Perspective {
  label: string;
  description: string;
}

export interface Box {
  id: string;
  session_id: string;
  perspective_index: number;
  content: string;
  duration_seconds: number | null;
  created_at: string;
  updated_at: string;
}

export interface AnchorWord {
  id: string;
  session_id: string;
  word: string;
  source_box: number | null;
  position: number;
  created_at: string;
}

export interface Rhyme {
  id: string;
  anchor_word_id: string;
  word: string;
  rhyme_type: 'perfect' | 'near' | 'consonance' | 'assonance';
  source: 'box' | 'suggested' | 'manual';
  position: number;
  created_at: string;
}

export interface Draft {
  id: string;
  session_id: string;
  content: string;
  version: number;
  created_at: string;
  updated_at: string;
}

export interface RhymeCandidate {
  word: string;
  rhyme_type: 'perfect' | 'near' | 'consonance' | 'assonance';
  source: 'box' | 'suggested';
}
