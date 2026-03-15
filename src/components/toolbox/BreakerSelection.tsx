import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './SolarToolbox.css';

type MainMode = 'AC' | 'DC';
type DcSubType = 'Battery' | 'PV';
type AcPhase = 'Single' | 'Three';

interface BreakerResult {
    designVoltage: number;
    maxVoltage: number;
    maxCurrent: string;
    designPower: string;
    maxPower: number;
    phase: string;
    recommendedBreaker: string;
    status: string;
}

export const BreakerSelection: React.FC = () => {
    const [mainMode, setMainMode] = useState<MainMode>('AC');
    const [dcSubType, setDcSubType] = useState<DcSubType>('Battery');
    const [acPhase, setAcPhase] = useState<AcPhase>('Single');

    // AC inputs
    const [acVoltage, setAcVoltage] = useState(230);
    const [peakLoad, setPeakLoad] = useState(5000);

    // DC Battery inputs
    const [batteryVolt, setBatteryVolt] = useState(48);
    const [systemCapacity, setSystemCapacity] = useState(5);

    // DC PV Panel inputs
    const [panelWatt, setPanelWatt] = useState(550);
    const [panelVolt, setPanelVolt] = useState(36);
    const [chargerCurrent, setChargerCurrent] = useState(120);
    const [chargerVolt, setChargerVolt] = useState(500);

    // Common
    const [engFactor, setEngFactor] = useState(1.25);

    const [result, setResult] = useState<BreakerResult | null>(null);
    const [error, setError] = useState('');

    const toggleMode = () => {
        setMainMode(prev => (prev === 'AC' ? 'DC' : 'AC'));
        setResult(null);
        setError('');
    };

    const compute = () => {
        setError('');

        if (isNaN(engFactor) || engFactor <= 0) {
            setError('Enter a valid Engineering Factor.');
            return;
        }

        if (mainMode === 'AC') {
            if (isNaN(acVoltage) || isNaN(peakLoad)) {
                setError('Enter valid AC inputs.');
                return;
            }
            const maxCurrent = peakLoad / acVoltage;
            const breaker = Math.ceil(maxCurrent * engFactor);
            setResult({
                designVoltage: acVoltage,
                maxVoltage: acVoltage,
                maxCurrent: maxCurrent.toFixed(2),
                designPower: (peakLoad * engFactor).toFixed(2),
                maxPower: peakLoad,
                phase: acPhase === 'Three' ? 'Three Phase' : 'Single Phase',
                recommendedBreaker: breaker + 'A',
                status: 'AC Calculation Successful ✓',
            });
        } else {
            if (dcSubType === 'Battery') {
                if (isNaN(batteryVolt) || isNaN(systemCapacity)) {
                    setError('Enter valid DC Battery inputs.');
                    return;
                }
                const maxPower = systemCapacity * 1000;
                const maxCurrent = maxPower / batteryVolt;
                const breaker = Math.ceil(maxCurrent * engFactor);
                setResult({
                    designVoltage: batteryVolt,
                    maxVoltage: batteryVolt,
                    maxCurrent: maxCurrent.toFixed(2),
                    designPower: (maxPower * engFactor).toFixed(2),
                    maxPower,
                    phase: 'DC',
                    recommendedBreaker: breaker + 'A',
                    status: 'DC Battery Calculation Successful ✓',
                });
            } else {
                if (isNaN(panelWatt) || isNaN(panelVolt)) {
                    setError('Enter valid DC Panel inputs.');
                    return;
                }
                const maxCurrent = panelWatt / panelVolt;
                const breaker = Math.ceil(maxCurrent * engFactor);
                setResult({
                    designVoltage: panelVolt,
                    maxVoltage: chargerVolt,
                    maxCurrent: maxCurrent.toFixed(2),
                    designPower: (panelWatt * engFactor).toFixed(2),
                    maxPower: panelWatt,
                    phase: 'DC',
                    recommendedBreaker: breaker + 'A',
                    status: 'DC Panel Calculation Successful ✓',
                });
            }
        }
    };

    const reset = () => {
        setAcVoltage(230); setPeakLoad(5000);
        setBatteryVolt(48); setSystemCapacity(5);
        setPanelWatt(550); setPanelVolt(36);
        setChargerCurrent(120); setChargerVolt(500);
        setEngFactor(1.25);
        setResult(null); setError('');
    };

    return (
        <div className="solar-toolbox-container">
            <div className="container">

                {/* Header */}
                <div className="title p-5">
                    <div>
                        {/* SIDEVIEW */}
                        <div className="sideView">
                            <h5 style={{ textDecoration: 'underline' }}> A.E RENEWABLE LTD</h5>
                        </div>

                        <div>
                            <h1>Installer Tool Kit <span className="badge">100% Accuracy.</span></h1>
                            <div className="subtitle">Complete Electrical Design &amp; Breaker Sizing by A.E RENEWABLE.</div>
                        </div>
                    </div>

                 
                </div>

                {/* Main grid */}
                <div className="grid-layout">

                    {/* LEFT — Inputs */}
                    <div className="card">
                        <div className="card-header">
                            <h2>Input Parameters</h2>
                            <button className="mode-btn" onClick={toggleMode}>
                                {mainMode === 'AC' ? 'Switch to DC' : 'Switch to AC'}
                            </button>
                        </div>

                        {error && <div className="error-message">{error}</div>}

                        <div className="card mt-14">
                            <h3>
                                {mainMode === 'AC' ? 'AC Input' : 'DC Input'}
                            </h3>

                            <div className="row">
                                {/* Long labels together - Sub-type select and Engineering Factor */}
                                <div className="col-6">
                                    {mainMode === 'AC' ? (
                                        <>
                                            <label>Phase Type <span className="unit">(1 Phase / 3 Phase)</span></label>
                                            <select value={acPhase} onChange={e => setAcPhase(e.target.value as AcPhase)}>
                                                <option value="Single">Single Phase</option>
                                                <option value="Three">Three Phase</option>
                                            </select>
                                        </>
                                    ) : (
                                        <>
                                            <label>Select Type <span className="unit">(Battery / PV Panel)</span></label>
                                            <select value={dcSubType} onChange={e => { setDcSubType(e.target.value as DcSubType); setResult(null); }}>
                                                <option value="Battery">Battery</option>
                                                <option value="PV">PV Panel</option>
                                            </select>
                                        </>
                                    )}
                                </div>

                                <div className="col-6">
                                    <label htmlFor="eng-factor">Engineering Factor <span className="unit">(default 1.25)</span></label>
                                    <input type="number" id="eng-factor" min={1.0} max={5.0} step={0.1}
                                        placeholder="e.g., 1.25" value={engFactor}
                                        onChange={e => setEngFactor(parseFloat(e.target.value))} />
                                </div>

                                {/* AC fields */}
                                {mainMode === 'AC' && (<>
                                    <div className="col-6">
                                        <label htmlFor="ac-voltage">Voltage <span className="unit">(V)</span></label>
                                        <input type="number" id="ac-voltage" min={110} max={415} step={1}
                                            placeholder="e.g., 230" value={acVoltage}
                                            onChange={e => setAcVoltage(parseFloat(e.target.value))} />
                                    </div>
                                    <div className="col-6">
                                        <label htmlFor="peak-load">Peak Load <span className="unit">(W)</span></label>
                                        <input type="number" id="peak-load" min={10} max={200000} step={1}
                                            placeholder="e.g., 5000" value={peakLoad}
                                            onChange={e => setPeakLoad(parseFloat(e.target.value))} />
                                    </div>
                                </>)}

                                {/* DC Battery fields */}
                                {mainMode === 'DC' && dcSubType === 'Battery' && (<>
                                    <div className="col-6">
                                        <label htmlFor="battery-volt">Battery Voltage <span className="unit">(V)</span></label>
                                        <input type="number" id="battery-volt" min={12} max={800} step={12}
                                            placeholder="e.g., 48" value={batteryVolt}
                                            onChange={e => setBatteryVolt(parseFloat(e.target.value))} />
                                    </div>
                                    <div className="col-6">
                                        <label htmlFor="sys-capacity">System Capacity <span className="unit">(kW)</span></label>
                                        <input type="number" id="sys-capacity" min={1} max={200000} step={1}
                                            placeholder="e.g., 5" value={systemCapacity}
                                            onChange={e => setSystemCapacity(parseFloat(e.target.value))} />
                                    </div>
                                </>)}

                                {/* DC PV Panel fields */}
                                {mainMode === 'DC' && dcSubType === 'PV' && (<>
                                    <div className="col-6">
                                        <label htmlFor="panel-watt">Panel Wattage <span className="unit">(W)</span></label>
                                        <input type="number" id="panel-watt" min={100} max={1000} step={5}
                                            placeholder="e.g., 550" value={panelWatt}
                                            onChange={e => setPanelWatt(parseFloat(e.target.value))} />
                                    </div>
                                    <div className="col-6">
                                        <label htmlFor="panel-volt">Panel Voltage <span className="unit">(V)</span></label>
                                        <input type="number" id="panel-volt" min={5} max={100} step={1}
                                            placeholder="e.g., 36" value={panelVolt}
                                            onChange={e => setPanelVolt(parseFloat(e.target.value))} />
                                    </div>
                                    <div className="col-6">
                                        <label htmlFor="charger-volt">Charger Voltage <span className="unit">(V)</span></label>
                                        <input type="number" id="charger-volt" min={16} max={800} step={1}
                                            placeholder="e.g., 500" value={chargerVolt}
                                            onChange={e => setChargerVolt(parseFloat(e.target.value))} />
                                    </div>
                                    <div className="col-6">
                                        <label htmlFor="charger-current">Charger Current <span className="unit">(A)</span></label>
                                        <input type="number" id="charger-current" min={20} max={300} step={1}
                                            placeholder="e.g., 120" value={chargerCurrent}
                                            onChange={e => setChargerCurrent(parseFloat(e.target.value))} />
                                    </div>
                                </>)}
                            </div>

                            {/* Derivation Info */}
                            <div className="DerivationInformationContainer">
                                <h3>Derivation Information</h3>
                                <div className="DerivationInformation">
                                    <p>
                                        This tool uses standard electrical engineering formulas to calculate the
                                        appropriate breaker size based on the provided load and system parameters.
                                        It considers system phase, voltage and power factor to ensure accurate
                                        sizing for safety and efficiency.
                                    </p>
                                    <div className="contact">
                                        <p>For further assistance, contact <a href="mailto:eniola.abdulqodir@gmail.com" style={{ color: 'var(--brand)', textDecoration: 'underline' }}>eniola.abdulqodir@gmail.com</a></p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Buttons */}
                        <div className="btnbar mt-14">
                            <button type="button" className="primary-action" onClick={compute}>Compute</button>
                            <button type="button" className="secondary-action" onClick={reset}>Reset</button>
                        </div>
                    </div>

                    {/* RIGHT — Results */}
                    <div className="card">
                        <h2>Results</h2>

                        <div className="out">
                            <div className="stat">
                                <div className="k"><Link to="/kit" style={{ color: 'inherit', textDecoration: 'underline' }}>Voltage:</Link></div>
                                <div className="v">{result ? result.designVoltage + ' V' : '—'}</div>
                                <div className="unit">Max: <Link to="/kit" style={{ color: 'inherit', textDecoration: 'underline' }}>{result ? result.maxVoltage + ' V' : '—'}</Link></div>
                            </div>

                            <div className="stat">
                                <div className="k"><Link to="/kit" style={{ color: 'inherit', textDecoration: 'underline' }}>Breaker Size:</Link></div>
                                <div className="v">{result ? result.recommendedBreaker : '—'}</div>
                                <div className="unit">Max Current: <Link to="/kit" style={{ color: 'inherit', textDecoration: 'underline' }}>{result ? result.maxCurrent + ' A' : '—'}</Link></div>
                            </div>

                            <div className="stat">
                                <div className="k"><Link to="/kit" style={{ color: 'inherit', textDecoration: 'underline' }}>Power:</Link></div>
                                <div className="v">{result ? result.designPower + ' W' : '—'}</div>
                                <div className="unit">Max Power: <Link to="/kit" style={{ color: 'inherit', textDecoration: 'underline' }}>{result ? result.maxPower + ' W' : '—'}</Link></div>
                            </div>

                            <div className="stat">
                                <div className="k"><Link to="/kit" style={{ color: 'inherit', textDecoration: 'underline' }}>Power Unit:</Link></div>
                                <div className="v">{result ? result.phase : '—'}</div>
                                <div className="unit">Recommended: <Link to={"/kit"} style={{ color: 'inherit', textDecoration: 'underline' }}>Chint</Link></div>
                            </div>

                            <div className="stat span-2">
                                <div className="k">Status:</div>
                                <div className="v stat-recommendation" style={{ color: result ? 'var(--good)' : 'var(--sub)' }}>
                                    {result ? result.status : 'Enter values and click Compute'}
                                </div>
                            </div>
                        </div>

                        <div className="resultFooter">
                            <p>For detailed system design and pricing, use the <u>Solar Toolbox</u>.</p>
                            <hr />
                            <p>Developed by. <a href="https://github.com/EniolaAbdulQodir/MindThread_Ai" style={{ color: 'var(--brand)', textDecoration: 'underline' }}>Abdulrasaq Eniola.</a></p>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default BreakerSelection;
