import { useEffect, useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
// @ts-ignore
import html2pdf from 'html2pdf.js';
import './SolarToolbox.css';
import { QuotationExecutiveSummary } from './quotation/QuotationExecutiveSummary';
import { QuotationCompanyProfile } from './quotation/QuotationCompanyProfile';
import { QuotationBankDetails } from './quotation/QuotationBankDetails';

const QuotationPreview = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [quotationDate, setQuotationDate] = useState("");
    const [quotationRef, setQuotationRef] = useState("");

    // Data passed from SolarToolbox
    const { result, quoteFormData, quoteRef: existingRef, autoDownload } = location.state || {};
    const quotationRefNode = useRef<HTMLDivElement>(null);
    const [isDownloading, setIsDownloading] = useState(false);

    useEffect(() => {
        if (!result) {
            // Redirect back if no data
            navigate('/');
            return;
        }

        const now = new Date();
        setQuotationDate(now.toLocaleDateString());
        setQuotationRef(existingRef || `Q-${Math.floor(Math.random() * 10000)}`);
    }, [result, navigate, existingRef]);

    useEffect(() => {
        if (autoDownload && quotationRef && quotationRefNode.current && !isDownloading) {
            // Add a small delay so fonts/images can render
            const timer = setTimeout(() => {
                downloadPdf();
            }, 1500);
            return () => clearTimeout(timer);
        }
    }, [autoDownload, quotationRef]);

    const downloadPdf = async () => {
        if (!quotationRefNode.current) return;
        setIsDownloading(true);

        try {
            const element = document.getElementById(`pdf-content-preview`);
            if (!element) {
                console.error("PDF element not found");
                return;
            }

            const opt = {
                margin: [0, 0, 0, 0],
                filename: `AE_Renewable_Quotation_${quotationRef}.pdf`,
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
                        try {
                            const styles = clonedDoc.querySelectorAll('style');
                            styles.forEach(style => {
                                if (style.innerHTML.includes('oklch')) {
                                    style.innerHTML = style.innerHTML.replace(/oklch\([^\)]+\)/g, 'inherit');
                                }
                            });
                        } catch (e) {
                            console.warn("PDF Style Scrubbing failed:", e);
                        }
                    }
                },
                jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
            };

            // @ts-ignore
            await html2pdf().from(element).set(opt).save();
        } catch (error) {
            console.error("PDF generation failed:", error);
            alert("Failed to generate PDF. You can try the manual Print button.");
        } finally {
            setIsDownloading(false);
        }
    };

    if (!result) return null;

    return (
        <div className="solar-toolbox-container pb-20">
            {isDownloading && (
                <div className="fixed top-4 right-4 z-[9999] bg-engineering-blue text-white px-6 py-3 rounded-lg shadow-xl flex items-center gap-3 font-semibold animate-pulse">
                    <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Generating your PDF document...
                </div>
            )}
            <div className="max-w-[1000px] mx-auto mb-4 mt-6 flex justify-between items-center px-4">
                <button
                    onClick={() => navigate('/')}
                    className="flex text-sm font-semibold items-center gap-2 text-white bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg backdrop-blur-sm transition-all"
                >
                    ← Back to Calculator
                </button>
                <div className="flex gap-3">
                    <button
                        onClick={() => window.print()}
                        className="flex text-sm font-semibold items-center gap-2 text-white bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg backdrop-blur-sm transition-all"
                    >
                        Standard Print
                    </button>
                    <button
                        onClick={downloadPdf}
                        disabled={isDownloading}
                        className="flex text-sm font-semibold items-center gap-2 text-white bg-engineering-green hover:bg-engineering-green/90 disabled:opacity-50 disabled:cursor-not-allowed px-5 py-2 rounded-lg backdrop-blur-sm transition-all shadow-lg"
                    >
                        {isDownloading ? 'Generating...' : 'Download PDF'}
                    </button>
                </div>
            </div>

            <div ref={quotationRefNode}>
                <QuotationExecutiveSummary
                    result={result}
                    quotationDate={quotationDate}
                    quotationRef={quotationRef}
                    quoteFormData={quoteFormData}
                />
                <QuotationCompanyProfile />
                <QuotationBankDetails />
            </div>

            {/* Hidden PDF Template - EXACT REPLICA using real components */}
            <div className="hidden-pdf-container" style={{ position: 'absolute', top: 0, left: '-15000px', opacity: 0, pointerEvents: 'none', zIndex: -1 }}>
                <style dangerouslySetInnerHTML={{
                    __html: `
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

                    .pdf-page-break {
                        page-break-before: always !important;
                        margin: 0 !important;
                        padding: 0 !important;
                        border: none !important;
                    }
                `}} />

                <div id="pdf-content-preview" className="pdf-export-wrapper" style={{ width: '1000px', transform: 'scale(0.79)', transformOrigin: 'top left', backgroundColor: '#ffffff' }}>
                    <div className="solar-toolbox-container">
                        <div style={{ height: '1410px', overflow: 'hidden', display: 'flex', flexDirection: 'column', pageBreakAfter: 'always' }}>
                            <QuotationExecutiveSummary
                                result={result}
                                quotationDate={quotationDate}
                                quotationRef={quotationRef}
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
            </div>
        </div>
    );
};

export default QuotationPreview;
