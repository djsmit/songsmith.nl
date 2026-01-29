'use client';

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Timer } from '@/components/songsmith';
import { Boxes, Key, PenLine, FileText, Sparkles } from 'lucide-react';
import type { Session, Box, AnchorWord, Rhyme, Draft, Perspective } from '@/types/songsmith';

interface SessionWorkspaceProps {
  session: Session;
  boxes: Box[];
  anchorWords: AnchorWord[];
  rhymes: Rhyme[];
  drafts: Draft[];
}

export function SessionWorkspace({
  session,
  boxes,
  anchorWords,
  rhymes,
  drafts,
}: SessionWorkspaceProps) {
  const [activeTab, setActiveTab] = useState('boxes');
  const [activePerspective, setActivePerspective] = useState(0);

  const perspectives = session.perspectives as Perspective[];
  const currentBox = boxes.find((b) => b.perspective_index === activePerspective);
  const currentDraft = drafts[0]; // Most recent draft

  return (
    <div className="pt-16 lg:pt-0 min-h-screen">
      <div className="max-w-5xl mx-auto px-4 py-6 lg:py-10">
        {/* Header */}
        <div className="mb-6">
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
              {perspectives.map((perspective, index) => (
                <Button
                  key={index}
                  variant={activePerspective === index ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setActivePerspective(index)}
                >
                  {perspective.label}
                </Button>
              ))}
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  {perspectives[activePerspective]?.label || `Perspective ${activePerspective + 1}`}
                </CardTitle>
                <CardDescription>
                  {perspectives[activePerspective]?.description || 'Explore this angle of your idea.'}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Timer
                  duration={600}
                  onComplete={() => console.log('Timer complete')}
                />
                <Textarea
                  placeholder="Start writing... Don't stop, don't edit, just let the words flow."
                  className="min-h-[300px] font-mono"
                  defaultValue={currentBox?.content || ''}
                />
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
                <CardTitle>Anchor Words</CardTitle>
                <CardDescription>
                  Select 9 key words from your freewriting that capture the essence of your song idea.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4">
                  {Array.from({ length: 9 }).map((_, index) => {
                    const anchor = anchorWords.find((a) => a.position === index);
                    return (
                      <div key={index} className="relative">
                        <Input
                          placeholder={`Word ${index + 1}`}
                          defaultValue={anchor?.word || ''}
                          className="text-center"
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
                <p className="text-sm text-muted-foreground mt-4">
                  Look through your three boxes and pick words that stand out — words with strong imagery, emotion, or sound.
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Rhymes Phase */}
          <TabsContent value="rhymes">
            <Card>
              <CardHeader>
                <CardTitle>Rhyme Palette</CardTitle>
                <CardDescription>
                  Build a collection of rhymes for each anchor word. Include perfect rhymes, near rhymes, and slant rhymes.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 lg:grid-cols-9 gap-4">
                  {anchorWords.length === 0 ? (
                    <p className="col-span-full text-center text-muted-foreground py-8">
                      Select your anchor words first, then build your rhyme palette here.
                    </p>
                  ) : (
                    anchorWords.map((anchor) => {
                      const anchorRhymes = rhymes.filter((r) => r.anchor_word_id === anchor.id);
                      return (
                        <div key={anchor.id} className="space-y-2">
                          <div className="font-medium text-sm text-teal text-center">
                            {anchor.word}
                          </div>
                          <div className="space-y-1">
                            {anchorRhymes.map((rhyme) => (
                              <div
                                key={rhyme.id}
                                className="text-xs text-center py-1 px-2 bg-muted rounded"
                              >
                                {rhyme.word}
                              </div>
                            ))}
                            <Button variant="ghost" size="sm" className="w-full text-xs h-7">
                              + Add
                            </Button>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Draft Phase */}
          <TabsContent value="draft">
            <Card>
              <CardHeader>
                <CardTitle>Draft</CardTitle>
                <CardDescription>
                  Write your lyric using your freewriting and rhyme palette as reference material.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="Start drafting your lyric..."
                  className="min-h-[400px] font-mono"
                  defaultValue={currentDraft?.content || ''}
                />
                <div className="flex items-center justify-between mt-4">
                  <p className="text-sm text-muted-foreground">
                    Your raw material is in the boxes. Your rhyme options are in the palette. Now craft.
                  </p>
                  <Button variant="outline" size="sm">
                    Get Feedback
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
