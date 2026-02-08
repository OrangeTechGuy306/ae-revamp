
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
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
    const { result } = location.state || {};

    useEffect(() => {
        if (!result) {
            // Redirect back if no data
            navigate('/toolbox');
            return;
        }

        const now = new Date();
        setQuotationDate(now.toLocaleDateString());
        setQuotationRef(`Q-${Math.floor(Math.random() * 10000)}`);
    }, [result, navigate]);

    if (!result) return null;

    return (
        <div className="solar-toolbox-container">
            <QuotationExecutiveSummary result={result} quotationDate={quotationDate} quotationRef={quotationRef} />
            <QuotationCompanyProfile />
            <QuotationBankDetails />
        </div>
    );
};

export default QuotationPreview;
