import { useState, useEffect } from 'react';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';
import { Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PlusCircle, BookOpen, Calculator, Edit, Trash2, Eye } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Essay {
  id: string;
  title: string;
  content: string;
  category: string;
  is_published: boolean;
  created_at: string;
}

interface QuranProgress {
  id: string;
  surah_number: number;
  verse_number: number;
  total_verses: number;
  last_read_at: string;
  bookmarked: boolean;
}

interface ZakatCalculation {
  id: string;
  cash_savings: number;
  gold_value: number;
  silver_value: number;
  investments: number;
  total_wealth: number;
  zakat_due: number;
  currency: string;
  calculated_at: string;
}

const Dashboard = () => {
  const { user, loading } = useSupabaseAuth();
  const { toast } = useToast();
  const [essays, setEssays] = useState<Essay[]>([]);
  const [quranProgress, setQuranProgress] = useState<QuranProgress[]>([]);
  const [zakatHistory, setZakatHistory] = useState<ZakatCalculation[]>([]);
  const [newEssay, setNewEssay] = useState({
    title: '',
    content: '',
    category: 'general'
  });
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    if (user) {
      fetchUserData();
    }
  }, [user]);

  const fetchUserData = async () => {
    if (!user) return;

    // Fetch essays
    const { data: essaysData } = await supabase
      .from('essays')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (essaysData) setEssays(essaysData);

    // Fetch Quran progress
    const { data: quranData } = await supabase
      .from('quran_progress')
      .select('*')
      .eq('user_id', user.id)
      .order('last_read_at', { ascending: false });

    if (quranData) setQuranProgress(quranData);

    // Fetch Zakat calculations
    const { data: zakatData } = await supabase
      .from('zakat_calculations')
      .select('*')
      .eq('user_id', user.id)
      .order('calculated_at', { ascending: false });

    if (zakatData) setZakatHistory(zakatData);
  };

  const createEssay = async () => {
    if (!user || !newEssay.title.trim() || !newEssay.content.trim()) return;

    setIsCreating(true);
    const { error } = await supabase
      .from('essays')
      .insert({
        user_id: user.id,
        title: newEssay.title,
        content: newEssay.content,
        category: newEssay.category
      });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to create essay",
        variant: "destructive"
      });
    } else {
      toast({
        title: "Success",
        description: "Essay created successfully"
      });
      setNewEssay({ title: '', content: '', category: 'general' });
      fetchUserData();
    }
    setIsCreating(false);
  };

  const togglePublish = async (essayId: string, currentStatus: boolean) => {
    const { error } = await supabase
      .from('essays')
      .update({ is_published: !currentStatus })
      .eq('id', essayId);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to update essay",
        variant: "destructive"
      });
    } else {
      toast({
        title: "Success",
        description: currentStatus ? "Essay unpublished" : "Essay published"
      });
      fetchUserData();
    }
  };

  const deleteEssay = async (essayId: string) => {
    const { error } = await supabase
      .from('essays')
      .delete()
      .eq('id', essayId);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to delete essay",
        variant: "destructive"
      });
    } else {
      toast({
        title: "Success",
        description: "Essay deleted successfully"
      });
      fetchUserData();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary mb-2">Islamic Dashboard</h1>
          <p className="text-muted-foreground">Manage your essays, track your progress</p>
        </div>

        <Tabs defaultValue="essays" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="essays">Essays</TabsTrigger>
            <TabsTrigger value="quran">Quran Progress</TabsTrigger>
            <TabsTrigger value="zakat">Zakat History</TabsTrigger>
          </TabsList>

          <TabsContent value="essays" className="space-y-6">
            <Card className="p-6">
              <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                <PlusCircle className="w-6 h-6" />
                Create New Essay
              </h2>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={newEssay.title}
                    onChange={(e) => setNewEssay({ ...newEssay, title: e.target.value })}
                    placeholder="Enter essay title"
                  />
                </div>
                <div>
                  <Label htmlFor="category">Category</Label>
                  <select
                    id="category"
                    value={newEssay.category}
                    onChange={(e) => setNewEssay({ ...newEssay, category: e.target.value })}
                    className="w-full p-2 border border-input bg-background rounded-md"
                  >
                    <option value="general">General</option>
                    <option value="spirituality">Spirituality</option>
                    <option value="quran">Quran</option>
                    <option value="hadith">Hadith</option>
                    <option value="fiqh">Fiqh</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="content">Content</Label>
                  <Textarea
                    id="content"
                    value={newEssay.content}
                    onChange={(e) => setNewEssay({ ...newEssay, content: e.target.value })}
                    placeholder="Write your essay content here..."
                    rows={8}
                  />
                </div>
                <Button 
                  onClick={createEssay} 
                  disabled={isCreating || !newEssay.title.trim() || !newEssay.content.trim()}
                  className="w-full"
                >
                  {isCreating ? "Creating..." : "Create Essay"}
                </Button>
              </div>
            </Card>

            <div className="grid gap-4">
              <h2 className="text-2xl font-semibold">Your Essays ({essays.length})</h2>
              {essays.length === 0 ? (
                <Card className="p-8 text-center">
                  <p className="text-muted-foreground">No essays yet. Create your first essay above!</p>
                </Card>
              ) : (
                essays.map((essay) => (
                  <Card key={essay.id} className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-semibold mb-2">{essay.title}</h3>
                        <div className="flex gap-2 mb-2">
                          <Badge variant="secondary">{essay.category}</Badge>
                          <Badge variant={essay.is_published ? "default" : "outline"}>
                            {essay.is_published ? "Published" : "Draft"}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Created: {new Date(essay.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => togglePublish(essay.id, essay.is_published)}
                        >
                          {essay.is_published ? <Eye className="w-4 h-4" /> : <Edit className="w-4 h-4" />}
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => deleteEssay(essay.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    <p className="text-muted-foreground line-clamp-3">{essay.content}</p>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="quran" className="space-y-6">
            <Card className="p-6">
              <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                <BookOpen className="w-6 h-6" />
                Quran Reading Progress
              </h2>
              {quranProgress.length === 0 ? (
                <p className="text-muted-foreground">Start reading the Quran to track your progress!</p>
              ) : (
                <div className="space-y-4">
                  {quranProgress.map((progress) => (
                    <div key={progress.id} className="flex justify-between items-center p-4 border rounded-lg">
                      <div>
                        <h3 className="font-semibold">Surah {progress.surah_number}</h3>
                        <p className="text-sm text-muted-foreground">
                          Verse {progress.verse_number} of {progress.total_verses}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Last read: {new Date(progress.last_read_at).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="w-16 h-2 bg-secondary rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-primary"
                            style={{ width: `${(progress.verse_number / progress.total_verses) * 100}%` }}
                          />
                        </div>
                        <p className="text-xs mt-1">
                          {Math.round((progress.verse_number / progress.total_verses) * 100)}%
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </TabsContent>

          <TabsContent value="zakat" className="space-y-6">
            <Card className="p-6">
              <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                <Calculator className="w-6 h-6" />
                Zakat Calculation History
              </h2>
              {zakatHistory.length === 0 ? (
                <p className="text-muted-foreground">No zakat calculations yet. Use the calculator to track your zakat!</p>
              ) : (
                <div className="space-y-4">
                  {zakatHistory.map((calculation) => (
                    <div key={calculation.id} className="p-4 border rounded-lg">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <h3 className="font-semibold mb-2">Wealth Breakdown</h3>
                          <div className="space-y-1 text-sm">
                            <p>Cash & Savings: {calculation.currency} {calculation.cash_savings.toLocaleString()}</p>
                            <p>Gold Value: {calculation.currency} {calculation.gold_value.toLocaleString()}</p>
                            <p>Silver Value: {calculation.currency} {calculation.silver_value.toLocaleString()}</p>
                            <p>Investments: {calculation.currency} {calculation.investments.toLocaleString()}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <h3 className="font-semibold mb-2">Results</h3>
                          <p className="text-lg font-bold text-primary">
                            Zakat Due: {calculation.currency} {calculation.zakat_due.toLocaleString()}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Total Wealth: {calculation.currency} {calculation.total_wealth.toLocaleString()}
                          </p>
                          <p className="text-xs text-muted-foreground mt-2">
                            Calculated: {new Date(calculation.calculated_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;