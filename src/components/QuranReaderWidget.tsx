import { useState } from 'react';
import { BookOpen, ChevronLeft, ChevronRight, Volume2, Bookmark } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

const QuranReaderWidget = () => {
  const [currentVerse, setCurrentVerse] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  
  const totalVerses = 5;
  const progressPercentage = (currentVerse / totalVerses) * 100;

  // Sample verses from Al-Fatiha
  const verses = [
    {
      arabic: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ",
      translation: "In the name of Allah, the Entirely Merciful, the Especially Merciful.",
      verse: 1
    },
    {
      arabic: "الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ",
      translation: "All praise is due to Allah, Lord of the worlds.",
      verse: 2
    },
    {
      arabic: "الرَّحْمَٰنِ الرَّحِيمِ",
      translation: "The Entirely Merciful, the Especially Merciful,",
      verse: 3
    },
    {
      arabic: "مَالِكِ يَوْمِ الدِّينِ",
      translation: "Sovereign of the Day of Recompense.",
      verse: 4
    },
    {
      arabic: "إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ",
      translation: "It is You we worship and You we ask for help.",
      verse: 5
    }
  ];

  const handlePrevious = () => {
    setCurrentVerse(prev => Math.max(1, prev - 1));
  };

  const handleNext = () => {
    setCurrentVerse(prev => Math.min(totalVerses, prev + 1));
  };

  const toggleAudio = () => {
    setIsPlaying(!isPlaying);
  };

  const currentVerseData = verses[currentVerse - 1];

  return (
    <div className="widget-card space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-gold rounded-lg flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-primary">Quran Reader</h3>
            <p className="text-sm text-muted-foreground">Al-Fatiha - The Opening</p>
          </div>
        </div>
        <Button 
          variant="ghost" 
          size="icon"
          className="hover:bg-secondary/20 hover:text-secondary"
        >
          <Bookmark className="w-5 h-5" />
        </Button>
      </div>

      {/* Verse Counter */}
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>Verse {currentVerse} of {totalVerses}</span>
        <span>Chapter 1 - Al-Fatiha</span>
      </div>

      {/* Progress Bar */}
      <div className="space-y-2">
        <Progress value={progressPercentage} className="h-2" />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Reading Progress</span>
          <span>{Math.round(progressPercentage)}%</span>
        </div>
      </div>

      {/* Arabic Text */}
      <div className="bg-primary/5 border border-primary/10 rounded-xl p-6 text-center">
        <div className="arabic-text text-2xl md:text-3xl text-primary mb-4 leading-relaxed">
          {currentVerseData.arabic}
        </div>
        
        {/* Audio Controls */}
        <div className="flex justify-center mb-4">
          <Button
            variant="outline"
            size="sm"
            onClick={toggleAudio}
            className="hover:bg-secondary hover:text-secondary-foreground"
          >
            <Volume2 className={`w-4 h-4 mr-2 ${isPlaying ? 'animate-pulse' : ''}`} />
            {isPlaying ? 'Playing...' : 'Listen'}
          </Button>
        </div>
      </div>

      {/* English Translation */}
      <div className="bg-muted/30 rounded-xl p-4">
        <p className="text-foreground text-center leading-relaxed">
          {currentVerseData.translation}
        </p>
      </div>

      {/* Navigation Controls */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={currentVerse === 1}
          className="flex items-center space-x-2 hover:bg-primary hover:text-primary-foreground"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Previous</span>
        </Button>

        <div className="text-center">
          <div className="text-sm font-medium text-primary">Verse {currentVerse}</div>
          <div className="text-xs text-muted-foreground">Al-Fatiha</div>
        </div>

        <Button
          variant="outline"
          onClick={handleNext}
          disabled={currentVerse === totalVerses}
          className="flex items-center space-x-2 hover:bg-primary hover:text-primary-foreground"
        >
          <span>Next</span>
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>

      {/* Reading Guidelines */}
      <div className="bg-secondary/5 border border-secondary/20 rounded-xl p-4">
        <h4 className="font-medium text-secondary mb-2">Reading Guidelines</h4>
        <ul className="text-sm text-muted-foreground space-y-1">
          <li>• Perform Wudu (ablution) before reading</li>
          <li>• Begin with "A'udhu billahi min ash-shaytani'r-rajim"</li>
          <li>• Recite "Bismillahi'r-rahmani'r-rahim" before each chapter</li>
        </ul>
      </div>

      {/* Open Full Reader Button */}
      <Button className="w-full btn-hero">
        Open Full Quran Reader
      </Button>
    </div>
  );
};

export default QuranReaderWidget;