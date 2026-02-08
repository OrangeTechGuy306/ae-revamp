
import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Tesseract from 'tesseract.js';
import { CalculatorForm } from './CalculatorForm';
import './SolarToolbox.css';
import './QuoteModal.css';


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
        wattage: 600,
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

interface InverterData {
    inverterBrand: string;
    inverterModel: string;
    acOutputKw: number;
    dcInputVoltage: string | number;
    inverterACInputCurrent: number;
    inverterDCInputCurrent: number;
    chargeControlAmps: string | number;
    chargeControlV: number;
    efficiency: number;
    inverterPrice: number;
    Warranty: string | number;
}

const INVERTER_CATALOG: InverterData[] = [

    {
        inverterBrand: 'FIRMAN',
        inverterModel: '1000W-FH01K0120',
        acOutputKw: 1,
        dcInputVoltage: 12,
        inverterACInputCurrent: 60,
        inverterDCInputCurrent: 83,
        chargeControlAmps: 30,
        chargeControlV: 50,
        efficiency: 97,
        inverterPrice: 170000,
        Warranty: '2 years'
    },
    {
        inverterBrand: 'FELICTY',
        inverterModel: ' IVEM3024',
        acOutputKw: 3,
        dcInputVoltage: 24,
        inverterACInputCurrent: 40,
        inverterDCInputCurrent: 125,
        chargeControlAmps: 100,
        chargeControlV: 500,
        efficiency: 95,
        inverterPrice: 380000,
        Warranty: '2 years'
    },
    {
        inverterBrand: 'FELICTY',
        inverterModel: ' IVEM5048',
        acOutputKw: 5,
        dcInputVoltage: 48,
        inverterACInputCurrent: 40,
        inverterDCInputCurrent: 125,
        chargeControlAmps: 100,
        chargeControlV: 500,
        efficiency: 95,
        inverterPrice: 480000,
        Warranty: '2 years'
    },
    {
        inverterBrand: 'FELICTY',
        inverterModel: ' IVEM6048-II',
        acOutputKw: 6,
        dcInputVoltage: 48,
        inverterACInputCurrent: 40,
        inverterDCInputCurrent: 150,
        chargeControlAmps: 120,
        chargeControlV: 500,
        efficiency: 95,
        inverterPrice: 510000,
        Warranty: '2 years'
    },
    {
        inverterBrand: 'FELICTY',
        inverterModel: ' IVEM12048-II',
        acOutputKw: 12,
        dcInputVoltage: 48,
        inverterACInputCurrent: 53,
        inverterDCInputCurrent: 250,
        chargeControlAmps: 240,
        chargeControlV: 500,
        efficiency: 95,
        inverterPrice: 1400000,
        Warranty: '2 years'
    },
    {
        inverterBrand: 'FELICTY',
        inverterModel: ' IVEM15048-I',
        acOutputKw: 15,
        dcInputVoltage: 48,
        inverterACInputCurrent: 65,
        inverterDCInputCurrent: 350,
        chargeControlAmps: 240,
        chargeControlV: 500,
        efficiency: 95,
        inverterPrice: 1750000,
        Warranty: '2 years'
    },
    {
        inverterBrand: 'FELICITY',
        inverterModel: 'IVGM50KHP3G01',
        acOutputKw: 50,
        dcInputVoltage: 160,
        inverterACInputCurrent: 80,
        inverterDCInputCurrent: 100,
        chargeControlAmps: 36,
        chargeControlV: 850,
        efficiency: 98,
        inverterPrice: 2830000,
        Warranty: '10 years'
    },
    {
        inverterBrand: 'FIRMAN',
        inverterModel: 'FH11K0110',
        acOutputKw: 11,
        dcInputVoltage: 48,
        inverterACInputCurrent: 60,
        inverterDCInputCurrent: 260,
        chargeControlAmps: 200,
        chargeControlV: 500,
        efficiency: 95,
        inverterPrice: 1100000,
        Warranty: '2 years'
    },
    {
        inverterBrand: 'DEYE',
        inverterModel: 'SUN-5K-SG04LP1-EU-SM2',
        acOutputKw: 5,
        dcInputVoltage: 48,
        inverterACInputCurrent: 35,
        inverterDCInputCurrent: 120,
        chargeControlAmps: 36,
        chargeControlV: 500,
        efficiency: 98,
        inverterPrice: 650000,
        Warranty: 5
    },
    {
        inverterBrand: 'DEYE',
        inverterModel: 'SUN-8K-SG01LP1-EU',
        acOutputKw: 8,
        dcInputVoltage: 48,
        inverterACInputCurrent: 50,
        inverterDCInputCurrent: 190,
        chargeControlAmps: 52,
        chargeControlV: 500,
        efficiency: 97,
        inverterPrice: 950000,
        Warranty: 5
    },
    {
        inverterBrand: 'DEYE',
        inverterModel: 'SUN-12K-SG02LP1-EU-AM3',
        acOutputKw: 12,
        dcInputVoltage: 48,
        inverterACInputCurrent: 52,
        inverterDCInputCurrent: 250,
        chargeControlAmps: 78,
        chargeControlV: 500,
        efficiency: 97,
        inverterPrice: 1400000,
        Warranty: 5
    },
    {
        inverterBrand: 'DEYE',
        inverterModel: 'SUN-20K-SG05LP3-EU-SM2',
        acOutputKw: 20,
        dcInputVoltage: 48,
        inverterACInputCurrent: 70,
        inverterDCInputCurrent: 350,
        chargeControlAmps: 56,
        chargeControlV: 650,
        efficiency: 98,
        inverterPrice: 2300000,
        Warranty: 5
    },
    {
        inverterBrand: 'DEYE',
        inverterModel: 'SUN-6K-SG04LP3-EU',
        acOutputKw: 6,
        dcInputVoltage: 48,
        inverterACInputCurrent: 10,
        inverterDCInputCurrent: 150,
        chargeControlAmps: 26,
        chargeControlV: 650,
        efficiency: 98,
        inverterPrice: 950000,
        Warranty: 5
    },
    {
        inverterBrand: 'DEYE',
        inverterModel: 'SUN-16K-SG01LP1-EU',
        acOutputKw: 16,
        dcInputVoltage: 48,
        inverterACInputCurrent: 70,
        inverterDCInputCurrent: 290,
        chargeControlAmps: 'MPPT controlled by system configuration',
        chargeControlV: 500,
        efficiency: 97,
        inverterPrice: 4100000,
        Warranty: 5
    },
    {
        inverterBrand: 'DEYE',
        inverterModel: 'SUN-30K-SG02HP3-EU-AM3',
        acOutputKw: 30,
        dcInputVoltage: 700,
        inverterACInputCurrent: 50,
        inverterDCInputCurrent: 75,
        chargeControlAmps: 108,
        chargeControlV: 850,
        efficiency: 98,
        inverterPrice: 5500000,
        Warranty: 5
    },
    {
        inverterBrand: 'DEYE',
        inverterModel: 'SUN-50K-SG01HP3-EU-BM4',
        acOutputKw: 50,
        dcInputVoltage: 160,
        inverterACInputCurrent: 83,
        inverterDCInputCurrent: 100,
        chargeControlAmps: 144,
        chargeControlV: 850,
        efficiency: 98,
        inverterPrice: 7500000,
        Warranty: 5
    },
    {
        inverterBrand: 'DEYE',
        inverterModel: 'SUN-10K-SG04LP3-EU-SM2',
        acOutputKw: 10,
        dcInputVoltage: 48,
        inverterACInputCurrent: 22,
        inverterDCInputCurrent: 210,
        chargeControlAmps: 39,
        chargeControlV: 650,
        efficiency: 98,
        inverterPrice: 1150000,
        Warranty: 5
    },
    {
        inverterBrand: 'DEYE',
        inverterModel: 'SUN-3.6K-SG04LP1-EU',
        acOutputKw: 3.6,
        dcInputVoltage: 48,
        inverterACInputCurrent: 35,
        inverterDCInputCurrent: 90,
        chargeControlAmps: 26,
        chargeControlV: 500,
        efficiency: 98,
        inverterPrice: 480000,
        Warranty: 5
    },
    {
        inverterBrand: 'DEYE',
        inverterModel: 'SUN-100K-G03_On_Grid',
        acOutputKw: 100,
        dcInputVoltage: 'N/A (Battery-less On-Grid System)',
        inverterACInputCurrent: 145,
        inverterDCInputCurrent: 40,
        chargeControlAmps: 240,
        chargeControlV: 850,
        efficiency: 99,
        inverterPrice: 5200000,
        Warranty: 5
    },
    {
        inverterBrand: 'DEYE',
        inverterModel: 'SUN-100K-G03_Hybrid',
        acOutputKw: 100,
        dcInputVoltage: 48,
        inverterACInputCurrent: 22.7,
        inverterDCInputCurrent: 275,
        chargeControlAmps: 52,
        chargeControlV: 650,
        efficiency: 98,
        inverterPrice: 1900000,
        Warranty: 5
    },
    {
        inverterBrand: 'DEYE',
        inverterModel: 'SUN-80K-SG02HP3-EU-EM6',
        acOutputKw: 80,
        dcInputVoltage: 800,
        inverterACInputCurrent: 115,
        inverterDCInputCurrent: 150,
        chargeControlAmps: 144,
        chargeControlV: 850,
        efficiency: 98,
        inverterPrice: 920000,
        Warranty: 5
    }
];

