import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    Search, Plus, Filter, MoreHorizontal, User, Zap, Battery, Sun, FileText,
    Eye, Edit, Trash2, Download, X, CheckCircle2, Loader2, AlertCircle
} from "lucide-react";
// @ts-ignore
import html2pdf from "html2pdf.js";
import api from "@/lib/api";

// Import real quotation components for exact replica
import { QuotationExecutiveSummary } from "@/components/toolbox/quotation/QuotationExecutiveSummary";
import { QuotationCompanyProfile } from "@/components/toolbox/quotation/QuotationCompanyProfile";
import { QuotationBankDetails } from "@/components/toolbox/quotation/QuotationBankDetails";
import "@/components/toolbox/SolarToolbox.css";
import { type CalculationResult } from "@/components/toolbox/SolarToolbox";

// Map an API quotation row to the customer display shape
function mapQuotationToCustomer(q: any) {
    const results = q.results || {};
    const inputs = q.inputs || {};
    const pvNos = results.pvArrayNos || inputs.pvArrayNos || 0;
    const invCap = results.inverterCapacity || inputs.inverterCapacity || "0";
    const batSize = results.batteryBankSize || inputs.batteryBankSize || "0";
    const solarCap = results.solarCapacity || inputs.solarCapacity || "0";
    const pvBrand = results.pvBrand || inputs.pvBrand || "";
    const pvModel = results.pvModel || inputs.pvModel || "";
    const invBrand = results.inverterBrand || inputs.inverterBrand || "";
    const invModel = results.inverterModel || inputs.inverterModel || "";
    const batBrand = results.batteryBrand || inputs.batteryBrand || "";
    const mounting = results.mountingDescription || inputs.mountingDescription || "—";
    const cabling = results.cablingDescription || inputs.cablingDescription || "—";
    const protection = results.protectionDescription || inputs.protectionDescription || "—";
    const installation = results.installationDescription || inputs.installationDescription || "—";

    return {
        id: q.id,
        name: q.full_name,
        contact: `${q.contact} / ${q.address}`,
        solarCap: `${solarCap} kW`,
        inverter: invModel || invBrand || "—",
        batterySize: `${batSize} kWh`,
        panels: `${pvNos} Units`,
        quoteRef: q.quote_ref,
        totalInvestment: "—",
        status: "Active",
        fullSpecs: {
            pvBrand,
            pvModel,
            pvNos: Number(pvNos),
            invBrand,
            invModel,
            invCap: `${invCap} kW`,
            batBrand,
            batSize: `${batSize} kWh`,
            mounting,
            cabling,
            protection,
            installation,
        },
    };
}

