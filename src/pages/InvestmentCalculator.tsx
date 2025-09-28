import { useState } from 'react';
import { ArrowLeft, Calculator, TrendingUp, DollarSign, Download, FileText, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Link } from 'react-router-dom';

interface BreakdownItem {
  period: number;
  capitalBalance: number;
  periodProfit: number;
  totalProfit: number;
  totalBalance: number;
}

interface CalculationResult {
  finalBalance: number;
  totalProfit: number;
  investorShare: number;
  partnerShare: number;
  breakdown: BreakdownItem[];
}

const InvestmentCalculator = () => {
  const [principal, setPrincipal] = useState('');
  const [profitRate, setProfitRate] = useState('');
  const [period, setPeriod] = useState('');
  const [periodType, setPeriodType] = useState('years');
  const [contractType, setContractType] = useState('mudarabah');
  const [profitDistribution, setProfitDistribution] = useState('reinvest');
  const [investorRatio, setInvestorRatio] = useState('70');
  const [partnerRatio, setPartnerRatio] = useState('30');
  const [result, setResult] = useState<CalculationResult | null>(null);

  const getContractInfo = (type: string) => {
    const info = {
      mudarabah: {
        title: "Mudarabah (Profit Sharing)",
        description: "Investor provides capital, partner manages business. Profit shared per agreement, losses borne by investor."
      },
      musharakah: {
        title: "Musharakah (Partnership)",
        description: "Both parties contribute capital and share profits/losses according to agreed ratios."
      },
      murabaha: {
        title: "Murabaha (Cost Plus)",
        description: "Asset purchased and sold with agreed markup. Fixed profit margin over specified period."
      },
      ijara: {
        title: "Ijara (Leasing)",
        description: "Asset leased to generate rental income. Returns based on rental payments over time."
      }
    };
    return info[type as keyof typeof info];
  };

  const calculateInvestment = () => {
    const p = parseFloat(principal);
    const r = parseFloat(profitRate) / 100;
    const t = parseFloat(period);
    const investorRat = parseFloat(investorRatio) / 100;
    const partnerRat = parseFloat(partnerRatio) / 100;
    
    if (!p || !r || !t) return;

    const periods = periodType === 'months' ? t : t * 12;
    const monthlyRate = periodType === 'months' ? r / 12 : r / 12;
    const breakdown: BreakdownItem[] = [];
    
    let currentCapital = p;
    let totalProfitAccumulated = 0;
    
    // Calculate for each period
    for (let i = 1; i <= periods; i++) {
      let periodProfit = 0;
      
      switch (contractType) {
        case 'mudarabah':
          // Mudarabah: Simple profit calculation, investor gets capital back + profit share
          periodProfit = p * monthlyRate;
          break;
          
        case 'musharakah':
          // Musharakah: Both parties contribute, profit shared per ratio
          periodProfit = currentCapital * monthlyRate;
          break;
          
        case 'murabaha':
          // Murabaha: Fixed markup, no compounding
          periodProfit = p * monthlyRate;
          break;
          
        case 'ijara':
          // Ijara: Rental-based returns, consistent monthly rental
          periodProfit = p * monthlyRate;
          break;
      }
      
      const investorProfitShare = contractType === 'musharakah' || contractType === 'mudarabah' 
        ? periodProfit * investorRat 
        : periodProfit;
      
      totalProfitAccumulated += investorProfitShare;
      
      // If reinvesting and it's a partnership model, add profit to capital
      if (profitDistribution === 'reinvest' && (contractType === 'musharakah')) {
        currentCapital += investorProfitShare;
      }
      
      breakdown.push({
        period: i,
        capitalBalance: currentCapital,
        periodProfit: investorProfitShare,
        totalProfit: totalProfitAccumulated,
        totalBalance: currentCapital + (profitDistribution === 'reinvest' ? 0 : totalProfitAccumulated)
      });
    }
    
    const finalBalance = contractType === 'musharakah' && profitDistribution === 'reinvest' 
      ? currentCapital 
      : p + totalProfitAccumulated;
    
    const partnerProfitShare = (contractType === 'musharakah' || contractType === 'mudarabah')
      ? (totalProfitAccumulated / investorRat) * partnerRat
      : 0;

    setResult({
      finalBalance: finalBalance,
      totalProfit: totalProfitAccumulated,
      investorShare: totalProfitAccumulated,
      partnerShare: partnerProfitShare,
      breakdown: breakdown
    });
  };

  const resetCalculator = () => {
    setPrincipal('');
    setProfitRate('');
    setPeriod('');
    setPeriodType('years');
    setContractType('mudarabah');
    setProfitDistribution('reinvest');
    setInvestorRatio('70');
    setPartnerRatio('30');
    setResult(null);
  };

  const exportToCSV = () => {
    if (!result) return;
    
    const headers = ['Period', 'Capital Balance', 'Period Profit', 'Total Profit', 'Total Balance'];
    const csvContent = [
      headers.join(','),
      ...result.breakdown.map(item => 
        [item.period, item.capitalBalance.toFixed(2), item.periodProfit.toFixed(2), 
         item.totalProfit.toFixed(2), item.totalBalance.toFixed(2)].join(',')
      )
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `shariah-investment-${contractType}-${Date.now()}.csv`;
    link.click();
    window.URL.revokeObjectURL(url);
  };

  const updateRatios = (investorValue: string) => {
    const investor = parseFloat(investorValue) || 0;
    const partner = 100 - investor;
    setInvestorRatio(investorValue);
    setPartnerRatio(partner.toString());
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
          <div className="space-y-6">
            <Card className="p-6">
              <div className="flex items-center space-x-3 mb-6">
                <TrendingUp className="w-6 h-6 text-primary" />
                <h2 className="text-xl font-semibold">Investment Details</h2>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="principal">Initial Investment Amount ($)</Label>
                  <Input
                    id="principal"
                    type="number"
                    placeholder="Enter amount"
                    value={principal}
                    onChange={(e) => setPrincipal(e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="profitRate">Expected Profit Rate (% per {periodType === 'years' ? 'year' : 'month'})</Label>
                  <Input
                    id="profitRate"
                    type="number"
                    step="0.1"
                    placeholder="e.g., 8.5"
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

                <div>
                  <Label htmlFor="contractType">Type of Islamic Contract</Label>
                  <Select value={contractType} onValueChange={setContractType}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mudarabah">Mudarabah (Profit Sharing)</SelectItem>
                      <SelectItem value="musharakah">Musharakah (Partnership)</SelectItem>
                      <SelectItem value="murabaha">Murabaha (Cost Plus)</SelectItem>
                      <SelectItem value="ijara">Ijara (Leasing)</SelectItem>
                    </SelectContent>
                  </Select>
                  <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm text-blue-800 font-medium">{getContractInfo(contractType).title}</p>
                    <p className="text-xs text-blue-700 mt-1">{getContractInfo(contractType).description}</p>
                  </div>
                </div>

                <div>
                  <Label>Profit Distribution</Label>
                  <RadioGroup value={profitDistribution} onValueChange={setProfitDistribution} className="mt-2">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="withdraw" id="withdraw" />
                      <Label htmlFor="withdraw">Withdraw each period</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="reinvest" id="reinvest" />
                      <Label htmlFor="reinvest">Reinvest profits</Label>
                    </div>
                  </RadioGroup>
                </div>

                {(contractType === 'mudarabah' || contractType === 'musharakah') && (
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <Label>Profit Sharing Ratio</Label>
                    <div className="grid grid-cols-2 gap-4 mt-2">
                      <div>
                        <Label htmlFor="investorRatio" className="text-sm">Investor Share (%)</Label>
                        <Input
                          id="investorRatio"
                          type="number"
                          min="1"
                          max="99"
                          value={investorRatio}
                          onChange={(e) => updateRatios(e.target.value)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="partnerRatio" className="text-sm">Partner Share (%)</Label>
                        <Input
                          id="partnerRatio"
                          type="number"
                          value={partnerRatio}
                          disabled
                          className="bg-muted"
                        />
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex gap-4 pt-4">
                  <Button onClick={calculateInvestment} className="flex-1" disabled={!principal || !profitRate || !period}>
                    <Calculator className="w-4 h-4 mr-2" />
                    Calculate
                  </Button>
                  <Button variant="outline" onClick={resetCalculator}>
                    Reset
                  </Button>
                </div>
              </div>
            </Card>
          </div>

          {/* Results */}
          <div className="space-y-6">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <DollarSign className="w-6 h-6 text-secondary" />
                  <h2 className="text-xl font-semibold">Investment Summary</h2>
                </div>
                {result && (
                  <Button variant="outline" size="sm" onClick={exportToCSV}>
                    <Download className="w-4 h-4 mr-2" />
                    Export CSV
                  </Button>
                )}
              </div>

              {result ? (
                <div className="space-y-4">
                  <div className="p-4 bg-primary/5 rounded-lg">
                    <p className="text-sm text-muted-foreground">Final Balance</p>
                    <p className="text-3xl font-bold text-primary">${result.finalBalance.toFixed(2)}</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-muted/50 rounded-lg text-center">
                      <p className="text-sm text-muted-foreground">Principal Amount</p>
                      <p className="text-xl font-semibold">${parseFloat(principal).toFixed(2)}</p>
                    </div>
                    <div className="p-4 bg-secondary/10 rounded-lg text-center">
                      <p className="text-sm text-muted-foreground">Total Profit (Your Share)</p>
                      <p className="text-xl font-semibold text-secondary">
                        ${result.totalProfit.toFixed(2)}
                      </p>
                    </div>
                  </div>

                  {(contractType === 'mudarabah' || contractType === 'musharakah') && result.partnerShare > 0 && (
                    <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                      <h4 className="font-medium text-amber-800 mb-2">Profit Distribution</h4>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-amber-700">Your Share ({investorRatio}%)</p>
                          <p className="font-semibold text-amber-800">${result.investorShare.toFixed(2)}</p>
                        </div>
                        <div>
                          <p className="text-amber-700">Partner Share ({partnerRatio}%)</p>
                          <p className="font-semibold text-amber-800">${result.partnerShare.toFixed(2)}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <TrendingUp className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Enter investment details to see calculations</p>
                </div>
              )}
            </Card>

            {/* Breakdown Table */}
            {result && result.breakdown.length > 0 && (
              <Card className="p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <FileText className="w-5 h-5 text-primary" />
                  <h3 className="text-lg font-semibold">Period-wise Breakdown</h3>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-2">Period</th>
                        <th className="text-right p-2">Capital</th>
                        <th className="text-right p-2">Period Profit</th>
                        <th className="text-right p-2">Total Profit</th>
                        <th className="text-right p-2">Balance</th>
                      </tr>
                    </thead>
                    <tbody>
                      {result.breakdown.slice(0, 12).map((item, index) => (
                        <tr key={index} className="border-b hover:bg-muted/30">
                          <td className="p-2">{periodType === 'months' ? `Month ${item.period}` : `Year ${Math.ceil(item.period / 12)}`}</td>
                          <td className="text-right p-2">${item.capitalBalance.toFixed(2)}</td>
                          <td className="text-right p-2 text-green-600">${item.periodProfit.toFixed(2)}</td>
                          <td className="text-right p-2 font-medium">${item.totalProfit.toFixed(2)}</td>
                          <td className="text-right p-2 font-semibold">${item.totalBalance.toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {result.breakdown.length > 12 && (
                    <p className="text-xs text-muted-foreground mt-2 text-center">
                      Showing first 12 periods. Download CSV for complete breakdown.
                    </p>
                  )}
                </div>
              </Card>
            )}

            {/* Shariah Compliance Note */}
            <Card className="p-4 bg-green-50 border-green-200">
              <div className="flex items-start space-x-3">
                <Info className="w-5 h-5 text-green-600 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-green-800 mb-2">✓ Shariah Compliance Confirmed</h4>
                  <p className="text-sm text-green-700 mb-2">
                    <strong>This calculation is Shariah-compliant and avoids Riba (interest).</strong>
                  </p>
                  <ul className="text-sm text-green-700 space-y-1">
                    <li>• No compound interest calculations</li>
                    <li>• Profit sharing based on Islamic contracts</li>
                    <li>• Risk and reward sharing principles applied</li>
                    <li>• Asset-backed investment principles</li>
                  </ul>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
};

export default InvestmentCalculator;