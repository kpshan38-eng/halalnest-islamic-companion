import { useState } from 'react';
import { ArrowLeft, Calendar, ArrowRightLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Link } from 'react-router-dom';

const DateConverter = () => {
  const [gregorianDate, setGregorianDate] = useState('');
  const [hijriDate, setHijriDate] = useState('');
  const [convertedDate, setConvertedDate] = useState('');
  const [conversionType, setConversionType] = useState('gregorian-to-hijri');

  const convertDate = () => {
    // Simplified date conversion - in a real app, you'd use a proper Islamic calendar library
    if (conversionType === 'gregorian-to-hijri' && gregorianDate) {
      const date = new Date(gregorianDate);
      const hijriYear = date.getFullYear() - 622; // Approximate conversion
      setConvertedDate(`${date.getDate()}/${date.getMonth() + 1}/${hijriYear} AH (Approximate)`);
    } else if (conversionType === 'hijri-to-gregorian' && hijriDate) {
      // Parse hijri date and convert (simplified)
      const parts = hijriDate.split('/');
      if (parts.length === 3) {
        const hijriYear = parseInt(parts[2]);
        const gregorianYear = hijriYear + 622; // Approximate conversion
        setConvertedDate(`${parts[0]}/${parts[1]}/${gregorianYear} CE (Approximate)`);
      }
    }
  };

  const resetConverter = () => {
    setGregorianDate('');
    setHijriDate('');
    setConvertedDate('');
  };

  const importantDates = [
    { hijri: '1 Muharram', gregorian: 'Islamic New Year', description: 'Beginning of Islamic calendar year' },
    { hijri: '10 Muharram', gregorian: 'Day of Ashura', description: 'Day of fasting and remembrance' },
    { hijri: '12 Rabi al-Awwal', gregorian: 'Mawlid al-Nabi', description: 'Prophet Muhammad\'s (PBUH) birthday' },
    { hijri: '1 Ramadan', gregorian: 'Start of Ramadan', description: 'Beginning of fasting month' },
    { hijri: '1 Shawwal', gregorian: 'Eid al-Fitr', description: 'Festival of breaking the fast' },
    { hijri: '10 Dhul Hijjah', gregorian: 'Eid al-Adha', description: 'Festival of sacrifice' },
  ];

  return (
    <main className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="flex items-center space-x-4 mb-8">
          <Link to="/calculators">
            <Button variant="outline" size="icon">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-primary">Islamic Date Converter</h1>
            <p className="text-muted-foreground">Convert between Hijri and Gregorian calendars</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Converter Form */}
          <Card className="p-6">
            <div className="flex items-center space-x-3 mb-6">
              <ArrowRightLeft className="w-6 h-6 text-primary" />
              <h2 className="text-xl font-semibold">Date Conversion</h2>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="conversionType">Conversion Type</Label>
                <Select value={conversionType} onValueChange={setConversionType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="gregorian-to-hijri">Gregorian to Hijri</SelectItem>
                    <SelectItem value="hijri-to-gregorian">Hijri to Gregorian</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {conversionType === 'gregorian-to-hijri' ? (
                <div>
                  <Label htmlFor="gregorianDate">Gregorian Date</Label>
                  <Input
                    id="gregorianDate"
                    type="date"
                    value={gregorianDate}
                    onChange={(e) => setGregorianDate(e.target.value)}
                  />
                </div>
              ) : (
                <div>
                  <Label htmlFor="hijriDate">Hijri Date (DD/MM/YYYY)</Label>
                  <Input
                    id="hijriDate"
                    type="text"
                    placeholder="e.g., 15/03/1445"
                    value={hijriDate}
                    onChange={(e) => setHijriDate(e.target.value)}
                  />
                </div>
              )}

              <div className="flex gap-4 pt-4">
                <Button onClick={convertDate} className="flex-1">
                  <ArrowRightLeft className="w-4 h-4 mr-2" />
                  Convert
                </Button>
                <Button variant="outline" onClick={resetConverter}>
                  Reset
                </Button>
              </div>

              {convertedDate && (
                <Card className="p-4 bg-primary/5 border-primary/20">
                  <h4 className="font-semibold text-primary mb-2">Converted Date</h4>
                  <p className="text-lg">{convertedDate}</p>
                  <p className="text-xs text-muted-foreground mt-2">
                    Note: This is an approximate conversion. For precise dates, consult Islamic calendar authorities.
                  </p>
                </Card>
              )}
            </div>
          </Card>

          {/* Important Islamic Dates */}
          <Card className="p-6">
            <div className="flex items-center space-x-3 mb-6">
              <Calendar className="w-6 h-6 text-secondary" />
              <h2 className="text-xl font-semibold">Important Islamic Dates</h2>
            </div>

            <div className="space-y-3">
              {importantDates.map((date, index) => (
                <div key={index} className="p-3 bg-muted/30 rounded-lg">
                  <div className="flex justify-between items-start mb-1">
                    <h4 className="font-medium text-sm">{date.hijri}</h4>
                    <span className="text-xs text-muted-foreground">{date.gregorian}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">{date.description}</p>
                </div>
              ))}
            </div>

            <Card className="mt-6 p-4 bg-secondary/5 border-secondary/20">
              <h4 className="font-semibold text-secondary mb-2">About Islamic Calendar</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Based on lunar months (354-355 days/year)</li>
                <li>• Started from Prophet's migration to Madinah</li>
                <li>• 12 months starting with Muharram</li>
                <li>• Dates may vary by moon sighting</li>
              </ul>
            </Card>
          </Card>
        </div>
      </div>
    </main>
  );
};

export default DateConverter;