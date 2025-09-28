import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Bell, Menu, X, User, BookOpen, Calculator, Clock, Home, Users, FileText, LogOut, Settings, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';
import { toast } from '@/hooks/use-toast';
import { ThemeToggle } from '@/components/ThemeToggle';
import halalNestLogo from '@/assets/halal-nest-logo.png';

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { user, loading, signOut } = useSupabaseAuth();

  // Handle scroll for navbar background
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Prayer Times', href: '/prayer-times', icon: Clock },
    { name: 'Holy Quran', href: '/quran', icon: BookOpen },
    { name: 'Islamic Calculators', href: '/calculators', icon: Calculator },
    { name: 'Articles', href: '/articles', icon: FileText },
    { name: 'Community', href: '/community', icon: Users },
    { name: 'Dashboard', href: '/dashboard', icon: Settings },
  ];

  const isActive = (path: string) => location.pathname === path;

  const handleNotificationClick = () => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to view notifications",
        variant: "destructive"
      });
      return;
    }
    toast({
      title: "Notifications",
      description: "Opening notification center...",
    });
  };

  return (
    <header className={`sticky top-0 z-50 w-full transition-all duration-500 ${
      scrolled 
        ? 'bg-background/80 backdrop-blur-xl border-b border-border/50 shadow-elegant' 
        : 'bg-background/95 backdrop-blur-md border-b border-border/30'
    }`}>
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo with enhanced animation */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="relative w-12 h-12 rounded-xl overflow-hidden group-hover:scale-110 transition-all duration-500 shadow-lg group-hover:shadow-xl">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-secondary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <img 
                src={halalNestLogo} 
                alt="HalalNest Logo" 
                className="w-full h-full object-contain relative z-10 group-hover:brightness-110 transition-all duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent group-hover:scale-105 transition-transform duration-300">
                HalalNest
              </h1>
              <p className="text-xs text-muted-foreground group-hover:text-primary/70 transition-colors duration-300">
                Your Islamic Companion
              </p>
            </div>
          </Link>

          {/* Desktop Navigation with enhanced animations */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navItems.map((item, index) => (
              <Link
                key={item.name}
                to={item.href}
                className={`relative flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-300 group ${
                  isActive(item.href)
                    ? 'bg-primary text-primary-foreground shadow-lg transform scale-105'
                    : 'text-foreground hover:bg-muted hover:text-primary hover:scale-105'
                }`}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <item.icon className={`w-4 h-4 transition-all duration-300 ${
                  isActive(item.href) ? 'animate-pulse' : 'group-hover:scale-110'
                }`} />
                <span className="font-medium">{item.name}</span>
                {isActive(item.href) && (
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-xl -z-10 animate-pulse" />
                )}
              </Link>
            ))}
          </nav>

          {/* Right side actions with enhanced animations */}
          <div className="flex items-center space-x-2">
            {/* Theme Toggle */}
            <ThemeToggle />

            {/* Notifications with glow effect */}
            <Button
              variant="ghost"
              size="icon"
              className="relative hover:bg-muted transition-all duration-300 hover:scale-110 group"
              onClick={handleNotificationClick}
            >
              <Bell className="w-5 h-5 group-hover:animate-pulse" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-secondary rounded-full border-2 border-background animate-pulse"></span>
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary/20 to-secondary/20 opacity-0 group-hover:opacity-50 transition-opacity duration-300 blur-sm" />
            </Button>

            {/* Enhanced Scholar Assistant Button */}
            <Link to="/scholar-assistant">
              <Button 
                variant="ghost" 
                size="icon"
                className="relative hover:bg-muted transition-all duration-300 hover:scale-110 group"
                title="Scholar Assistant"
              >
                <Sparkles className="w-5 h-5 group-hover:animate-pulse text-secondary" />
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-secondary/20 to-primary/20 opacity-0 group-hover:opacity-50 transition-opacity duration-300 blur-sm" />
              </Button>
            </Link>

            {/* Sign In / Profile with enhanced styling */}
            {!loading && (
              user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-10 w-10 rounded-full hover:scale-110 transition-transform duration-300">
                      <Avatar className="h-10 w-10 ring-2 ring-primary/20 hover:ring-primary/40 transition-all duration-300">
                        <AvatarImage src={user.user_metadata?.avatar_url || ''} alt={user.user_metadata?.full_name || 'User'} />
                        <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-primary-foreground">
                          {(user.user_metadata?.full_name || user.email || 'U').charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <div className="flex flex-col space-y-1 p-2">
                      <p className="text-sm font-medium leading-none">{user.user_metadata?.full_name || 'User'}</p>
                      <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link to="/dashboard" className="flex items-center cursor-pointer">
                        <Settings className="mr-2 h-4 w-4" />
                        <span>Dashboard</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => signOut()} className="cursor-pointer text-destructive">
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Link to="/auth">
                  <Button 
                    variant="outline" 
                    className="hidden sm:inline-flex items-center space-x-2 hover:bg-primary hover:text-primary-foreground transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
                  >
                    <User className="w-4 h-4" />
                    <span>Sign In</span>
                  </Button>
                </Link>
              )
            )}

            {/* Enhanced Mobile menu trigger */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="lg:hidden hover:bg-muted transition-all duration-300 hover:scale-110"
                >
                  <div className="relative w-5 h-5">
                    <Menu className={`absolute w-5 h-5 transition-all duration-300 ${isOpen ? 'rotate-180 opacity-0' : 'rotate-0 opacity-100'}`} />
                    <X className={`absolute w-5 h-5 transition-all duration-300 ${isOpen ? 'rotate-0 opacity-100' : 'rotate-180 opacity-0'}`} />
                  </div>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80 bg-background/95 backdrop-blur-xl">
                <div className="flex flex-col space-y-4 mt-8">
                  {/* Mobile user info with enhanced styling */}
                  {!loading && (
                    user ? (
                      <div className="flex items-center space-x-3 p-4 bg-gradient-to-r from-primary/5 to-secondary/5 rounded-xl border border-border/50">
                        <Avatar className="h-10 w-10 ring-2 ring-primary/20">
                          <AvatarImage src={user.user_metadata?.avatar_url || ''} alt={user.user_metadata?.full_name || 'User'} />
                          <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-primary-foreground">
                            {(user.user_metadata?.full_name || user.email || 'U').charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <p className="text-sm font-medium">{user.user_metadata?.full_name || 'User'}</p>
                          <p className="text-xs text-muted-foreground">{user.email}</p>
                        </div>
                        <Button variant="ghost" size="sm" onClick={() => signOut()} className="hover:bg-destructive/10 hover:text-destructive">
                          <LogOut className="w-4 h-4" />
                        </Button>
                      </div>
                    ) : (
                      <Link to="/auth" className="w-full">
                        <Button variant="outline" className="w-full justify-start space-x-2 hover:bg-primary hover:text-primary-foreground transition-all duration-300">
                          <User className="w-4 h-4" />
                          <span>Sign In</span>
                        </Button>
                      </Link>
                    )
                  )}
                  
                  {/* Mobile navigation with staggered animations */}
                  <div className="border-t border-border/50 pt-4">
                    {navItems.map((item, index) => (
                      <Link
                        key={item.name}
                        to={item.href}
                        onClick={() => setIsOpen(false)}
                        className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 mb-2 ${
                          isActive(item.href)
                            ? 'bg-gradient-to-r from-primary to-primary/90 text-primary-foreground shadow-lg'
                            : 'text-foreground hover:bg-muted hover:text-primary hover:translate-x-2'
                        }`}
                        style={{ animationDelay: `${index * 50}ms` }}
                      >
                        <item.icon className="w-5 h-5" />
                        <span className="font-medium">{item.name}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navigation;