export function Customers() {
    const [customers, setCustomers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [fetchError, setFetchError] = useState<string | null>(null);

    const fetchQuotations = async () => {
        try {
            setLoading(true);
            setFetchError(null);
            const res = await api.get("/api/quotations");
            setCustomers(res.data.map(mapQuotationToCustomer));
        } catch (err: any) {
            setFetchError(err.response?.data?.message || "Failed to load quotations.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchQuotations(); }, []);

    const [openMenuId, setOpenMenuId] = useState<string | null>(null);
    const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
    const [isViewOpen, setIsViewOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [isDownloading, setIsDownloading] = useState<string | null>(null);

    const [isAddOpen, setIsAddOpen] = useState(false);
    const [addLoading, setAddLoading] = useState(false);
    const [addError, setAddError] = useState<string | null>(null);
    const [addForm, setAddForm] = useState({
        fullName: "", contact: "", address: "", quoteRef: ""
    });

    const handleAddCustomer = async (e: React.FormEvent) => {
        e.preventDefault();
        setAddError(null);
        setAddLoading(true);
        try {
            // Generating a random quote ref if empty
            const finalQuoteRef = addForm.quoteRef || `Q-${Math.floor(1000 + Math.random() * 9000)}`;
            await api.post("/api/quotations", {
                ...addForm,
                quoteRef: finalQuoteRef,
                results: { pvArrayNos: 12, inverterCapacity: 5, batteryBankSize: 10, solarCapacity: 5.4 },
                inputs: { pvBrand: "Jinko", inverterBrand: "DEYE", batteryBrand: "Felicity" }
            });
            setIsAddOpen(false);
            setAddForm({ fullName: "", contact: "", address: "", quoteRef: "" });
            fetchQuotations();
        } catch (err: any) {
            setAddError(err.response?.data?.message || "Failed to create quotation.");
        } finally {
            setAddLoading(false);
        }
    };

    const toggleMenu = (id: string) => {
        setOpenMenuId(openMenuId === id ? null : id);
    };

    // Helper to map customer data to the format expected by quotation components
    const mapCustomerToResult = (cust: any): CalculationResult => {
        const invCap = parseFloat(cust.fullSpecs.invCap || "0");
        const batSize = parseFloat(cust.fullSpecs.batSize || "0");
        const solCap = parseFloat(cust.solarCap || "0");
        const dailyGen = (solCap * 4.5).toFixed(1);

        return {
            inverterBrand: cust.fullSpecs.invBrand,
            inverterModel: cust.fullSpecs.invModel,
            inverterPrice: 0,
            pvBrand: cust.fullSpecs.pvBrand,
            pvModel: cust.fullSpecs.pvModel,
            pvWattage: 600,
            batteryBrand: cust.fullSpecs.batBrand,
            batteryModel: "Lithium Series",
            batteryPrice: 0,
            totalEnergy: solCap.toFixed(1),
            batteryBankSize: batSize.toFixed(1),
            dailyEnergyGeneneration: dailyGen,
            solarCapacity: solCap.toFixed(2),
            pvArrayNos: cust.fullSpecs.pvNos,
            inverterNos: 1,
            inverterCapacity: invCap.toFixed(1),
            checkingVolt: 48,
            selectedLoad: 100,
            totalEnergyWEff: solCap.toFixed(2),
            _batteryBankRaw: batSize,
            _dailyEnergyRaw: parseFloat(dailyGen),
            warranty: 5,
            efficiency: 98,
            mountingDescription: cust.fullSpecs.mounting,
            cablingDescription: cust.fullSpecs.cabling,
            protectionDescription: cust.fullSpecs.protection,
            protectionRated: cust.fullSpecs.protection,
            installationDescription: cust.fullSpecs.installation,
            installationChangeover: 63
        };
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
                margin: [0, 0, 0, 0] as [number, number, number, number],
                filename: `Quotation_${customer.name.replace(/\s+/g, '_')}_${customer.quoteRef}.pdf`,
                image: { type: 'jpeg', quality: 0.98 },
                pagebreak: { mode: ['css', 'legacy'] },
                html2canvas: {
                    scale: 2,
                    useCORS: true,
                    letterRendering: true,
                    allowTaint: true,
                    windowWidth: 1000,
                    x: 0,
                    y: 0,
                    scrollX: 0,
                    scrollY: 0,
                    onclone: (clonedDoc: Document) => {
                        // Safely strip oklch from style tags to prevent html2canvas parsing crashes
                        try {
                            const styles = clonedDoc.querySelectorAll('style');
                            styles.forEach(style => {
                                if (style.innerHTML.includes('oklch')) {
                                    style.innerHTML = style.innerHTML.replace(/oklch\([^\)]+\)/g, '#94a3b8');
                                }
                            });
                        } catch (e) {
                            console.warn("PDF Style Scrubbing failed:", e);
                        }

                        // Inject global safe overrides for layout stability and oklch fallbacks
                        const styleNode = clonedDoc.createElement('style');
                        styleNode.innerHTML = `
                            * {
                                border-color: #e2e8f0 !important;
                                outline: none !important;
                                box-shadow: none !important;
                                --tw-ring-color: transparent !important;
                                --tw-ring-shadow: 0 0 #0000 !important;
                                --tw-shadow: 0 0 #0000 !important;
                                --tw-outline-color: transparent !important;
                            }
                            
                            /* Preserving exact replica visuals for engineering colors */
                            .text-engineering-blue { color: #2563eb !important; }
                            .text-engineering-green { color: #16a34a !important; }
                            .text-engineering-orange { color: #f59e0b !important; }
                            .text-engineering-red { color: #dc2626 !important; }
                            
                            .bg-engineering-blue { background-color: #2563eb !important; }
                            .bg-engineering-green { background-color: #16a34a !important; }
                            .bg-engineering-orange { background-color: #f59e0b !important; }
                            .bg-engineering-red { background-color: #dc2626 !important; }
                        `;
                        clonedDoc.head.appendChild(styleNode);
                    }
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

    const confirmDelete = async () => {
        try {
            await api.delete(`/api/quotations/${selectedCustomer.id}`);
            setCustomers(prev => prev.filter(c => c.id !== selectedCustomer.id));
        } catch (err: any) {
            alert(err.response?.data?.message || "Failed to delete quotation.");
        } finally {
            setIsDeleteOpen(false);
            setSelectedCustomer(null);
        }
    };

    return (
        <div className="space-y-8 py-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-white">Project Customers</h1>
                    <p className="text-muted-foreground mt-2">Detailed engineering results and quotation history for all clients.</p>
                </div>
                <Button
                    className="bg-engineering-blue hover:bg-engineering-blue/90 text-white"
                    onClick={() => { setIsAddOpen(true); setAddError(null); }}
                >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Customer
                </Button>
            </div>

            {fetchError && (
                <div className="flex items-center gap-2 text-sm text-engineering-red bg-engineering-red/10 border border-engineering-red/20 rounded-lg px-4 py-3">
                    <AlertCircle className="h-4 w-4" /> {fetchError}
                </div>
            )}

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
                                {loading ? (
                                    <tr>
                                        <td colSpan={6} className="px-4 py-10 text-center">
                                            <Loader2 className="h-6 w-6 animate-spin text-engineering-blue mx-auto" />
                                        </td>
                                    </tr>
                                ) : customers.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="px-4 py-10 text-center text-muted-foreground text-sm">No quotations found.</td>
                                    </tr>
                                ) : customers.map((cust) => (
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

            {/* Hidden PDF Templates - EXACT REPLICAS using real components */}
            <div className="hidden-pdf-container" style={{ position: 'absolute', top: 0, left: '-15000px', opacity: 0, pointerEvents: 'none', zIndex: -1 }}>
                {/* CSS Overrides for oklch compatibility with html2pdf/html2canvas */}
                <style dangerouslySetInnerHTML={{
                    __html: `
                    .pdf-export-wrapper {
                        /* Force light scheme */
                        color-scheme: light !important;
                        background: white !important;
                        color: #020617 !important;
                        font-size: 14px !important;
                        line-height: 1.4 !important;

                        /* Standard Shadcn Variables (HSL) - forcing safe HSL/RGB values */
                        --background: 0 0% 100% !important;
                        --foreground: 222 47% 11% !important;
                        --card: 0 0% 100% !important;
                        --card-foreground: 222 47% 11% !important;
                        --popover: 0 0% 100% !important;
                        --popover-foreground: 222 47% 11% !important;
                        --primary: 221 83% 53% !important; /* Engineering Blue */
                        --primary-foreground: 210 40% 98% !important;
                        --secondary: 210 40% 96% !important;
                        --secondary-foreground: 222 47% 11% !important;
                        --muted: 210 40% 96% !important;
                        --muted-foreground: 215 16% 47% !important;
                        --accent: 210 40% 96% !important;
                        --accent-foreground: 222 47% 11% !important;
                        --destructive: 0 84% 60% !important;
                        --destructive-foreground: 210 40% 98% !important;
                        --border: 214 32% 91% !important;
                        --input: 214 32% 91% !important;
                        --ring: 221 83% 53% !important;
                        
                        /* Tailwind v4 specific color overrides (Force Hex/RGB) */
                        --color-engineering-blue: #2563eb !important;
                        --color-engineering-green: #16a34a !important;
                        --color-engineering-orange: #f59e0b !important;
                        --color-engineering-red: #dc2626 !important;
                        
                        /* Common Tailwind theme colors that might be oklch */
                        --color-border: #e2e8f0 !important;
                        --color-input: #e2e8f0 !important;
                        --color-ring: #3b82f6 !important;
                        --color-background: #ffffff !important;
                        --color-foreground: #020617 !important;
                        --color-primary: #3b82f6 !important;
                        --color-secondary: #f1f5f9 !important;
                        --color-muted: #f1f5f9 !important;
                        --color-accent: #f1f5f9 !important;
                        --color-destructive: #ef4444 !important;
                    }
                    
                    .pdf-export-wrapper * {
                        border-color: #e2e8f0 !important;
                        outline-color: transparent !important; /* Prevent oklch outline parse error */
                    }
                    
                    /* Page break handling */
                    .pdf-page-break {
                        page-break-before: always !important;
                        margin: 0 !important;
                        padding: 0 !important;
                        border: none !important;
                    }

                    /* Ensure background images are handled properly */
                    .pdf-export-wrapper .hero {
                        background-color: #044381 !important;
                    }

                    .pdf-export-wrapper .quotation,
                    .pdf-export-wrapper .quotation-page-2,
                    .pdf-export-wrapper .quotation-page-last {
                        margin: 0 !important;
                        padding: 0 !important;
                        max-width: 100% !important;
                        box-shadow: none !important;
                    }
                    
                    .pdf-export-wrapper .mainContent {
                        padding: 24px 28px !important;
                        gap: 24px !important;
                    }

                    .pdf-export-wrapper h3 {
                        font-size: 18px !important;
                        padding: 4px 16px !important;
                    }

                    .pdf-export-wrapper table.spec-table th, 
                    .pdf-export-wrapper table.spec-table td {
                        padding: 8px 6px !important;
                        font-size: 13px !important;
                    }

                    .pdf-export-wrapper .termsContainer {
                        padding: 12px !important;
                    }

                    .pdf-export-wrapper .termsContainer ul {
                        font-size: 13px !important;
                    }

                    .pdf-export-wrapper .leftSide p {
                        font-size: 14px !important;
                    }

                    .pdf-export-wrapper .estimatesContainer ul {
                        font-size: 14px !important;
                    }
                    
                    .pdf-export-wrapper .quotationPriceCont {
                        padding: 15px 12px !important;
                    }

                    .pdf-export-wrapper .quotationPriceCont h2 {
                        font-size: 24px !important;
                    }

                    .pdf-export-wrapper .quotationPriceCont .quotationPrice {
                        font-size: 32px !important;
                    }
                `}} />

                {customers.map(cust => {
                    const resultData = mapCustomerToResult(cust);
                    const quoteFormData = {
                        fullName: cust.name,
                        contact: cust.contact.split(' / ')[0],
                        address: cust.contact.split(' / ')[1] || ""
                    };

                    return (
                        <div key={`pdf-${cust.id}`} id={`pdf-content-${cust.id}`} className="pdf-export-wrapper" style={{ width: '1000px', transform: 'scale(0.79)', transformOrigin: 'top left', backgroundColor: '#ffffff' }}>
                            <div className="solar-toolbox-container">
                                <div style={{ height: '1410px', overflow: 'hidden', display: 'flex', flexDirection: 'column', pageBreakAfter: 'always' }}>
                                    <QuotationExecutiveSummary
                                        result={resultData}
                                        quotationDate={new Date().toLocaleDateString()}
                                        quotationRef={cust.quoteRef}
                                        quoteFormData={quoteFormData}
                                    />
                                </div>
                                <div className="pdf-page-break" style={{ height: '1410px', overflow: 'hidden', display: 'flex', flexDirection: 'column', pageBreakAfter: 'always' }}>
                                    <QuotationCompanyProfile />
                                </div>
                                <div className="pdf-page-break" style={{ height: '1410px', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                                    <QuotationBankDetails />
                                </div>
                            </div>
                        </div>
                    );
                })}
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

            {/* Add Customer Modal */}
            {isAddOpen && (
                <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
                    <div className="fixed inset-0 bg-black/70 backdrop-blur-md" onClick={() => setIsAddOpen(false)} />
                    <Card className="w-full max-w-md bg-[#0a0d14] border-engineering-blue/30 shadow-2xl relative z-[1001]">
                        <CardHeader className="bg-[#111521]/80 border-b border-white/5 flex flex-row items-center justify-between py-5 px-6">
                            <CardTitle className="text-white text-lg flex items-center gap-2">
                                <Plus className="h-5 w-5 text-engineering-blue" />
                                Add Customer Quotation
                            </CardTitle>
                            <button
                                onClick={() => setIsAddOpen(false)}
                                className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </CardHeader>
                        <CardContent className="pt-6">
                            <form onSubmit={handleAddCustomer} className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-muted-foreground">Full Name</label>
                                    <input
                                        type="text"
                                        placeholder="John Doe"
                                        value={addForm.fullName}
                                        onChange={e => setAddForm(f => ({ ...f, fullName: e.target.value }))}
                                        required
                                        className="w-full px-4 py-2 bg-[#111521] border border-border rounded-md text-sm text-white focus:outline-none focus:ring-1 focus:ring-engineering-blue transition-all"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-muted-foreground">Contact Detail (Email/Phone)</label>
                                    <input
                                        type="text"
                                        placeholder="john@example.com / +234..."
                                        value={addForm.contact}
                                        onChange={e => setAddForm(f => ({ ...f, contact: e.target.value }))}
                                        required
                                        className="w-full px-4 py-2 bg-[#111521] border border-border rounded-md text-sm text-white focus:outline-none focus:ring-1 focus:ring-engineering-blue transition-all"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-muted-foreground">Address</label>
                                    <input
                                        type="text"
                                        placeholder="123 Solar Street, Lagos"
                                        value={addForm.address}
                                        onChange={e => setAddForm(f => ({ ...f, address: e.target.value }))}
                                        required
                                        className="w-full px-4 py-2 bg-[#111521] border border-border rounded-md text-sm text-white focus:outline-none focus:ring-1 focus:ring-engineering-blue transition-all"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-muted-foreground">Quote Ref (Optional)</label>
                                    <input
                                        type="text"
                                        placeholder="Leave blank to auto-generate"
                                        value={addForm.quoteRef}
                                        onChange={e => setAddForm(f => ({ ...f, quoteRef: e.target.value }))}
                                        className="w-full px-4 py-2 bg-[#111521] border border-border rounded-md text-sm text-white focus:outline-none focus:ring-1 focus:ring-engineering-blue transition-all"
                                    />
                                </div>

                                {addError && (
                                    <div className="flex items-center gap-2 text-sm text-engineering-red bg-engineering-red/10 border border-engineering-red/20 rounded-lg px-4 py-3">
                                        <AlertCircle className="h-4 w-4 flex-shrink-0" />
                                        <span>{addError}</span>
                                    </div>
                                )}

                                <div className="flex gap-3 pt-2">
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        className="flex-1 text-muted-foreground hover:text-white"
                                        onClick={() => setIsAddOpen(false)}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        type="submit"
                                        disabled={addLoading}
                                        className="flex-1 bg-engineering-blue hover:bg-engineering-blue/90 text-white"
                                    >
                                        {addLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save Customer"}
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    );
}
