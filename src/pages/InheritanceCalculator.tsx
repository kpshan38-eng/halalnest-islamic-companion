import { useState } from 'react';
import { ArrowLeft, Users, Calculator, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Link } from 'react-router-dom';

interface Heir {
  type: string;
  count: number;
  share: number;
  amount: number;
}

const InheritanceCalculator = () => {
  const [totalEstate, setTotalEstate] = useState('');
  const [survivors, setSurvivors] = useState({
    spouse: false,
    sons: 0,
    daughters: 0,
    father: false,
    mother: false,
    brothers: 0,
    sisters: 0,
  });
  const [distribution, setDistribution] = useState<Heir[]>([]);
  const [calculated, setCalculated] = useState(false);

  const calculateInheritance = () => {
    const estate = parseFloat(totalEstate);
    if (!estate) return;

    const heirs: Heir[] = [];
    let remainingEstate = estate;

    // Simplified Islamic inheritance calculation
    // In a real application, this would need complex Shariah law implementation

    // Spouse shares
    if (survivors.spouse) {
      let spouseShare = 0;
      if (survivors.sons > 0 || survivors.daughters > 0) {
        spouseShare = estate * 0.125; // 1/8 if there are children
      } else {
        spouseShare = estate * 0.25; // 1/4 if no children
      }
      heirs.push({
        type: 'Spouse',
        count: 1,
        share: spouseShare / estate * 100,
        amount: spouseShare
      });
      remainingEstate -= spouseShare;
    }

    // Parents shares
    if (survivors.father) {
      const fatherShare = estate * (survivors.sons > 0 ? 0.1667 : 0.25); // 1/6 or 1/4
      heirs.push({
        type: 'Father',
        count: 1,
        share: fatherShare / estate * 100,
        amount: fatherShare
      });
      remainingEstate -= fatherShare;
    }

    if (survivors.mother) {
      const motherShare = estate * (survivors.sons > 0 || survivors.daughters > 0 ? 0.1667 : 0.3333); // 1/6 or 1/3
      heirs.push({
        type: 'Mother',
        count: 1,
        share: motherShare / estate * 100,
        amount: motherShare
      });
      remainingEstate -= motherShare;
    }

    // Children shares (simplified)
    if (survivors.sons > 0 || survivors.daughters > 0) {
      const totalChildren = survivors.sons + (survivors.daughters * 0.5); // Male gets 2x female share
      if (survivors.sons > 0) {
        const sonShare = (remainingEstate * 0.7) / totalChildren * 2; // Approximate
        heirs.push({
          type: 'Sons',
          count: survivors.sons,
          share: (sonShare * survivors.sons) / estate * 100,
          amount: sonShare * survivors.sons
        });
      }
      if (survivors.daughters > 0) {
        const daughterShare = (remainingEstate * 0.7) / totalChildren; // Approximate
        heirs.push({
          type: 'Daughters',
          count: survivors.daughters,
          share: (daughterShare * survivors.daughters) / estate * 100,
          amount: daughterShare * survivors.daughters
        });
      }
    }

    setDistribution(heirs);
    setCalculated(true);
  };

  const resetCalculator = () => {
    setTotalEstate('');
    setSurvivors({
      spouse: false,
      sons: 0,
      daughters: 0,
      father: false,
      mother: false,
      brothers: 0,
      sisters: 0,
    });
    setDistribution([]);
    setCalculated(false);
  };

  const updateSurvivors = (key: string, value: any) => {
    setSurvivors(prev => ({ ...prev, [key]: value }));
  };

  return (
    <main className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="flex items-center space-x-4 mb-8">
          <Link to="/calculators">
            <Button variant="outline" size="icon">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-primary">Islamic Inheritance Calculator</h1>
            <p className="text-muted-foreground">Calculate estate distribution according to Islamic law</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Input Form */}
          <div className="space-y-6">
            <Card className="p-6">
              <div className="flex items-center space-x-3 mb-6">
                <DollarSign className="w-6 h-6 text-primary" />
                <h2 className="text-xl font-semibold">Estate Information</h2>
              </div>

              <div>
                <Label htmlFor="totalEstate">Total Estate Value</Label>
                <Input
                  id="totalEstate"
                  type="number"
                  placeholder="Enter total estate value"
                  value={totalEstate}
                  onChange={(e) => setTotalEstate(e.target.value)}
                />
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center space-x-3 mb-6">
                <Users className="w-6 h-6 text-primary" />
                <h2 className="text-xl font-semibold">Surviving Family Members</h2>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="spouse"
                    checked={survivors.spouse}
                    onCheckedChange={(checked) => updateSurvivors('spouse', checked)}
                  />
                  <Label htmlFor="spouse">Spouse</Label>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="sons">Number of Sons</Label>
                    <Input
                      id="sons"
                      type="number"
                      min="0"
                      value={survivors.sons}
                      onChange={(e) => updateSurvivors('sons', parseInt(e.target.value) || 0)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="daughters">Number of Daughters</Label>
                    <Input
                      id="daughters"
                      type="number"
                      min="0"
                      value={survivors.daughters}
                      onChange={(e) => updateSurvivors('daughters', parseInt(e.target.value) || 0)}
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="father"
                      checked={survivors.father}
                      onCheckedChange={(checked) => updateSurvivors('father', checked)}
                    />
                    <Label htmlFor="father">Father</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="mother"
                      checked={survivors.mother}
                      onCheckedChange={(checked) => updateSurvivors('mother', checked)}
                    />
                    <Label htmlFor="mother">Mother</Label>
                  </div>
                </div>
              </div>

              <div className="flex gap-4 mt-6">
                <Button onClick={calculateInheritance} className="flex-1" disabled={!totalEstate}>
                  <Calculator className="w-4 h-4 mr-2" />
                  Calculate Distribution
                </Button>
                <Button variant="outline" onClick={resetCalculator}>
                  Reset
                </Button>
              </div>
            </Card>
          </div>

          {/* Results */}
          <Card className="p-6">
            <div className="flex items-center space-x-3 mb-6">
              <Users className="w-6 h-6 text-secondary" />
              <h2 className="text-xl font-semibold">Inheritance Distribution</h2>
            </div>

            {calculated && distribution.length > 0 ? (
              <div className="space-y-4">
                <div className="p-4 bg-primary/5 rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">Total Estate Value</p>
                  <p className="text-2xl font-bold text-primary">${parseFloat(totalEstate).toFixed(2)}</p>
                </div>

                <div className="space-y-3">
                  {distribution.map((heir, index) => (
                    <div key={index} className="p-4 bg-muted/30 rounded-lg">
                      <div className="flex justify-between items-center">
                        <div>
                          <h4 className="font-medium">{heir.type}</h4>
                          <p className="text-sm text-muted-foreground">
                            {heir.count > 1 ? `${heir.count} persons` : '1 person'}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-semibold">${heir.amount.toFixed(2)}</p>
                          <p className="text-sm text-muted-foreground">{heir.share.toFixed(1)}%</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Enter estate details to see distribution</p>
              </div>
            )}

            <Card className="mt-6 p-4 bg-amber-50 border-amber-200">
              <h4 className="font-semibold text-amber-800 mb-2">Important Notice</h4>
              <p className="text-sm text-amber-700">
                This is a simplified calculation. Islamic inheritance law is complex and may require 
                consultation with qualified Islamic scholars for accurate distribution, especially in 
                cases involving debts, specific bequests, or complex family situations.
              </p>
            </Card>
          </Card>
        </div>
      </div>
    </main>
  );
};

export default InheritanceCalculator;