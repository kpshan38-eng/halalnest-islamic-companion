import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Bell, Menu, X, User, BookOpen, Calculator, Clock, Home, Users, FileText, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useFirebaseAuth } from '@/hooks/useFirebaseAuth';

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { currentUser, loading, signOut } = useFirebaseAuth();

  const navItems = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Prayer Times', href: '/prayer-times', icon: Clock },
    { name: 'Holy Quran', href: '/quran', icon: BookOpen },
    { name: 'Islamic Calculators', href: '/calculators', icon: Calculator },
    { name: 'Articles', href: '/articles', icon: FileText },
    { name: 'Community', href: '/community', icon: Users },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur-md border-b border-border/50 shadow-elegant">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 bg-gradient-islamic rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
              <span className="text-white font-bold text-lg">ح</span>
            </div>
            <div className="hidden sm:block">
              <h1 className="text-2xl font-bold text-primary">HalalNest</h1>
              <p className="text-xs text-muted-foreground">Your Islamic Companion</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                  isActive(item.href)
                    ? 'bg-primary text-primary-foreground shadow-lg'
                    : 'text-foreground hover:bg-muted hover:text-primary'
                }`}
              >
                <item.icon className="w-4 h-4" />
                <span className="font-medium">{item.name}</span>
              </Link>
            ))}
          </nav>

          {/* Right side actions */}
          <div className="flex items-center space-x-3">
            {/* Notifications */}
            <Button
              variant="ghost"
              size="icon"
              className="relative hover:bg-muted transition-colors duration-300"
              title="Notifications (Alt+T)"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-secondary rounded-full border-2 border-background"></span>
            </Button>

            {/* Sign In / Profile */}
            {!loading && (
              currentUser ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={currentUser.photoURL || ''} alt={currentUser.displayName || 'User'} />
                        <AvatarFallback className="bg-primary text-primary-foreground">
                          {currentUser.displayName?.charAt(0) || currentUser.email?.charAt(0) || 'U'}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <div className="flex flex-col space-y-1 p-2">
                      <p className="text-sm font-medium leading-none">{currentUser.displayName || 'User'}</p>
                      <p className="text-xs leading-none text-muted-foreground">{currentUser.email}</p>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => signOut()} className="cursor-pointer">
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Link to="/auth">
                  <Button variant="outline" className="hidden sm:inline-flex items-center space-x-2 hover:bg-primary hover:text-primary-foreground transition-all duration-300">
                    <User className="w-4 h-4" />
                    <span>Sign In</span>
                  </Button>
                </Link>
              )
            )}

            {/* Mobile menu trigger */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="lg:hidden hover:bg-muted transition-colors duration-300"
                >
                  {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80 bg-background/95 backdrop-blur-md">
                <div className="flex flex-col space-y-4 mt-8">
                  {!loading && (
                    currentUser ? (
                      <div className="flex items-center space-x-3 p-4 bg-muted/50 rounded-lg">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={currentUser.photoURL || ''} alt={currentUser.displayName || 'User'} />
                          <AvatarFallback className="bg-primary text-primary-foreground">
                            {currentUser.displayName?.charAt(0) || currentUser.email?.charAt(0) || 'U'}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <p className="text-sm font-medium">{currentUser.displayName || 'User'}</p>
                          <p className="text-xs text-muted-foreground">{currentUser.email}</p>
                        </div>
                        <Button variant="ghost" size="sm" onClick={() => signOut()}>
                          <LogOut className="w-4 h-4" />
                        </Button>
                      </div>
                    ) : (
                      <Link to="/auth" className="w-full">
                        <Button variant="outline" className="w-full justify-start space-x-2">
                          <User className="w-4 h-4" />
                          <span>Sign In</span>
                        </Button>
                      </Link>
                    )
                  )}
                  
                  <div className="border-t border-border/50 pt-4">
                    {navItems.map((item) => (
                      <Link
                        key={item.name}
                        to={item.href}
                        onClick={() => setIsOpen(false)}
                        className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-300 ${
                          isActive(item.href)
                            ? 'bg-primary text-primary-foreground shadow-lg'
                            : 'text-foreground hover:bg-muted hover:text-primary'
                        }`}
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