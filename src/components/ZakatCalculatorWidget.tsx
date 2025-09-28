import { useState, useEffect } from 'react';
import { Calculator, DollarSign, Info, TrendingUp, Download, Globe, ToggleLeft, ToggleRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';

// Comprehensive Shariah-Compliant Zakat Calculator
const ZakatCalculatorWidget = () => {
  // Language and UI state
  const [isArabic, setIsArabic] = useState(false);
  const [currency, setCurrency] = useState('INR');
  const [nisabType, setNisabType] = useState<'gold' | 'silver'>('gold');
  
  // Assets (Zakatable wealth)
  const [cashAndBank, setCashAndBank] = useState('');
  const [goldWeight, setGoldWeight] = useState(''); // in grams
  const [goldValue, setGoldValue] = useState(''); // market value
  const [silverWeight, setSilverWeight] = useState(''); // in grams
  const [silverValue, setSilverValue] = useState(''); // market value
  const [businessAssets, setBusinessAssets] = useState('');
  const [shariahInvestments, setShariahInvestments] = useState('');
  const [tradeProperty, setTradeProperty] = useState('');
  const [livestock, setLivestock] = useState('');
  const [crops, setCrops] = useState('');
  
  // Liabilities
  const [debts, setDebts] = useState('');
  
  // Results state
  const [calculationResult, setCalculationResult] = useState<any>(null);
  
  // Current market prices (mock - in real app would fetch from API)
  const [goldPricePerGram, setGoldPricePerGram] = useState(6500); // INR per gram
  const [silverPricePerGram, setSilverPricePerGram] = useState(85); // INR per gram
  
  // Nisab thresholds in grams
  const goldNisabGrams = 87.48;
  const silverNisabGrams = 612.36;
  
  // Translations
  const translations = {
    en: {
      title: 'Shariah-Compliant Zakat Calculator',
      subtitle: 'Calculate your obligatory charity according to Islamic law',
      language: 'Language',
      currency: 'Currency',
      nisabType: 'Nisab Calculation Based On',
      gold: 'Gold',
      silver: 'Silver',
      assets: 'Assets (Zakatable Wealth)',
      cashBank: 'Cash & Bank Savings',
      goldWeight: 'Gold Weight (grams)',
      goldValue: 'Gold Market Value',
      silverWeight: 'Silver Weight (grams)',
      silverValue: 'Silver Market Value',
      businessAssets: 'Business Assets (Inventory, Receivables)',
      shariahInvestments: 'Shariah-Compliant Investments',
      tradeProperty: 'Property for Trade (not personal home)',
      livestock: 'Livestock (if applicable)',
      crops: 'Agricultural Crops (if applicable)',
      liabilities: 'Liabilities',
      debts: 'Debts Owed',
      calculate: 'Calculate Zakat',
      reset: 'Reset',
      export: 'Export Results',
      results: 'Zakat Calculation Results',
      totalAssets: 'Total Assets',
      totalLiabilities: 'Total Liabilities',
      netWealth: 'Net Zakatable Wealth',
      nisabThreshold: 'Nisab Threshold',
      zakatDue: 'Zakat Due (2.5%)',
      notDue: 'Zakat Not Due',
      breakdown: 'Breakdown by Category',
      shariahCompliant: 'This calculation is Shariah-compliant and avoids Riba (interest)',
      lunarYear: 'Zakat is obligatory only on wealth held for one complete lunar year (Hawl)',
      disclaimer: 'This calculator provides estimates only. For complex situations, please consult with a qualified Islamic scholar.'
    },
    ar: {
      title: 'حاسبة الزكاة المتوافقة مع الشريعة',
      subtitle: 'احسب زكاتك الواجبة وفقاً للشريعة الإسلامية',
      language: 'اللغة',
      currency: 'العملة',
      nisabType: 'حساب النصاب بناءً على',
      gold: 'الذهب',
      silver: 'الفضة',
      assets: 'الأصول (الثروة الخاضعة للزكاة)',
      cashBank: 'النقد والمدخرات المصرفية',
      goldWeight: 'وزن الذهب (جرام)',
      goldValue: 'القيمة السوقية للذهب',
      silverWeight: 'وزن الفضة (جرام)',
      silverValue: 'القيمة السوقية للفضة',
      businessAssets: 'أصول التجارة (المخزون، المستحقات)',
      shariahInvestments: 'الاستثمارات المتوافقة مع الشريعة',
      tradeProperty: 'العقارات للتجارة (وليس المنزل الشخصي)',
      livestock: 'الماشية (إن وجدت)',
      crops: 'المحاصيل الزراعية (إن وجدت)',
      liabilities: 'الالتزامات',
      debts: 'الديون المستحقة',
      calculate: 'احسب الزكاة',
      reset: 'إعادة تعيين',
      export: 'تصدير النتائج',
      results: 'نتائج حساب الزكاة',
      totalAssets: 'إجمالي الأصول',
      totalLiabilities: 'إجمالي الالتزامات',
      netWealth: 'صافي الثروة الخاضعة للزكاة',
      nisabThreshold: 'حد النصاب',
      zakatDue: 'الزكاة المستحقة (2.5%)',
      notDue: 'لا توجد زكاة مستحقة',
      breakdown: 'التفصيل حسب الفئة',
      shariahCompliant: 'هذا الحساب متوافق مع الشريعة ويتجنب الربا',
      lunarYear: 'الزكاة واجبة فقط على الثروة المحتفظ بها لمدة سنة قمرية كاملة (الحول)',
      disclaimer: 'هذه الحاسبة تقدم تقديرات فقط. للحالات المعقدة، يرجى استشارة عالم إسلامي مؤهل.'
    }
  };
  
  const t = translations[isArabic ? 'ar' : 'en'];
  
  const formatCurrency = (amount: number) => {
    const locale = isArabic ? 'ar-SA' : 'en-IN';
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };
  
  // Calculate current nisab value in selected currency
  const calculateNisabValue = () => {
    if (nisabType === 'gold') {
      return goldNisabGrams * goldPricePerGram;
    } else {
      return silverNisabGrams * silverPricePerGram;
    }
  };
  
  const calculateZakat = () => {
    // Parse all inputs
    const assets = {
      cash: parseFloat(cashAndBank) || 0,
      goldValue: parseFloat(goldValue) || (parseFloat(goldWeight) || 0) * goldPricePerGram,
      silverValue: parseFloat(silverValue) || (parseFloat(silverWeight) || 0) * silverPricePerGram,
      business: parseFloat(businessAssets) || 0,
      investments: parseFloat(shariahInvestments) || 0,
      property: parseFloat(tradeProperty) || 0,
      livestock: parseFloat(livestock) || 0,
      crops: parseFloat(crops) || 0
    };
    
    const liabilities = parseFloat(debts) || 0;
    
    // Calculate totals
    const totalAssets = Object.values(assets).reduce((sum, value) => sum + value, 0);
    const netWealth = totalAssets - liabilities;
    const nisabThreshold = calculateNisabValue();
    
    // Determine if zakat is due
    const isZakatDue = netWealth >= nisabThreshold;
    const zakatAmount = isZakatDue ? netWealth * 0.025 : 0;
    
    setCalculationResult({
      assets,
      totalAssets,
      liabilities,
      netWealth,
      nisabThreshold,
      isZakatDue,
      zakatAmount,
      breakdown: Object.entries(assets).filter(([_, value]) => value > 0)
    });
  };
  
  const resetCalculator = () => {
    setCashAndBank('');
    setGoldWeight('');
    setGoldValue('');
    setSilverWeight('');
    setSilverValue('');
    setBusinessAssets('');
    setShariahInvestments('');
    setTradeProperty('');
    setLivestock('');
    setCrops('');
    setDebts('');
    setCalculationResult(null);
  };
  
  const exportResults = () => {
    if (!calculationResult) return;
    
    const csvContent = [
      ['Item', 'Amount'],
      ['Total Assets', calculationResult.totalAssets],
      ['Total Liabilities', calculationResult.liabilities],
      ['Net Zakatable Wealth', calculationResult.netWealth],
      ['Nisab Threshold', calculationResult.nisabThreshold],
      ['Zakat Due', calculationResult.zakatAmount],
      ['Status', calculationResult.isZakatDue ? 'Zakat Due' : 'No Zakat Due']
    ].map(row => row.join(',')).join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'zakat-calculation.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };
  
  return (
    <div className={`widget-card space-y-6 ${isArabic ? 'rtl' : 'ltr'}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-gold rounded-lg flex items-center justify-center">
            <Calculator className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-primary">{t.title}</h3>
            <p className="text-sm text-muted-foreground">{t.subtitle}</p>
          </div>
        </div>
        
        {/* Language Toggle */}
        <div className="flex items-center space-x-2">
          <Globe className="w-4 h-4 text-muted-foreground" />
          <Switch
            checked={isArabic}
            onCheckedChange={setIsArabic}
          />
          <span className="text-sm text-muted-foreground">عربي</span>
        </div>
      </div>
      
      {/* Settings */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label>{t.currency}</Label>
          <Select value={currency} onValueChange={setCurrency}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="INR">INR - Indian Rupee</SelectItem>
              <SelectItem value="USD">USD - US Dollar</SelectItem>
              <SelectItem value="EUR">EUR - Euro</SelectItem>
              <SelectItem value="GBP">GBP - British Pound</SelectItem>
              <SelectItem value="AED">AED - UAE Dirham</SelectItem>
              <SelectItem value="SAR">SAR - Saudi Riyal</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label>{t.nisabType}</Label>
          <Select value={nisabType} onValueChange={(value: 'gold' | 'silver') => setNisabType(value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="gold">{t.gold} (87.48g)</SelectItem>
              <SelectItem value="silver">{t.silver} (612.36g)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label>Current {nisabType === 'gold' ? t.gold : t.silver} Price</Label>
          <div className="text-sm text-muted-foreground">
            {formatCurrency(nisabType === 'gold' ? goldPricePerGram : silverPricePerGram)}/gram
          </div>
        </div>
      </div>
      
      <Separator />
      
      {/* Assets Section */}
      <div className="space-y-4">
        <h4 className="text-md font-semibold text-primary flex items-center">
          <TrendingUp className="w-4 h-4 mr-2" />
          {t.assets}
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>{t.cashBank}</Label>
            <Input
              type="number"
              placeholder="0"
              value={cashAndBank}
              onChange={(e) => setCashAndBank(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label>{t.businessAssets}</Label>
            <Input
              type="number"
              placeholder="0"
              value={businessAssets}
              onChange={(e) => setBusinessAssets(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label>{t.goldWeight}</Label>
            <Input
              type="number"
              placeholder="0"
              value={goldWeight}
              onChange={(e) => setGoldWeight(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label>{t.goldValue}</Label>
            <Input
              type="number"
              placeholder="0"
              value={goldValue}
              onChange={(e) => setGoldValue(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label>{t.silverWeight}</Label>
            <Input
              type="number"
              placeholder="0"
              value={silverWeight}
              onChange={(e) => setSilverWeight(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label>{t.silverValue}</Label>
            <Input
              type="number"
              placeholder="0"
              value={silverValue}
              onChange={(e) => setSilverValue(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label>{t.shariahInvestments}</Label>
            <Input
              type="number"
              placeholder="0"
              value={shariahInvestments}
              onChange={(e) => setShariahInvestments(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label>{t.tradeProperty}</Label>
            <Input
              type="number"
              placeholder="0"
              value={tradeProperty}
              onChange={(e) => setTradeProperty(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label>{t.livestock}</Label>
            <Input
              type="number"
              placeholder="0"
              value={livestock}
              onChange={(e) => setLivestock(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label>{t.crops}</Label>
            <Input
              type="number"
              placeholder="0"
              value={crops}
              onChange={(e) => setCrops(e.target.value)}
            />
          </div>
        </div>
      </div>
      
      <Separator />
      
      {/* Liabilities Section */}
      <div className="space-y-4">
        <h4 className="text-md font-semibold text-destructive flex items-center">
          <DollarSign className="w-4 h-4 mr-2" />
          {t.liabilities}
        </h4>
        
        <div className="space-y-2">
          <Label>{t.debts}</Label>
          <Input
            type="number"
            placeholder="0"
            value={debts}
            onChange={(e) => setDebts(e.target.value)}
          />
        </div>
      </div>
      
      {/* Important Notes */}
      <div className="bg-secondary/10 border border-secondary/20 rounded-xl p-4">
        <div className="flex items-start space-x-3">
          <Info className="w-5 h-5 text-secondary mt-0.5" />
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">{t.lunarYear}</p>
            <p className="text-sm text-green-600">{t.shariahCompliant}</p>
          </div>
        </div>
      </div>
      
      {/* Action Buttons */}
      <div className="flex space-x-3">
        <Button onClick={calculateZakat} className="flex-1 btn-gold">
          {t.calculate}
        </Button>
        <Button variant="outline" onClick={resetCalculator}>
          {t.reset}
        </Button>
        {calculationResult && (
          <Button variant="outline" onClick={exportResults}>
            <Download className="w-4 h-4 mr-2" />
            {t.export}
          </Button>
        )}
      </div>
      
      {/* Results */}
      {calculationResult && (
        <Card className="p-6 space-y-4">
          <h4 className="text-lg font-semibold text-primary mb-4">{t.results}</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">{t.totalAssets}:</span>
                <span className="font-medium">{formatCurrency(calculationResult.totalAssets)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">{t.totalLiabilities}:</span>
                <span className="font-medium text-destructive">-{formatCurrency(calculationResult.liabilities)}</span>
              </div>
              <div className="flex justify-between border-t pt-2">
                <span className="text-sm font-medium">{t.netWealth}:</span>
                <span className="font-bold">{formatCurrency(calculationResult.netWealth)}</span>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">{t.nisabThreshold}:</span>
                <span className="font-medium">{formatCurrency(calculationResult.nisabThreshold)}</span>
              </div>
              <div className="flex justify-between border-t pt-2">
                <span className="text-sm font-medium">{t.zakatDue}:</span>
                <span className={`font-bold text-2xl ${calculationResult.isZakatDue ? 'text-green-600' : 'text-muted-foreground'}`}>
                  {calculationResult.isZakatDue ? formatCurrency(calculationResult.zakatAmount) : t.notDue}
                </span>
              </div>
            </div>
          </div>
          
          {calculationResult.isZakatDue && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mt-4">
              <h5 className="font-medium text-green-800 mb-2">{t.breakdown}</h5>
              <div className="space-y-1">
                {calculationResult.breakdown.map(([key, value]: [string, number]) => (
                  <div key={key} className="flex justify-between text-sm">
                    <span className="text-green-700 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}:</span>
                    <span className="text-green-800 font-medium">{formatCurrency(value)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </Card>
      )}
      
      {/* Disclaimer */}
      <div className="text-xs text-muted-foreground text-center">
        <p>{t.disclaimer}</p>
      </div>
    </div>
  );
};

export default ZakatCalculatorWidget;