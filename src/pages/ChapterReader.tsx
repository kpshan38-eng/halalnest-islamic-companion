import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Play, Pause, BookOpen, Volume2, Settings, Bookmark, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useQuranAPI, type Verse, type Chapter } from '@/hooks/useQuranAPI';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

const ChapterReader = () => {
  const { chapterNumber } = useParams<{ chapterNumber: string }>();
  const navigate = useNavigate();
  const { user } = useSupabaseAuth();
  const { fetchVerses, fetchChapterInfo, fetchAudio } = useQuranAPI();
  
  const [verses, setVerses] = useState<Verse[]>([]);
  const [chapterInfo, setChapterInfo] = useState<Chapter | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentVerse, setCurrentVerse] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [arabicOnly, setArabicOnly] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const loadChapterData = async () => {
      if (!chapterNumber) return;
      
      setLoading(true);
      
      try {
        const [versesData, chapterData, audioData] = await Promise.all([
          fetchVerses(parseInt(chapterNumber)),
          fetchChapterInfo(parseInt(chapterNumber)),
          fetchAudio(parseInt(chapterNumber))
        ]);

        if (versesData) {
          setVerses(versesData.verses);
        }
        
        if (chapterData) {
          setChapterInfo(chapterData);
        }
        
        if (audioData?.audio_file?.audio_url) {
          setAudioUrl(audioData.audio_file.audio_url);
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load chapter data",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    loadChapterData();
  }, [chapterNumber, fetchVerses, fetchChapterInfo, fetchAudio]);

  const saveProgress = async (verseNumber: number) => {
    if (!user || !chapterNumber) return;
    
    try {
      await supabase.from('quran_progress').upsert({
        user_id: user.id,
        surah_number: parseInt(chapterNumber),
        verse_number: verseNumber,
        total_verses: verses.length,
        last_read_at: new Date().toISOString()
      });
    } catch (error) {
      console.error('Failed to save progress:', error);
    }
  };

  const handleVerseClick = (verseNumber: number) => {
    setCurrentVerse(verseNumber);
    if (user) {
      saveProgress(verseNumber);
    }
  };

  const handlePlayPause = () => {
    if (!audioUrl || !audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleBookmark = async () => {
    if (!user || !chapterNumber) {
      toast({
        title: "Sign in required",
        description: "Please sign in to bookmark verses",
        variant: "destructive",
      });
      return;
    }

    try {
      await supabase.from('quran_progress').upsert({
        user_id: user.id,
        surah_number: parseInt(chapterNumber),
        verse_number: currentVerse,
        total_verses: verses.length,
        bookmarked: true
      });

      toast({
        title: "Bookmarked",
        description: `Verse ${currentVerse} has been bookmarked`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to bookmark verse",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading chapter...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 bg-background/95 backdrop-blur-sm border-b z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" onClick={() => navigate('/quran')}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Chapters
              </Button>
              {chapterInfo && (
                <div>
                  <h1 className="text-xl font-bold text-primary">
                    {chapterInfo.name_simple} - {chapterInfo.translated_name.name}
                  </h1>
                  <p className="text-sm text-muted-foreground">
                    {chapterInfo.verses_count} verses • {chapterInfo.revelation_place}
                  </p>
                </div>
              )}
            </div>
            
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" onClick={() => setArabicOnly(!arabicOnly)}>
                <Settings className="w-4 h-4 mr-2" />
                {arabicOnly ? 'Show Translation' : 'Arabic Only'}
              </Button>
              <Button variant="outline" size="sm" onClick={handleBookmark}>
                <Bookmark className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={handlePlayPause} disabled={!audioUrl}>
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Audio Element */}
      {audioUrl && (
        <audio
          ref={audioRef}
          src={audioUrl}
          onEnded={() => setIsPlaying(false)}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
        />
      )}

      {/* Bismillah */}
      {chapterInfo?.bismillah_pre && parseInt(chapterNumber!) !== 1 && (
        <div className="container mx-auto px-4 py-8">
          <Card className="p-8 text-center bg-primary/5 border-primary/20">
            <p className="text-2xl font-arabic text-primary mb-2">
              بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
            </p>
            <p className="text-muted-foreground">
              In the name of Allah, the Entirely Merciful, the Especially Merciful
            </p>
          </Card>
        </div>
      )}

      {/* Verses */}
      <div className="container mx-auto px-4 pb-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {verses.map((verse) => (
            <Card 
              key={verse.id} 
              className={`p-6 transition-all duration-300 cursor-pointer hover:shadow-md ${
                currentVerse === verse.verse_number ? 'ring-2 ring-primary/50 bg-primary/5' : ''
              }`}
              onClick={() => handleVerseClick(verse.verse_number)}
            >
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-2">
                  <span className="text-primary font-bold text-sm">{verse.verse_number}</span>
                </div>
                
                <div className="flex-1 space-y-4">
                  {/* Arabic Text */}
                  <div className="text-right">
                    <p className="text-2xl leading-loose font-arabic text-primary">
                      {verse.text_uthmani}
                    </p>
                  </div>
                  
                  {/* Translation */}
                  {!arabicOnly && verse.translations && verse.translations.length > 0 && (
                    <>
                      <Separator />
                      <div className="space-y-2">
                        {verse.translations.map((translation) => (
                          <div key={translation.id}>
                            <p className="text-foreground leading-relaxed">
                              {translation.text}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                              {translation.resource_name}
                            </p>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Progress Indicator */}
      {user && (
        <div className="fixed bottom-4 right-4 bg-background border rounded-lg p-3 shadow-lg">
          <div className="flex items-center space-x-2 text-sm">
            <BookOpen className="w-4 h-4 text-primary" />
            <span className="text-muted-foreground">
              Verse {currentVerse} of {verses.length}
            </span>
          </div>
        </div>
      )}
    </main>
  );
};

export default ChapterReader;