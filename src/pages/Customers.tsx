import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    Search, Plus, Filter, MoreHorizontal, User, Zap, Battery, Sun, FileText,
    Eye, Edit, Trash2, Download, X, CheckCircle2
} from "lucide-react";
// @ts-ignore
import html2pdf from "html2pdf.js";

export function Customers() {
    const [customers, setCustomers] = useState([
        {
            id: "CUST-001",
            name: "John Smith",
            contact: "john.s@example.com / +234 801 234 5678",
            solarCap: "5.45 kW",
            inverter: "DEYE 5000TL",
            batterySize: "10.0 kWh",
            panels: "9 Units",
            quoteRef: "Q-8421",
            totalInvestment: "₦2,450,000",
            status: "Active",
            fullSpecs: {
                pvBrand: "Jinko Solar",
                pvModel: "Tiger Pro 600W",
                pvNos: 9,
                invBrand: "DEYE",
                invModel: "SUN-5K-SG04LP1",
                invCap: "5.0 kW",
                batBrand: "Felicity",
                batSize: "10.0 kWh",
                mounting: "Auto-Scaled Roof Mount",
                cabling: "4mm² PV / 6mm² AC",
                protection: "125A DC / 32A AC",
                installation: "Standard Commissioning"
            }
        },
        {
            id: "CUST-002",
            name: "Sarah Johnson",
            contact: "s.johnson@example.com / +234 802 987 6543",
            solarCap: "10.20 kW",
            inverter: "Growatt 10000TL",
            batterySize: "20.0 kWh",
            panels: "18 Units",
            quoteRef: "Q-3312",
            totalInvestment: "₦4,800,000",
            status: "Active",
            fullSpecs: {
                pvBrand: "Jinko Solar",
                pvModel: "Tiger Pro 600W",
                pvNos: 18,
                invBrand: "Growatt",
                invModel: "MOD 10KTL3-X",
                invCap: "10.0 kW",
                batBrand: "LG Chem",
                batSize: "20.0 kWh",
                mounting: "Ground Mount Structure",
                cabling: "6mm² PV / 10mm² AC",
                protection: "250A DC / 50A AC",
                installation: "Custom Industrial"
            }
        }
    ]);

    const [openMenuId, setOpenMenuId] = useState<string | null>(null);
    const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
    const [isViewOpen, setIsViewOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [isDownloading, setIsDownloading] = useState<string | null>(null);

    const toggleMenu = (id: string) => {
        setOpenMenuId(openMenuId === id ? null : id);
    };

    const handleAction = (action: string, customer: any) => {
        setSelectedCustomer(customer);
        setOpenMenuId(null);

        if (action === 'view') setIsViewOpen(true);
        if (action === 'delete') setIsDeleteOpen(true);
        if (action === 'download') {
            downloadPdf(customer);
        }
    };

    const downloadPdf = async (customer: any) => {
        try {
            setIsDownloading(customer.id);
            const element = document.getElementById(`pdf-content-${customer.id}`);
            if (!element) {
                console.error("PDF element not found:", `pdf-content-${customer.id}`);
                return;
            }

            const opt = {
                margin: [10, 10, 10, 10] as [number, number, number, number],
                filename: `Quotation_${customer.name.replace(/\s+/g, '_')}_${customer.quoteRef}.pdf`,
                image: { type: 'jpeg', quality: 0.98 },
                html2canvas: {
                    scale: 2,
                    useCORS: true,
                    letterRendering: true,
                    allowTaint: true,
                    windowWidth: 1200
                },
                jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
            };

            // @ts-ignore
            await html2pdf().from(element).set(opt).save();
        } catch (error) {
            console.error("PDF Error:", error);
            alert("Failed to generate PDF. Please try again.");
        } finally {
            setIsDownloading(null);
        }
    };

    const confirmDelete = () => {
        setCustomers(customers.filter(c => c.id !== selectedCustomer.id));
        setIsDeleteOpen(false);
        setSelectedCustomer(null);
    };

    return (
        <div className="space-y-8 py-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-white">Project Customers</h1>
                    <p className="text-muted-foreground mt-2">Detailed engineering results and quotation history for all clients.</p>
                </div>
                <Button className="bg-engineering-blue hover:bg-engineering-blue/90 text-white">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Customer
                </Button>
            </div>

            <Card className="bg-card/50 border-border backdrop-blur-sm relative z-0">
                <CardHeader className="pb-0">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="relative w-full sm:w-96">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <input
                                type="text"
                                placeholder="Search customers or quote refs..."
                                className="w-full pl-10 pr-4 py-2 bg-[#111521] border border-border rounded-md text-sm text-white focus:outline-none focus:ring-1 focus:ring-engineering-blue transition-all"
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm" className="border-border text-muted-foreground hover:text-white hover:bg-white/5">
                                <Filter className="h-4 w-4 mr-2" />
                                Filter
                            </Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="pt-6">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse min-w-[1000px]">
                            <thead>
                                <tr className="border-b border-border text-[10px] font-bold uppercase text-muted-foreground tracking-wider">
                                    <th className="px-4 py-3">Customer & Contact</th>
                                    <th className="px-4 py-3">System Specs</th>
                                    <th className="px-4 py-3">Component Detail</th>
                                    <th className="px-4 py-3">Quotation Info</th>
                                    <th className="px-4 py-3">Status</th>
                                    <th className="px-4 py-3 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {customers.map((cust) => (
                                    <tr key={cust.id} className="group hover:bg-white/5 transition-colors">
                                        <td className="px-4 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="h-9 w-9 rounded-full bg-engineering-blue/10 flex items-center justify-center flex-shrink-0">
                                                    <User className="h-5 w-5 text-engineering-blue" />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-semibold text-white">{cust.name}</p>
                                                    <p className="text-[11px] text-muted-foreground">{cust.contact}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-4">
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-1.5 text-xs text-white">
                                                    <Sun className="h-3 w-3 text-engineering-orange" />
                                                    <span>{cust.solarCap}</span>
                                                </div>
                                                <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                                                    <Battery className="h-3 w-3 text-engineering-green" />
                                                    <span>{cust.batterySize}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-4">
                                            <div className="space-y-1 text-[11px]">
                                                <div className="flex items-center gap-1.5 text-white">
                                                    <Zap className="h-3 w-3 text-engineering-blue" />
                                                    <span>{cust.inverter}</span>
                                                </div>
                                                <div className="text-muted-foreground px-4">
                                                    {cust.panels}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-4">
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-1.5 text-xs font-medium text-white">
                                                    <FileText className="h-3 w-3 text-muted-foreground" />
                                                    <span>{cust.quoteRef}</span>
                                                </div>
                                                <div className="text-xs text-engineering-blue font-bold">
                                                    {cust.totalInvestment}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-4">
                                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${cust.status === 'Active' ? 'bg-engineering-green/20 text-engineering-green' :
                                                cust.status === 'Maintenance' ? 'bg-engineering-orange/20 text-engineering-orange' :
                                                    'bg-engineering-blue/20 text-engineering-blue'
                                                }`}>
                                                {cust.status}
                                            </span>
                                        </td>
                                        <td className="px-4 py-4 text-right">
                                            <div className="relative inline-block text-left">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 text-muted-foreground hover:text-white"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        toggleMenu(cust.id);
                                                    }}
                                                >
                                                    {isDownloading === cust.id ? (
                                                        <div className="h-4 w-4 border-2 border-engineering-blue border-t-transparent animate-spin rounded-full"></div>
                                                    ) : (
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    )}
                                                </Button>

                                                {openMenuId === cust.id && (
                                                    <>
                                                        <div
                                                            className="fixed inset-0 z-40"
                                                            onClick={() => setOpenMenuId(null)}
                                                        ></div>
                                                        <div className="absolute right-0 mt-2 w-48 rounded-md bg-[#111521] border border-border shadow-2xl z-50 overflow-hidden ring-1 ring-black ring-opacity-5">
                                                            <div className="py-1">
                                                                <button
                                                                    onClick={() => handleAction('view', cust)}
                                                                    className="flex items-center w-full px-4 py-2 text-sm text-gray-300 hover:bg-white/10 hover:text-white transition-colors"
                                                                >
                                                                    <Eye className="h-4 w-4 mr-3 text-engineering-blue" />
                                                                    View Details
                                                                </button>
                                                                <button
                                                                    onClick={() => handleAction('download', cust)}
                                                                    disabled={isDownloading !== null}
                                                                    className="flex items-center w-full px-4 py-2 text-sm text-gray-300 hover:bg-white/10 hover:text-white transition-colors disabled:opacity-50"
                                                                >
                                                                    <Download className="h-4 w-4 mr-3 text-engineering-green" />
                                                                    {isDownloading === cust.id ? 'Generating...' : 'Download PDF'}
                                                                </button>
                                                                <button
                                                                    className="flex items-center w-full px-4 py-2 text-sm text-gray-300 hover:bg-white/10 hover:text-white transition-colors"
                                                                >
                                                                    <Edit className="h-4 w-4 mr-3 text-engineering-orange" />
                                                                    Edit System
                                                                </button>
                                                                <div className="border-t border-border my-1"></div>
                                                                <button
                                                                    onClick={() => handleAction('delete', cust)}
                                                                    className="flex items-center w-full px-4 py-2 text-sm text-engineering-red hover:bg-engineering-red/10 transition-colors"
                                                                >
                                                                    <Trash2 className="h-4 w-4 mr-3" />
                                                                    Delete Client
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>

            {/* Hidden PDF Templates - Multi-page design matching QuotationPreview */}
            <div className="hidden-pdf-container" style={{ position: 'fixed', top: '-10000px', left: 0, opacity: 0, pointerEvents: 'none', zIndex: -1 }}>
                {customers.map(cust => (
                    <div key={`pdf-${cust.id}`} id={`pdf-content-${cust.id}`} style={{ width: '794px', backgroundColor: '#ffffff', color: '#000000', fontFamily: 'sans-serif' }}>

                        {/* PAGE 1: EXECUTIVE SUMMARY */}
                        <div className="pdf-page" style={{ padding: '40px', minHeight: '1123px', boxSizing: 'border-box', pageBreakAfter: 'always', backgroundColor: '#f0f4ff' }}>
                            {/* Hero Header */}
                            <div style={{ position: 'relative', height: '160px', backgroundColor: '#0e5b8a', marginBottom: '30px', borderRadius: '8px', overflow: 'hidden' }}>
                                <div style={{ position: 'absolute', left: '20px', top: '20px', backgroundColor: '#ffffff', padding: '15px', borderRadius: '8px', display: 'flex', gap: '15px', alignItems: 'center', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>
                                    <div style={{ width: '45px', height: '45px', backgroundColor: '#044381', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <div style={{ color: '#f4a600', fontSize: '24px', fontWeight: 'bold' }}>⚡</div>
                                    </div>
                                    <div>
                                        <div style={{ fontWeight: 800, fontSize: '18px', color: '#044381', lineHeight: '1.2' }}>A.E<br />RENEWABLE LTD</div>
                                        <div style={{ fontSize: '10px', color: '#f4a600', fontWeight: 'bold', marginTop: '4px' }}>POWERING YOUR FUTURE WITH SUN</div>
                                    </div>
                                </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '30px' }}>
                                {/* Left Side */}
                                <div>
                                    <h3 style={{ display: 'inline-block', padding: '4px 20px', margin: '0 0 15px 0', fontSize: '18px', backgroundColor: '#044381', color: '#ffffff', borderRadius: '4px' }}>Executive Summary</h3>
                                    <p style={{ fontSize: '13px', lineHeight: '1.6', color: '#1f2937' }}>
                                        <strong>Dear {cust.name},</strong><br />
                                        Thank you for considering A.E RENEWABLE LTD for your solar energy needs. Based on the information provided, we have designed a customized solar power system to meet your energy requirements efficiently and sustainably.
                                    </p>

                                    <div style={{ marginTop: '25px' }}>
                                        <h2 style={{ padding: '4px 0', textAlign: 'center', fontSize: '16px', backgroundColor: '#044381', color: '#ffffff', borderRadius: '4px', margin: '0 0 10px 0' }}>SYSTEM DESIGN & SPECIFICATIONS</h2>
                                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
                                            <thead>
                                                <tr style={{ backgroundColor: '#f8fafc' }}>
                                                    <th style={{ padding: '10px', border: '1px solid #e2e8f0', textAlign: 'left', color: '#044381' }}>Item</th>
                                                    <th style={{ padding: '10px', border: '1px solid #e2e8f0', textAlign: 'left', color: '#044381' }}>Description</th>
                                                    <th style={{ padding: '10px', border: '1px solid #e2e8f0', textAlign: 'left', color: '#044381' }}>Rated</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <td style={{ padding: '10px', border: '1px solid #e2e8f0' }}>Solar Panels</td>
                                                    <td style={{ padding: '10px', border: '1px solid #e2e8f0' }}>{cust.fullSpecs.pvBrand} {cust.fullSpecs.pvModel} ({cust.fullSpecs.pvNos} units)</td>
                                                    <td style={{ padding: '10px', border: '1px solid #e2e8f0' }}>{cust.solarCap}</td>
                                                </tr>
                                                <tr>
                                                    <td style={{ padding: '10px', border: '1px solid #e2e8f0' }}>Inverter</td>
                                                    <td style={{ padding: '10px', border: '1px solid #e2e8f0' }}>{cust.fullSpecs.invBrand} {cust.fullSpecs.invModel}</td>
                                                    <td style={{ padding: '10px', border: '1px solid #e2e8f0' }}>{cust.fullSpecs.invCap}</td>
                                                </tr>
                                                <tr>
                                                    <td style={{ padding: '10px', border: '1px solid #e2e8f0' }}>Batteries</td>
                                                    <td style={{ padding: '10px', border: '1px solid #e2e8f0' }}>{cust.fullSpecs.batBrand} Energy Storage</td>
                                                    <td style={{ padding: '10px', border: '1px solid #e2e8f0' }}>{cust.fullSpecs.batSize}</td>
                                                </tr>
                                                <tr>
                                                    <td style={{ padding: '10px', border: '1px solid #e2e8f0' }}>Mounting</td>
                                                    <td style={{ padding: '10px', border: '1px solid #e2e8f0' }}>{cust.fullSpecs.mounting}</td>
                                                    <td style={{ padding: '10px', border: '1px solid #e2e8f0' }}>Hardware</td>
                                                </tr>
                                                <tr>
                                                    <td style={{ padding: '10px', border: '1px solid #e2e8f0' }}>Cabling</td>
                                                    <td style={{ padding: '10px', border: '1px solid #e2e8f0' }}>{cust.fullSpecs.cabling}</td>
                                                    <td style={{ padding: '10px', border: '1px solid #e2e8f0' }}>Full gauge</td>
                                                </tr>
                                                <tr>
                                                    <td style={{ padding: '10px', border: '1px solid #e2e8f0' }}>Protection</td>
                                                    <td style={{ padding: '10px', border: '1px solid #e2e8f0' }}>{cust.fullSpecs.protection}</td>
                                                    <td style={{ padding: '10px', border: '1px solid #e2e8f0' }}>Safety Systems</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>

                                {/* Right Side */}
                                <div>
                                    <div style={{ fontSize: '11px', color: '#64748b', marginBottom: '20px', textAlign: 'right' }}>
                                        Date: {new Date().toLocaleDateString()} • Ref: {cust.quoteRef}
                                    </div>

                                    <div style={{ padding: '15px', backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #e2e8f0', marginBottom: '20px' }}>
                                        <h4 style={{ margin: '0 0 10px 0', fontSize: '14px', color: '#044381' }}>SYSTEM ANALYSIS</h4>
                                        <ul style={{ margin: 0, padding: '0 0 0 15px', fontSize: '12px', lineHeight: '1.8' }}>
                                            <li>Design Capacity: <b>{cust.solarCap}</b></li>
                                            <li>Storage Bank: <b>{cust.batterySize}</b></li>
                                            <li>CO₂ Saved: ~1,250 kg/year</li>
                                        </ul>
                                    </div>

                                    <div style={{ padding: '20px', backgroundColor: '#ffffff', borderRadius: '20px', border: '2px dashed #16a34a', textAlign: 'center' }}>
                                        <h2 style={{ color: '#16a34a', margin: '0 0 5px 0', fontSize: '18px' }}>Total Investment</h2>
                                        <div style={{ fontSize: '32px', fontWeight: 900, color: '#16a34a', margin: '10px 0' }}>{cust.totalInvestment}</div>
                                        <div style={{ fontSize: '12px', color: '#16a34a', fontWeight: 'bold' }}>
                                            {cust.fullSpecs.invCap} Power | {cust.fullSpecs.batSize} Bank
                                        </div>

                                        <div style={{ marginTop: '15px', padding: '10px', backgroundColor: '#044381', borderRadius: '8px', color: '#ffffff' }}>
                                            <div style={{ fontSize: '24px', fontWeight: 900, color: '#f4a600' }}>5</div>
                                            <div style={{ fontSize: '10px', fontWeight: 'bold' }}>YEARS WARRANTY</div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div style={{ marginTop: 'Auto', paddingTop: '30px', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#64748b' }}>
                                <div>© 2024 A.E RENEWABLE LTD</div>
                                <div>www.aerenewable.com</div>
                            </div>
                        </div>

                        {/* PAGE 2: COMPANY PROFILE */}
                        <div className="pdf-page" style={{ padding: '60px', minHeight: '1123px', boxSizing: 'border-box', pageBreakAfter: 'always', backgroundColor: '#ffffff' }}>
                            <h2 style={{ fontSize: '28px', color: '#044381', borderBottom: '3px solid #f4a600', paddingBottom: '10px', marginBottom: '20px' }}>A.E RENEWABLE LTD</h2>
                            <h3 style={{ fontSize: '20px', color: '#044381', marginBottom: '15px' }}>Company Overview & Identity</h3>
                            <p style={{ fontSize: '14px', lineHeight: '1.6', color: '#374151', marginBottom: '20px' }}>
                                A.E RENEWABLE LTD is a comprehensive renewable energy and electrical engineering company in Nigeria, delivering solar installations, smart power systems, electrical works, and energy-efficient solutions for homes, offices, and industrial facilities.
                            </p>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px' }}>
                                <div>
                                    <h3 style={{ color: '#16a34a', fontSize: '16px', marginBottom: '10px' }}>Our Mission</h3>
                                    <p style={{ fontSize: '13px', lineHeight: '1.6', color: '#4b5563' }}>
                                        To deliver clean, reliable, and affordable energy solutions while continuously innovating and enhancing performance for every client and project.
                                    </p>

                                    <h3 style={{ color: '#16a34a', fontSize: '16px', marginBottom: '10px', marginTop: '20px' }}>Core Values</h3>
                                    <ul style={{ fontSize: '13px', lineHeight: '1.8', color: '#4b5563', paddingLeft: '20px' }}>
                                        <li>Innovation & Excellence</li>
                                        <li>Integrity & Transparency</li>
                                        <li>Safety & Quality First</li>
                                        <li>Customer Satisfaction</li>
                                    </ul>
                                </div>
                                <div>
                                    <h3 style={{ color: '#044381', fontSize: '16px', marginBottom: '15px' }}>Services & Capabilities</h3>
                                    {[
                                        { t: 'Solar Home & Office', d: 'Hybrid/Off-grid systems with smart monitoring.' },
                                        { t: 'Mini-Grid Power', d: 'Community and industrial clusters electrification.' },
                                        { t: 'Electrical Installations', d: 'Professional wiring and surge protection.' },
                                        { t: 'Smart Automation', d: 'IoT-based energy and facility management.' }
                                    ].map((s, i) => (
                                        <div key={i} style={{ padding: '10px', border: '1px solid #f1f5f9', backgroundColor: '#f8fafc', borderRadius: '8px', marginBottom: '10px' }}>
                                            <div style={{ fontWeight: 'bold', fontSize: '12px', color: '#16a34a' }}>{s.t}</div>
                                            <div style={{ fontSize: '11px', color: '#64748b' }}>{s.d}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div style={{ marginTop: '40px', padding: '20px', backgroundColor: '#f0f9ff', borderRadius: '12px', borderLeft: '6px solid #044381' }}>
                                <h4 style={{ color: '#044381', margin: '0 0 10px 0' }}>Why Clients Trust Us</h4>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', fontSize: '12px', color: '#334155' }}>
                                    <div>✓ High-quality materials</div>
                                    <div>✓ Certified engineers</div>
                                    <div>✓ Transparent pricing</div>
                                    <div>✓ 24/7 Support</div>
                                </div>
                            </div>
                        </div>

                        {/* PAGE 3: BANK DETAILS */}
                        <div className="pdf-page" style={{ padding: '60px', minHeight: '1123px', boxSizing: 'border-box', backgroundColor: '#ffffff', display: 'flex', flexDirection: 'column' }}>
                            <h3 style={{ fontSize: '24px', color: '#044381', borderBottom: '3px solid #f4a600', paddingBottom: '10px', marginBottom: '30px' }}>Bank / Account Details</h3>

                            <div style={{ backgroundColor: '#f8fafc', padding: '30px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
                                    <div>
                                        <div style={{ fontSize: '13px', color: '#64748b', fontWeight: 'bold' }}>Account Name:</div>
                                        <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#0f172a', marginTop: '5px' }}>A.E RENEWABLE LTD</div>
                                    </div>
                                    <div>
                                        <div style={{ fontSize: '13px', color: '#64748b', fontWeight: 'bold' }}>Account Number:</div>
                                        <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#0f172a', marginTop: '5px', letterSpacing: '1px' }}>0123456789</div>
                                    </div>
                                    <div>
                                        <div style={{ fontSize: '13px', color: '#64748b', fontWeight: 'bold' }}>Bank Name:</div>
                                        <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#0f172a', marginTop: '5px' }}>Example Bank PLC</div>
                                    </div>
                                    <div>
                                        <div style={{ fontSize: '13px', color: '#64748b', fontWeight: 'bold' }}>Branch:</div>
                                        <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#0f172a', marginTop: '5px' }}>Abuja Central</div>
                                    </div>
                                </div>
                            </div>

                            <p style={{ marginTop: '40px', fontSize: '14px', color: '#64748b', fontStyle: 'italic', lineHeight: '1.6' }}>
                                Please make payments to the account above. For assistance, call <span style={{ color: '#16a34a', fontWeight: 'bold' }}>+234 813 361 5132</span>.
                                Quotation valid for 30 days from issued date.
                            </p>

                            <div style={{ marginTop: 'auto', backgroundColor: '#044381', color: '#ffffff', padding: '30px', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <div style={{ fontWeight: 800, fontSize: '16px' }}>A.E RENEWABLE LTD</div>
                                    <div style={{ fontSize: '11px', opacity: 0.8, marginTop: '4px' }}>Sustainable Solar Engineering Solutions</div>
                                </div>
                                <div style={{ textAlign: 'right', fontSize: '11px' }}>
                                    <div>Abuja, Nigeria</div>
                                    <div style={{ color: '#f4a600', fontWeight: 'bold', marginTop: '4px' }}>www.aerenewable.com</div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* View Modal */}
            {isViewOpen && selectedCustomer && (
                <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 sm:p-6 lg:p-8">
                    <div className="fixed inset-0 bg-black/70 backdrop-blur-md" onClick={() => setIsViewOpen(false)}></div>
                    <Card className="w-full max-w-2xl bg-[#0a0d14] border-engineering-blue/30 shadow-[0_0_50px_rgba(0,110,255,0.1)] relative z-[1001] overflow-hidden border">
                        <CardHeader className="bg-[#111521]/80 border-b border-white/5 flex flex-row items-center justify-between py-5 px-6">
                            <div className="flex items-center gap-4">
                                <div className="h-12 w-12 rounded-xl bg-engineering-blue/10 border border-engineering-blue/20 flex items-center justify-center shadow-inner">
                                    <User className="h-7 w-7 text-engineering-blue" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-black text-white tracking-tight leading-none uppercase">{selectedCustomer.name}</h2>
                                    <p className="text-[10px] text-muted-foreground mt-2 font-mono uppercase tracking-widest">{selectedCustomer.id} | QUOTE REF: {selectedCustomer.quoteRef}</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsViewOpen(false)}
                                className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all border border-white/5"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </CardHeader>
                        <CardContent className="p-0 overflow-y-auto max-h-[75vh]">
                            <div className="p-6 space-y-8">
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 font-sans">
                                    <div className="space-y-6">
                                        <div>
                                            <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] mb-2 block text-blue-400/80">Account Connection</label>
                                            <p className="text-base text-white/90 font-bold leading-relaxed">{selectedCustomer.contact.split(' / ')[0]}</p>
                                            <p className="text-sm text-engineering-blue font-black mt-1">{selectedCustomer.contact.split(' / ')[1]}</p>
                                        </div>
                                        <div className="flex gap-4 items-center pt-2">
                                            <div>
                                                <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] mb-2 block">System Status</label>
                                                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest inline-flex items-center gap-2 ${selectedCustomer.status === 'Active' ? 'bg-engineering-green/10 text-engineering-green border border-engineering-green/20' :
                                                    selectedCustomer.status === 'Maintenance' ? 'bg-engineering-orange/10 text-engineering-orange border border-engineering-orange/20' :
                                                        'bg-engineering-blue/10 text-engineering-blue border border-engineering-blue/20'
                                                    }`}>
                                                    <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${selectedCustomer.status === 'Active' ? 'bg-engineering-green' :
                                                        selectedCustomer.status === 'Maintenance' ? 'bg-engineering-orange' : 'bg-engineering-blue'
                                                        }`}></div>
                                                    {selectedCustomer.status}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-[#111521] p-6 rounded-2xl border border-white/5 shadow-2xl relative overflow-hidden group">
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-engineering-blue/5 rounded-full -mr-16 -mt-16 blur-3xl group-hover:bg-engineering-blue/10 transition-colors"></div>
                                        <h3 className="text-xs font-black text-white uppercase tracking-[0.2em] flex items-center gap-3 mb-6 border-b border-white/5 pb-3">
                                            <Zap className="h-4 w-4 text-engineering-blue" />
                                            Engineering Metrics
                                        </h3>
                                        <div className="grid grid-cols-2 gap-y-4 gap-x-6">
                                            <div className="space-y-1">
                                                <span className="text-[9px] text-muted-foreground font-bold uppercase tracking-widest block">Solar Generation</span>
                                                <p className="text-lg font-black text-white leading-none">{selectedCustomer.solarCap}</p>
                                            </div>
                                            <div className="space-y-1">
                                                <span className="text-[9px] text-muted-foreground font-bold uppercase tracking-widest block">Storage Bank</span>
                                                <p className="text-lg font-black text-white leading-none">{selectedCustomer.batterySize}</p>
                                            </div>
                                            <div className="space-y-1">
                                                <span className="text-[9px] text-muted-foreground font-bold uppercase tracking-widest block">Inverter Peak</span>
                                                <p className="text-lg font-black text-white leading-none">{selectedCustomer.fullSpecs.invCap}</p>
                                            </div>
                                            <div className="space-y-1">
                                                <span className="text-[9px] text-muted-foreground font-bold uppercase tracking-widest block">Module Count</span>
                                                <p className="text-lg font-black text-white leading-none">{selectedCustomer.panels}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <h3 className="text-xs font-black text-white uppercase tracking-[0.2em] flex items-center gap-3">
                                        <FileText className="h-4 w-4 text-muted-foreground" />
                                        Quotation Detail
                                    </h3>
                                    <div className="rounded-xl border border-white/5 overflow-hidden bg-[#111521]/30">
                                        <table className="w-full text-left border-collapse">
                                            <thead>
                                                <tr className="bg-[#111521]/80 text-[9px] font-black uppercase text-muted-foreground/60 border-b border-white/5">
                                                    <th className="px-5 py-4 tracking-widest">Engineering Component</th>
                                                    <th className="px-5 py-4 tracking-widest">Model Specification</th>
                                                    <th className="px-5 py-4 text-right tracking-widest">Performance</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-white/[0.03]">
                                                <tr className="text-xs text-white/80 hover:bg-white/[0.02] transition-colors">
                                                    <td className="px-5 py-4 font-bold text-white">Solar Array</td>
                                                    <td className="px-5 py-4 text-muted-foreground">{selectedCustomer.fullSpecs.pvBrand} {selectedCustomer.fullSpecs.pvModel}</td>
                                                    <td className="px-5 py-4 text-right font-black text-engineering-blue">{selectedCustomer.solarCap}</td>
                                                </tr>
                                                <tr className="text-xs text-white/80 hover:bg-white/[0.02] transition-colors">
                                                    <td className="px-5 py-4 font-bold text-white">Inverter</td>
                                                    <td className="px-5 py-4 text-muted-foreground">{selectedCustomer.fullSpecs.invBrand} {selectedCustomer.fullSpecs.invModel}</td>
                                                    <td className="px-5 py-4 text-right font-black text-engineering-blue">{selectedCustomer.fullSpecs.invCap}</td>
                                                </tr>
                                                <tr className="text-xs text-white/80 hover:bg-white/[0.02] transition-colors">
                                                    <td className="px-5 py-4 font-bold text-white">Storage</td>
                                                    <td className="px-5 py-4 text-muted-foreground">{selectedCustomer.fullSpecs.batBrand} Lithium Series</td>
                                                    <td className="px-5 py-4 text-right font-black text-engineering-blue">{selectedCustomer.batterySize}</td>
                                                </tr>
                                                <tr className="text-xs text-white/80 hover:bg-white/[0.02] transition-colors">
                                                    <td className="px-5 py-4 font-bold text-white">Infrastructure</td>
                                                    <td className="px-5 py-4 text-muted-foreground">{selectedCustomer.fullSpecs.mounting}</td>
                                                    <td className="px-5 py-4 text-right uppercase text-[9px] font-black opacity-50">Custom</td>
                                                </tr>
                                                <tr className="text-xs text-white/80 hover:bg-white/[0.02] transition-colors">
                                                    <td className="px-5 py-4 font-bold text-white">Safety</td>
                                                    <td className="px-5 py-4 text-muted-foreground">{selectedCustomer.fullSpecs.protection} Protection</td>
                                                    <td className="px-5 py-4 text-right uppercase text-[9px] font-black opacity-50">Rated</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>

                                <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-6">
                                    <div className="flex items-center gap-8 w-full sm:w-auto">
                                        <div>
                                            <span className="text-[9px] text-muted-foreground font-black uppercase tracking-[0.2em] block mb-1">Contract Total</span>
                                            <span className="text-3xl font-black text-white leading-none tracking-tighter">{selectedCustomer.totalInvestment}</span>
                                        </div>
                                        <div className="h-10 w-px bg-white/5"></div>
                                        <div className="text-engineering-green">
                                            <CheckCircle2 className="h-8 w-8 opacity-50" />
                                        </div>
                                    </div>
                                    <Button
                                        onClick={() => downloadPdf(selectedCustomer)}
                                        disabled={isDownloading !== null}
                                        className="w-full sm:w-auto px-8 bg-engineering-green hover:bg-engineering-green/90 text-white font-black uppercase tracking-widest py-6 rounded-xl shadow-[0_10px_30px_rgba(22,163,74,0.2)] transition-all hover:translate-y-[-2px] active:translate-y-[0px] disabled:opacity-50"
                                    >
                                        {isDownloading === selectedCustomer.id ? (
                                            <div className="flex items-center gap-3">
                                                <div className="h-4 w-4 border-2 border-white border-t-transparent animate-spin rounded-full"></div>
                                                Capturing...
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-3">
                                                <Download className="h-5 w-5" />
                                                Export PDF
                                            </div>
                                        )}
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {isDeleteOpen && selectedCustomer && (
                <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4">
                    <div className="fixed inset-0 bg-black/80 backdrop-blur-md" onClick={() => setIsDeleteOpen(false)}></div>
                    <Card className="w-full max-w-sm bg-[#0a0d14] border-engineering-red/30 shadow-2xl relative z-[2001] border">
                        <CardHeader className="text-center pt-10">
                            <div className="mx-auto h-16 w-16 rounded-2xl bg-engineering-red/10 border border-engineering-red/20 flex items-center justify-center mb-6 shadow-inner">
                                <Trash2 className="h-8 w-8 text-engineering-red" />
                            </div>
                            <h2 className="text-2xl font-black text-white uppercase tracking-tight">Delete Client?</h2>
                            <p className="text-sm text-muted-foreground mt-4 leading-relaxed font-sans px-4">
                                Are you sure you want to remove <strong className="text-white">{selectedCustomer.name}</strong>? This will permanently erase their engineering records.
                            </p>
                        </CardHeader>
                        <CardContent className="flex flex-col gap-3 pt-8 pb-10 px-8">
                            <Button
                                className="w-full bg-engineering-red hover:bg-engineering-red/90 text-white font-black uppercase tracking-widest py-6 rounded-xl"
                                onClick={confirmDelete}
                            >
                                Confirm Deletion
                            </Button>
                            <Button
                                variant="ghost"
                                className="w-full text-muted-foreground hover:text-white font-bold uppercase tracking-widest py-4"
                                onClick={() => setIsDeleteOpen(false)}
                            >
                                Cancel Action
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    );
}
