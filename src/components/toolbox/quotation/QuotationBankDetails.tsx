
export const QuotationBankDetails = () => {
    return (
        <div className="quotation-page-last">
            <div className="cardContainer">
                <div className="mainContent" style={{ display: 'block', minHeight: '180mm' }}>
                    <h3 style={{ fontSize: '24px', color: '#044381', borderBottom: '3px solid #f4a600', paddingBottom: '10px', marginBottom: '20px' }}>Bank / Account Details</h3>
                    <div className="flex flex-wrap gap-8 items-center mt-6">
                        <div className="min-w-[280px] text-base text-[#010a1d]"><strong>Account Name:</strong> <br /><span style={{ fontSize: '18px', fontWeight: 600 }}>A.E RENEWABLE LTD</span></div>
                        <div className="min-w-[200px] text-base text-[#010a1d]"><strong>Account Number:</strong> <br /><span style={{ fontSize: '18px', fontWeight: 600 }}>0123456789</span></div>
                        <div className="min-w-[200px] text-base text-[#010a1d]"><strong>Bank:</strong> <br /><span style={{ fontSize: '18px', fontWeight: 600 }}>Example Bank PLC</span></div>
                        <div className="min-w-[150px] text-base text-[#010a1d]"><strong>Branch:</strong> <br /><span style={{ fontSize: '18px', fontWeight: 600 }}>Abuja Branch</span></div>
                    </div>
                    <p className="mt-10 text-sm text-[#555] italic">Please make payments to the account above. For assistance, call +234 813 361 5132.</p>

                    <div className="flex justify-center mt-12 mb-6">
                        <button onClick={() => window.print()} className="bg-blue-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-blue-700 shadow-lg transition-all active:scale-95 print:hidden">
                            Print / Save PDF
                        </button>
                    </div>
                </div>

                <div className="quotationFooter">
                    <div className="left">© 2024 A.E RENEWABLE LTD. All rights reserved.</div>
                    <div className="center">
                        <div>Phone: <a href="tel:+2348133615132" style={{ color: '#46a500' }}>+234 813 361 5132</a></div>
                        <div>Website: <a href="https://www.aerenewable.com" style={{ color: '#46a500' }}>www.aerenewable.com</a></div>
                    </div>
                    <div className="right">
                        <button className="printButton" onClick={() => window.print()}>Print</button>
                    </div>
                </div>
            </div>
        </div>
    );
};
