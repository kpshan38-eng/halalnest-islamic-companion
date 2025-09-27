import HeroSection from '@/components/HeroSection';
import PrayerTimesWidget from '@/components/PrayerTimesWidget';
import QuranReaderWidget from '@/components/QuranReaderWidget';
import ZakatCalculatorWidget from '@/components/ZakatCalculatorWidget';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Calculator, Users, BookOpen, TrendingUp, Clock, Eye, User, MessageCircle } from 'lucide-react';

const Index = () => {
  const additionalTools = [
    {
      title: 'Islamic Inheritance Calculator',
      description: 'Shariah-compliant inheritance distribution',
      icon: Users,
      color: 'bg-primary/10 text-primary',
      features: ['Ashab al-Furudh (Fixed heirs)', 'Asabah (Residuaries)', 'Dhawu al-Arham (Distant relatives)']
    },
    {
      title: 'Scholar Assistant',
      description: 'AI-powered Islamic guidance chat',
      icon: MessageCircle,
      color: 'bg-secondary/10 text-secondary',
      features: ['24/7 availability', 'Authentic sources', 'Multiple languages']
    }
  ];

  const articles = [
    {
      title: 'The Beauty of Morning Prayers',
      category: 'Spirituality',
      readTime: '5 min read',
      views: '2.3k',
      excerpt: 'Discover the spiritual significance of Fajr prayer...'
    },
    {
      title: 'Understanding Zakat: A Pillar of Islam',
      category: 'Islamic Finance',
      readTime: '8 min read',
      views: '1.8k',
      excerpt: 'A comprehensive guide to calculating Zakat...'
    },
    {
      title: 'The Prophetic Way of Life',
      category: 'Sunnah',
      readTime: '12 min read',
      views: '3.1k',
      excerpt: 'Learn how to incorporate the Sunnah into daily life...'
    }
  ];

  return (
    <main className="min-h-screen bg-background">
      {/* Hero Section */}
      <HeroSection />

      {/* Islamic Tools Dashboard */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-primary mb-4">Islamic Tools Dashboard</h2>
            <p className="text-xl text-muted-foreground">Essential Islamic tools for your daily spiritual journey</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            <PrayerTimesWidget />
            <QuranReaderWidget />
            <ZakatCalculatorWidget />
          </div>
        </div>
      </section>

      {/* Additional Tools Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-primary mb-4">More Islamic Tools</h2>
            <p className="text-lg text-muted-foreground">Comprehensive suite of Shariah-compliant calculators and guidance</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-8">
            {additionalTools.map((tool, index) => (
              <Card key={tool.title} className="p-6 hover:shadow-lg transition-all duration-300">
                <div className="flex items-start space-x-4">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${tool.color}`}>
                    <tool.icon className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-primary mb-2">{tool.title}</h3>
                    <p className="text-muted-foreground mb-4">{tool.description}</p>
                    
                    <div className="mb-4">
                      <h4 className="font-medium text-foreground mb-2">Features:</h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        {tool.features.map((feature, idx) => (
                          <li key={idx} className="flex items-center space-x-2">
                            <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <Button variant="outline" className="hover:bg-primary hover:text-primary-foreground">
                      Learn More
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <div className="text-center">
            <Link to="/calculators">
              <Button className="btn-hero px-8 py-3">
                <Calculator className="w-5 h-5 mr-2" />
                View All Calculators
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Knowledge Articles Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-primary mb-4">Knowledge Articles</h2>
            <p className="text-lg text-muted-foreground">Authentic Islamic guidance from qualified scholars</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {articles.map((article, index) => (
              <Card key={article.title} className="p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium text-secondary bg-secondary/10 px-2 py-1 rounded-full">
                      {article.category}
                    </span>
                    <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                      <Eye className="w-3 h-3" />
                      <span>{article.views}</span>
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold text-primary mb-2">{article.title}</h3>
                  <p className="text-sm text-muted-foreground mb-3">{article.excerpt}</p>
                  
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex items-center space-x-1">
                      <Clock className="w-3 h-3" />
                      <span>{article.readTime}</span>
                    </div>
                  </div>
                </div>
                
                <Button variant="outline" size="sm" className="w-full hover:bg-primary hover:text-primary-foreground">
                  Read Article
                </Button>
              </Card>
            ))}
          </div>

          <div className="text-center">
            <Link to="/articles">
              <Button className="btn-hero px-8 py-3">
                <BookOpen className="w-5 h-5 mr-2" />
                View All Articles
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Authentication Notice */}
      <section className="py-12 bg-secondary/5">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <Card className="p-8 border-secondary/20">
            <div className="flex items-center justify-center w-12 h-12 bg-secondary/20 rounded-full mx-auto mb-4">
              <User className="w-6 h-6 text-secondary" />
            </div>
            <h3 className="text-xl font-semibold text-secondary mb-2">Authentication Required for Editing</h3>
            <p className="text-muted-foreground mb-6">
              Sign in to edit articles and access advanced features like bookmarking, community discussions, and personalized content.
            </p>
            <Link to="/auth">
              <Button className="btn-gold">
                Sign In to Continue
              </Button>
            </Link>
          </Card>
        </div>
      </section>

      {/* Community CTA Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <h2 className="text-3xl font-bold text-primary mb-4">Join Our Growing Community</h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Connect with Muslims worldwide through authentic resources verified by qualified scholars. 
            Share knowledge, seek guidance, and grow together in faith.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/community">
              <Button className="btn-hero px-8 py-3">
                <Users className="w-5 h-5 mr-2" />
                Join Community
              </Button>
            </Link>
            <Link to="/articles">
              <Button variant="outline" className="px-8 py-3 hover:bg-primary hover:text-primary-foreground">
                Learn More
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Index;
