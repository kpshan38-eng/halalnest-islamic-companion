import { BookOpen, Search, Volume2, Bookmark, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';

const Quran = () => {
  const chapters = [
    { number: 1, name: 'Al-Fatiha', translation: 'The Opening', verses: 7, revelation: 'Makkah' },
    { number: 2, name: 'Al-Baqarah', translation: 'The Cow', verses: 286, revelation: 'Madinah' },
    { number: 3, name: 'Ali Imran', translation: 'The Family of Imran', verses: 200, revelation: 'Madinah' },
    { number: 4, name: 'An-Nisa', translation: 'The Women', verses: 176, revelation: 'Madinah' },
    { number: 5, name: 'Al-Maidah', translation: 'The Table', verses: 120, revelation: 'Madinah' },
    { number: 6, name: 'Al-Anam', translation: 'The Cattle', verses: 165, revelation: 'Makkah' },
  ];

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
              />
            </div>
            <div className="flex gap-3">
              <Button variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
              <Button variant="outline">
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
          {chapters.map((chapter) => (
            <Card key={chapter.number} className="p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer">
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
                <Button variant="ghost" size="icon">
                  <Volume2 className="w-4 h-4" />
                </Button>
              </div>
              
              <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                <span>{chapter.verses} verses</span>
                <span>{chapter.revelation}</span>
              </div>

              <div className="flex gap-2">
                <Button className="flex-1" size="sm">
                  Read Chapter
                </Button>
                <Button variant="outline" size="sm">
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
            <Button className="btn-hero">
              Continue Reading
            </Button>
          </div>
        </Card>
      </div>
    </main>
  );
};

export default Quran;