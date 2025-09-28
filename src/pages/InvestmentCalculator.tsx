import { useState } from 'react';
import { ArrowLeft, Calculator, TrendingUp, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Link } from 'react-router-dom';

const InvestmentCalculator = () => {
  const [principal, setPrincipal] = useState('');
  const [profitRate, setProfitRate] = useState('');
  const [period, setPeriod] = useState('');
  const [periodType, setPeriodType] = useState('years');
  const [result, setResult] = useState<number | null>(null);

  const calculateInvestment = () => {
    const p = parseFloat(principal);
    const r = parseFloat(profitRate) / 100;
    const t = parseFloat(period);
    
    if (p && r && t) {
      // Simple profit calculation for Shariah-compliant investments
      const totalProfit = p * r * t;
      const totalAmount = p + totalProfit;
      setResult(totalAmount);
    }
  };

  const resetCalculator = () => {
    setPrincipal('');
    setProfitRate('');
    setPeriod('');
    setPeriodType('years');
    setResult(null);
  };

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
            <h1 className="text-3xl font-bold text-primary">Investment Calculator</h1>
            <p className="text-muted-foreground">Calculate Shariah-compliant investment returns</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Calculator Form */}
          <Card className="p-6">
            <div className="flex items-center space-x-3 mb-6">
              <TrendingUp className="w-6 h-6 text-primary" />
              <h2 className="text-xl font-semibold">Investment Details</h2>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="principal">Initial Investment Amount</Label>
                <Input
                  id="principal"
                  type="number"
                  placeholder="Enter amount"
                  value={principal}
                  onChange={(e) => setPrincipal(e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="profitRate">Expected Annual Profit Rate (%)</Label>
                <Input
                  id="profitRate"
                  type="number"
                  step="0.1"
                  placeholder="e.g., 5.5"
                  value={profitRate}
                  onChange={(e) => setProfitRate(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="period">Investment Period</Label>
                  <Input
                    id="period"
                    type="number"
                    placeholder="Enter period"
                    value={period}
                    onChange={(e) => setPeriod(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="periodType">Period Type</Label>
                  <Select value={periodType} onValueChange={setPeriodType}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="years">Years</SelectItem>
                      <SelectItem value="months">Months</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <Button onClick={calculateInvestment} className="flex-1">
                  <Calculator className="w-4 h-4 mr-2" />
                  Calculate
                </Button>
                <Button variant="outline" onClick={resetCalculator}>
                  Reset
                </Button>
              </div>
            </div>
          </Card>

          {/* Results */}
          <Card className="p-6">
            <div className="flex items-center space-x-3 mb-6">
              <DollarSign className="w-6 h-6 text-secondary" />
              <h2 className="text-xl font-semibold">Investment Summary</h2>
            </div>

            {result ? (
              <div className="space-y-4">
                <div className="p-4 bg-primary/5 rounded-lg">
                  <p className="text-sm text-muted-foreground">Total Amount After Investment Period</p>
                  <p className="text-3xl font-bold text-primary">${result.toFixed(2)}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-muted/50 rounded-lg text-center">
                    <p className="text-sm text-muted-foreground">Principal Amount</p>
                    <p className="text-xl font-semibold">${principal}</p>
                  </div>
                  <div className="p-4 bg-secondary/10 rounded-lg text-center">
                    <p className="text-sm text-muted-foreground">Total Profit</p>
                    <p className="text-xl font-semibold text-secondary">
                      ${(result - parseFloat(principal)).toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <TrendingUp className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Enter investment details to see calculations</p>
              </div>
            )}

            {/* Shariah Compliance Note */}
            <Card className="mt-6 p-4 bg-secondary/5 border-secondary/20">
              <h4 className="font-semibold text-secondary mb-2">Shariah Compliance</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Invest only in halal businesses</li>
                <li>• Avoid interest-based investments</li>
                <li>• Consider profit-sharing arrangements</li>
                <li>• Consult Islamic financial advisors</li>
              </ul>
            </Card>
          </Card>
        </div>
      </div>
    </main>
  );
};

export default InvestmentCalculator;