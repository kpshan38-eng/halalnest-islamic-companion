import { Calendar, Clock, MapPin, Settings, Bell, BellOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useState, useEffect } from 'react';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

const PrayerTimes = () => {
  const { user } = useSupabaseAuth();
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Kerala, India, Ponani prayer times (approximate)
  const prayerTimes = [
    { name: 'Fajr', arabicName: 'الفجر', time: '5:15 AM', description: 'Dawn prayer - 2 Rakat Sunnah + 2 Rakat Fard', active: false },
    { name: 'Dhuhr', arabicName: 'الظهر', time: '12:30 PM', description: 'Midday prayer - 4 Rakat Sunnah + 4 Rakat Fard + 2 Rakat Sunnah', active: false },
    { name: 'Asr', arabicName: 'العصر', time: '3:45 PM', description: 'Afternoon prayer - 4 Rakat Sunnah + 4 Rakat Fard', active: getCurrentPrayer() === 'Asr' },
    { name: 'Maghrib', arabicName: 'المغرب', time: '6:45 PM', description: 'Sunset prayer - 3 Rakat Fard + 2 Rakat Sunnah', active: false },
    { name: 'Isha', arabicName: 'العشاء', time: '8:15 PM', description: 'Night prayer - 4 Rakat Sunnah + 4 Rakat Fard + 2 Rakat Sunnah + 3 Rakat Witr', active: false },
  ];

  function getCurrentPrayer() {
    const now = new Date();
    const hour = now.getHours();
    const minute = now.getMinutes();
    const currentMinutes = hour * 60 + minute;

    if (currentMinutes >= 315 && currentMinutes < 750) return 'Fajr'; // 5:15 AM - 12:30 PM
    if (currentMinutes >= 750 && currentMinutes < 945) return 'Dhuhr'; // 12:30 PM - 3:45 PM
    if (currentMinutes >= 945 && currentMinutes < 1125) return 'Asr'; // 3:45 PM - 6:45 PM
    if (currentMinutes >= 1125 && currentMinutes < 1215) return 'Maghrib'; // 6:45 PM - 8:15 PM
    return 'Isha'; // 8:15 PM - 5:15 AM
  }

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    if (user) {
      checkNotificationPreferences();
    }

    return () => clearInterval(timer);
  }, [user]);

  const checkNotificationPreferences = async () => {
    if (!user) return;

    const { data } = await supabase
      .from('notification_preferences')
      .select('prayer_notifications')
      .eq('user_id', user.id)
      .single();

    if (data) {
      setNotificationsEnabled(data.prayer_notifications);
    }
  };

  const handleSettingsClick = () => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to access prayer settings",
        variant: "destructive"
      });
      return;
    }
    
    toast({
      title: "Prayer Settings",
      description: "Opening prayer time settings and location preferences...",
    });
  };

  const handleMonthlyView = () => {
    toast({
      title: "Monthly View",
      description: "Opening monthly prayer times calendar...",
    });
  };

  const handleChangeMethod = () => {
    toast({
      title: "Calculation Method",
      description: "Opening calculation method settings...",
    });
  };

  const toggleNotifications = async () => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to enable notifications",
        variant: "destructive"
      });
      return;
    }

    const newState = !notificationsEnabled;
    
    // Check if browser supports notifications
    if (newState && 'Notification' in window) {
      const permission = await Notification.requestPermission();
      if (permission !== 'granted') {
        toast({
          title: "Permission denied",
          description: "Please allow notifications to receive prayer reminders",
          variant: "destructive"
        });
        return;
      }
    }

    // Update in database
    const { error } = await supabase
      .from('notification_preferences')
      .upsert({
        user_id: user.id,
        prayer_notifications: newState
      });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to update notification preferences",
        variant: "destructive"
      });
    } else {
      setNotificationsEnabled(newState);
      toast({
        title: newState ? "Notifications enabled" : "Notifications disabled",
        description: newState 
          ? "You'll receive prayer time reminders" 
          : "Prayer notifications have been turned off"
      });
    }
  };

  return (
    <main className="min-h-screen bg-background py-8 relative overflow-hidden">
      {/* Background Pattern */}
      <div 
        className="absolute inset-0 opacity-5 bg-repeat"
        style={{
          backgroundImage: `url('/src/assets/islamic-carpet-pattern.png')`,
          backgroundSize: '400px 400px'
        }}
      />
      
      <div className="container mx-auto px-4 max-w-4xl relative z-10">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-4xl font-bold text-primary mb-4">Prayer Times</h1>
          <p className="text-xl text-muted-foreground">Stay connected with Allah through daily prayers</p>
          <p className="text-sm text-muted-foreground">Ponani, Kerala, India</p>
        </div>

        {/* Location and Settings */}
        <Card className="p-6 mb-8 animate-scale-in bg-background/80 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <MapPin className="w-6 h-6 text-primary" />
              <div>
                <h3 className="text-lg font-semibold">Ponani, Kerala, India</h3>
                <p className="text-sm text-muted-foreground">
                  {currentTime.toLocaleDateString('en-US', { 
                    weekday: 'long',
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric'
                  })}
                  {' • '}
                  {currentTime.toLocaleTimeString()}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Button 
                variant="outline" 
                size="sm"
                onClick={toggleNotifications}
                className="hover-scale"
              >
                {notificationsEnabled ? <Bell className="w-4 h-4 mr-2" /> : <BellOff className="w-4 h-4 mr-2" />}
                {notificationsEnabled ? 'Notifications On' : 'Enable Notifications'}
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleSettingsClick}
                className="hover-scale"
              >
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleMonthlyView}
                className="hover-scale"
              >
                <Calendar className="w-4 h-4 mr-2" />
                Monthly View
              </Button>
            </div>
          </div>
        </Card>

        {/* Prayer Times Grid */}
        <div className="grid gap-6 mb-8">
          {prayerTimes.map((prayer, index) => (
            <Card 
              key={prayer.name} 
              className={`p-6 transition-all duration-300 hover:shadow-elegant animate-fade-in bg-background/80 backdrop-blur-sm ${
                prayer.active ? 'ring-2 ring-primary bg-primary/5' : ''
              }`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                    prayer.active ? 'bg-primary text-primary-foreground shadow-glow' : 'bg-muted'
                  }`}>
                    <Clock className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-3 mb-1">
                      <h3 className="text-xl font-semibold text-primary">{prayer.name}</h3>
                      <span className="arabic-text text-lg text-muted-foreground">{prayer.arabicName}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{prayer.description}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-primary">{prayer.time}</div>
                  {prayer.active && (
                    <div className="text-sm text-secondary font-medium pulse">Current Prayer</div>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Additional Information */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="p-6 animate-fade-in bg-background/80 backdrop-blur-sm hover:shadow-elegant transition-all duration-300">
            <h3 className="text-lg font-semibold text-primary mb-4">Calculation Method</h3>
            <p className="text-muted-foreground mb-4">
              Currently using ISNA (Islamic Society of North America) calculation method for Kerala, India.
            </p>
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleChangeMethod}
              className="hover-scale"
            >
              Change Method
            </Button>
          </Card>

          <Card className="p-6 animate-fade-in bg-background/80 backdrop-blur-sm hover:shadow-elegant transition-all duration-300">
            <h3 className="text-lg font-semibold text-primary mb-4">Prayer Significance</h3>
            <p className="text-muted-foreground">
              The five daily prayers are a pillar of Islam, providing structure to the day 
              and keeping us connected to Allah's remembrance.
            </p>
          </Card>
        </div>
      </div>
    </main>
  );
};

export default PrayerTimes;