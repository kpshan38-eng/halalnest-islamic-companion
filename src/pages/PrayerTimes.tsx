import { Calendar, Clock, MapPin, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

const PrayerTimes = () => {
  const prayerTimes = [
    { name: 'Fajr', arabicName: 'الفجر', time: '5:30 AM', description: 'Dawn prayer - 2 Rakat Sunnah + 2 Rakat Fard', active: false },
    { name: 'Dhuhr', arabicName: 'الظهر', time: '12:45 PM', description: 'Midday prayer - 4 Rakat Sunnah + 4 Rakat Fard + 2 Rakat Sunnah', active: false },
    { name: 'Asr', arabicName: 'العصر', time: '3:22 PM', description: 'Afternoon prayer - 4 Rakat Sunnah + 4 Rakat Fard', active: true },
    { name: 'Maghrib', arabicName: 'المغرب', time: '6:15 PM', description: 'Sunset prayer - 3 Rakat Fard + 2 Rakat Sunnah', active: false },
    { name: 'Isha', arabicName: 'العشاء', time: '8:00 PM', description: 'Night prayer - 4 Rakat Sunnah + 4 Rakat Fard + 2 Rakat Sunnah + 3 Rakat Witr', active: false },
  ];

  return (
    <main className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-primary mb-4">Prayer Times</h1>
          <p className="text-xl text-muted-foreground">Stay connected with Allah through daily prayers</p>
        </div>

        {/* Location and Settings */}
        <Card className="p-6 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <MapPin className="w-6 h-6 text-primary" />
              <div>
                <h3 className="text-lg font-semibold">Mumbai, India</h3>
                <p className="text-sm text-muted-foreground">15 Rajab 1446 AH</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Button variant="outline" size="sm">
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
              <Button variant="outline" size="sm">
                <Calendar className="w-4 h-4 mr-2" />
                Monthly View
              </Button>
            </div>
          </div>
        </Card>

        {/* Prayer Times Grid */}
        <div className="grid gap-6 mb-8">
          {prayerTimes.map((prayer, index) => (
            <Card key={prayer.name} className={`p-6 ${prayer.active ? 'ring-2 ring-primary bg-primary/5' : ''}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    prayer.active ? 'bg-primary text-primary-foreground' : 'bg-muted'
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
                    <div className="text-sm text-secondary font-medium">Current Prayer</div>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Additional Information */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-primary mb-4">Calculation Method</h3>
            <p className="text-muted-foreground mb-4">
              Currently using ISNA (Islamic Society of North America) calculation method.
            </p>
            <Button variant="outline" size="sm">Change Method</Button>
          </Card>

          <Card className="p-6">
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