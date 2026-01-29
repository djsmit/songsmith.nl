'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Timer } from '@/components/songsmith';
import { Boxes, Key, PenLine, FileText, Sparkles, Check, Loader2, ArrowLeft, X, Plus } from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';
import type { Session, Box, AnchorWord, Rhyme, Draft, Perspective } from '@/types/songsmith';

interface SessionWorkspaceProps {
  session: Session;
  boxes: Box[];
  anchorWords: AnchorWord[];
  rhymes: Rhyme[];
  drafts: Draft[];
}

type SaveStatus = 'saved' | 'saving' | 'unsaved';

export function SessionWorkspace({
  session,
  boxes: initialBoxes,
  anchorWords: initialAnchorWords,
  rhymes: initialRhymes,
  drafts: initialDrafts,
}: SessionWorkspaceProps) {
  const router = useRouter();
  const supabase = createClient();

  const [activeTab, setActiveTab] = useState('boxes');
  const [activePerspective, setActivePerspective] = useState(0);

  // Local state for boxes
  const [boxes, setBoxes] = useState(initialBoxes);
  const [boxSaveStatus, setBoxSaveStatus] = useState<SaveStatus>('saved');

  // Local state for anchor words
  const [anchorWords, setAnchorWords] = useState<(AnchorWord | null)[]>(() => {
    const words: (AnchorWord | null)[] = Array(9).fill(null);
    initialAnchorWords.forEach((aw) => {
      if (aw.position >= 0 && aw.position < 9) {
        words[aw.position] = aw;
      }
    });
    return words;
  });
  const [anchorSaveStatus, setAnchorSaveStatus] = useState<SaveStatus>('saved');

  // Local state for rhymes (grouped by anchor word id)
  const [rhymes, setRhymes] = useState<Map<string, Rhyme[]>>(() => {
    const map = new Map<string, Rhyme[]>();
    initialRhymes.forEach((r) => {
      const existing = map.get(r.anchor_word_id) || [];
      map.set(r.anchor_word_id, [...existing, r]);
    });
    return map;
  });
  const [rhymeSaveStatus, setRhymeSaveStatus] = useState<SaveStatus>('saved');
  const [addingRhymeForAnchor, setAddingRhymeForAnchor] = useState<string | null>(null);
  const [newRhymeWord, setNewRhymeWord] = useState('');

  // Local state for draft
  const [draftContent, setDraftContent] = useState(initialDrafts[0]?.content || '');
  const [draftId, setDraftId] = useState(initialDrafts[0]?.id);
  const [draftSaveStatus, setDraftSaveStatus] = useState<SaveStatus>('saved');

  // Debounce timers
  const boxSaveTimer = useRef<NodeJS.Timeout | undefined>(undefined);
  const anchorSaveTimer = useRef<NodeJS.Timeout | undefined>(undefined);
  const draftSaveTimer = useRef<NodeJS.Timeout | undefined>(undefined);

  const perspectives = session.perspectives as Perspective[];
  const currentBox = boxes.find((b) => b.perspective_index === activePerspective);

  // Save box content
  const saveBox = useCallback(async (boxId: string, content: string, durationSeconds?: number) => {
    setBoxSaveStatus('saving');
    try {
      const updateData: { content: string; duration_seconds?: number } = { content };
      if (durationSeconds !== undefined) {
        updateData.duration_seconds = durationSeconds;
      }

      const { error } = await supabase
        .from('boxes')
        .update(updateData)
        .eq('id', boxId);

      if (error) throw error;
      setBoxSaveStatus('saved');
    } catch (error) {
      console.error('Error saving box:', error);
      setBoxSaveStatus('unsaved');
      toast.error('Failed to save. Will retry...');
    }
  }, [supabase]);

  // Handle box content change with debounce
  const handleBoxChange = useCallback((boxId: string, content: string) => {
    // Update local state immediately
    setBoxes((prev) =>
      prev.map((b) => (b.id === boxId ? { ...b, content } : b))
    );
    setBoxSaveStatus('unsaved');

    // Debounce save
    if (boxSaveTimer.current) {
      clearTimeout(boxSaveTimer.current);
    }
    boxSaveTimer.current = setTimeout(() => {
      saveBox(boxId, content);
    }, 1000);
  }, [saveBox]);

  // Save timer duration when it updates
  const handleTimerTick = useCallback((elapsed: number) => {
    if (currentBox) {
      // Update local state
      setBoxes((prev) =>
        prev.map((b) =>
          b.id === currentBox.id ? { ...b, duration_seconds: elapsed } : b
        )
      );
    }
  }, [currentBox]);

  // Save duration when timer completes or user leaves
  const handleTimerComplete = useCallback(() => {
    if (currentBox) {
      const box = boxes.find((b) => b.id === currentBox.id);
      if (box) {
        saveBox(box.id, box.content, box.duration_seconds || 0);
      }
    }
    toast.success('Time\'s up! Great work on this perspective.');
  }, [currentBox, boxes, saveBox]);

  // Save anchor word
  const saveAnchorWord = useCallback(async (position: number, word: string) => {
    setAnchorSaveStatus('saving');
    try {
      const existing = anchorWords[position];

      if (word.trim() === '') {
        // Delete if empty
        if (existing) {
          const { error } = await supabase
            .from('anchor_words')
            .delete()
            .eq('id', existing.id);
          if (error) throw error;

          setAnchorWords((prev) => {
            const next = [...prev];
            next[position] = null;
            return next;
          });
        }
      } else if (existing) {
        // Update existing
        const { error } = await supabase
          .from('anchor_words')
          .update({ word: word.trim() })
          .eq('id', existing.id);
        if (error) throw error;

        setAnchorWords((prev) => {
          const next = [...prev];
          next[position] = { ...existing, word: word.trim() };
          return next;
        });
      } else {
        // Insert new
        const { data, error } = await supabase
          .from('anchor_words')
          .insert({
            session_id: session.id,
            word: word.trim(),
            position,
            source_box: null,
          })
          .select()
          .single();
        if (error) throw error;

        setAnchorWords((prev) => {
          const next = [...prev];
          next[position] = data;
          return next;
        });
      }

      setAnchorSaveStatus('saved');
    } catch (error) {
      console.error('Error saving anchor word:', error);
      setAnchorSaveStatus('unsaved');
      toast.error('Failed to save anchor word');
    }
  }, [anchorWords, session.id, supabase]);

  // Handle anchor word change with debounce
  const handleAnchorChange = useCallback((position: number, word: string) => {
    setAnchorWords((prev) => {
      const next = [...prev];
      if (next[position]) {
        next[position] = { ...next[position]!, word };
      } else {
        // Temporary local state before save
        next[position] = {
          id: `temp-${position}`,
          session_id: session.id,
          word,
          source_box: null,
          position,
          created_at: new Date().toISOString(),
        };
      }
      return next;
    });
    setAnchorSaveStatus('unsaved');

    if (anchorSaveTimer.current) {
      clearTimeout(anchorSaveTimer.current);
    }
    anchorSaveTimer.current = setTimeout(() => {
      saveAnchorWord(position, word);
    }, 500);
  }, [session.id, saveAnchorWord]);

  // Save draft
  const saveDraft = useCallback(async (content: string) => {
    setDraftSaveStatus('saving');
    try {
      if (draftId) {
        const { error } = await supabase
          .from('drafts')
          .update({ content })
          .eq('id', draftId);
        if (error) throw error;
      } else {
        const { data, error } = await supabase
          .from('drafts')
          .insert({
            session_id: session.id,
            content,
            version: 1,
          })
          .select()
          .single();
        if (error) throw error;
        setDraftId(data.id);
      }
      setDraftSaveStatus('saved');
    } catch (error) {
      console.error('Error saving draft:', error);
      setDraftSaveStatus('unsaved');
      toast.error('Failed to save draft');
    }
  }, [draftId, session.id, supabase]);

  // Handle draft change with debounce
  const handleDraftChange = useCallback((content: string) => {
    setDraftContent(content);
    setDraftSaveStatus('unsaved');

    if (draftSaveTimer.current) {
      clearTimeout(draftSaveTimer.current);
    }
    draftSaveTimer.current = setTimeout(() => {
      saveDraft(content);
    }, 1000);
  }, [saveDraft]);

  // Add rhyme
  const addRhyme = useCallback(async (anchorWordId: string, word: string, rhymeType: Rhyme['rhyme_type'] = 'perfect') => {
    if (!word.trim()) return;

    setRhymeSaveStatus('saving');
    try {
      const anchorRhymes = rhymes.get(anchorWordId) || [];
      const position = anchorRhymes.length;

      const { data, error } = await supabase
        .from('rhymes')
        .insert({
          anchor_word_id: anchorWordId,
          word: word.trim(),
          rhyme_type: rhymeType,
          source: 'manual',
          position,
        })
        .select()
        .single();

      if (error) throw error;

      setRhymes((prev) => {
        const next = new Map(prev);
        const existing = next.get(anchorWordId) || [];
        next.set(anchorWordId, [...existing, data]);
        return next;
      });

      setRhymeSaveStatus('saved');
      setAddingRhymeForAnchor(null);
      setNewRhymeWord('');
    } catch (error) {
      console.error('Error adding rhyme:', error);
      setRhymeSaveStatus('unsaved');
      toast.error('Failed to add rhyme');
    }
  }, [rhymes, supabase]);

  // Remove rhyme
  const removeRhyme = useCallback(async (rhymeId: string, anchorWordId: string) => {
    setRhymeSaveStatus('saving');
    try {
      const { error } = await supabase
        .from('rhymes')
        .delete()
        .eq('id', rhymeId);

      if (error) throw error;

      setRhymes((prev) => {
        const next = new Map(prev);
        const existing = next.get(anchorWordId) || [];
        next.set(anchorWordId, existing.filter((r) => r.id !== rhymeId));
        return next;
      });

      setRhymeSaveStatus('saved');
    } catch (error) {
      console.error('Error removing rhyme:', error);
      setRhymeSaveStatus('unsaved');
      toast.error('Failed to remove rhyme');
    }
  }, [supabase]);

  // Save on unmount
  useEffect(() => {
    return () => {
      if (boxSaveTimer.current) clearTimeout(boxSaveTimer.current);
      if (anchorSaveTimer.current) clearTimeout(anchorSaveTimer.current);
      if (draftSaveTimer.current) clearTimeout(draftSaveTimer.current);
    };
  }, []);

  // Save status indicator component
  const SaveIndicator = ({ status }: { status: SaveStatus }) => {
    if (status === 'saving') {
      return (
        <span className="flex items-center gap-1 text-xs text-muted-foreground">
          <Loader2 className="h-3 w-3 animate-spin" />
          Saving...
        </span>
      );
    }
    if (status === 'saved') {
      return (
        <span className="flex items-center gap-1 text-xs text-muted-foreground">
          <Check className="h-3 w-3 text-teal" />
          Saved
        </span>
      );
    }
    return (
      <span className="text-xs text-muted-foreground">Unsaved changes</span>
    );
  };

  return (
    <div className="pt-16 lg:pt-0 min-h-screen">
      <div className="max-w-5xl mx-auto px-4 py-6 lg:py-10">
        {/* Header */}
        <div className="mb-6">
          <Link
            href="/app"
            className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to sessions
          </Link>
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
            <Sparkles className="h-4 w-4 text-teal" />
            <span>Spark</span>
          </div>
          <p className="text-lg font-serif italic">&ldquo;{session.spark}&rdquo;</p>
        </div>

        {/* Phase Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4 mb-6">
            <TabsTrigger value="boxes" className="gap-2">
              <Boxes className="h-4 w-4" />
              <span className="hidden sm:inline">Boxes</span>
            </TabsTrigger>
            <TabsTrigger value="anchors" className="gap-2">
              <Key className="h-4 w-4" />
              <span className="hidden sm:inline">Anchors</span>
            </TabsTrigger>
            <TabsTrigger value="rhymes" className="gap-2">
              <FileText className="h-4 w-4" />
              <span className="hidden sm:inline">Rhymes</span>
            </TabsTrigger>
            <TabsTrigger value="draft" className="gap-2">
              <PenLine className="h-4 w-4" />
              <span className="hidden sm:inline">Draft</span>
            </TabsTrigger>
          </TabsList>

          {/* Boxes Phase */}
          <TabsContent value="boxes" className="space-y-4">
            {/* Perspective tabs */}
            <div className="flex gap-2 flex-wrap">
              {perspectives.map((perspective, index) => {
                const box = boxes.find((b) => b.perspective_index === index);
                const hasContent = box && box.content && box.content.length > 0;
                return (
                  <Button
                    key={index}
                    variant={activePerspective === index ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setActivePerspective(index)}
                    className="relative"
                  >
                    {perspective.label}
                    {hasContent && (
                      <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-teal" />
                    )}
                  </Button>
                );
              })}
            </div>

            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">
                      {perspectives[activePerspective]?.label || `Perspective ${activePerspective + 1}`}
                    </CardTitle>
                    <CardDescription>
                      {perspectives[activePerspective]?.description || 'Explore this angle of your idea.'}
                    </CardDescription>
                  </div>
                  <SaveIndicator status={boxSaveStatus} />
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <Timer
                  duration={600}
                  onTick={handleTimerTick}
                  onComplete={handleTimerComplete}
                />
                {currentBox && (
                  <Textarea
                    placeholder="Start writing... Don't stop, don't edit, just let the words flow."
                    className="min-h-[300px] font-mono text-base leading-relaxed"
                    value={currentBox.content}
                    onChange={(e) => handleBoxChange(currentBox.id, e.target.value)}
                  />
                )}
                <p className="text-sm text-muted-foreground">
                  Write without stopping. Don&apos;t edit, don&apos;t judge. Just explore this perspective and see what emerges.
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Anchors Phase */}
          <TabsContent value="anchors">
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle>Anchor Words</CardTitle>
                    <CardDescription>
                      Select 9 key words from your freewriting that capture the essence of your song idea.
                    </CardDescription>
                  </div>
                  <SaveIndicator status={anchorSaveStatus} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4 mb-6">
                  {Array.from({ length: 9 }).map((_, index) => {
                    const anchor = anchorWords[index];
                    return (
                      <div key={index} className="relative">
                        <Input
                          placeholder={`Word ${index + 1}`}
                          value={anchor?.word || ''}
                          onChange={(e) => handleAnchorChange(index, e.target.value)}
                          className="text-center font-medium"
                        />
                        {anchor?.source_box !== null && anchor?.source_box !== undefined && (
                          <Badge
                            variant="outline"
                            className="absolute -top-2 -right-2 text-[10px] px-1"
                          >
                            Box {anchor.source_box + 1}
                          </Badge>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Show boxes for reference */}
                <div className="border-t pt-4 mt-4">
                  <h4 className="text-sm font-medium mb-3">Your Freewriting (for reference)</h4>
                  <div className="grid gap-4 md:grid-cols-3">
                    {perspectives.map((perspective, index) => {
                      const box = boxes.find((b) => b.perspective_index === index);
                      return (
                        <div key={index} className="space-y-1">
                          <h5 className="text-xs font-medium text-teal">{perspective.label}</h5>
                          <div className="text-xs text-muted-foreground bg-muted/50 p-2 rounded max-h-32 overflow-y-auto">
                            {box?.content || <span className="italic">No content yet</span>}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Rhymes Phase */}
          <TabsContent value="rhymes">
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle>Rhyme Palette</CardTitle>
                    <CardDescription>
                      Build a collection of rhymes for each anchor word. Include perfect rhymes, near rhymes, and slant rhymes.
                    </CardDescription>
                  </div>
                  <SaveIndicator status={rhymeSaveStatus} />
                </div>
              </CardHeader>
              <CardContent>
                {anchorWords.filter(Boolean).length === 0 ? (
                  <div className="text-center text-muted-foreground py-12">
                    <Key className="h-12 w-12 mx-auto mb-4 opacity-30" />
                    <p>Select your anchor words first, then build your rhyme palette here.</p>
                    <Button
                      variant="outline"
                      className="mt-4"
                      onClick={() => setActiveTab('anchors')}
                    >
                      Go to Anchors
                    </Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-3 lg:grid-cols-9 gap-3">
                    {anchorWords.map((anchor, index) => {
                      if (!anchor) return <div key={index} />;
                      const anchorRhymes = rhymes.get(anchor.id) || [];
                      const isAdding = addingRhymeForAnchor === anchor.id;
                      return (
                        <div key={anchor.id} className="space-y-2">
                          <div
                            className="font-medium text-sm text-teal text-center truncate px-1"
                            title={anchor.word}
                          >
                            {anchor.word}
                          </div>
                          <div className="space-y-1.5 min-h-[100px]">
                            {anchorRhymes.map((rhyme) => (
                              <div
                                key={rhyme.id}
                                className="group relative text-xs text-center py-1.5 px-2 bg-muted rounded hover:bg-muted/80 transition-colors"
                              >
                                <span className="truncate block" title={rhyme.word}>
                                  {rhyme.word}
                                </span>
                                <button
                                  onClick={() => removeRhyme(rhyme.id, anchor.id)}
                                  className="absolute -top-1 -right-1 h-4 w-4 bg-destructive text-destructive-foreground rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                                  title="Remove rhyme"
                                >
                                  <X className="h-2.5 w-2.5" />
                                </button>
                              </div>
                            ))}
                            {isAdding ? (
                              <form
                                onSubmit={(e) => {
                                  e.preventDefault();
                                  addRhyme(anchor.id, newRhymeWord);
                                }}
                                className="space-y-1"
                              >
                                <Input
                                  autoFocus
                                  value={newRhymeWord}
                                  onChange={(e) => setNewRhymeWord(e.target.value)}
                                  placeholder="Type rhyme..."
                                  className="h-7 text-xs text-center"
                                  onBlur={() => {
                                    if (!newRhymeWord.trim()) {
                                      setAddingRhymeForAnchor(null);
                                    }
                                  }}
                                  onKeyDown={(e) => {
                                    if (e.key === 'Escape') {
                                      setAddingRhymeForAnchor(null);
                                      setNewRhymeWord('');
                                    }
                                  }}
                                />
                                <div className="flex gap-1">
                                  <Button type="submit" size="sm" className="flex-1 h-6 text-xs">
                                    <Check className="h-3 w-3" />
                                  </Button>
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    className="h-6 text-xs px-2"
                                    onClick={() => {
                                      setAddingRhymeForAnchor(null);
                                      setNewRhymeWord('');
                                    }}
                                  >
                                    <X className="h-3 w-3" />
                                  </Button>
                                </div>
                              </form>
                            ) : (
                              <Button
                                variant="ghost"
                                size="sm"
                                className="w-full text-xs h-7"
                                onClick={() => {
                                  setAddingRhymeForAnchor(anchor.id);
                                  setNewRhymeWord('');
                                }}
                              >
                                <Plus className="h-3 w-3 mr-1" />
                                Add
                              </Button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Rhyme type legend */}
                {anchorWords.filter(Boolean).length > 0 && (
                  <div className="border-t pt-4 mt-6">
                    <p className="text-xs text-muted-foreground">
                      <strong>Tip:</strong> Mix rhyme types for variety. Perfect rhymes (cat/hat), near rhymes (cat/bed),
                      consonance (cat/cut), and assonance (cat/lap) all create musical connections.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Draft Phase */}
          <TabsContent value="draft">
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle>Draft</CardTitle>
                    <CardDescription>
                      Write your lyric using your freewriting and rhyme palette as reference material.
                    </CardDescription>
                  </div>
                  <SaveIndicator status={draftSaveStatus} />
                </div>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="Start drafting your lyric..."
                  className="min-h-[400px] font-mono text-base leading-relaxed"
                  value={draftContent}
                  onChange={(e) => handleDraftChange(e.target.value)}
                />
                <div className="flex items-center justify-between mt-4">
                  <p className="text-sm text-muted-foreground">
                    Your raw material is in the boxes. Your rhyme options are in the palette. Now craft.
                  </p>
                  <Button variant="outline" size="sm" disabled>
                    Get Feedback (coming soon)
                  </Button>
                </div>

                {/* Reference panel */}
                <div className="border-t pt-4 mt-6">
                  <h4 className="text-sm font-medium mb-3">Reference Material</h4>
                  <Tabs defaultValue="boxes" className="w-full">
                    <TabsList className="grid w-full grid-cols-2 mb-3">
                      <TabsTrigger value="boxes">Boxes</TabsTrigger>
                      <TabsTrigger value="anchors">Anchor Words</TabsTrigger>
                    </TabsList>
                    <TabsContent value="boxes">
                      <div className="grid gap-4 md:grid-cols-3">
                        {perspectives.map((perspective, index) => {
                          const box = boxes.find((b) => b.perspective_index === index);
                          return (
                            <div key={index} className="space-y-1">
                              <h5 className="text-xs font-medium text-teal">{perspective.label}</h5>
                              <div className="text-xs text-muted-foreground bg-muted/50 p-2 rounded max-h-40 overflow-y-auto whitespace-pre-wrap">
                                {box?.content || <span className="italic">No content yet</span>}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </TabsContent>
                    <TabsContent value="anchors">
                      <div className="flex flex-wrap gap-2">
                        {anchorWords.filter(Boolean).map((anchor) => (
                          <Badge key={anchor!.id} variant="secondary" className="text-sm">
                            {anchor!.word}
                          </Badge>
                        ))}
                        {anchorWords.filter(Boolean).length === 0 && (
                          <p className="text-sm text-muted-foreground">No anchor words selected yet</p>
                        )}
                      </div>
                    </TabsContent>
                  </Tabs>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
