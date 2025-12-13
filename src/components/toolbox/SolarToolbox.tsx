
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Tesseract from 'tesseract.js';
import './SolarToolbox.css';

// ==================== CONFIGURATION ====================
// ==================== CONFIGURATION ====================
export const APP_CONFIG = {
    inverter: {
        brand: "Growatt",
        model: "MIN 5000TL-X",
        price: 150000,
        maxSolarInput: 10,
        maxACOutput: 8,
        systemLoss: 0.95
    },
    panel: {
        brand: "Jinko Solar",
        model: "Cheetah HC",
        wattage: 300,
        panelFactor: 1.2
    },
    battery: {
        brand: "LG Chem",
        model: "RESU 10H",
        price: 50000,
        DOD: 0.8,
        efficiency: 0.8
    },
    environment: {
        emissionFactor: 0.42 // kg CO2 per kWh
    },
    applianceWattage: {
        'refrigerator': 600,
        'washing machine': 1200,
        'air conditioner': 1500,
        'heater': 1500,
        'microwave': 1000,
        'oven': 3000,
        'dishwasher': 1800,
        'television': 100,
        'laptop': 65,
        'desktop': 400,
        'printer': 300,
        'blender': 500,
        'iron': 1200,
        'fan': 75,
        'light bulb': 15,
        'led light': 10,
        'fluorescent': 20,
        'kettle': 2200,
        'toaster': 1500,
        'coffee maker': 1200,
        'pump': 800,
        'router': 12,
        'modem': 10
    } as Record<string, number>
};

interface Device {
    type: string;
    wattage: number;
    count: number;
    emoji?: string;
    timestamp?: string;
}

interface CalculationResult {
    inverterBrand: string;
    inverterModel: string;
    inverterPrice: number;
    pvBrand: string;
    pvModel: string;
    pvWattage: number;
    batteryBrand: string;
    batteryModel: string;
    batteryPrice: number;
    totalEnergy: string;
    batteryBankSize: string;
    dailyEnergyGeneneration: string;
    solarCapacity: string;
    pvArrayNos: number;
    inverterNos: number;
    inverterCapacity: string;
    checkingVolt: number;
    selectedLoad: number;
    totalEnergyWEff: string;
    _batteryBankRaw: number; // retained for secondary calcs
    _dailyEnergyRaw: number; // retained for secondary calcs
}

