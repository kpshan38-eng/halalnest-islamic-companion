import { useState } from 'react';
import { ArrowLeft, Users, Calculator, DollarSign, Info } from 'lucide-react';
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
  calculation?: string;
}

interface CalculationStep {
  step: string;
  explanation: string;
}

const InheritanceCalculator = () => {
  const [totalEstate, setTotalEstate] = useState('');
  const [survivors, setSurvivors] = useState({
    spouse: false,
    sons: 0,
    daughters: 0,
    father: false,
    mother: false,
    fullBrothers: 0,
    fullSisters: 0,
    paternalBrothers: 0,
    paternalSisters: 0,
    paternalGrandfather: false,
    paternalGrandmother: false,
    maternalGrandmother: false,
  });
  const [distribution, setDistribution] = useState<Heir[]>([]);
  const [calculationSteps, setCalculationSteps] = useState<CalculationStep[]>([]);
  const [calculated, setCalculated] = useState(false);
  const [noHeirs, setNoHeirs] = useState(false);

  const calculateInheritance = () => {
    const estate = parseFloat(totalEstate);
    if (!estate) return;

    const heirs: Heir[] = [];
    const steps: CalculationStep[] = [];
    let remainingEstate = estate;

    // Check if there are any heirs at all
    const hasHeirs = survivors.spouse || survivors.sons > 0 || survivors.daughters > 0 || 
                     survivors.father || survivors.mother || survivors.fullBrothers > 0 || 
                     survivors.fullSisters > 0 || survivors.paternalBrothers > 0 || 
                     survivors.paternalSisters > 0 || survivors.paternalGrandfather || 
                     survivors.paternalGrandmother || survivors.maternalGrandmother;

    if (!hasHeirs) {
      setNoHeirs(true);
      setDistribution([]);
      setCalculationSteps([{
        step: "No Heirs Found",
        explanation: "As there are no eligible heirs according to Islamic law, the entire estate goes to Baitul Mal (Islamic treasury/public fund)."
      }]);
      setCalculated(true);
      return;
    }

    setNoHeirs(false);
    steps.push({
      step: "Initial Assessment",
      explanation: `Total estate value: $${estate.toFixed(2)}. Beginning Faraid calculation according to Islamic inheritance law.`
    });

    // STEP 1: Calculate fixed shares (Fara'id) first
    
    // Spouse shares - calculated first as they are fixed
    if (survivors.spouse) {
      let spouseShare = 0;
      let spouseRatio = '';
      
      if (survivors.sons > 0 || survivors.daughters > 0) {
        spouseShare = estate * (1/8); // 1/8 if there are children
        spouseRatio = '1/8';
      } else {
        spouseShare = estate * (1/4); // 1/4 if no children
        spouseRatio = '1/4';
      }
      
      heirs.push({
        type: 'Spouse',
        count: 1,
        share: (spouseShare / estate) * 100,
        amount: spouseShare,
        calculation: `${spouseRatio} of estate`
      });
      
      remainingEstate -= spouseShare;
      steps.push({
        step: "Spouse Share",
        explanation: `Spouse receives ${spouseRatio} (${((spouseShare / estate) * 100).toFixed(1)}%) = $${spouseShare.toFixed(2)} ${survivors.sons > 0 || survivors.daughters > 0 ? 'because children exist' : 'because no children exist'}.`
      });
    }

    // Parents shares
    if (survivors.father) {
      let fatherShare = 0;
      let fatherRatio = '';
      
      if (survivors.sons > 0) {
        // Father gets 1/6 if there are sons (as sons inherit as residuary)
        fatherShare = estate * (1/6);
        fatherRatio = '1/6';
      } else {
        // Father can inherit as residuary if no sons, but gets minimum 1/6
        fatherShare = Math.max(estate * (1/6), remainingEstate * 0.5);
        fatherRatio = fatherShare === estate * (1/6) ? '1/6' : 'residuary (min 1/6)';
      }
      
      heirs.push({
        type: 'Father',
        count: 1,
        share: (fatherShare / estate) * 100,
        amount: fatherShare,
        calculation: fatherRatio
      });
      
      remainingEstate -= fatherShare;
      steps.push({
        step: "Father Share",
        explanation: `Father receives ${fatherRatio} = $${fatherShare.toFixed(2)} ${survivors.sons > 0 ? 'because sons exist (sons inherit as residuary)' : 'as residuary heir with minimum 1/6'}.`
      });
    }

    if (survivors.mother) {
      let motherShare = 0;
      let motherRatio = '';
      
      if ((survivors.sons > 0 || survivors.daughters > 0) || 
          (survivors.fullBrothers > 0 || survivors.fullSisters > 0 || 
           survivors.paternalBrothers > 0 || survivors.paternalSisters > 0)) {
        motherShare = estate * (1/6); // 1/6 if there are children or siblings
        motherRatio = '1/6';
      } else {
        motherShare = estate * (1/3); // 1/3 if no children or siblings
        motherRatio = '1/3';
      }
      
      heirs.push({
        type: 'Mother',
        count: 1,
        share: (motherShare / estate) * 100,
        amount: motherShare,
        calculation: motherRatio
      });
      
      remainingEstate -= motherShare;
      steps.push({
        step: "Mother Share",
        explanation: `Mother receives ${motherRatio} = $${motherShare.toFixed(2)} ${motherRatio === '1/6' ? 'because children or siblings exist' : 'because no children or siblings exist'}.`
      });
    }

    // Grandparents (only if parents are not alive)
    if (!survivors.father && survivors.paternalGrandfather) {
      const grandfatherShare = estate * (1/6);
      heirs.push({
        type: 'Paternal Grandfather',
        count: 1,
        share: (grandfatherShare / estate) * 100,
        amount: grandfatherShare,
        calculation: '1/6 (father substitute)'
      });
      remainingEstate -= grandfatherShare;
      steps.push({
        step: "Paternal Grandfather Share",
        explanation: `Paternal grandfather receives 1/6 = $${grandfatherShare.toFixed(2)} as substitute for father.`
      });
    }

    if (!survivors.mother && (survivors.paternalGrandmother || survivors.maternalGrandmother)) {
      const grandmothersCount = (survivors.paternalGrandmother ? 1 : 0) + (survivors.maternalGrandmother ? 1 : 0);
      const totalGrandmotherShare = estate * (1/6);
      const perGrandmotherShare = totalGrandmotherShare / grandmothersCount;
      
      if (survivors.paternalGrandmother) {
        heirs.push({
          type: 'Paternal Grandmother',
          count: 1,
          share: (perGrandmotherShare / estate) * 100,
          amount: perGrandmotherShare,
          calculation: `1/6 ÷ ${grandmothersCount} (mother substitute)`
        });
      }
      
      if (survivors.maternalGrandmother) {
        heirs.push({
          type: 'Maternal Grandmother',
          count: 1,
          share: (perGrandmotherShare / estate) * 100,
          amount: perGrandmotherShare,
          calculation: `1/6 ÷ ${grandmothersCount} (mother substitute)`
        });
      }
      
      remainingEstate -= totalGrandmotherShare;
      steps.push({
        step: "Grandmother(s) Share",
        explanation: `Grandmother(s) receive total 1/6 = $${totalGrandmotherShare.toFixed(2)}, split equally among ${grandmothersCount} grandmother(s).`
      });
    }

    // STEP 2: Children shares (if any)
    if (survivors.sons > 0 || survivors.daughters > 0) {
      if (survivors.daughters > 0 && survivors.sons === 0) {
        // Only daughters - they get specific fractional shares
        let daughtersShare = 0;
        let daughtersRatio = '';
        
        if (survivors.daughters === 1) {
          daughtersShare = estate * 0.5; // 1/2 for one daughter
          daughtersRatio = '1/2';
        } else {
          daughtersShare = estate * (2/3); // 2/3 for multiple daughters
          daughtersRatio = '2/3';
        }
        
        // But daughters can't get more than what's remaining
        daughtersShare = Math.min(daughtersShare, remainingEstate);
        const perDaughterShare = daughtersShare / survivors.daughters;
        
        heirs.push({
          type: 'Daughters',
          count: survivors.daughters,
          share: (daughtersShare / estate) * 100,
          amount: daughtersShare,
          calculation: `${daughtersRatio} total (${survivors.daughters === 1 ? 'single daughter' : 'multiple daughters'})`
        });
        
        remainingEstate -= daughtersShare;
        steps.push({
          step: "Daughters Share",
          explanation: `${survivors.daughters} daughter(s) receive ${daughtersRatio} = $${daughtersShare.toFixed(2)} total, $${perDaughterShare.toFixed(2)} each.`
        });
      } else if (survivors.sons > 0) {
        // Sons and daughters together - residuary inheritance (2:1 ratio)
        const totalShares = (survivors.sons * 2) + survivors.daughters;
        const perShare = remainingEstate / totalShares;
        
        if (survivors.sons > 0) {
          const sonsTotal = perShare * survivors.sons * 2;
          heirs.push({
            type: 'Sons',
            count: survivors.sons,
            share: (sonsTotal / estate) * 100,
            amount: sonsTotal,
            calculation: 'Residuary (2x daughter share)'
          });
          
          steps.push({
            step: "Sons Share",
            explanation: `${survivors.sons} son(s) receive $${sonsTotal.toFixed(2)} total as residuary heirs, $${(perShare * 2).toFixed(2)} each (2x daughter share).`
          });
        }
        
        if (survivors.daughters > 0) {
          const daughtersTotal = perShare * survivors.daughters;
          heirs.push({
            type: 'Daughters',
            count: survivors.daughters,
            share: (daughtersTotal / estate) * 100,
            amount: daughtersTotal,
            calculation: 'Residuary (1x share)'
          });
          
          steps.push({
            step: "Daughters Share",
            explanation: `${survivors.daughters} daughter(s) receive $${daughtersTotal.toFixed(2)} total as residuary heirs, $${perShare.toFixed(2)} each.`
          });
        }
        
        remainingEstate = 0; // All residuary goes to children
      }
    }

    // STEP 3: Siblings (only if no children and no father)
    if (survivors.sons === 0 && survivors.daughters === 0 && !survivors.father && remainingEstate > 0) {
      // Full siblings take precedence over paternal siblings
      if (survivors.fullBrothers > 0 || survivors.fullSisters > 0) {
        const totalSiblings = survivors.fullBrothers + survivors.fullSisters;
        
        if (survivors.fullSisters > 0 && survivors.fullBrothers === 0) {
          // Only full sisters
          let sistersShare = 0;
          let sistersRatio = '';
          
          if (survivors.fullSisters === 1) {
            sistersShare = Math.min(estate * 0.5, remainingEstate); // 1/2 for one sister
            sistersRatio = '1/2';
          } else {
            sistersShare = Math.min(estate * (2/3), remainingEstate); // 2/3 for multiple sisters
            sistersRatio = '2/3';
          }
          
          heirs.push({
            type: 'Full Sisters',
            count: survivors.fullSisters,
            share: (sistersShare / estate) * 100,
            amount: sistersShare,
            calculation: `${sistersRatio} (no full brothers)`
          });
          
          remainingEstate -= sistersShare;
          steps.push({
            step: "Full Sisters Share",
            explanation: `${survivors.fullSisters} full sister(s) receive ${sistersRatio} = $${sistersShare.toFixed(2)} total.`
          });
        } else if (survivors.fullBrothers > 0) {
          // Full brothers and sisters together - residuary (2:1 ratio)
          const totalShares = (survivors.fullBrothers * 2) + survivors.fullSisters;
          const perShare = remainingEstate / totalShares;
          
          if (survivors.fullBrothers > 0) {
            const brothersTotal = perShare * survivors.fullBrothers * 2;
            heirs.push({
              type: 'Full Brothers',
              count: survivors.fullBrothers,
              share: (brothersTotal / estate) * 100,
              amount: brothersTotal,
              calculation: 'Residuary (2x sister share)'
            });
          }
          
          if (survivors.fullSisters > 0) {
            const sistersTotal = perShare * survivors.fullSisters;
            heirs.push({
              type: 'Full Sisters',
              count: survivors.fullSisters,
              share: (sistersTotal / estate) * 100,
              amount: sistersTotal,
              calculation: 'Residuary (1x share)'
            });
          }
          
          steps.push({
            step: "Full Siblings Share",
            explanation: `Full siblings receive remaining estate as residuary heirs: brothers get 2x sister share, sisters get 1x share.`
          });
          
          remainingEstate = 0;
        }
      } else if (survivors.paternalBrothers > 0 || survivors.paternalSisters > 0) {
        // Paternal siblings (only if no full siblings)
        if (survivors.paternalSisters > 0 && survivors.paternalBrothers === 0) {
          let sistersShare = 0;
          let sistersRatio = '';
          
          if (survivors.paternalSisters === 1) {
            sistersShare = Math.min(estate * 0.5, remainingEstate);
            sistersRatio = '1/2';
          } else {
            sistersShare = Math.min(estate * (2/3), remainingEstate);
            sistersRatio = '2/3';
          }
          
          heirs.push({
            type: 'Paternal Sisters',
            count: survivors.paternalSisters,
            share: (sistersShare / estate) * 100,
            amount: sistersShare,
            calculation: `${sistersRatio} (no paternal brothers)`
          });
          
          remainingEstate -= sistersShare;
          steps.push({
            step: "Paternal Sisters Share",
            explanation: `${survivors.paternalSisters} paternal sister(s) receive ${sistersRatio} = $${sistersShare.toFixed(2)} total.`
          });
        } else if (survivors.paternalBrothers > 0) {
          // Paternal brothers and sisters - residuary (2:1 ratio)
          const totalShares = (survivors.paternalBrothers * 2) + survivors.paternalSisters;
          const perShare = remainingEstate / totalShares;
          
          if (survivors.paternalBrothers > 0) {
            const brothersTotal = perShare * survivors.paternalBrothers * 2;
            heirs.push({
              type: 'Paternal Brothers',
              count: survivors.paternalBrothers,
              share: (brothersTotal / estate) * 100,
              amount: brothersTotal,
              calculation: 'Residuary (2x sister share)'
            });
          }
          
          if (survivors.paternalSisters > 0) {
            const sistersTotal = perShare * survivors.paternalSisters;
            heirs.push({
              type: 'Paternal Sisters',
              count: survivors.paternalSisters,
              share: (sistersTotal / estate) * 100,
              amount: sistersTotal,
              calculation: 'Residuary (1x share)'
            });
          }
          
          steps.push({
            step: "Paternal Siblings Share",
            explanation: `Paternal siblings receive remaining estate as residuary heirs: brothers get 2x sister share.`
          });
          
          remainingEstate = 0;
        }
      }
    }

    // Final step - any remaining estate
    if (remainingEstate > 0.01) { // Small threshold for rounding errors
      steps.push({
        step: "Remaining Estate",
        explanation: `$${remainingEstate.toFixed(2)} remains undistributed. This should be distributed proportionally among residuary heirs or go to Baitul Mal if no eligible heirs remain.`
      });
    }

    setDistribution(heirs);
    setCalculationSteps(steps);
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
      fullBrothers: 0,
      fullSisters: 0,
      paternalBrothers: 0,
      paternalSisters: 0,
      paternalGrandfather: false,
      paternalGrandmother: false,
      maternalGrandmother: false,
    });
    setDistribution([]);
    setCalculationSteps([]);
    setCalculated(false);
    setNoHeirs(false);
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

                {/* Siblings Section */}
                <div className="border-t pt-4">
                  <h3 className="text-sm font-medium text-muted-foreground mb-3">Siblings (only inherit if no children and no father)</h3>
                  
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="fullBrothers">Full Brothers</Label>
                        <Input
                          id="fullBrothers"
                          type="number"
                          min="0"
                          value={survivors.fullBrothers}
                          onChange={(e) => updateSurvivors('fullBrothers', parseInt(e.target.value) || 0)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="fullSisters">Full Sisters</Label>
                        <Input
                          id="fullSisters"
                          type="number"
                          min="0"
                          value={survivors.fullSisters}
                          onChange={(e) => updateSurvivors('fullSisters', parseInt(e.target.value) || 0)}
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="paternalBrothers">Paternal Brothers</Label>
                        <Input
                          id="paternalBrothers"
                          type="number"
                          min="0"
                          value={survivors.paternalBrothers}
                          onChange={(e) => updateSurvivors('paternalBrothers', parseInt(e.target.value) || 0)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="paternalSisters">Paternal Sisters</Label>
                        <Input
                          id="paternalSisters"
                          type="number"
                          min="0"
                          value={survivors.paternalSisters}
                          onChange={(e) => updateSurvivors('paternalSisters', parseInt(e.target.value) || 0)}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Grandparents Section */}
                <div className="border-t pt-4">
                  <h3 className="text-sm font-medium text-muted-foreground mb-3">Grandparents (only inherit if parents are not alive)</h3>
                  
                  <div className="flex flex-wrap items-center gap-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="paternalGrandfather"
                        checked={survivors.paternalGrandfather}
                        onCheckedChange={(checked) => updateSurvivors('paternalGrandfather', checked)}
                      />
                      <Label htmlFor="paternalGrandfather">Paternal Grandfather</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="paternalGrandmother"
                        checked={survivors.paternalGrandmother}
                        onCheckedChange={(checked) => updateSurvivors('paternalGrandmother', checked)}
                      />
                      <Label htmlFor="paternalGrandmother">Paternal Grandmother</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="maternalGrandmother"
                        checked={survivors.maternalGrandmother}
                        onCheckedChange={(checked) => updateSurvivors('maternalGrandmother', checked)}
                      />
                      <Label htmlFor="maternalGrandmother">Maternal Grandmother</Label>
                    </div>
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

            {calculated ? (
              noHeirs ? (
                <div className="text-center py-8">
                  <div className="p-6 bg-red-50 border border-red-200 rounded-lg">
                    <h3 className="text-lg font-semibold text-red-800 mb-2">No Eligible Heirs Found</h3>
                    <p className="text-red-700 mb-4">
                      According to Islamic inheritance law, there are no eligible heirs present.
                    </p>
                    <div className="p-4 bg-red-100 rounded-lg">
                      <p className="font-medium text-red-800">Estate Disposition:</p>
                      <p className="text-red-700">
                        The entire estate of <strong>${parseFloat(totalEstate).toFixed(2)}</strong> goes to <strong>Baitul Mal</strong> (Islamic treasury/public fund).
                      </p>
                    </div>
                  </div>
                </div>
              ) : distribution.length > 0 ? (
                <div className="space-y-6">
                  <div className="p-4 bg-primary/5 rounded-lg">
                    <p className="text-sm text-muted-foreground mb-1">Total Estate Value</p>
                    <p className="text-2xl font-bold text-primary">${parseFloat(totalEstate).toFixed(2)}</p>
                  </div>

                  <div className="space-y-3">
                    {distribution.map((heir, index) => (
                      <div key={index} className="p-4 bg-muted/30 rounded-lg">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium">{heir.type}</h4>
                            <p className="text-sm text-muted-foreground">
                              {heir.count > 1 ? `${heir.count} persons` : '1 person'}
                            </p>
                            {heir.calculation && (
                              <p className="text-xs text-primary mt-1">{heir.calculation}</p>
                            )}
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-semibold">${heir.amount.toFixed(2)}</p>
                            <p className="text-sm text-muted-foreground">{heir.share.toFixed(1)}%</p>
                            {heir.count > 1 && (
                              <p className="text-xs text-muted-foreground">
                                ${(heir.amount / heir.count).toFixed(2)} each
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Step-by-step calculation */}
                  <Card className="p-4 bg-blue-50 border-blue-200">
                    <div className="flex items-center space-x-2 mb-3">
                      <Info className="w-4 h-4 text-blue-600" />
                      <h4 className="font-semibold text-blue-800">Step-by-Step Calculation</h4>
                    </div>
                    <div className="space-y-2">
                      {calculationSteps.map((step, index) => (
                        <div key={index} className="text-sm">
                          <span className="font-medium text-blue-800">{index + 1}. {step.step}:</span>
                          <span className="text-blue-700 ml-1">{step.explanation}</span>
                        </div>
                      ))}
                    </div>
                  </Card>
                </div>
              ) : null
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Enter estate details to see distribution</p>
              </div>
            )}

            <Card className="mt-6 p-4 bg-amber-50 border-amber-200">
              <h4 className="font-semibold text-amber-800 mb-2">Important Notice</h4>
              <p className="text-sm text-amber-700">
                This calculator implements comprehensive Faraid (Islamic inheritance law) calculations including primary heirs (spouse, children, parents), 
                secondary heirs (siblings, grandparents), and Baitul Mal provisions. However, complex cases involving debts, 
                specific bequests, or unusual family situations may require consultation with qualified Islamic scholars.
              </p>
            </Card>
          </Card>
        </div>
      </div>
    </main>
  );
};

export default InheritanceCalculator;