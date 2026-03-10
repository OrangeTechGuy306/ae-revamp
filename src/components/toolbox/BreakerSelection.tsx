import React, { useState } from 'react';
import { AlertCircle, Zap } from 'lucide-react';
import '../../styles/BreakerSelection.css';

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
        <div className="breaker-container">
            <div className="breaker-header">
                <h1 className="breaker-title">Breaker & Switch Selection</h1>
                <p className="breaker-subtitle">Calculate appropriate breaker sizing for AC/DC systems</p>
            </div>

            <div className="breaker-content">
                {/* Mode Selection Tabs */}
                <div className="mode-tabs">
                    <button
                        className={`tab-btn ${mode === 'AC' ? 'active' : ''}`}
                        onClick={() => { setMode('AC'); setResult(null); }}
                    >
                        <Zap size={18} />
                        AC Breaker
                    </button>
                    <button
                        className={`tab-btn ${mode === 'DC_BATTERY' ? 'active' : ''}`}
                        onClick={() => { setMode('DC_BATTERY'); setResult(null); }}
                    >
                        <Zap size={18} />
                        DC Battery
                    </button>
                    <button
                        className={`tab-btn ${mode === 'DC_PANEL' ? 'active' : ''}`}
                        onClick={() => { setMode('DC_PANEL'); setResult(null); }}
                    >
                        <Zap size={18} />
                        DC Panel
                    </button>
                </div>

                <div className="breaker-grid">
                    {/* Left: Inputs */}
                    <div className="input-section">
                        <h2>Input Parameters</h2>

                        {/* Error Display */}
                        {error && (
                            <div className="error-box">
                                <AlertCircle size={20} />
                                <span>{error}</span>
                            </div>
                        )}

                        {/* AC Mode */}
                        {mode === 'AC' && (
                            <div className="input-group">
                                <div className="input-field">
                                    <label>AC Voltage (V)</label>
                                    <input
                                        type="number"
                                        min="110"
                                        max="415"
                                        step="1"
                                        value={inputs.acVoltage}
                                        onChange={(e) => handleInputChange('acVoltage', parseFloat(e.target.value))}
                                        placeholder="e.g., 230"
                                    />
                                </div>
                                <div className="input-field">
                                    <label>Peak Load (W)</label>
                                    <input
                                        type="number"
                                        min="10"
                                        max="200000"
                                        step="1"
                                        value={inputs.peakLoad}
                                        onChange={(e) => handleInputChange('peakLoad', parseFloat(e.target.value))}
                                        placeholder="e.g., 5000"
                                    />
                                </div>
                            </div>
                        )}

                        {/* DC Battery Mode */}
                        {mode === 'DC_BATTERY' && (
                            <div className="input-group">
                                <div className="input-field">
                                    <label>Battery Voltage (V)</label>
                                    <input
                                        type="number"
                                        min="12"
                                        max="800"
                                        step="12"
                                        value={inputs.batteryVolt}
                                        onChange={(e) => handleInputChange('batteryVolt', parseFloat(e.target.value))}
                                        placeholder="e.g., 48"
                                    />
                                </div>
                                <div className="input-field">
                                    <label>System Capacity (kW)</label>
                                    <input
                                        type="number"
                                        min="1"
                                        max="200000"
                                        step="1"
                                        value={inputs.systemCapacity}
                                        onChange={(e) => handleInputChange('systemCapacity', parseFloat(e.target.value))}
                                        placeholder="e.g., 5"
                                    />
                                </div>
                            </div>
                        )}

                        {/* DC Panel Mode */}
                        {mode === 'DC_PANEL' && (
                            <div className="input-group">
                                <div className="input-field">
                                    <label>Panel Wattage (W)</label>
                                    <input
                                        type="number"
                                        min="100"
                                        max="1000"
                                        step="5"
                                        value={inputs.panelWatt}
                                        onChange={(e) => handleInputChange('panelWatt', parseFloat(e.target.value))}
                                        placeholder="e.g., 550"
                                    />
                                </div>
                                <div className="input-field">
                                    <label>Panel Voltage (V)</label>
                                    <input
                                        type="number"
                                        min="5"
                                        max="100"
                                        step="1"
                                        value={inputs.panelVolt}
                                        onChange={(e) => handleInputChange('panelVolt', parseFloat(e.target.value))}
                                        placeholder="e.g., 36"
                                    />
                                </div>
                                <div className="input-field">
                                    <label>Charger Voltage (V)</label>
                                    <input
                                        type="number"
                                        min="16"
                                        max="800"
                                        step="1"
                                        value={inputs.chargerVolt}
                                        onChange={(e) => handleInputChange('chargerVolt', parseFloat(e.target.value))}
                                        placeholder="e.g., 500"
                                    />
                                </div>
                                <div className="input-field">
                                    <label>Charger Current (A)</label>
                                    <input
                                        type="number"
                                        min="20"
                                        max="300"
                                        step="1"
                                        value={inputs.chargerCurrent}
                                        onChange={(e) => handleInputChange('chargerCurrent', parseFloat(e.target.value))}
                                        placeholder="e.g., 120"
                                    />
                                </div>
                            </div>
                        )}

                        {/* Common Engineering Factor */}
                        <div className="input-group">
                            <div className="input-field">
                                <label>Engineering Factor (default 1.25)</label>
                                <input
                                    type="number"
                                    min="1.0"
                                    max="5.0"
                                    step="0.1"
                                    value={inputs.engineeringFactor}
                                    onChange={(e) => handleInputChange('engineeringFactor', parseFloat(e.target.value))}
                                    placeholder="e.g., 1.25"
                                />
                            </div>
                        </div>

                        {/* Button Group */}
                        <div className="button-group">
                            <button className="btn btn-primary" onClick={calculateBreaker}>
                                Calculate
                            </button>
                            <button className="btn btn-secondary" onClick={resetForm}>
                                Reset
                            </button>
                        </div>

                        {/* Info Box */}
                        <div className="info-box">
                            <h3>Important Information</h3>
                            <p>
                                This tool uses standard electrical engineering formulas to calculate the appropriate
                                breaker size based on the provided load and system parameters. It considers factors such
                                as system phase, voltage, and power factor to ensure accurate sizing for safety and efficiency.
                            </p>
                        </div>
                    </div>

                    {/* Right: Results */}
                    <div className="results-section">
                        <h2>Calculation Results</h2>

                        {result ? (
                            <div className="results-container">
                                <div className="result-item">
                                    <span className="label">Status:</span>
                                    <span className="value success">{result.Status}</span>
                                </div>
                                <div className="result-item">
                                    <span className="label">Design Voltage:</span>
                                    <span className="value">{result.Design_Voltage} V</span>
                                </div>
                                <div className="result-item">
                                    <span className="label">Max Voltage:</span>
                                    <span className="value">{result.Max_Voltage} V</span>
                                </div>
                                <div className="result-item">
                                    <span className="label">Max Current:</span>
                                    <span className="value">{result.Max_Current} A</span>
                                </div>
                                <div className="result-item">
                                    <span className="label">Design Power:</span>
                                    <span className="value">{result.Design_Power} W</span>
                                </div>
                                <div className="result-item">
                                    <span className="label">Max Power:</span>
                                    <span className="value">{result.Max_Power} W</span>
                                </div>
                                <div className="result-item">
                                    <span className="label">Phase Type:</span>
                                    <span className="value">{result.Phase}</span>
                                </div>
                                <div className="result-item highlight">
                                    <span className="label">Recommended Breaker:</span>
                                    <span className="value recommended">{result.Recommended_Breaker}</span>
                                </div>
                            </div>
                        ) : (
                            <div className="no-results">
                                <p>Click "Calculate" to see results</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BreakerSelection;
