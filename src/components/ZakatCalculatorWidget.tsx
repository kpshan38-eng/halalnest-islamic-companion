import { useState } from 'react';
import { Calculator, DollarSign, Info, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card } from '@/components/ui/card';

const ZakatCalculatorWidget = () => {
  const [currency, setCurrency] = useState('USD');
  const [cashSavings, setCashSavings] = useState('');
  const [goldValue, setGoldValue] = useState('');
  const [silverValue, setSilverValue] = useState('');
  const [investments, setInvestments] = useState('');
  const [zakatAmount, setZakatAmount] = useState<number | null>(null);

  const nisabAmount = 7500; // Current nisab in USD
  const zakatRate = 0.025; // 2.5%

  const calculateZakat = () => {
    const cash = parseFloat(cashSavings) || 0;
    const gold = parseFloat(goldValue) || 0;
    const silver = parseFloat(silverValue) || 0;
    const invest = parseFloat(investments) || 0;
    
    const totalWealth = cash + gold + silver + invest;
    
    if (totalWealth >= nisabAmount) {
      const zakat = totalWealth * zakatRate;
      setZakatAmount(zakat);
    } else {
      setZakatAmount(0);
    }
  };

  const resetCalculator = () => {
    setCashSavings('');
    setGoldValue('');
    setSilverValue('');
    setInvestments('');
    setZakatAmount(null);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="widget-card space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-gold rounded-lg flex items-center justify-center">
            <Calculator className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-primary">Zakat Calculator</h3>
            <p className="text-sm text-muted-foreground">Calculate your obligatory charity</p>
          </div>
        </div>
      </div>

      {/* Currency Selector */}
      <div className="space-y-2">
        <Label htmlFor="currency">Currency</Label>
        <Select value={currency} onValueChange={setCurrency}>
          <SelectTrigger>
            <SelectValue placeholder="Select currency" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="USD">USD - US Dollar</SelectItem>
            <SelectItem value="EUR">EUR - Euro</SelectItem>
            <SelectItem value="GBP">GBP - British Pound</SelectItem>
            <SelectItem value="AED">AED - UAE Dirham</SelectItem>
            <SelectItem value="SAR">SAR - Saudi Riyal</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Input Fields */}
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="cash">Cash & Bank Savings</Label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              id="cash"
              type="number"
              placeholder="0"
              value={cashSavings}
              onChange={(e) => setCashSavings(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="gold">Gold Value</Label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              id="gold"
              type="number"
              placeholder="0"
              value={goldValue}
              onChange={(e) => setGoldValue(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="silver">Silver Value</Label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              id="silver"
              type="number"
              placeholder="0"
              value={silverValue}
              onChange={(e) => setSilverValue(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="investments">Investments & Business Assets</Label>
          <div className="relative">
            <TrendingUp className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              id="investments"
              type="number"
              placeholder="0"
              value={investments}
              onChange={(e) => setInvestments(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      </div>

      {/* Nisab Information */}
      <div className="bg-secondary/10 border border-secondary/20 rounded-xl p-4">
        <div className="flex items-start space-x-3">
          <Info className="w-5 h-5 text-secondary mt-0.5" />
          <div>
            <h4 className="font-medium text-secondary mb-1">Nisab Information</h4>
            <p className="text-sm text-muted-foreground">
              Current nisab is approximately {formatCurrency(nisabAmount)}. 
              Zakat is due when your wealth exceeds this amount for one lunar year (Hawl).
            </p>
          </div>
        </div>
      </div>

      {/* Hawl Requirement */}
      <div className="bg-muted/30 rounded-xl p-4">
        <h4 className="font-medium text-foreground mb-2">Hawl Requirement</h4>
        <p className="text-sm text-muted-foreground">
          Your wealth must remain above the nisab threshold for a complete lunar year 
          before Zakat becomes obligatory.
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-3">
        <Button onClick={calculateZakat} className="flex-1 btn-gold">
          Calculate Zakat
        </Button>
        <Button variant="outline" onClick={resetCalculator}>
          Reset
        </Button>
      </div>

      {/* Results */}
      {zakatAmount !== null && (
        <Card className="p-6 bg-primary/5 border-primary/20">
          <div className="text-center">
            <h4 className="text-lg font-semibold text-primary mb-2">
              Your Zakat Amount
            </h4>
            <div className="text-3xl font-bold text-secondary mb-2">
              {formatCurrency(zakatAmount)}
            </div>
            {zakatAmount > 0 ? (
              <p className="text-sm text-muted-foreground">
                Congratulations! You can purify your wealth through Zakat.
              </p>
            ) : (
              <p className="text-sm text-muted-foreground">
                Your wealth is below the nisab threshold. No Zakat is due at this time.
              </p>
            )}
          </div>
        </Card>
      )}

      {/* Disclaimer */}
      <div className="text-xs text-muted-foreground text-center">
        <p>
          This calculator provides estimates only. For complex situations, 
          please consult with a qualified Islamic scholar.
        </p>
      </div>
    </div>
  );
};

export default ZakatCalculatorWidget;