export function SolarToolbox() {
    // ==================== STATE ====================
    // Inputs
    const [inputs, setInputs] = useState({
        load: '' as string | number,
        usagehrDay: '' as string | number,
        psh: 5,
        panelEff: 30, // Panel Factor in %
        dod: 80,
        sysLoss: 0.8,
        batteryEff: 100 // Percentage on Load input (repurposed by original logic?) OR percentage logic
    });

    // The original logic used `batteryEff` input sometimes as a display for the percentage buttons,
    // but also `selectedLoadValue` was the source of truth for "Percentage Load% on Battery".
    // The input id="batteryEff" in HTML had label "Percentage on Load".
    const [selectedLoadValue, setSelectedLoadValue] = useState<number>(100);

    // Results
    const [result, setResult] = useState<CalculationResult | null>(null);

    // UI State
    const [isLoading, setIsLoading] = useState(false);
    const [successMsg, setSuccessMsg] = useState<string | null>(null);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const navigate = useNavigate();
    const [showCamera, setShowCamera] = useState(false);

    // Camera & Scanning
    const videoRef = useRef<HTMLVideoElement>(null);
    const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
    const [scannedDevices, setScannedDevices] = useState<Device[]>([]);
    const [lastScannedResult, setLastScannedResult] = useState<Partial<Device> | null>(null);
    const [showScanResult, setShowScanResult] = useState(false);
    const [isProcessingImage, setIsProcessingImage] = useState(false);
    const [showLoadListModal, setShowLoadListModal] = useState(false);

    // ==================== EFFECTS ====================
    useEffect(() => {
        // Sync input "batteryEff" with selectedLoadValue if user types manually
        // In original code: input -> buttons sync
        // We'll just bind input value to selectedLoadValue
        setInputs(prev => ({ ...prev, batteryEff: selectedLoadValue }));
    }, [selectedLoadValue]);

    // ==================== LOGIC ====================

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        let val: string | number = value;
        if (id !== 'load' && id !== 'usagehrDay') {
            val = parseFloat(value);
        }

        // Special handling for percentage input sync
        if (id === 'batteryEff') {
            const num = parseInt(value);
            if (!isNaN(num) && num >= 10 && num <= 100) {
                setSelectedLoadValue(num);
            }
        }

        setInputs(prev => ({ ...prev, [id]: val }));
    };

    const getDeviceEmoji = (type: string) => {
        const map: Record<string, string> = {
            'refrigerator': '🧊', 'washing machine': '🧺', 'air conditioner': '❄️',
            'heater': '🔥', 'microwave': '🍲', 'oven': '🔪', 'dishwasher': '🍽️',
            'television': '📺', 'laptop': '💻', 'desktop': '🖥️', 'printer': '🖨️',
            'blender': '🥤', 'iron': '👔', 'fan': '💨', 'light bulb': '💡',
            'pump': '💧', 'router': '📡'
        };
        return map[type.toLowerCase()] || '⚡';
    };

    // Calculation Engine
    const calculateArray = () => {
        const totalEnergyUsage = parseFloat(String(inputs.load));
        const usageHr = parseFloat(String(inputs.usagehrDay));
        const peakSunHr = Number(inputs.psh);
        const dod = Number(inputs.dod); // Original used this
        // const sysLoss = Number(inputs.sysLoss);

        if (isNaN(totalEnergyUsage) || totalEnergyUsage <= 0 || isNaN(usageHr) || usageHr <= 0) {
            alert("Please enter valid positive numbers for Load and Backup Time.");
            return null;
        }

        setIsLoading(true);

        setTimeout(() => {
            // Core Logic
            const totalEnergyKw = totalEnergyUsage / 1000;
            const totalEnergyWEff = totalEnergyKw / (dod / 100); // Using DOD as efficiency factor loosely based on original code logic
            // Note: Original code: totalEnergyWEff = totalEnergyKw / efficiencyLoad (where efficiencyLoad was hardcoded 80 or used DOD?). 
            // Original logic: const totalEnergyWEff = (totalEnergyKw / DOD); (if DOD is 0.8)

            const batteryBank = totalEnergyWEff * (selectedLoadValue / 100) * usageHr;

            let checkingVolt = 12;
            if (batteryBank <= 2) checkingVolt = 12;
            else if (batteryBank <= 5) checkingVolt = 24;
            else if (batteryBank <= 50) checkingVolt = 48;
            else if (batteryBank <= 100) checkingVolt = 96;
            else if (batteryBank <= 200) checkingVolt = 360;
            else checkingVolt = 500;

            const panelForLoad = totalEnergyWEff;
            const panelForBattery = batteryBank / peakSunHr;
            const solarCap = panelForBattery + panelForLoad;
            const dailyEnergyGen = batteryBank + (panelForLoad * peakSunHr);

            const pvWattage = APP_CONFIG.panel.wattage;
            const pvArrayNos = solarCap / (pvWattage / 1000);

            const { maxSolarInput, maxACOutput } = APP_CONFIG.inverter;
            const invertersByPV = Math.ceil(solarCap / maxSolarInput);
            const invertersByLoad = Math.ceil(totalEnergyWEff / maxACOutput);
            const invertNos = Math.max(invertersByPV, invertersByLoad, 1); // Ensure at least 1
            const ACCapacity = (maxACOutput * invertNos);

            const newResult: CalculationResult = {
                inverterBrand: APP_CONFIG.inverter.brand,
                inverterModel: APP_CONFIG.inverter.model,
                inverterPrice: APP_CONFIG.inverter.price,
                pvBrand: APP_CONFIG.panel.brand,
                pvModel: APP_CONFIG.panel.model,
                pvWattage,
                batteryBrand: APP_CONFIG.battery.brand,
                batteryModel: APP_CONFIG.battery.model,
                batteryPrice: APP_CONFIG.battery.price,
                totalEnergy: totalEnergyKw.toFixed(1),
                batteryBankSize: batteryBank.toFixed(2),
                dailyEnergyGeneneration: dailyEnergyGen.toFixed(1),
                solarCapacity: solarCap.toFixed(2),
                pvArrayNos: Math.ceil(pvArrayNos),
                inverterNos: invertNos,
                inverterCapacity: ACCapacity.toFixed(0),
                checkingVolt,
                selectedLoad: selectedLoadValue,
                totalEnergyWEff: totalEnergyWEff.toFixed(2),
                _batteryBankRaw: batteryBank,
                _dailyEnergyRaw: dailyEnergyGen
            };

            setResult(newResult);
            setIsLoading(false);
            setSuccessMsg("Array calculation completed!");
            setTimeout(() => setSuccessMsg(null), 3000);
        }, 1500);
    };

    const handleQuotation = () => {
        if (!result) {
            setErrorMsg("Please compute the array first.");
            setTimeout(() => setErrorMsg(null), 3000);
            return;
        }
        navigate('/quotation', { state: { result, inputs } });
    };

    const resetAll = () => {
        setInputs({
            load: '', usagehrDay: '', psh: 5, panelEff: 30, dod: 80, sysLoss: 0.8, batteryEff: 100
        });
        setSelectedLoadValue(100);
        setResult(null);
        setScannedDevices([]);
        setSuccessMsg("Form reset successfully!");
        setTimeout(() => setSuccessMsg(null), 2000);
    };

    // Camera & OCR Logic
    const initCamera = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: 'environment' }
            });
            setCameraStream(stream);
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                videoRef.current.play();
            }
            setShowCamera(true);
        } catch (err: any) {
            setErrorMsg("Camera access denied: " + err.message);
            setTimeout(() => setErrorMsg(null), 3000);
        }
    }


    const stopCamera = () => {
        if (cameraStream) {
            cameraStream.getTracks().forEach(track => track.stop());
            setCameraStream(null);
        }
        setShowCamera(false);
    };

    // Helper to extract watts from text
    const extractWattage = (text: string) => {
        const wattagePattern = /(\d+)\s*[wW](?:att)?s?/g;
        const matches = [...text.matchAll(wattagePattern)];
        for (const match of matches) {
            const val = parseFloat(match[1]);
            // Reasonable range check (e.g. < 50kW, > 0)
            if (val > 0 && val < 50000) return val;
        }
        return null;
    };

    const scanDevice = async () => {
        if (!videoRef.current) return;
        const canvas = document.createElement('canvas');
        canvas.width = videoRef.current.videoWidth;
        canvas.height = videoRef.current.videoHeight;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(videoRef.current, 0, 0);

        setIsProcessingImage(true);

        try {
            const { data: { text } } = await Tesseract.recognize(canvas.toDataURL('image/png'), 'eng');
            const wattage = extractWattage(text);

            // Simple heuristic for device type from text
            let type = "Device";
            const lowerText = text.toLowerCase();
            for (const key of Object.keys(APP_CONFIG.applianceWattage)) {
                if (lowerText.includes(key)) {
                    type = key.charAt(0).toUpperCase() + key.slice(1);
                    break;
                }
            }

            setLastScannedResult({ type, wattage: wattage || 0 });
            setShowScanResult(true);

        } catch (err) {
            console.error(err);
            setErrorMsg("Scan failed");
            setTimeout(() => setErrorMsg(null), 3000);
        } finally {
            setIsProcessingImage(false);
        }
    };

    const addScannedDevice = () => {
        if (lastScannedResult && lastScannedResult.wattage) {
            setScannedDevices(prev => {
                const existing = prev.find(d => d.type === lastScannedResult.type);
                if (existing) {
                    return prev.map(d => d.type === lastScannedResult.type ? { ...d, count: d.count + 1 } : d);
                }
                return [...prev, { count: 1, type: lastScannedResult.type!, wattage: lastScannedResult.wattage!, emoji: getDeviceEmoji(lastScannedResult.type!) }];
            });

            // Update total load input
            const currentLoad = parseFloat(String(inputs.load)) || 0;
            setInputs(prev => ({ ...prev, load: currentLoad + lastScannedResult.wattage! }));

            setSuccessMsg(`Added ${lastScannedResult.type} (${lastScannedResult.wattage}W)`);
            setTimeout(() => setSuccessMsg(null), 2000);
        }
        setShowScanResult(false);
    };

    // Manual image upload
    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = async (evt) => {
            setIsProcessingImage(true);
            try {
                const img = new Image();
                img.src = evt.target?.result as string;
                await img.decode();

                // Analyze
                const { data: { text } } = await Tesseract.recognize(img.src, 'eng');
                const wattage = extractWattage(text) || 500; // Fallback 500W if fails

                setLastScannedResult({ type: "Unknown Device", wattage });
                setShowScanResult(true);
            } catch (err) {
                setErrorMsg("Image analysis failed");
                setTimeout(() => setErrorMsg(null), 3000);
            } finally {
                setIsProcessingImage(false);
            }
        };
        reader.readAsDataURL(file);
    };


    return (
        <div className="solar-toolbox-container">
            <div className="container">
                {/* HEADER */}
                <div className="title">
                    <div>
                        <div className="sideView">
                            {/* Hamburger suppressed for simplicity in React version or implement sidebar later */}
                        </div>
                        <div className="flex flex-col">
                            <h1>Installer Tool Kit <span className="badge">100% Accuracy.</span></h1>
                            <div className="subtitle">Complete Solar Design & Sizing Toolkit – from Load to Quotation.</div>
                        </div>
                    </div>

                    <div className="toggle">
                        {/* Mode toggle handled by system theme or implement context later */}
                        <label className="pill text-gray-500">Light mode (System)</label>
                    </div>
                </div>

                <div className="grid-layout">
                    {/* LEFT: Inputs */}
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
                                    <button onClick={initCamera} style={{ background: 'none', border: 'none', color: '#6ad1ff', padding: 0, cursor: 'pointer', fontWeight: 600 }}>
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

                    {/* RIGHT: Results */}
                    <div className="card">
                        <h2 className="text-xl mb-4 font-semibold">Results</h2>
                        <div className="out" id="results">
                            <div className="stat">
                                <div className="k">Load:</div>
                                <div className="v">{result ? result.totalEnergy + ' Kw' : '—'}</div>
                            </div>
                            <div className="stat">
                                <div className="k">Required PV array:</div>
                                <div className="v">{result ? result.solarCapacity + ' KW' : '—'}</div>
                                <div className="pv">Pv_Kwatt Required</div>
                            </div>
                            <div className="stat">
                                <div className="k">Panel count (rounded up):</div>
                                <div className="v">{result ? result.pvArrayNos + ' Nos' : '—'}</div>
                                <div className="pvN">{result ? result.pvArrayNos + ' Units. ' + result.pvModel : ''}</div>
                            </div>
                            <div className="stat">
                                <div className="k">Recommended Panel(W):</div>
                                <div className="v">{result ? result.pvWattage + 'W' : '—'}</div>
                                <div className="panelBrand">{result ? result.pvBrand : '--'}</div>
                            </div>
                            <div className="stat">
                                <div className="k">Estimated daily energy:</div>
                                <div className="v">{result ? result.dailyEnergyGeneneration + ' kW/day' : '—'}</div>
                                <div className="kwD">kW/day</div>
                            </div>
                            {/* Omitted status field to save space or mapped to existing data */}
                            <div className="stat">
                                <div className="k">Inverter System:</div>
                                <div className="v">{result ? result.inverterNos + ' Nos' : '—'}</div>
                                <div className="requiredInverterO">{result ? 'MaxOutput ' + result.inverterCapacity + ' KwP' : 'MaxPower'}</div>
                            </div>
                            <div className="stat">
                                <div className="k">Battery Sizing:</div>
                                <div className="v">{result ? result.batteryBankSize + ' KwHr' : '—'}</div>
                                <div className="checkingVolt">{result ? result.checkingVolt + ' Volt' : ''}</div>
                            </div>
                        </div>
                        {result && (
                            <div className="resultFooter">
                                <hr style={{ border: '1px solid rgba(255,255,255,.1)' }} />
                                <p className="aboutResult mt-2">
                                    For detailed system design and professional quotation, please use the "Quotation" button.
                                </p>
                                <hr style={{ border: '1px solid rgba(255,255,255,.1)' }} />
                                <p>Developed by <a href="https://github.com/EniolaAbdulQodir/MindThread_Ai" target="_blank" rel="noreferrer" className="text-brand">Abdulrasaq Eniola.</a></p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* MODALS / OVERLAYS */}

            {/* Camera Interface */}
            {showCamera && (
                <div id="cameraPanel" style={{ display: 'flex', position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0, 0, 0, 0.7)', zIndex: 9999, alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(4px)' }}>
                    <div style={{ background: 'linear-gradient(135deg, rgba(10, 30, 50, 0.95), rgba(20, 50, 80, 0.95))', borderRadius: '16px', border: '2px solid rgba(106, 209, 255, 0.4)', padding: '24px', maxWidth: '500px', width: '90%', maxHeight: '80vh', overflowY: 'auto' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                            <h2 style={{ margin: 0, color: '#6ad1ff', fontSize: '22px' }}>📷 Smart Device Scanner</h2>
                            <button onClick={stopCamera} style={{ background: '#ff6b6b', color: 'white', padding: '8px 14px', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>✕</button>
                        </div>

                        <div style={{ position: 'relative', width: '100%', marginBottom: '12px' }}>
                            <video ref={videoRef} style={{ width: '100%', borderRadius: '8px', background: '#000', maxHeight: '300px', display: 'block' }}></video>
                            {isProcessingImage && (
                                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', color: 'white' }}>
                                    <div style={{ fontSize: '28px' }}>⏳</div>
                                    <div>Processing...</div>
                                </div>
                            )}
                        </div>

                        {showScanResult && lastScannedResult && (
                            <div style={{ background: 'rgba(106,209,255,0.15)', border: '1px solid rgba(106,209,255,0.4)', borderRadius: '8px', padding: 12, marginBottom: 12 }}>
                                <div style={{ fontSize: 13, fontWeight: 600, color: '#6ad1ff', marginBottom: 8 }}>Last Scan Result:</div>
                                <div style={{ marginBottom: 8 }}>
                                    <span style={{ color: 'white', fontWeight: 600 }}>{lastScannedResult.type}</span> - <span style={{ color: '#00d466' }}>{lastScannedResult.wattage}W</span>
                                </div>
                                <button onClick={addScannedDevice} style={{ width: '100%', background: '#00d466', color: 'white', padding: 8, border: 'none', borderRadius: 6, cursor: 'pointer', fontWeight: 600 }}>
                                    ✅ Add to Load
                                </button>
                            </div>
                        )}

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
                            <button onClick={scanDevice} style={{ background: '#00d466', color: 'white', padding: 12, border: 'none', borderRadius: 8 }}>📸 Scan</button>
                            <label style={{ background: '#6ad1ff', color: 'white', padding: 12, border: 'none', borderRadius: 8, textAlign: 'center', cursor: 'pointer' }}>
                                ➕ Upload
                                <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handleImageUpload} />
                            </label>
                            <button onClick={() => setShowLoadListModal(true)} style={{ background: 'linear-gradient(90deg, #00d4ff, #0099ff)', color: 'white', padding: 12, border: 'none', borderRadius: 8 }}>📋 List</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Load List Modal */}
            {showLoadListModal && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', zIndex: 10000, display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={() => setShowLoadListModal(false)}>
                    <div style={{ background: '#0b1221', padding: 20, borderRadius: 12, maxWidth: 400, width: '90%' }} onClick={e => e.stopPropagation()}>
                        <h3 style={{ color: '#6ad1ff', marginTop: 0 }}>📋 Scanned Devices</h3>
                        <div style={{ maxHeight: 300, overflowY: 'auto' }}>
                            {scannedDevices.length === 0 ? <p style={{ color: '#888' }}>No devices scanned.</p> : (
                                scannedDevices.map((d, i) => (
                                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #333' }}>
                                        <span>{d.emoji} {d.type} (x{d.count})</span>
                                        <span style={{ color: '#00d466' }}>{d.wattage * d.count}W</span>
                                    </div>
                                ))
                            )}
                        </div>
                        <button onClick={() => setShowLoadListModal(false)} style={{ marginTop: 15, width: '100%', padding: 10, background: '#333', color: 'white', border: 'none', borderRadius: 8 }}>Close</button>
                    </div>
                </div>
            )}


        </div>
    );
}


export default SolarToolbox;
