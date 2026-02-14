
import { APP_CONFIG, type CalculationResult } from '../SolarToolbox';

interface Props {
    result: CalculationResult;
    quotationDate: string;
    quotationRef: string;
    quoteFormData?: {
        fullName: string;
        contact: string;
        address: string;
    };
}
// url('https://images.unsplash.com/photo-1509391366360-2e959784a276?q=80&w=2072&auto=format&fit=crop')

export const QuotationExecutiveSummary = ({ result, quotationDate, quotationRef, quoteFormData }: Props) => {
    return (
        <div className="quotation show" style={{ position: 'relative' }}>
            <div className="cardContainer">
                <div className="hero overflow-hidden" style={{ backgroundImage: "url(/public/solar-header.jpeg)", backgroundSize: 'cover', backgroundPosition: 'center' }}>

                    <div className="logo-badge">
                        <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
                            <svg className="logo-sun" viewBox="0 0 64 40" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                <rect x="0" y="8" width="48" height="24" rx="2" fill="#044381" opacity="0.08" />
                                <path d="M6 22c0-1.1.9-2 2-2h30v8H8c-1.1 0-2-.9-2-2v-4z" fill="#fff" opacity="0.06" />
                                <g transform="translate(4,4)">
                                    <circle cx="8" cy="6" r="6" fill="#f4a600" />
                                    <rect x="18" y="2" width="16" height="10" rx="1" fill="#0aa80f" transform="rotate(-12 26 7)" />
                                </g>
                            </svg>
                        </div>
                        <div style={{ flex: 1 }}>
                            <div style={{ fontWeight: 800, fontSize: '18px' }}>A.E<br />RENEWABLE LTD</div>
                            <div className="tagline">POWERING YOUR FUTURE WITH SUN</div>
                        </div>
                    </div>
                </div>

                <div className="mainContent">
                    <div className="leftSide">
                        <h3>Executive Summary</h3>
                        <p className='text-[15px]'><strong>Dear {quoteFormData?.fullName || 'Client'},</strong><br />
                            Thank you for considering A.E RENEWABLE LTD for your solar energy needs. Based on the information provided, we have designed a customized solar power system to meet your energy requirements efficiently and sustainably.</p>

                        <div className="specsContainer">
                            <h2>SYSTEM DESIGN & SPECIFICATIONS</h2>
                            <table className="spec-table">
                                <thead>
                                    <tr>
                                        <th style={{ color: '#044381' }}>Item</th>
                                        <th style={{ color: '#044381' }}>Description</th>
                                        <th style={{ color: '#044381' }}>Rated</th>
                                        <th style={{ color: '#044381' }}> Inc.</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {/* Solar Panels */}
                                    <tr>
                                        <td>Solar Panels</td>
                                        <td><i>{result.pvBrand}</i> <br /> <small>{result.pvModel} ({result.pvArrayNos} units)</small></td>
                                        <td><small>{result.solarCapacity} kW</small></td>
                                        <td><span className="mark mark-check"></span></td>
                                    </tr>
                                    {/* Inverter */}
                                    <tr>
                                        <td>Inverter</td>
                                        <td><i>{result.inverterBrand}</i><br /><small>{result.inverterModel}</small></td>
                                        <td><small>UpTo {result.inverterCapacity} KwP</small></td>
                                        <td><span className="mark mark-check"></span></td>
                                    </tr>
                                    {/* Batteries */}
                                    <tr>
                                        <td>Batteries</td>
                                        <td><i>{result.batteryBrand}</i></td>
                                        <td><small>{result.batteryBankSize} kWh</small></td>
                                        <td><span className="mark mark-check"></span></td>
                                    </tr>
                                    {/* Mounting Structure */}
                                    <tr>
                                        <td>Mounting</td>
                                        <td><i>{result.mountingDescription || 'Will be determined'}</i><br /><small>{result.mountingDescription ? 'Auto-Scaled' : 'at site survey'}</small></td>
                                        <td><small>Mounting Hardware</small></td>
                                        <td><span className="mark mark-check"></span></td>
                                    </tr>
                                    {/* Cabling */}
                                    <tr>
                                        <td>Cabling</td>
                                        <td><i>{result.cablingDescription || 'Flex Cables'}</i><br /><small>Professional PV & AC Cables</small></td>
                                        <td><small>Full gauge supplied</small></td>
                                        <td><span className="mark mark-check"></span></td>
                                    </tr>
                                    {/* Protection Devices */}
                                    <tr>
                                        <td>Protection</td>
                                        <td><i>{result.protectionDescription || 'Main Switch / Neutral Safety'}</i><br /><small>Voltage Protection</small></td>
                                        <td><small>{result.protectionRated || '40k MSC / ≤2.2kV VPL'}</small></td>
                                        <td><span className="mark mark-check"></span></td>
                                    </tr>
                                    {/* Installation */}
                                    <tr>
                                        <td>Installation</td>
                                        <td><i>Professional Install</i><br /><small>{result.installationDescription || 'Testing & Commissioning'}</small></td>
                                        <td><small>Lump Sum</small></td>
                                        <td><span className="mark mark-check"></span></td>
                                    </tr>
                                </tbody>
                            </table>


                            <div className="termsContainer">
                                <h4 style={{ margin: '0 0 8px 0' }}>Terms & Conditions</h4>
                                <ul>
                                    <li>Payment terms: 70% upfront, 30% on completion.</li>
                                    <li>Delivery timeframe: Max 2 working days after deposit.</li>
                                    <li>Cable sizes & Mounting Structure will be determined during site assessment.</li>
                                    <li>Quotation valid for 30 days from the date of issue.</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <div className="rightSide">
                        {/* <div className="title" style={{ fontSize: 24 }}>PROFESSIONAL<br />QUOTATION</div> */}
                        <div className="client">
                            <small>Date: {quotationDate} &nbsp; • &nbsp; Quote Ref: {quotationRef}</small></div>

                        <div className="diagramContainer" aria-hidden="true">
                            <svg viewBox="0 0 360 120" xmlns="http://www.w3.org/2000/svg">
                                <defs>
                                    <style>{`.s { fill:none; stroke:#0b4a7b; stroke-width:2; stroke-linecap:round }`}</style>
                                </defs>
                                <g transform="translate(8,8)">
                                    <rect x="0" y="8" width="40" height="20" rx="2" fill="rgb(0, 110, 255)" stroke="#000000" />
                                    <rect x="0" y="40" width="40" height="20" rx="2" fill="rgb(0, 110, 255)" stroke="#000000" />
                                    <rect x="0" y="72" width="40" height="20" rx="2" fill="rgb(0, 110, 255)" stroke="#000000" />
                                    <text x="56" y="22" fontSize="14" fill="#010a1d">Solar Panels</text>
                                    <text x="56" y="54" fontSize="14" fill="#010a1d">Solar Panels</text>
                                    <text x="56" y="86" fontSize="14" fill="#010a1d">Solar Panels</text>

                                    <rect x="210" y="15" width="70" height="70" rx="6" fill="#0b4a7b" stroke="#000000" />
                                    <text x="245" y="56" fontSize="16" fill="red" textAnchor="middle">Inverter</text>
                                    <line x1="40" y1="18" x2="210" y2="18" stroke="red" strokeWidth="2" />
                                    <line x1="40" y1="50" x2="210" y2="50" stroke="red" strokeWidth="2" />
                                    <line x1="40" y1="82" x2="210" y2="82" stroke="red" strokeWidth="2" />

                                    <rect x="210" y="92" width="70" height="28" rx="4" fill="#fff" stroke="red" />
                                    <text x="245" y="112" fontSize="16" fill="#000000" textAnchor="middle">Battery</text>

                                    <line x1="245" y1="86" x2="245" y2="92" stroke="red" strokeWidth="2" />
                                </g>
                            </svg>
                        </div>

                        <div className="estimatesContainer">
                            {/* <h4>PERFORMANCE ESTIMATES</h4> */}
                            <ul>
                                <b style={{ fontSize: '20px', color: '#0b4a7b' }}>System Analysis</b>
                                <li>Daily Energy Generation: <b>{result.dailyEnergyGeneneration}</b><b>KW/D</b></li>
                                <li>Backup Time at {result.selectedLoad}% Load: <b>{(((result._batteryBankRaw || 0) / parseFloat(result.totalEnergyWEff)) * result.selectedLoad / 10).toFixed(1)}</b><b>Hrs</b></li>
                                <li>CO₂ Emissions Saved: ~<b>{((result._dailyEnergyRaw || 0) * APP_CONFIG.environment.emissionFactor).toFixed(2)}</b> kg/year</li>
                            </ul>
                        </div>

                        <div className="warrantyContainer">
                            <h4 style={{ marginTop: 0 }}>WARRANTY & SUPPORT</h4>
                            <ul>
                                <li>Panels: 25-year performance warranty</li>
                                <li>Inverter: 5-year manufacturer warranty</li>
                                <li>A.E RENEWABLE LTD: 1-year complimentary maintenance</li>
                            </ul>
                        </div>

                        <div className="quotationPriceCont">
                            <h2>Total Investment</h2>
                            <div className="quotationPriceValue">
                                <h2 className="quotationPrice">₦0,250,000</h2>
                                <div className="quotationSpecs">
                                    <div>{result.inverterCapacity} kW Power</div>
                                    <div>{result.batteryBankSize} KwHr Bank</div>
                                </div>
                            </div>

                            <div className="warrantyBadge">
                                <div className="badgeContent">
                                    <div className="years">5</div>
                                    <div className="label">YEARS<br />WARRANTY</div>
                                </div>
                                <div className="ribbon">
                                    <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
                                        <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                                    </svg>
                                </div>
                            </div>
                        </div>
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
