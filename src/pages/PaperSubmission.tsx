import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FileText, Send, BookOpen } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const PaperSubmission = () => {
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    email: '',
    category: '',
    abstract: '',
    content: '',
    keywords: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const categories = [
    'Islamic Jurisprudence (Fiqh)',
    'Islamic Finance',
    'Quran Studies',
    'Hadith Studies',
    'Islamic History',
    'Islamic Philosophy',
    'Contemporary Islamic Issues',
    'Islamic Education',
    'Comparative Religion',
    'Other'
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.title || !formData.author || !formData.email || !formData.category || !formData.content) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // In a real app, this would submit to Supabase
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API call
      
      // Store in localStorage for demo purposes
      const existingPapers = JSON.parse(localStorage.getItem('submitted_papers') || '[]');
      const newPaper = {
        id: Date.now().toString(),
        ...formData,
        status: 'pending',
        submittedAt: new Date().toISOString()
      };
      existingPapers.push(newPaper);
      localStorage.setItem('submitted_papers', JSON.stringify(existingPapers));

      toast({
        title: "Paper Submitted Successfully!",
        description: "Your paper has been submitted for review. You will be notified once it's reviewed.",
      });

      // Reset form
      setFormData({
        title: '',
        author: '',
        email: '',
        category: '',
        abstract: '',
        content: '',
        keywords: ''
      });

    } catch (error) {
      toast({
        title: "Submission Failed",
        description: "There was an error submitting your paper. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-gradient-gold rounded-full flex items-center justify-center">
            <FileText className="w-8 h-8 text-white" />
          </div>
        </div>
        <h1 className="text-3xl font-bold text-primary mb-2">Submit Your Islamic Research Paper</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Share your knowledge with the Islamic community. Submit your research papers, articles, 
          and scholarly works for review and publication on our platform.
        </p>
      </div>

      {/* Submission Guidelines */}
      <Card className="p-6 mb-8 bg-secondary/5 border-secondary/20">
        <h3 className="font-semibold text-secondary mb-3 flex items-center">
          <BookOpen className="w-5 h-5 mr-2" />
          Submission Guidelines
        </h3>
        <ul className="text-sm text-muted-foreground space-y-2">
          <li>• Papers should be original work based on Islamic sources and scholarship</li>
          <li>• All content must comply with Islamic principles and values</li>
          <li>• Provide proper citations and references for all quoted material</li>
          <li>• Papers will be reviewed by qualified Islamic scholars</li>
          <li>• Review process typically takes 7-14 business days</li>
          <li>• Authors will be notified of acceptance or required revisions</li>
        </ul>
      </Card>

      {/* Submission Form */}
      <Card className="p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="title">Paper Title *</Label>
              <Input
                id="title"
                placeholder="Enter the title of your paper"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="author">Author Name *</Label>
              <Input
                id="author"
                placeholder="Your full name"
                value={formData.author}
                onChange={(e) => handleInputChange('author', e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address *</Label>
              <Input
                id="email"
                type="email"
                placeholder="your.email@example.com"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Keywords */}
          <div className="space-y-2">
            <Label htmlFor="keywords">Keywords</Label>
            <Input
              id="keywords"
              placeholder="e.g., Fiqh, Hadith, Islamic Finance (separated by commas)"
              value={formData.keywords}
              onChange={(e) => handleInputChange('keywords', e.target.value)}
            />
          </div>

          {/* Abstract */}
          <div className="space-y-2">
            <Label htmlFor="abstract">Abstract/Summary</Label>
            <Textarea
              id="abstract"
              placeholder="Provide a brief summary of your paper (optional but recommended)"
              value={formData.abstract}
              onChange={(e) => handleInputChange('abstract', e.target.value)}
              rows={4}
            />
          </div>

          {/* Content */}
          <div className="space-y-2">
            <Label htmlFor="content">Paper Content *</Label>
            <Textarea
              id="content"
              placeholder="Enter the full content of your paper here. Include all sections, references, and citations."
              value={formData.content}
              onChange={(e) => handleInputChange('content', e.target.value)}
              rows={15}
              className="min-h-[300px]"
              required
            />
          </div>

          {/* Terms and Conditions */}
          <div className="bg-muted/50 rounded-lg p-4">
            <h4 className="font-medium text-sm mb-2">Terms of Submission</h4>
            <p className="text-xs text-muted-foreground">
              By submitting this paper, you confirm that:
            </p>
            <ul className="text-xs text-muted-foreground mt-2 space-y-1">
              <li>• This is your original work or you have proper permissions</li>
              <li>• The content complies with Islamic principles and values</li>
              <li>• You grant permission to publish this work on our platform</li>
              <li>• All information provided is accurate and truthful</li>
            </ul>
          </div>

          {/* Submit Button */}
          <div className="flex justify-center pt-6">
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="btn-gold min-w-48"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Submitting...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Submit Paper for Review
                </>
              )}
            </Button>
          </div>
        </form>
      </Card>

      {/* Contact Information */}
      <div className="text-center mt-8">
        <p className="text-sm text-muted-foreground">
          Questions about submission? Contact us at{' '}
          <a href="mailto:papers@halalnest.com" className="text-primary hover:underline">
            papers@halalnest.com
          </a>
        </p>
      </div>
    </div>
  );
};

export default PaperSubmission;