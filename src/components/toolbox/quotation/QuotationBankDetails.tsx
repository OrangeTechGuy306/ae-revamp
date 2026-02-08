

export const QuotationBankDetails = () => {
    return (
        <div className="quotation-page-last">
            <h3>Bank / Account Details</h3>
            <div className="flex flex-wrap gap-3 items-center">
                <div className="min-w-[220px] text-sm text-[#333]"><strong>Account Name:</strong> <span>A.E RENEWABLE LTD</span></div>
                <div className="min-w-[200px] text-sm text-[#333]"><strong>Account Number:</strong> <span>0123456789</span></div>
                <div className="min-w-[180px] text-sm text-[#333]"><strong>Bank:</strong> <span>Example Bank PLC</span></div>
                <div className="min-w-[150px] text-sm text-[#333]"><strong>Branch:</strong> <span>Abuja Branch</span></div>
            </div>
            <p className="mt-3 text-xs text-[#666]">Please make payments to the account above. For assistance, call +234 813 361 5132.</p>

            <div className="flex justify-center mt-6">
                <button onClick={() => window.print()} className="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-blue-700">Print / Save PDF</button>
            </div>
        </div>
    );
};
