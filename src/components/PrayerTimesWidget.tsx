import { useState, useEffect } from 'react';
import { MapPin, Compass, Calendar, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';

const PrayerTimesWidget = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [nextPrayer, setNextPrayer] = useState('Maghrib');
  const [timeUntilNext, setTimeUntilNext] = useState('2h 35m');

  // Mock prayer times data
  const prayerTimes = [
    { name: 'Fajr', arabicName: 'الفجر', time: '5:30 AM', active: false },
    { name: 'Dhuhr', arabicName: 'الظهر', time: '12:45 PM', active: false },
    { name: 'Asr', arabicName: 'العصر', time: '3:22 PM', active: true },
    { name: 'Maghrib', arabicName: 'المغرب', time: '6:15 PM', active: false },
    { name: 'Isha', arabicName: 'العشاء', time: '8:00 PM', active: false },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    });
  };

  const islamicDate = "15 Rajab 1446";

  return (
    <div className="widget-card space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-islamic rounded-lg flex items-center justify-center">
            <Clock className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-primary">Prayer Times</h3>
            <p className="text-sm text-muted-foreground">Stay connected with Allah</p>
          </div>
        </div>
      </div>

      {/* Location and Current Time */}
      <div className="bg-muted/50 rounded-xl p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <MapPin className="w-4 h-4" />
            <span>Mumbai, India</span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Calendar className="w-4 h-4" />
            <span>{islamicDate}</span>
          </div>
        </div>
        
        <div className="text-center">
          <div className="text-2xl font-bold text-primary font-mono">
            {formatTime(currentTime)}
          </div>
          <div className="text-sm text-muted-foreground">
            Current Local Time
          </div>
        </div>
      </div>

      {/* Prayer Times List */}
      <div className="space-y-2">
        {prayerTimes.map((prayer, index) => (
          <div
            key={prayer.name}
            className={`flex items-center justify-between p-3 rounded-lg transition-all duration-300 ${
              prayer.active 
                ? 'prayer-active' 
                : 'bg-muted/30 hover:bg-muted/50'
            }`}
          >
            <div className="flex items-center space-x-3">
              <div className={`w-2 h-2 rounded-full ${
                prayer.active ? 'bg-primary-foreground' : 'bg-muted-foreground'
              }`} />
              <div>
                <div className={`font-medium ${prayer.active ? 'text-primary-foreground' : 'text-foreground'}`}>
                  {prayer.name}
                </div>
                <div className={`text-sm arabic-text ${prayer.active ? 'text-primary-foreground/80' : 'text-muted-foreground'}`}>
                  {prayer.arabicName}
                </div>
              </div>
            </div>
            <div className={`font-bold ${prayer.active ? 'text-primary-foreground' : 'text-primary'}`}>
              {prayer.time}
            </div>
          </div>
        ))}
      </div>

      {/* Next Prayer Countdown */}
      <div className="bg-secondary/10 border border-secondary/20 rounded-xl p-4 text-center">
        <div className="text-sm text-muted-foreground mb-1">Next Prayer</div>
        <div className="text-lg font-bold text-secondary mb-1">{nextPrayer}</div>
        <div className="text-2xl font-bold text-primary">{timeUntilNext}</div>
      </div>

      {/* Qibla Direction */}
      <div className="flex items-center justify-between bg-primary/5 rounded-xl p-4">
        <div className="flex items-center space-x-3">
          <Compass className="w-6 h-6 text-primary" />
          <div>
            <div className="font-medium text-primary">Qibla Direction</div>
            <div className="text-sm text-muted-foreground">Towards Mecca</div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-primary">58° NE</div>
          <div className="text-xs text-muted-foreground">Compass</div>
        </div>
      </div>

      {/* View Details Button */}
      <Button variant="outline" className="w-full hover:bg-primary hover:text-primary-foreground transition-all duration-300">
        View Detailed Schedule
      </Button>
    </div>
  );
};

export default PrayerTimesWidget;