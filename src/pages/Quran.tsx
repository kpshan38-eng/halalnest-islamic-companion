import { BookOpen, Search, Volume2, Bookmark, Download, Play, Pause } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { useState } from 'react';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';
import { AuthGuard } from '@/components/AuthGuard';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

const Quran = () => {
  const { user } = useSupabaseAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [playingChapter, setPlayingChapter] = useState<number | null>(null);

  const chapters = [
    { number: 1, name: 'Al-Fatiha', translation: 'The Opening', verses: 7, revelation: 'Makkah' },
    { number: 2, name: 'Al-Baqarah', translation: 'The Cow', verses: 286, revelation: 'Madinah' },
    { number: 3, name: 'Ali Imran', translation: 'The Family of Imran', verses: 200, revelation: 'Madinah' },
    { number: 4, name: 'An-Nisa', translation: 'The Women', verses: 176, revelation: 'Madinah' },
    { number: 5, name: 'Al-Maidah', translation: 'The Table', verses: 120, revelation: 'Madinah' },
    { number: 6, name: 'Al-Anam', translation: 'The Cattle', verses: 165, revelation: 'Makkah' },
  ];

  const filteredChapters = chapters.filter(chapter =>
    chapter.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    chapter.translation.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleReadChapter = (chapterNumber: number, chapterName: string) => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to read the Quran",
        variant: "destructive",
      });
      return;
    }
    
    toast({
      title: "Opening Chapter",
      description: `Starting to read ${chapterName}...`,
    });
    
    // Simulate saving progress
    setTimeout(() => {
      toast({
        title: "Reading Progress Saved",
        description: `Your progress in ${chapterName} has been saved`,
      });
    }, 2000);
  };

  const handleBookmarkChapter = async (chapterNumber: number, chapterName: string) => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to bookmark chapters",
        variant: "destructive",
      });
      return;
    }

    try {
      await supabase.from('quran_progress').upsert({
        user_id: user.id,
        surah_number: chapterNumber,
        verse_number: 1,
        total_verses: chapters.find(c => c.number === chapterNumber)?.verses || 0,
        bookmarked: true
      });

      toast({
        title: "Bookmarked Successfully",
        description: `${chapterName} has been added to your bookmarks`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to bookmark chapter",
        variant: "destructive",
      });
    }
  };

  const handlePlayAudio = (chapterNumber: number, chapterName: string) => {
    if (playingChapter === chapterNumber) {
      setPlayingChapter(null);
      toast({
        title: "Audio Paused",
        description: `Paused recitation of ${chapterName}`,
      });
    } else {
      setPlayingChapter(chapterNumber);
      toast({
        title: "Playing Audio",
        description: `Now playing recitation of ${chapterName}`,
      });
    }
  };

  const handleDownload = () => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to download chapters",
        variant: "destructive",
      });
      return;
    }
    
    toast({
      title: "Download Started",
      description: "Quran chapters are being downloaded...",
    });
    
    // Simulate download progress
    setTimeout(() => {
      toast({
        title: "Download Complete",
        description: "Quran chapters are now available offline",
      });
    }, 3000);
  };

  const handleViewBookmarks = () => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to view bookmarks",
        variant: "destructive",
      });
      return;
    }
    toast({
      title: "Opening Bookmarks",
      description: "Loading your bookmarked chapters...",
    });
  };

  const handleContinueReading = () => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to continue reading",
        variant: "destructive",
      });
      return;
    }
    
    toast({
      title: "Continue Reading",
      description: "Resuming from your last read position...",
    });
  };

  return (
    <main className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-primary mb-4">Holy Quran</h1>
          <p className="text-xl text-muted-foreground">Read, listen, and reflect upon Allah's final revelation</p>
        </div>

        {/* Search and Filters */}
        <Card className="p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Search chapters, verses, or keywords..."
                className="pl-12"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={handleDownload}>
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
              <Button variant="outline" onClick={handleViewBookmarks}>
                <Bookmark className="w-4 h-4 mr-2" />
                Bookmarks
              </Button>
            </div>
          </div>
        </Card>

        {/* Reading Guidelines */}
        <Card className="p-6 mb-8 bg-secondary/5 border-secondary/20">
          <h3 className="text-lg font-semibold text-secondary mb-4">Reading Guidelines</h3>
          <div className="grid md:grid-cols-3 gap-4 text-sm">
            <div className="text-center">
              <div className="w-12 h-12 bg-secondary/20 rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-secondary font-bold">1</span>
              </div>
              <p className="font-medium mb-1">Perform Wudu</p>
              <p className="text-muted-foreground">Maintain purity before reading</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-secondary/20 rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-secondary font-bold">2</span>
              </div>
              <p className="font-medium mb-1">Seek Refuge</p>
              <p className="text-muted-foreground">A'udhu billahi min ash-shaytani'r-rajim</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-secondary/20 rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-secondary font-bold">3</span>
              </div>
              <p className="font-medium mb-1">Begin with Bismillah</p>
              <p className="text-muted-foreground">Bismillahi'r-rahmani'r-rahim</p>
            </div>
          </div>
        </Card>

        {/* Chapters Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredChapters.map((chapter) => (
            <Card key={chapter.number} className="p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <span className="text-primary font-bold">{chapter.number}</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-primary">{chapter.name}</h3>
                    <p className="text-sm text-muted-foreground">{chapter.translation}</p>
                  </div>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => handlePlayAudio(chapter.number, chapter.name)}
                  className={playingChapter === chapter.number ? "text-secondary" : ""}
                >
                  {playingChapter === chapter.number ? (
                    <Pause className="w-4 h-4" />
                  ) : (
                    <Volume2 className="w-4 h-4" />
                  )}
                </Button>
              </div>
              
              <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                <span>{chapter.verses} verses</span>
                <span>{chapter.revelation}</span>
              </div>

              <div className="flex gap-2">
                <Button 
                  className="flex-1" 
                  size="sm"
                  onClick={() => handleReadChapter(chapter.number, chapter.name)}
                >
                  Read Chapter
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleBookmarkChapter(chapter.number, chapter.name)}
                >
                  <Bookmark className="w-4 h-4" />
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {/* Continue Reading */}
        <Card className="p-6 mt-8 bg-primary/5 border-primary/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <BookOpen className="w-8 h-8 text-primary" />
              <div>
                <h3 className="text-lg font-semibold text-primary">Continue Reading</h3>
                <p className="text-muted-foreground">Al-Baqarah - Verse 255 (Ayat-ul-Kursi)</p>
              </div>
            </div>
            <Button className="btn-hero" onClick={handleContinueReading}>
              Continue Reading
            </Button>
          </div>
        </Card>
      </div>
    </main>
  );
};

export default Quran;