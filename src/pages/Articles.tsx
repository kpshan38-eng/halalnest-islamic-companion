import { Search, Clock, Eye, BookOpen, Heart, TrendingUp, User, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';

const Articles = () => {
  const { user } = useSupabaseAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    toast({
      title: "Searching",
      description: `Looking for articles matching "${value}"...`,
    });
  };

  const handleCategoryFilter = (categoryName: string) => {
    setActiveCategory(categoryName);
    toast({
      title: "Filter Applied", 
      description: `Showing ${categoryName} articles`,
    });
  };

  const handleReadArticle = (title: string) => {
    toast({
      title: "Opening Article",
      description: `Reading: ${title}`,
    });
  };

  const handleSignInToContinue = () => {
    toast({
      title: "Sign In Required",
      description: "Please sign in to access advanced features",
    });
  };
  const categories = [
    { name: 'All', count: 45, active: activeCategory === 'All' },
    { name: 'Spirituality', count: 12, active: activeCategory === 'Spirituality' },
    { name: 'Islamic Finance', count: 8, active: activeCategory === 'Islamic Finance' },
    { name: 'Sunnah', count: 15, active: activeCategory === 'Sunnah' },
    { name: 'Family & Life', count: 6, active: activeCategory === 'Family & Life' },
    { name: 'Prayer & Worship', count: 4, active: activeCategory === 'Prayer & Worship' },
  ];

  const articles = [
    {
      title: 'The Beauty of Morning Prayers',
      excerpt: 'Discover the spiritual significance and benefits of Fajr prayer in strengthening your connection with Allah.',
      category: 'Spirituality',
      readTime: '5 min read',
      views: '2.3k',
      author: 'Sheikh Ahmad Rahman',
      date: '2 days ago',
      image: '/api/placeholder/400/200',
      featured: true
    },
    {
      title: 'Understanding Zakat: A Pillar of Islam',
      excerpt: 'A comprehensive guide to calculating and distributing Zakat according to Islamic principles.',
      category: 'Islamic Finance',
      readTime: '8 min read',
      views: '1.8k',
      author: 'Dr. Fatima Al-Zahra',
      date: '1 week ago',
      image: '/api/placeholder/400/200',
      featured: false
    },
    {
      title: 'The Prophetic Way of Life',
      excerpt: 'Learn how to incorporate the Sunnah of Prophet Muhammad (PBUH) into modern daily living.',
      category: 'Sunnah',
      readTime: '12 min read',
      views: '3.1k',
      author: 'Imam Hassan Ali',
      date: '3 days ago',
      image: '/api/placeholder/400/200',
      featured: false
    },
    {
      title: 'Raising Children with Islamic Values',
      excerpt: 'Practical guidance for parents on nurturing faith and character in children.',
      category: 'Family & Life',
      readTime: '10 min read',
      views: '1.5k',
      author: 'Sister Aisha Khan',
      date: '5 days ago',
      image: '/api/placeholder/400/200',
      featured: false
    },
    {
      title: 'The Science Behind Ablution (Wudu)',
      excerpt: 'Exploring the health and spiritual benefits of the Islamic ritual of purification.',
      category: 'Prayer & Worship',
      readTime: '6 min read',
      views: '2.7k',
      author: 'Dr. Omar Malik',
      date: '1 week ago',
      image: '/api/placeholder/400/200',
      featured: false
    },
    {
      title: 'Halal Investment Strategies',
      excerpt: 'Navigate the world of Shariah-compliant investments and wealth building.',
      category: 'Islamic Finance',
      readTime: '15 min read',
      views: '4.2k',
      author: 'Financial Advisor Yusuf Ahmad',
      date: '4 days ago',
      image: '/api/placeholder/400/200',
      featured: false
    }
  ];

  return (
    <main className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-primary mb-4">Islamic Knowledge Articles</h1>
          <p className="text-xl text-muted-foreground">Authentic Islamic guidance and insights from qualified scholars</p>
        </div>

        {/* Search and Filters */}
        <Card className="p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Search articles, topics, or authors..."
                className="pl-12"
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </div>
            
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Button
                  key={category.name}
                  variant={category.active ? "default" : "outline"}
                  size="sm"
                  className={category.active ? "btn-hero" : ""}
                  onClick={() => handleCategoryFilter(category.name)}
                >
                  {category.name} ({category.count})
                </Button>
              ))}
            </div>
          </div>
        </Card>

        {/* Featured Article */}
        {articles.filter(article => article.featured).map((article) => (
          <Card key={article.title} className="p-8 mb-8 bg-gradient-to-r from-primary/5 to-secondary/5 border-primary/20">
            <div className="grid lg:grid-cols-2 gap-8 items-center">
              <div>
                <Badge className="bg-secondary/20 text-secondary mb-4">Featured Article</Badge>
                <h2 className="text-3xl font-bold text-primary mb-4">{article.title}</h2>
                <p className="text-lg text-muted-foreground mb-6">{article.excerpt}</p>
                
                <div className="flex items-center space-x-6 text-sm text-muted-foreground mb-6">
                  <div className="flex items-center space-x-2">
                    <User className="w-4 h-4" />
                    <span>{article.author}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4" />
                    <span>{article.readTime}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Eye className="w-4 h-4" />
                    <span>{article.views} views</span>
                  </div>
                </div>
                
                <Button className="btn-hero" onClick={() => handleReadArticle(article.title)}>Read Full Article</Button>
              </div>
              
              <div className="bg-muted/30 rounded-xl aspect-video flex items-center justify-center">
                <BookOpen className="w-16 h-16 text-muted-foreground" />
              </div>
            </div>
          </Card>
        ))}

        {/* Articles Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {articles.filter(article => !article.featured).map((article) => (
            <Card key={article.title} className="overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <div className="bg-muted/30 aspect-video flex items-center justify-center">
                <BookOpen className="w-12 h-12 text-muted-foreground" />
              </div>
              
              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <Badge variant="outline" className="text-xs">{article.category}</Badge>
                  <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                    <Eye className="w-3 h-3" />
                    <span>{article.views}</span>
                  </div>
                </div>
                
                <h3 className="text-lg font-semibold text-primary mb-3 line-clamp-2">{article.title}</h3>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-3">{article.excerpt}</p>
                
                <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
                  <span>{article.author}</span>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                      <Clock className="w-3 h-3" />
                      <span>{article.readTime}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-3 h-3" />
                      <span>{article.date}</span>
                    </div>
                  </div>
                </div>
                
                <Button variant="outline" size="sm" className="w-full hover:bg-primary hover:text-primary-foreground" onClick={() => handleReadArticle(article.title)}>
                  Read Article
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {/* Authentication Notice */}
        <Card className="p-6 text-center bg-secondary/5 border-secondary/20">
          <h3 className="text-lg font-semibold text-secondary mb-2">Authentication Required for Editing</h3>
          <p className="text-muted-foreground mb-4">
            Sign in to edit articles and access advanced features like bookmarking and commenting.
          </p>
          <Button className="btn-gold" onClick={handleSignInToContinue}>
            Sign In to Continue
          </Button>
        </Card>
      </div>
    </main>
  );
};

export default Articles;