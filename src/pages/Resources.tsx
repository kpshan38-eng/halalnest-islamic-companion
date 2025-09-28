import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, Youtube, Globe, BookOpen, Search, Filter } from 'lucide-react';

interface Resource {
  id: string;
  title: string;
  description: string;
  url: string;
  type: 'youtube' | 'website' | 'wikipedia';
  category: string;
  tags: string[];
}

const islamicResources: Resource[] = [
  {
    id: '1',
    title: 'Islamic Online University',
    description: 'Free online Islamic education with comprehensive courses on Quran, Hadith, and Islamic studies.',
    url: 'https://islamiconlineuniversity.com',
    type: 'website',
    category: 'Education',
    tags: ['education', 'courses', 'free']
  },
  {
    id: '2',
    title: 'Bayyinah Institute',
    description: 'High-quality Islamic education focusing on Arabic language and Quranic studies.',
    url: 'https://www.youtube.com/@BayyinahInstitute',
    type: 'youtube',
    category: 'Education',
    tags: ['arabic', 'quran', 'tafsir']
  },
  {
    id: '3',
    title: 'Islam - Wikipedia',
    description: 'Comprehensive encyclopedia entry about Islam, its history, beliefs, and practices.',
    url: 'https://en.wikipedia.org/wiki/Islam',
    type: 'wikipedia',
    category: 'Reference',
    tags: ['history', 'reference', 'overview']
  },
  {
    id: '4',
    title: 'Mufti Menk',
    description: 'Inspirational Islamic lectures and guidance for daily life by Mufti Ismail Menk.',
    url: 'https://www.youtube.com/@MuftiMenk',
    type: 'youtube',
    category: 'Lectures',
    tags: ['motivation', 'guidance', 'daily-life']
  },
  {
    id: '5',
    title: 'IslamQA.info',
    description: 'Authentic Islamic questions and answers based on Quran and Sunnah.',
    url: 'https://islamqa.info',
    type: 'website',
    category: 'Q&A',
    tags: ['fiqh', 'fatwa', 'guidance']
  },
  {
    id: '6',
    title: 'Omar Suleiman',
    description: 'Contemporary Islamic teachings and spiritual guidance.',
    url: 'https://www.youtube.com/@YaqeenInstitute',
    type: 'youtube',
    category: 'Lectures',
    tags: ['spirituality', 'contemporary', 'guidance']
  },
  {
    id: '7',
    title: 'Quran.com',
    description: 'Beautiful online Quran with translations, audio recitations, and tafsir.',
    url: 'https://quran.com',
    type: 'website',
    category: 'Quran',
    tags: ['quran', 'translation', 'audio']
  },
  {
    id: '8',
    title: 'Islamic History - Wikipedia',
    description: 'Comprehensive overview of Islamic history from the Prophet to modern times.',
    url: 'https://en.wikipedia.org/wiki/Islamic_history',
    type: 'wikipedia',
    category: 'History',
    tags: ['history', 'timeline', 'reference']
  },
  {
    id: '9',
    title: 'Yasir Qadhi',
    description: 'In-depth Islamic knowledge and contemporary Muslim issues.',
    url: 'https://www.youtube.com/@YasirQadhi',
    type: 'youtube',
    category: 'Education',
    tags: ['theology', 'contemporary', 'in-depth']
  },
  {
    id: '10',
    title: 'Sunnah.com',
    description: 'Comprehensive collection of authentic Hadith with search functionality.',
    url: 'https://sunnah.com',
    type: 'website',
    category: 'Hadith',
    tags: ['hadith', 'sunnah', 'reference']
  }
];

const Resources = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedType, setSelectedType] = useState('All');

  const categories = ['All', ...Array.from(new Set(islamicResources.map(r => r.category)))];
  const types = ['All', 'youtube', 'website', 'wikipedia'];

  const filteredResources = islamicResources.filter(resource => {
    const matchesSearch = resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resource.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resource.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'All' || resource.category === selectedCategory;
    const matchesType = selectedType === 'All' || resource.type === selectedType;
    
    return matchesSearch && matchesCategory && matchesType;
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'youtube':
        return <Youtube className="w-4 h-4 text-red-600" />;
      case 'wikipedia':
        return <BookOpen className="w-4 h-4 text-blue-600" />;
      default:
        return <Globe className="w-4 h-4 text-green-600" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'youtube':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      case 'wikipedia':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      default:
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/5">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent mb-6">
            Islamic Resources
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Discover authentic Islamic knowledge through carefully curated resources from YouTube, Wikipedia, 
            and trusted Islamic websites. Enhance your understanding of Islam with these valuable sources.
          </p>
          
          {/* Contact Information */}
          <div className="bg-gradient-to-r from-primary/5 to-secondary/5 p-6 rounded-xl border border-border/50 max-w-2xl mx-auto mb-8">
            <h3 className="text-lg font-semibold mb-4 text-primary">Contact & Location</h3>
            <div className="grid md:grid-cols-3 gap-4 text-sm">
              <div className="flex flex-col items-center">
                <span className="font-medium text-foreground">Email</span>
                <a href="mailto:shankp562@gmail.com" className="text-primary hover:underline">
                  shankp562@gmail.com
                </a>
              </div>
              <div className="flex flex-col items-center">
                <span className="font-medium text-foreground">Phone</span>
                <a href="tel:+919961512525" className="text-primary hover:underline">
                  +91 9961512525
                </a>
              </div>
              <div className="flex flex-col items-center">
                <span className="font-medium text-foreground">Location</span>
                <span className="text-muted-foreground">Biyyam Lake, Kerala, India</span>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 space-y-4 animate-scale-in">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search resources, topics, or tags..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="px-4 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                <option value="All">All Types</option>
                <option value="youtube">YouTube</option>
                <option value="website">Website</option>
                <option value="wikipedia">Wikipedia</option>
              </select>
            </div>
          </div>
        </div>

        {/* Resources Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredResources.map((resource, index) => (
            <Card 
              key={resource.id} 
              className="p-6 hover:shadow-xl transition-all duration-300 hover:scale-105 hover:bg-gradient-to-br hover:from-primary/5 hover:to-secondary/5 animate-fade-in group"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-2">
                  {getTypeIcon(resource.type)}
                  <Badge className={getTypeColor(resource.type)}>
                    {resource.type}
                  </Badge>
                </div>
                <Badge variant="outline">{resource.category}</Badge>
              </div>
              
              <h3 className="text-lg font-semibold mb-3 text-foreground group-hover:text-primary transition-colors">
                {resource.title}
              </h3>
              
              <p className="text-muted-foreground mb-4 text-sm leading-relaxed">
                {resource.description}
              </p>
              
              <div className="flex flex-wrap gap-1 mb-4">
                {resource.tags.map(tag => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
              
              <Button 
                asChild 
                className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300"
              >
                <a href={resource.url} target="_blank" rel="noopener noreferrer">
                  Visit Resource <ExternalLink className="w-4 h-4 ml-2" />
                </a>
              </Button>
            </Card>
          ))}
        </div>

        {filteredResources.length === 0 && (
          <div className="text-center py-16">
            <Filter className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-xl font-semibold mb-2">No resources found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search terms or filters to find more resources.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Resources;