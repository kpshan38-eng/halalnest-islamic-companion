import { Users, MessageCircle, Globe, Heart, Star, TrendingUp, Plus, Bot } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';

const Community = () => {
  const { user } = useSupabaseAuth();

  const handleStartDiscussion = () => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to start a discussion",
        variant: "destructive",
      });
      return;
    }
    toast({
      title: "Start Discussion",
      description: "Opening discussion creation form...",
    });
  };

  const handleJoinDiscussion = (title: string) => {
    toast({
      title: "Joining Discussion",
      description: `Opening: ${title}`,
    });
  };

  const handleJoinCommunity = () => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to join the community",
        variant: "destructive",
      });
      return;
    }
    toast({
      title: "Welcome!",
      description: "You've joined our Islamic community",
    });
  };

  const handleAskScholar = () => {
    window.location.href = '/scholar-assistant';
  };

  const handleLearnMore = () => {
    toast({
      title: "Learn More",
      description: "Opening community guidelines and information...",
    });
  };
  const stats = [
    { label: 'Active Members', value: '50,000+', icon: Users },
    { label: 'Daily Discussions', value: '1,200+', icon: MessageCircle },
    { label: 'Countries', value: '85+', icon: Globe },
    { label: 'Verified Scholars', value: '150+', icon: Star },
  ];

  const discussions = [
    {
      title: 'Best practices for maintaining prayer consistency during busy work schedule',
      author: 'Ahmad Hassan',
      replies: 24,
      likes: 89,
      category: 'Prayer & Worship',
      timeAgo: '2 hours ago',
      trending: true
    },
    {
      title: 'How to explain Islamic values to non-Muslim friends respectfully?',
      author: 'Fatima Al-Zahra',
      replies: 18,
      likes: 67,
      category: 'Dawah & Community',
      timeAgo: '4 hours ago',
      trending: false
    },
    {
      title: 'Halal investment options in current economic climate',
      author: 'Omar Malik',
      replies: 31,
      likes: 112,
      category: 'Islamic Finance',
      timeAgo: '6 hours ago',
      trending: true
    },
    {
      title: 'Parenting advice: Teaching children to love the Quran',
      author: 'Aisha Khan',
      replies: 42,
      likes: 156,
      category: 'Family & Parenting',
      timeAgo: '1 day ago',
      trending: false
    }
  ];

  const categories = [
    { name: 'Prayer & Worship', members: '12.5k', color: 'bg-blue-500/10 text-blue-600' },
    { name: 'Quran & Hadith', members: '15.2k', color: 'bg-green-500/10 text-green-600' },
    { name: 'Islamic Finance', members: '8.7k', color: 'bg-yellow-500/10 text-yellow-600' },
    { name: 'Family & Parenting', members: '9.3k', color: 'bg-purple-500/10 text-purple-600' },
    { name: 'Dawah & Community', members: '6.8k', color: 'bg-pink-500/10 text-pink-600' },
    { name: 'Spiritual Growth', members: '11.4k', color: 'bg-indigo-500/10 text-indigo-600' },
  ];

  return (
    <main className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-primary mb-4">Join Our Growing Community</h1>
          <p className="text-xl text-muted-foreground">
            Connect with Muslims worldwide through authentic resources verified by qualified scholars
          </p>
        </div>

        {/* Community Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-12">
          {stats.map((stat) => (
            <Card key={stat.label} className="p-6 text-center hover:shadow-elegant transition-all duration-300">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <stat.icon className="w-6 h-6 text-primary" />
              </div>
              <div className="text-2xl font-bold text-primary mb-1">{stat.value}</div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </Card>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Discussion Feed */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold text-primary">Recent Discussions</h2>
              <Button className="btn-hero" onClick={handleStartDiscussion}>
                <Plus className="w-4 h-4 mr-2" />
                Start Discussion
              </Button>
            </div>

            {discussions.map((discussion, index) => (
              <Card key={index} className="p-6 hover:shadow-lg transition-all duration-300">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <Badge variant="outline" className="text-xs">{discussion.category}</Badge>
                      {discussion.trending && (
                        <Badge className="bg-secondary/20 text-secondary text-xs">
                          <TrendingUp className="w-3 h-3 mr-1" />
                          Trending
                        </Badge>
                      )}
                    </div>
                    <h3 className="text-lg font-semibold text-primary mb-2 hover:text-secondary cursor-pointer transition-colors">
                      {discussion.title}
                    </h3>
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <span>by {discussion.author}</span>
                      <span>{discussion.timeAgo}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-6 text-sm text-muted-foreground">
                    <div className="flex items-center space-x-1">
                      <MessageCircle className="w-4 h-4" />
                      <span>{discussion.replies} replies</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Heart className="w-4 h-4" />
                      <span>{discussion.likes} likes</span>
                    </div>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleJoinDiscussion(discussion.title)}
                  >
                    Join Discussion
                  </Button>
                </div>
              </Card>
            ))}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Community Categories */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-primary mb-4">Popular Categories</h3>
              <div className="space-y-3">
                {categories.map((category, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors">
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 rounded-full ${category.color.split(' ')[0]}`}></div>
                      <span className="font-medium">{category.name}</span>
                    </div>
                    <span className="text-sm text-muted-foreground">{category.members}</span>
                  </div>
                ))}
              </div>
            </Card>

            {/* Community Guidelines */}
            <Card className="p-6 bg-primary/5 border-primary/20">
              <h3 className="text-lg font-semibold text-primary mb-4">Community Guidelines</h3>
              <ul className="text-sm text-muted-foreground space-y-2">
                <li className="flex items-start space-x-2">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2"></div>
                  <span>Maintain respectful Islamic discourse</span>
                </li>
                <li className="flex items-start space-x-2">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2"></div>
                  <span>Support fellow Muslims with kindness</span>
                </li>
                <li className="flex items-start space-x-2">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2"></div>
                  <span>Share authentic Islamic knowledge</span>
                </li>
                <li className="flex items-start space-x-2">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2"></div>
                  <span>Consult scholars for complex matters</span>
                </li>
              </ul>
            </Card>

            {/* Scholar Assistant */}
            <Card className="p-6 bg-secondary/5 border-secondary/20">
              <h3 className="text-lg font-semibold text-secondary mb-4">Scholar Assistant</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Get AI-powered Islamic guidance for your questions, backed by authentic sources.
              </p>
              <Button 
                variant="outline" 
                className="w-full hover:bg-secondary hover:text-secondary-foreground"
                onClick={handleAskScholar}
              >
                <Bot className="w-4 h-4 mr-2" />
                Ask Scholar Assistant
              </Button>
            </Card>
          </div>
        </div>

        {/* Call to Action */}
        <Card className="p-8 mt-12 text-center bg-gradient-to-r from-primary/5 to-secondary/5 border-primary/20">
          <h2 className="text-2xl font-bold text-primary mb-4">Ready to Join Our Community?</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Connect with fellow Muslims, learn from scholars, and grow in your faith together. 
            Join thousands of Muslims worldwide in meaningful discussions and authentic Islamic learning.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="btn-hero" onClick={handleJoinCommunity}>
              Join Community
            </Button>
            <Button variant="outline" onClick={handleLearnMore}>
              Learn More
            </Button>
          </div>
        </Card>
      </div>
    </main>
  );
};

export default Community;