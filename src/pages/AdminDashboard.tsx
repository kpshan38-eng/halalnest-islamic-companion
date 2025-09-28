import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Shield, FileText, Users, Eye, Trash2, CheckCircle, XCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Mock data structure for papers/publications
interface Paper {
  id: string;
  title: string;
  author: string;
  content: string;
  category: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: Date;
  email: string;
}

const AdminDashboard = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [papers, setPapers] = useState<Paper[]>([]);
  const [selectedPaper, setSelectedPaper] = useState<Paper | null>(null);
  const { toast } = useToast();

  // Check if admin is already authenticated
  useEffect(() => {
    const adminAuth = localStorage.getItem('admin_authenticated');
    if (adminAuth === 'true') {
      setIsAuthenticated(true);
      loadPapers();
    }
  }, []);

  const loadPapers = () => {
    // In a real app, this would fetch from Supabase
    const mockPapers: Paper[] = [
      {
        id: '1',
        title: 'Understanding Zakat in Modern Times',
        author: 'Dr. Ahmad Hassan',
        content: 'Comprehensive analysis of Zakat calculation methods in contemporary Islamic finance...',
        category: 'Islamic Finance',
        status: 'pending',
        submittedAt: new Date('2024-01-15'),
        email: 'ahmad.hassan@example.com'
      },
      {
        id: '2',
        title: 'Inheritance Laws in Islamic Jurisprudence',
        author: 'Prof. Fatima Al-Zahra',
        content: 'Detailed explanation of Faraid and its application in modern legal systems...',
        category: 'Islamic Law',
        status: 'approved',
        submittedAt: new Date('2024-01-10'),
        email: 'fatima.alzahra@example.com'
      }
    ];
    setPapers(mockPapers);
  };

  const handleLogin = () => {
    // Check credentials
    if (email === 'shankp562@gmail.com' && password === 'shanukpshan') {
      setIsAuthenticated(true);
      localStorage.setItem('admin_authenticated', 'true');
      loadPapers();
      toast({
        title: "Login Successful",
        description: "Welcome to the Admin Dashboard",
      });
    } else {
      toast({
        title: "Login Failed",
        description: "Invalid email or password",
        variant: "destructive",
      });
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('admin_authenticated');
    setEmail('');
    setPassword('');
  };

  const updatePaperStatus = (paperId: string, status: 'approved' | 'rejected') => {
    setPapers(prev => prev.map(paper => 
      paper.id === paperId ? { ...paper, status } : paper
    ));
    toast({
      title: "Status Updated",
      description: `Paper has been ${status}`,
    });
  };

  const deletePaper = (paperId: string) => {
    setPapers(prev => prev.filter(paper => paper.id !== paperId));
    toast({
      title: "Paper Deleted",
      description: "Paper has been permanently removed",
    });
  };

  // Login form for admin authentication
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 to-secondary/10">
        <Card className="w-full max-w-md p-8">
          <div className="text-center mb-6">
            <Shield className="w-12 h-12 text-primary mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-primary">Admin Dashboard</h1>
            <p className="text-muted-foreground">Papers & Publications Management</p>
          </div>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter admin email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
              />
            </div>
            
            <Button onClick={handleLogin} className="w-full">
              Login to Dashboard
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  // Main admin dashboard
  return (
    <div className="container mx-auto p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-primary flex items-center">
            <Shield className="w-8 h-8 mr-3" />
            Admin Dashboard
          </h1>
          <p className="text-muted-foreground">Manage Islamic papers and publications</p>
        </div>
        <Button variant="outline" onClick={handleLogout}>
          Logout
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="p-6">
          <div className="flex items-center">
            <FileText className="w-8 h-8 text-blue-500" />
            <div className="ml-4">
              <p className="text-sm text-muted-foreground">Total Papers</p>
              <p className="text-2xl font-bold">{papers.length}</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center">
            <CheckCircle className="w-8 h-8 text-green-500" />
            <div className="ml-4">
              <p className="text-sm text-muted-foreground">Approved</p>
              <p className="text-2xl font-bold">{papers.filter(p => p.status === 'approved').length}</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center">
            <XCircle className="w-8 h-8 text-red-500" />
            <div className="ml-4">
              <p className="text-sm text-muted-foreground">Rejected</p>
              <p className="text-2xl font-bold">{papers.filter(p => p.status === 'rejected').length}</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center">
            <Users className="w-8 h-8 text-yellow-500" />
            <div className="ml-4">
              <p className="text-sm text-muted-foreground">Pending</p>
              <p className="text-2xl font-bold">{papers.filter(p => p.status === 'pending').length}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Papers List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Papers List */}
        <Card className="p-6">
          <h2 className="text-xl font-bold mb-4 flex items-center">
            <FileText className="w-5 h-5 mr-2" />
            Submitted Papers
          </h2>
          
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {papers.map((paper) => (
              <div key={paper.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-sm">{paper.title}</h3>
                  <Badge 
                    variant={
                      paper.status === 'approved' ? 'default' : 
                      paper.status === 'rejected' ? 'destructive' : 
                      'secondary'
                    }
                  >
                    {paper.status}
                  </Badge>
                </div>
                
                <p className="text-sm text-muted-foreground mb-2">By: {paper.author}</p>
                <p className="text-xs text-muted-foreground mb-3">
                  Submitted: {paper.submittedAt.toLocaleDateString()}
                </p>
                
                <div className="flex space-x-2">
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => setSelectedPaper(paper)}
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    View
                  </Button>
                  
                  {paper.status === 'pending' && (
                    <>
                      <Button 
                        size="sm" 
                        variant="default"
                        onClick={() => updatePaperStatus(paper.id, 'approved')}
                      >
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Approve
                      </Button>
                      <Button 
                        size="sm" 
                        variant="destructive"
                        onClick={() => updatePaperStatus(paper.id, 'rejected')}
                      >
                        <XCircle className="w-4 h-4 mr-1" />
                        Reject
                      </Button>
                    </>
                  )}
                  
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => deletePaper(paper.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Paper Details */}
        <Card className="p-6">
          <h2 className="text-xl font-bold mb-4">Paper Details</h2>
          
          {selectedPaper ? (
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium">Title</Label>
                <p className="text-sm mt-1">{selectedPaper.title}</p>
              </div>
              
              <div>
                <Label className="text-sm font-medium">Author</Label>
                <p className="text-sm mt-1">{selectedPaper.author}</p>
              </div>
              
              <div>
                <Label className="text-sm font-medium">Email</Label>
                <p className="text-sm mt-1">{selectedPaper.email}</p>
              </div>
              
              <div>
                <Label className="text-sm font-medium">Category</Label>
                <p className="text-sm mt-1">{selectedPaper.category}</p>
              </div>
              
              <div>
                <Label className="text-sm font-medium">Status</Label>
                <Badge className="mt-1">
                  {selectedPaper.status}
                </Badge>
              </div>
              
              <div>
                <Label className="text-sm font-medium">Content</Label>
                <div className="border rounded-md p-3 mt-1 max-h-40 overflow-y-auto">
                  <p className="text-sm">{selectedPaper.content}</p>
                </div>
              </div>
              
              <div className="flex space-x-2 pt-4">
                {selectedPaper.status === 'pending' && (
                  <>
                    <Button 
                      size="sm"
                      onClick={() => updatePaperStatus(selectedPaper.id, 'approved')}
                    >
                      Approve
                    </Button>
                    <Button 
                      size="sm" 
                      variant="destructive"
                      onClick={() => updatePaperStatus(selectedPaper.id, 'rejected')}
                    >
                      Reject
                    </Button>
                  </>
                )}
              </div>
            </div>
          ) : (
            <p className="text-muted-foreground">Select a paper to view details</p>
          )}
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;