export interface CalculationResult {
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
    _batteryBankRaw?: number;
    _dailyEnergyRaw?: number;
    warranty?: string | number;
    efficiency?: number;
}

export function SolarToolbox() {

    const [inputs, setInputs] = useState({
        load: '' as string | number,
        usagehrDay: 8 as string | number,
        psh: 5,
        panelEff: 1.3,
        dod: 0.8,
        sysLoss: 0.8,
        batteryEff: 100
    });

    const [selectedLoadValue, setSelectedLoadValue] = useState<number>(100);


    const [result, setResult] = useState<CalculationResult | null>(null);


    const [isLoading, setIsLoading] = useState(false);
    const [successMsg, setSuccessMsg] = useState<string | null>(null);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const navigate = useNavigate();
    const [showCamera, setShowCamera] = useState(false);


    const videoRef = useRef<HTMLVideoElement>(null);
    const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
    const [scannedDevices, setScannedDevices] = useState<Device[]>([]);
    const [lastScannedResult, setLastScannedResult] = useState<Partial<Device> | null>(null);
    const [showScanResult, setShowScanResult] = useState(false);
    const [isProcessingImage, setIsProcessingImage] = useState(false);
    const [showLoadListModal, setShowLoadListModal] = useState(false);
    const [showQuoteModal, setShowQuoteModal] = useState(false);
    const [quoteFormData, setQuoteFormData] = useState({
        fullName: '',
        contact: '',
        address: ''
    });

    useEffect(() => {

        setInputs(prev => ({ ...prev, batteryEff: selectedLoadValue }));
    }, [selectedLoadValue]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        let val: string | number = value;
        if (id !== 'load' && id !== 'usagehrDay') {
            val = parseFloat(value);
        }

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
    const findBestInverter = (requiredKw: number): { inverter: InverterData, count: number } => {
        // Sort ascending by acOutputKw
        const sorted = [...INVERTER_CATALOG].sort((a, b) => a.acOutputKw - b.acOutputKw);

        // 1. Single Unit Priority
        // Find the smallest single inverter that meets or exceeds the load
        const singleInverter = sorted.find(inv => inv.acOutputKw >= requiredKw);
        if (singleInverter) {
            return { inverter: singleInverter, count: 1 };
        }

        // 2. Alternative Calculation (Multi-Unit Optimization)
        // If the load exceeds every single inverter's capacity:
        // Iterate through each model and see how many units (2-5) would be needed
        let bestMatch: { inverter: InverterData, count: number, totalCap: number } | null = null;

        for (const inverter of sorted) {
            if (inverter.acOutputKw <= 0) continue;

            const count = Math.ceil(requiredKw / inverter.acOutputKw);

            // Constraint: 2 to 5 units (since 1 unit was already checked above)
            if (count >= 2 && count <= 5) {
                const totalCap = count * inverter.acOutputKw;

                // Priority: Smallest total capacity (nearest higher), then fewest units as tie-breaker
                if (!bestMatch || totalCap < bestMatch.totalCap || (totalCap === bestMatch.totalCap && count < bestMatch.count)) {
                    bestMatch = { inverter, count, totalCap };
                }
            }
        }

        if (bestMatch) {
            return { inverter: bestMatch.inverter, count: bestMatch.count };
        }

        // 3. Fallback: If no model covers the load with 5 units, use 5 units of the largest available inverter
        const largest = sorted[sorted.length - 1];
        return { inverter: largest, count: 5 };
    };

    const calculateArray = () => {
        const totalEnergyUsage = parseFloat(String(inputs.load));
        const usageHr = parseFloat(String(inputs.usagehrDay));
        const peakSunHr = Number(inputs.psh);
        const panelFact = Number(inputs.panelEff);
        const systemLosses = Number(inputs.sysLoss);

        if (
            isNaN(totalEnergyUsage) || totalEnergyUsage <= 0 ||
            isNaN(usageHr) || usageHr <= 0 ||
            isNaN(peakSunHr) || peakSunHr <= 0 ||
            isNaN(panelFact) || panelFact <= 0 ||
            isNaN(systemLosses) || systemLosses <= 0
        ) {
            alert("Please enter valid positive numbers for all fields.");
            return null;
        }

        setIsLoading(true);

        setTimeout(() => {
            // Convert load to kWh and adjust for system losses
            const totalEnergyKw = totalEnergyUsage / 1000;

            const totalEnergyWEff = totalEnergyKw / systemLosses;

            // Battery bank sizing (kWh)
            const batteryBank = totalEnergyWEff * (selectedLoadValue / 100) * usageHr;

            let checkingVolt = 12;
            if (batteryBank <= 2) checkingVolt = 12;
            else if (batteryBank <= 5) checkingVolt = 24;
            else if (batteryBank <= 100) checkingVolt = 48;
            else if (batteryBank <= 250) checkingVolt = 48;
            else checkingVolt = 96;

            // Panel for load and panel for battery
            const panelForLoad = totalEnergyWEff;
            const panelForBattery = batteryBank / peakSunHr;

            // Total solar capacity in kW
            const solarCap = panelForBattery + panelForLoad;

            // Daily energy generation in kWh/day
            const dailyEnergyGen = batteryBank + (panelForLoad * peakSunHr);

            const pvWattage = APP_CONFIG.panel.wattage;
            // const pvArrayNos = (solarCap * 1000) / pvWattage;
            const pvArrayNos = (solarCap * 1000) / pvWattage;

            // Recommend Inverter
            const { inverter: recommendedInverter, count: invertNos } = findBestInverter(totalEnergyWEff);

            const newResult: CalculationResult = {
                inverterBrand: recommendedInverter.inverterBrand,
                inverterModel: recommendedInverter.inverterModel,
                inverterPrice: recommendedInverter.inverterPrice * invertNos,
                pvBrand: APP_CONFIG.panel.brand,
                pvModel: APP_CONFIG.panel.model,
                pvWattage,
                batteryBrand: APP_CONFIG.battery.brand,
                batteryModel: APP_CONFIG.battery.model,
                batteryPrice: APP_CONFIG.battery.price,
                totalEnergy: totalEnergyKw.toFixed(1),
                batteryBankSize: batteryBank.toFixed(1),
                dailyEnergyGeneneration: dailyEnergyGen.toFixed(1),
                solarCapacity: solarCap.toFixed(2),
                pvArrayNos: Math.ceil(pvArrayNos),
                inverterNos: invertNos,
                inverterCapacity: (recommendedInverter.acOutputKw * invertNos).toFixed(1),
                checkingVolt,
                selectedLoad: selectedLoadValue,
                totalEnergyWEff: totalEnergyWEff.toFixed(2),
                _batteryBankRaw: batteryBank,
                _dailyEnergyRaw: dailyEnergyGen,
                warranty: recommendedInverter.Warranty,
                efficiency: recommendedInverter.efficiency
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
        setShowQuoteModal(true);
    };

    const submitQuotation = (e: React.FormEvent) => {
        e.preventDefault();
        if (!quoteFormData.fullName || !quoteFormData.contact || !quoteFormData.address) {
            setErrorMsg("Please fill in all fields.");
            setTimeout(() => setErrorMsg(null), 3000);
            return;
        }
        navigate('/quotation', { state: { result, inputs, quoteFormData } });
        setShowQuoteModal(false);
    };

    const resetAll = () => {
        setInputs({
            load: '', usagehrDay: 8, psh: 5, panelEff: 1.3, dod: 0.8, sysLoss: 0.8, batteryEff: 100
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

            <div className="">
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

                    {/* Mode toggle handled by system theme or implement context later */}
                    {/* <div className="toggle">
                        <label className="pill text-gray-500">Light mode (System)</label>
                    </div> */}
                </div>

                <div className="grid md:grid-cols-2 w-full gap-5 grid-cols-1">
                    {/* LEFT: Inputs */}
                    <CalculatorForm
                        inputs={inputs}
                        handleInputChange={handleInputChange}
                        selectedLoadValue={selectedLoadValue}
                        setSelectedLoadValue={setSelectedLoadValue}
                        calculateArray={calculateArray}
                        resetAll={resetAll}
                        handleQuotation={handleQuotation}
                        isLoading={isLoading}
                        successMsg={successMsg}
                        errorMsg={errorMsg}
                        onScanClick={initCamera}
                    />

                    {/* RIGHT: Results */}
                    <div className="card">
                        <h2 className="text-xl mb-4 font-semibold">Results</h2>
                        <div>
                            <div className="out" id="results">
                                <div className="stat">
                                    <div className="k">Load:</div>
                                    <div className="v">{result ? result.totalEnergy + ' Kw' : '—'}</div>
                                </div>
                                <div className="stat">
                                    <div className="k">Battery Sizing:</div>
                                    <div className="v">{result ? result.batteryBankSize + ' KwHr' : '—'}</div>
                                    <div className="checkingVolt">{result ? result.checkingVolt + ' Volt' : ''}</div>
                                </div>
                                <div className="stat">
                                    <div className="k">Inverter System:</div>
                                    <div className="v">{result ? `${result.inverterNos} Nos` : '—'}</div>
                                    <div className="requiredInverterO">
                                        {result ? `${result.inverterBrand} ${result.inverterModel} (${result.inverterCapacity} Kw Total)` : 'MaxPower'}
                                    </div>
                                </div>
                                <div className="stat">
                                    <div className="k">Required PV array:</div>
                                    <div className="v">{result ? result.solarCapacity + ' KW' : '—'}</div>
                                    <div className="pv">Pv_Kwatt Required</div>
                                </div>
                                <div className="stat">
                                    <div className="k">Recommended Panel(W):</div>
                                    <div className="v">{result ? result.pvWattage + 'W' : '—'}</div>
                                    <div className="panelBrand">{result ? result.pvBrand : '--'}</div>
                                </div>
                                <div className="stat">
                                    <div className="k">Panel count (rounded up):</div>
                                    <div className="v">{result ? result.pvArrayNos + ' Nos' : '—'}</div>
                                    <div className="pvN">{result ? result.pvArrayNos + ' Units. ' + result.pvModel : ''}</div>
                                </div>

                                <div className="stat">
                                    <div className="k">Estimated daily energy:</div>
                                    <div className="v">{result ? result.dailyEnergyGeneneration + ' kW/day' : '—'}</div>
                                    <div className="kwD">kW/day</div>
                                </div>

                                <div className="stat">
                                    <div className="k">Status</div>
                                    <div className="v"></div>
                                </div>

                            </div>

                            <div style={{ background: "linear-gradient(135deg, rgba(4, 67, 129, .3), rgba(244, 166, 0, 0.15))   " }} className='w-full p-10 bg-linear from-bg-[#044381], to-bg-[#f4a600] rounded-md mt-5 flex flex-col gap-3'>
                                <hr className='mb-3' />
                                <p className='flex items-center gap-2 flex-wrap'>
                                    <span>For detailed system design and price information please use the</span>
                                    <button className='border-b-2 border-b-blue-500 text-blue-500 cursor-pointer' onClick={handleQuotation}> Quotation button</button>
                                </p>
                                <div>
                                    <hr className='mb-3' />
                                    <p> Developed by <Link to={''} className='text-blue-600 underline'>Abdulrazaq Eniola</Link> </p>
                                </div>
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

            {/* Quotation Request Modal */}
            {showQuoteModal && (
                <div className="modal-overlay" onClick={() => setShowQuoteModal(false)}>
                    <div className="modal-content quote-modal shadow-2xl" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2 className="text-2xl font-bold text-brand">Client Details</h2>
                            <button className="close-btn" onClick={() => setShowQuoteModal(false)}>✕</button>
                        </div>
                        <div className='border-b-2 border-b-amber-500 w-full mb-5' />
                        {/* <p className="text-gray-400 mb-6 font-semibold">Please provide your details to generate your customized solar quotation.</p> */}

                        <form onSubmit={submitQuotation} className="flex flex-col gap-4">
                            <div className="form-group">
                                <label htmlFor="fullName" className="block text-sm font-medium text-gray-300 mb-1">Full Name</label>
                                <input
                                    type="text"
                                    id="fullName"
                                    placeholder="e.g. Emeka Ayomide Musa"
                                    value={quoteFormData.fullName}
                                    onChange={(e) => setQuoteFormData({ ...quoteFormData, fullName: e.target.value })}
                                    required
                                    className="w-full p-3 rounded-lg bg-[#0a1e32] border border-[#6ad1ff4d] text-white focus:outline-none focus:border-[#6ad1ff]"
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="contact" className="block text-sm font-medium text-gray-300 mb-1">Contact (Phone/Email)</label>
                                <input
                                    type="text"
                                    id="contact"
                                    placeholder="e.g. +234... or email@example.com"
                                    value={quoteFormData.contact}
                                    onChange={(e) => setQuoteFormData({ ...quoteFormData, contact: e.target.value })}
                                    required
                                    className="w-full p-3 rounded-lg bg-[#0a1e32] border border-[#6ad1ff4d] text-white focus:outline-none focus:border-[#6ad1ff]"
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="address" className="block text-sm font-medium text-gray-300 mb-1">Installation Address</label>
                                <input
                                    type="text"
                                    id="address"
                                    placeholder="e.g. No 1, Solar Way, Abuja"
                                    value={quoteFormData.address}
                                    onChange={(e) => setQuoteFormData({ ...quoteFormData, address: e.target.value })}
                                    required
                                    className="w-full p-3 rounded-lg bg-[#0a1e32] border border-[#6ad1ff4d] text-white focus:outline-none focus:border-[#6ad1ff]"
                                />
                            </div>

                            <button type="submit" className="submit-quote-btn mt-4 bg-red-500">
                                SUBMIT
                            </button>
                        </form>
                    </div>
                </div>
            )}


        </div>
    );
}


export default SolarToolbox;
