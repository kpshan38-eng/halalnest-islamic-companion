import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';

const BlossomButton = () => {
  const [isBlossoming, setIsBlossoming] = useState(false);

  const triggerBlossom = () => {
    setIsBlossoming(true);
    
    // Create flower petals animation
    const container = document.createElement('div');
    container.className = 'fixed inset-0 pointer-events-none z-50';
    document.body.appendChild(container);

    // Create multiple flower petals
    for (let i = 0; i < 50; i++) {
      const petal = document.createElement('div');
      petal.innerHTML = '🌸';
      petal.className = 'absolute text-2xl animate-bounce';
      petal.style.left = Math.random() * 100 + '%';
      petal.style.top = Math.random() * 100 + '%';
      petal.style.animationDelay = Math.random() * 2 + 's';
      petal.style.animationDuration = (Math.random() * 3 + 2) + 's';
      container.appendChild(petal);
    }

    // Show Prophet ﷺ calligraphy after 1 second
    setTimeout(() => {
      const calligraphy = document.createElement('div');
      calligraphy.className = 'fixed inset-0 flex items-center justify-center pointer-events-none z-50 animate-fade-in';
      calligraphy.innerHTML = `
        <div class="bg-background/90 backdrop-blur-md rounded-lg p-8 text-center shadow-elegant">
          <div class="text-6xl mb-4" style="font-family: 'Amiri', serif;">ﷺ</div>
          <p class="text-2xl font-bold text-primary mb-2">صلى الله عليه وسلم</p>
          <p class="text-lg text-muted-foreground">Peace and blessings be upon him</p>
        </div>
      `;
      document.body.appendChild(calligraphy);

      // Remove everything after 3 seconds
      setTimeout(() => {
        document.body.removeChild(container);
        document.body.removeChild(calligraphy);
        setIsBlossoming(false);
      }, 3000);
    }, 1000);
  };

  return (
    <Button
      onClick={triggerBlossom}
      disabled={isBlossoming}
      className="fixed bottom-4 right-4 z-40 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white shadow-lg"
      size="lg"
    >
      <Sparkles className="w-5 h-5 mr-2" />
      {isBlossoming ? 'Blossoming...' : 'Blossom'}
    </Button>
  );
};

export default BlossomButton;