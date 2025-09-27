import { Calculator, DollarSign, Calendar, Compass, Users, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import ZakatCalculatorWidget from '@/components/ZakatCalculatorWidget';

const Calculators = () => {
  const calculators = [
    {
      title: 'Zakat Calculator',
      description: 'Calculate your obligatory charity based on Shariah principles',
      icon: DollarSign,
      color: 'bg-secondary/10 text-secondary',
      featured: true
    },
    {
      title: 'Islamic Inheritance Calculator',
      description: 'Distribute estate according to Islamic inheritance law',
      icon: Users,
      color: 'bg-primary/10 text-primary',
      features: ['Estate value input', 'Heir categories', 'Shariah-compliant distribution']
    },
    {
      title: 'Qibla Direction Finder',
      description: 'Find the direction to Kaaba from anywhere in the world',
      icon: Compass,
      color: 'bg-emerald-500/10 text-emerald-600',
      features: ['GPS-based location', 'Accurate Kaaba direction', 'Interactive compass']
    },
    {
      title: 'Islamic Date Converter',
      description: 'Convert between Hijri and Gregorian calendars',
      icon: Calendar,
      color: 'bg-blue-500/10 text-blue-600',
      features: ['Hijri to Gregorian', 'Gregorian to Hijri', 'Important Islamic dates']
    },
    {
      title: 'Investment Calculator',
      description: 'Shariah-compliant investment and savings calculations',
      icon: TrendingUp,
      color: 'bg-purple-500/10 text-purple-600',
      features: ['Halal investment options', 'Profit calculations', 'Risk assessment']
    }
  ];

  return (
    <main className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-primary mb-4">Islamic Calculators</h1>
          <p className="text-xl text-muted-foreground">Shariah-compliant tools for your Islamic financial and spiritual needs</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Calculators Grid */}
          <div className="lg:col-span-2 space-y-6">
            {calculators.map((calc, index) => (
              <Card key={calc.title} className="p-6 hover:shadow-lg transition-all duration-300">
                <div className="flex items-start space-x-4">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${calc.color}`}>
                    <calc.icon className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-xl font-semibold text-primary">{calc.title}</h3>
                      {calc.featured && (
                        <span className="bg-secondary/20 text-secondary px-3 py-1 rounded-full text-xs font-medium">
                          Featured
                        </span>
                      )}
                    </div>
                    <p className="text-muted-foreground mb-4">{calc.description}</p>
                    
                    {calc.features && (
                      <div className="mb-4">
                        <h4 className="font-medium text-foreground mb-2">Features:</h4>
                        <ul className="text-sm text-muted-foreground space-y-1">
                          {calc.features.map((feature, idx) => (
                            <li key={idx} className="flex items-center space-x-2">
                              <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    <div className="flex gap-3">
                      <Button className={calc.featured ? "btn-gold" : ""}>
                        {calc.featured ? "Use Calculator" : "Open Calculator"}
                      </Button>
                      <Button variant="outline">Learn More</Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Featured Calculator - Zakat Calculator Widget */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <ZakatCalculatorWidget />
            </div>
          </div>
        </div>

        {/* Educational Section */}
        <div className="mt-16 grid md:grid-cols-2 gap-8">
          <Card className="p-6 bg-primary/5 border-primary/20">
            <h3 className="text-lg font-semibold text-primary mb-4">Why Use Islamic Calculators?</h3>
            <ul className="text-muted-foreground space-y-2">
              <li className="flex items-start space-x-2">
                <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2"></div>
                <span>Ensure compliance with Islamic principles</span>
              </li>
              <li className="flex items-start space-x-2">
                <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2"></div>
                <span>Accurate calculations based on Shariah law</span>
              </li>
              <li className="flex items-start space-x-2">
                <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2"></div>
                <span>Guided by qualified Islamic scholars</span>
              </li>
              <li className="flex items-start space-x-2">
                <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2"></div>
                <span>Easy-to-use modern interface</span>
              </li>
            </ul>
          </Card>

          <Card className="p-6 bg-secondary/5 border-secondary/20">
            <h3 className="text-lg font-semibold text-secondary mb-4">Need Help?</h3>
            <p className="text-muted-foreground mb-4">
              For complex financial situations or specific religious questions, 
              we recommend consulting with qualified Islamic scholars.
            </p>
            <Button variant="outline" className="w-full">
              Contact Scholar
            </Button>
          </Card>
        </div>
      </div>
    </main>
  );
};

export default Calculators;