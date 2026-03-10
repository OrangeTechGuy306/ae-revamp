import React, { useState } from 'react';
import { AlertCircle, Zap } from 'lucide-react';

type BreakerMode = 'AC' | 'DC_BATTERY' | 'DC_PANEL';

interface BreakerResult {
    Design_Voltage: number;
    Max_Voltage: number;
    Max_Current: string;
    Design_Power: string;
    Max_Power: number;
    Phase: string;
    Recommended_Breaker: string;
    Status: string;
}

interface FormInputs {
    engineeringFactor: number;
    // AC
    acVoltage: number;
    peakLoad: number;
    // DC Battery
    batteryVolt: number;
    systemCapacity: number;
    // DC Panel
    panelWatt: number;
    panelVolt: number;
    chargerCurrent: number;
    chargerVolt: number;
}

export const BreakerSelection: React.FC = () => {
    const [mode, setMode] = useState<BreakerMode>('AC');
    const [inputs, setInputs] = useState<FormInputs>({
        engineeringFactor: 1.25,
        acVoltage: 230,
        peakLoad: 5,
        batteryVolt: 48,
        systemCapacity: 5,
        panelWatt: 550,
        panelVolt: 36,
        chargerCurrent: 120,
        chargerVolt: 500,
    });
    const [result, setResult] = useState<BreakerResult | null>(null);
    const [error, setError] = useState<string>('');

    const handleInputChange = (key: keyof FormInputs, value: number) => {
        setInputs(prev => ({ ...prev, [key]: value }));
    };

    const calculateBreaker = (): void => {
        setError('');
        try {
            const engineeringFactor = inputs.engineeringFactor;

            if (isNaN(engineeringFactor) || engineeringFactor <= 0) {
                setError('Enter a valid Engineering Factor');
                return;
            }

            let calculation: BreakerResult | null = null;

            if (mode === 'AC') {
                const acVoltage = inputs.acVoltage;
                const peakLoad = inputs.peakLoad;

                if (isNaN(acVoltage) || isNaN(peakLoad)) {
                    setError('Enter valid AC inputs');
                    return;
                }

                const maxPower = peakLoad;
                const maxCurrent = maxPower / acVoltage;
                const breaker = Math.ceil(maxCurrent * engineeringFactor);

                calculation = {
                    Design_Voltage: acVoltage,
                    Max_Voltage: acVoltage,
                    Max_Current: maxCurrent.toFixed(2),
                    Design_Power: (peakLoad * engineeringFactor).toFixed(2),
                    Max_Power: maxPower,
                    Phase: 'Single Phase',
                    Recommended_Breaker: breaker + 'A',
                    Status: 'AC Calculation Successful',
                };
            } else if (mode === 'DC_BATTERY') {
                const batteryVolt = inputs.batteryVolt;
                const systemCapacity = inputs.systemCapacity;

                if (isNaN(batteryVolt) || isNaN(systemCapacity)) {
                    setError('Enter valid DC Battery inputs');
                    return;
                }

                const maxPower = systemCapacity * 1000; // Convert kW to W
                const maxCurrent = maxPower / batteryVolt;
                const breaker = Math.ceil(maxCurrent * engineeringFactor);

                calculation = {
                    Design_Voltage: batteryVolt,
                    Max_Voltage: batteryVolt,
                    Max_Current: maxCurrent.toFixed(2),
                    Design_Power: (maxPower * engineeringFactor).toFixed(2),
                    Max_Power: maxPower,
                    Phase: 'DC',
                    Recommended_Breaker: breaker + 'A',
                    Status: 'DC Battery Calculation Successful',
                };
            } else if (mode === 'DC_PANEL') {
                const panelWatt = inputs.panelWatt;
                const panelVolt = inputs.panelVolt;

                if (isNaN(panelWatt) || isNaN(panelVolt)) {
                    setError('Enter valid DC Panel inputs');
                    return;
                }

                const maxPower = panelWatt;
                const maxCurrent = panelWatt / panelVolt;
                const breaker = Math.ceil(maxCurrent * engineeringFactor);

                calculation = {
                    Design_Voltage: panelVolt,
                    Max_Voltage: inputs.chargerVolt,
                    Max_Current: maxCurrent.toFixed(2),
                    Design_Power: (maxPower * engineeringFactor).toFixed(2),
                    Max_Power: maxPower,
                    Phase: 'DC',
                    Recommended_Breaker: breaker + 'A',
                    Status: 'DC Panel Calculation Successful',
                };
            }

            setResult(calculation);
        } catch (err) {
            setError('An error occurred during calculation');
        }
    };

    const resetForm = (): void => {
        setInputs({
            engineeringFactor: 1.25,
            acVoltage: 230,
            peakLoad: 5,
            batteryVolt: 48,
            systemCapacity: 5,
            panelWatt: 550,
            panelVolt: 36,
            chargerCurrent: 120,
            chargerVolt: 500,
        });
        setResult(null);
        setError('');
    };

    return (
        <div className="min-h-screen bg-background py-8 px-4 md:px-8">
            {/* Header */}
            <div className="text-center mb-8 max-w-4xl mx-auto">
                <h1 className="text-3xl md:text-4xl font-bold mb-3 text-primary">
                    Breaker & Switch Selection
                </h1>
                <p className="text-muted-foreground text-sm md:text-base">
                    Calculate appropriate breaker sizing for AC/DC systems
                </p>
            </div>

            <div className="max-w-6xl mx-auto">
                {/* Mode Selection Tabs */}
                <div className="flex flex-wrap gap-3 justify-center mb-8">
                    {[
                        { key: 'AC' as BreakerMode, label: 'AC Breaker' },
                        { key: 'DC_BATTERY' as BreakerMode, label: 'DC Battery' },
                        { key: 'DC_PANEL' as BreakerMode, label: 'DC Panel' },
                    ].map(({ key, label }) => (
                        <button
                            key={key}
                            onClick={() => { setMode(key); setResult(null); }}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all duration-300 ${
                                mode === key
                                    ? 'bg-primary text-primary-foreground shadow-lg'
                                    : 'bg-secondary text-secondary-foreground hover:border-primary border-2 border-transparent'
                            }`}
                        >
                            <Zap size={18} />
                            {label}
                        </button>
                    ))}
                </div>

                {/* Main Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Left: Inputs */}
                    <div className="card bg-card/50 border border-border rounded-lg p-6 backdrop-blur-sm">
                        <h2 className="text-xl font-semibold mb-6 text-foreground">Input Parameters</h2>

                        {/* Error Display */}
                        {error && (
                            <div className="flex items-center gap-3 p-3 mb-6 bg-destructive/10 border border-destructive/30 rounded-lg text-destructive">
                                <AlertCircle size={20} className="flex-shrink-0" />
                                <span className="text-sm">{error}</span>
                            </div>
                        )}

                        <div className="space-y-5">
                            {/* AC Mode */}
                            {mode === 'AC' && (
                                <>
                                    <div>
                                        <label className="block text-sm font-medium text-muted-foreground mb-2">
                                            AC Voltage (V)
                                        </label>
                                        <input
                                            type="number"
                                            min="110"
                                            max="415"
                                            step="1"
                                            value={inputs.acVoltage}
                                            onChange={(e) => handleInputChange('acVoltage', parseFloat(e.target.value))}
                                            placeholder="e.g., 230"
                                            className="w-full px-3 py-2 bg-secondary border border-border rounded-md text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-muted-foreground mb-2">
                                            Peak Load (W)
                                        </label>
                                        <input
                                            type="number"
                                            min="10"
                                            max="200000"
                                            step="1"
                                            value={inputs.peakLoad}
                                            onChange={(e) => handleInputChange('peakLoad', parseFloat(e.target.value))}
                                            placeholder="e.g., 5000"
                                            className="w-full px-3 py-2 bg-secondary border border-border rounded-md text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                                        />
                                    </div>
                                </>
                            )}

                            {/* DC Battery Mode */}
                            {mode === 'DC_BATTERY' && (
                                <>
                                    <div>
                                        <label className="block text-sm font-medium text-muted-foreground mb-2">
                                            Battery Voltage (V)
                                        </label>
                                        <input
                                            type="number"
                                            min="12"
                                            max="800"
                                            step="12"
                                            value={inputs.batteryVolt}
                                            onChange={(e) => handleInputChange('batteryVolt', parseFloat(e.target.value))}
                                            placeholder="e.g., 48"
                                            className="w-full px-3 py-2 bg-secondary border border-border rounded-md text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-muted-foreground mb-2">
                                            System Capacity (kW)
                                        </label>
                                        <input
                                            type="number"
                                            min="1"
                                            max="200000"
                                            step="1"
                                            value={inputs.systemCapacity}
                                            onChange={(e) => handleInputChange('systemCapacity', parseFloat(e.target.value))}
                                            placeholder="e.g., 5"
                                            className="w-full px-3 py-2 bg-secondary border border-border rounded-md text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                                        />
                                    </div>
                                </>
                            )}

                            {/* DC Panel Mode */}
                            {mode === 'DC_PANEL' && (
                                <>
                                    <div>
                                        <label className="block text-sm font-medium text-muted-foreground mb-2">
                                            Panel Wattage (W)
                                        </label>
                                        <input
                                            type="number"
                                            min="100"
                                            max="1000"
                                            step="5"
                                            value={inputs.panelWatt}
                                            onChange={(e) => handleInputChange('panelWatt', parseFloat(e.target.value))}
                                            placeholder="e.g., 550"
                                            className="w-full px-3 py-2 bg-secondary border border-border rounded-md text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-muted-foreground mb-2">
                                            Panel Voltage (V)
                                        </label>
                                        <input
                                            type="number"
                                            min="5"
                                            max="100"
                                            step="1"
                                            value={inputs.panelVolt}
                                            onChange={(e) => handleInputChange('panelVolt', parseFloat(e.target.value))}
                                            placeholder="e.g., 36"
                                            className="w-full px-3 py-2 bg-secondary border border-border rounded-md text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-muted-foreground mb-2">
                                            Charger Voltage (V)
                                        </label>
                                        <input
                                            type="number"
                                            min="16"
                                            max="800"
                                            step="1"
                                            value={inputs.chargerVolt}
                                            onChange={(e) => handleInputChange('chargerVolt', parseFloat(e.target.value))}
                                            placeholder="e.g., 500"
                                            className="w-full px-3 py-2 bg-secondary border border-border rounded-md text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-muted-foreground mb-2">
                                            Charger Current (A)
                                        </label>
                                        <input
                                            type="number"
                                            min="20"
                                            max="300"
                                            step="1"
                                            value={inputs.chargerCurrent}
                                            onChange={(e) => handleInputChange('chargerCurrent', parseFloat(e.target.value))}
                                            placeholder="e.g., 120"
                                            className="w-full px-3 py-2 bg-secondary border border-border rounded-md text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                                        />
                                    </div>
                                </>
                            )}

                            {/* Common Engineering Factor */}
                            <div>
                                <label className="block text-sm font-medium text-muted-foreground mb-2">
                                    Engineering Factor (default 1.25)
                                </label>
                                <input
                                    type="number"
                                    min="1.0"
                                    max="5.0"
                                    step="0.1"
                                    value={inputs.engineeringFactor}
                                    onChange={(e) => handleInputChange('engineeringFactor', parseFloat(e.target.value))}
                                    placeholder="e.g., 1.25"
                                    className="w-full px-3 py-2 bg-secondary border border-border rounded-md text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                                />
                            </div>
                        </div>

                        {/* Button Group */}
                        <div className="flex gap-3 mt-8">
                            <button
                                onClick={calculateBreaker}
                                className="flex-1 px-4 py-2 bg-primary text-primary-foreground font-semibold rounded-md hover:opacity-90 transition-opacity"
                            >
                                Calculate
                            </button>
                            <button
                                onClick={resetForm}
                                className="flex-1 px-4 py-2 bg-secondary text-secondary-foreground font-semibold rounded-md hover:bg-accent transition-colors border border-border"
                            >
                                Reset
                            </button>
                        </div>

                        {/* Info Box */}
                        <div className="mt-6 p-4 bg-secondary/50 border border-border rounded-lg">
                            <h3 className="text-sm font-semibold text-primary mb-2">Important Information</h3>
                            <p className="text-xs text-muted-foreground leading-relaxed">
                                This tool uses standard electrical engineering formulas to calculate the appropriate breaker
                                size based on the provided load and system parameters. It considers factors such as system
                                phase, voltage, and power factor to ensure accurate sizing for safety and efficiency.
                            </p>
                        </div>
                    </div>

                    {/* Right: Results */}
                    <div className="card bg-card/50 border border-border rounded-lg p-6 backdrop-blur-sm">
                        <h2 className="text-xl font-semibold mb-6 text-foreground">Calculation Results</h2>

                        {result ? (
                            <div className="space-y-3">
                                <div className="stat">
                                    <div className="k">Status:</div>
                                    <div className="v text-green-400">{result.Status}</div>
                                </div>
                                <div className="stat">
                                    <div className="k">Design Voltage:</div>
                                    <div className="v">{result.Design_Voltage} V</div>
                                </div>
                                <div className="stat">
                                    <div className="k">Max Voltage:</div>
                                    <div className="v">{result.Max_Voltage} V</div>
                                </div>
                                <div className="stat">
                                    <div className="k">Max Current:</div>
                                    <div className="v">{result.Max_Current} A</div>
                                </div>
                                <div className="stat">
                                    <div className="k">Design Power:</div>
                                    <div className="v">{result.Design_Power} W</div>
                                </div>
                                <div className="stat">
                                    <div className="k">Max Power:</div>
                                    <div className="v">{result.Max_Power} W</div>
                                </div>
                                <div className="stat">
                                    <div className="k">Phase Type:</div>
                                    <div className="v">{result.Phase}</div>
                                </div>
                                <div className="stat border-2 border-primary bg-primary/10 rounded-lg p-3 mt-4">
                                    <div className="k">Recommended Breaker:</div>
                                    <div className="v text-yellow-400 text-lg font-bold">{result.Recommended_Breaker}</div>
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-center justify-center h-80 text-muted-foreground">
                                <p className="text-center">Click "Calculate" to see results</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BreakerSelection;
