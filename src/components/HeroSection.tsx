import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Users, BookOpen, Clock } from 'lucide-react';

const HeroSection = () => {
  return (
    <section className="relative py-20 overflow-hidden islamic-pattern">
      {/* Background decorative elements */}
      <div className="absolute inset-0 bg-gradient-hero opacity-5"></div>
      <div className="absolute top-10 right-10 w-32 h-32 bg-secondary/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-10 left-10 w-48 h-48 bg-primary/5 rounded-full blur-3xl"></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          {/* Main heading */}
          <h1 className="text-5xl md:text-7xl font-bold text-primary mb-6 animate-fade-in">
            Halal<span className="text-secondary">Nest</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto animate-slide-up">
            Your comprehensive Islamic companion featuring authentic resources, prayer tools, and scholarly guidance in one beautiful platform
          </p>

          {/* Statistics */}
          <div className="flex flex-wrap justify-center gap-8 mb-12 animate-slide-up">
            <div className="flex items-center space-x-3 bg-card/80 backdrop-blur-sm rounded-2xl px-6 py-4 shadow-elegant">
              <Users className="w-8 h-8 text-secondary" />
              <div className="text-left">
                <div className="text-2xl font-bold text-primary">50,000+</div>
                <div className="text-sm text-muted-foreground">Active Users</div>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 bg-card/80 backdrop-blur-sm rounded-2xl px-6 py-4 shadow-elegant">
              <BookOpen className="w-8 h-8 text-secondary" />
              <div className="text-left">
                <div className="text-2xl font-bold text-primary">114</div>
                <div className="text-sm text-muted-foreground">Quran Chapters</div>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 bg-card/80 backdrop-blur-sm rounded-2xl px-6 py-4 shadow-elegant">
              <Clock className="w-8 h-8 text-secondary" />
              <div className="text-left">
                <div className="text-2xl font-bold text-primary">1,000+</div>
                <div className="text-sm text-muted-foreground">Daily Prayers</div>
              </div>
            </div>
          </div>

          {/* Featured Quranic Verse */}
          <div className="bg-card/90 backdrop-blur-sm rounded-3xl p-8 mb-12 shadow-islamic border border-primary/10 animate-fade-in">
            <div className="arabic-text text-3xl md:text-4xl text-primary mb-6 leading-relaxed">
              وَمَا خَلَقْتُ الْجِنَّ وَالْإِنسَ إِلَّا لِيَعْبُدُونِ
            </div>
            <p className="text-lg text-muted-foreground mb-2">
              "And I did not create the jinn and mankind except to worship Me."
            </p>
            <p className="text-sm text-secondary font-medium">
              - Quran 51:56
            </p>
          </div>

          {/* Call to action buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up">
            <Link to="/prayer-times">
              <Button className="btn-hero px-8 py-6 text-lg font-semibold">
                Start Your Journey
              </Button>
            </Link>
            <Link to="/community">
              <Button className="btn-hero-outline px-8 py-6 text-lg font-semibold">
                Join Community
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;