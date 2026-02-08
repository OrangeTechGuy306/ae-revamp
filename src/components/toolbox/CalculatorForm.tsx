import React from 'react';

interface CalculatorFormProps {
    inputs: {
        load: string | number;
        usagehrDay: string | number;
        psh: number;
        panelEff: number;
        dod: number;
        sysLoss: number;
        batteryEff: number;
    };
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    selectedLoadValue: number;
    setSelectedLoadValue: (val: number) => void;
    calculateArray: () => void;
    resetAll: () => void;
    handleQuotation: () => void;
    isLoading: boolean;
    successMsg: string | null;
    errorMsg: string | null;
    onScanClick: () => void;
}

export const CalculatorForm = ({
    inputs,
    handleInputChange,
    selectedLoadValue,
    setSelectedLoadValue,
    calculateArray,
    resetAll,
    handleQuotation,
    isLoading,
    successMsg,
    errorMsg,
    onScanClick
}: CalculatorFormProps) => {
    return (
        <div className="card">
            <h1>Panel Sizing</h1>
            <h2 className="text-xl mb-4 font-semibold">Input</h2>
            <div className="row">
                <div className="col-6">
                    <label>Total Load Power <span className="unit">(W)</span></label>
                    <input
                        id="load"
                        type="number"
                        min="0"
                        step="100"
                        placeholder="e.g. 1000"
                        value={inputs.load}
                        onChange={handleInputChange}
                        style={{ background: 'linear-gradient(90deg, rgba(0,180,216,0.1), rgba(255,255,255,0.02))', border: '1px solid rgba(0,180,216,0.3)' }}
                    />
                    <small style={{ display: 'block', marginTop: '4px', color: '#6ad1ff', fontSize: '11px' }}>
                        <button onClick={onScanClick} style={{ background: 'none', border: 'none', color: '#6ad1ff', padding: 0, cursor: 'pointer', fontWeight: 600 }}>
                            📷 Scan devices
                        </button> or enter manually
                    </small>
                </div>
                <div className="col-6">
                    <label>Backup Time <span className="unit">(hr/day)</span></label>
                    <input id="usagehrDay" type="number" min="0" step="1" placeholder="e.g. 8" value={inputs.usagehrDay} onChange={handleInputChange} />
                </div>

                {/* ADDITIONAL SETTINGS */}
                <div className="col-6">
                    <label>Peak Sun Hours (PSH) <span className="unit">(hr/day)</span></label>
                    <input id="psh" type="number" step="0.5" value={inputs.psh} onChange={handleInputChange} />
                </div>
                <div className="col-6">
                    <label>Panel Factor <span className="unit">(%, default 30%)</span></label>
                    <input id="panelEff" type="number" value={inputs.panelEff} onChange={handleInputChange} />
                </div>
                <div className="col-6">
                    <label>Depth of Discharge <span className="unit">(%, default 80)</span></label>
                    <input id="dod" type="number" value={inputs.dod} onChange={handleInputChange} />
                </div>
                <div className="col-6">
                    <label>System Losses <span className="unit">(factor, default 0.8)</span></label>
                    <input id="sysLoss" type="number" step="0.1" value={inputs.sysLoss} onChange={handleInputChange} />
                </div>
                <div className="col-6">
                    <label><b>Percentage on Load</b></label>
                    <input id="batteryEff" type="number" value={inputs.batteryEff} onChange={handleInputChange} />
                </div>
            </div>

            <div className="percentageContainer mt-4">
                <h3 className="text-lg font-bold">Percentage Load% on Battery</h3>
                <div className="load-group">
                    {[100, 90, 80, 70, 60, 50, 40, 30, 20, 10].map(pct => (
                        <div key={pct} className={`load-item ${selectedLoadValue === pct ? 'active' : ''}`}>
                            <button className="top-btn" onClick={() => setSelectedLoadValue(pct)}>{pct}%</button>
                            <button className="bottom-btn" onClick={() => setSelectedLoadValue(pct)}></button>
                        </div>
                    ))}
                </div>
            </div>

            <div className="btnbar" style={{ marginTop: '14px' }}>
                <button id="compute" type="button" onClick={calculateArray}>Compute Array</button>
                <button id="reset" type="button" className="ghost" onClick={resetAll}>Reset</button>
                <button id="copy" type="button" className="ghost" onClick={handleQuotation}>Quotation</button>
            </div>

            {/* MESSAGES */}
            {isLoading && <div id="loading" style={{ marginTop: 10 }}>⏳ Loading...</div>}
            {successMsg && <div id="done" style={{ color: '#0aa80f', marginTop: 10 }}>✅ {successMsg}</div>}
            {errorMsg && <div className="warn" style={{ marginTop: 10 }}>⚠️ {errorMsg}</div>}
        </div>
    );
};
