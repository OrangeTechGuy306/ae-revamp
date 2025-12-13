
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './SolarToolbox.css'; // Reuse existing styles
import { APP_CONFIG } from './SolarToolbox';

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
            <div className="quotation show">
                <div className="cardContainer">
                    <div className="hero overflow-hidden" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1509391366360-2e959784a276?q=80&w=2072&auto=format&fit=crop')", backgroundSize: 'cover', backgroundPosition: 'center' }}>

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
                            <p><strong>Dear Client,</strong><br />
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
                                            <td><i>{result.pvBrand}</i> <br /> <small>{result.pvModel}</small></td>
                                            <td><small>{result.solarCapacity} KwG</small></td>
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
                                            <td><i>Felicity</i><br /><small>Lithium2E2D</small></td>
                                            <td><small>{result.batteryBankSize} KwP</small></td>
                                            <td><span className="mark mark-check"></span></td>
                                        </tr>
                                        {/* Mounting Structure */}
                                        <tr>
                                            <td>Mounting</td>
                                            <td><i>Will be determined</i><br /><small>at site survey</small></td>
                                            <td><small>Mounting Structure</small></td>
                                            <td><span className="mark mark-check"></span></td>
                                        </tr>
                                        {/* Cabling */}
                                        <tr>
                                            <td>Cabling</td>
                                            <td><i>Flex Cables</i><br /><small>6-75 mm² available</small></td>
                                            <td><small>Full gauge supplied</small></td>
                                            <td><span className="mark mark-check"></span></td>
                                        </tr>
                                        {/* Protection Devices */}
                                        <tr>
                                            <td>Protection</td>
                                            <td><i>Main Switch / Neutral Safety</i><br /><small>Voltage Protection</small></td>
                                            <td><small>40k MSC / ≤2.2kV VPL</small></td>
                                            <td><span className="mark mark-check"></span></td>
                                        </tr>
                                        {/* Installation */}
                                        <tr>
                                            <td>Installation</td>
                                            <td><i>Professional Install</i><br /><small>Testing & Commissioning</small></td>
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
                            <div className="title" style={{ fontSize: 24 }}>PROFESSIONAL<br />QUOTATION</div>
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
                                <h4>PERFORMANCE ESTIMATES</h4>
                                <ul>
                                    <b style={{ fontSize: '20px', color: '#0b4a7b' }}>System Analysis</b>
                                    <li>Daily Energy Generation: <b>{result.dailyEnergyGeneneration}</b><b>KW/D</b></li>
                                    <li>Backup Time at {result.selectedLoad}% Load: <b>{((result._batteryBankRaw / parseFloat(result.totalEnergyWEff)) * result.selectedLoad / 10).toFixed(1)}</b><b>Hrs</b></li>
                                    <li>CO₂ Emissions Saved: ~<b>{(result._dailyEnergyRaw * APP_CONFIG.environment.emissionFactor).toFixed(2)}</b> kg/year</li>
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


                {/* PAGE 2: COMPANY PROFILE */}


                <div className="quotation-page-2">
                    <div className="cardContainer">
                        <div className="mainContent">
                            <h2 style={{ fontSize: '28px', color: '#044381', borderBottom: '3px solid #f4a600', paddingBottom: '10px', marginBottom: '18px' }}>A.E RENEWABLE LTD</h2>
                            <h3 style={{ fontSize: '22px', color: '#044381', marginBottom: '14px' }}>Company Overview & Identity</h3>
                            <p style={{ fontSize: '15px', color: '#333', marginBottom: '12px' }}>A.E RENEWABLE LTD is a comprehensive renewable energy and electrical engineering company in Nigeria, delivering solar installations, smart power systems, electrical works, automation, and energy-efficient solutions for homes, offices, farms, estates, and industrial facilities.</p>
                            <p style={{ fontSize: '15px', color: '#333', marginBottom: '12px' }}>Our certified team provides detailed engineering design, project management, and installation services. We implement cutting-edge technologies and follow global standards to ensure every installation is reliable, scalable, and future-proof.</p>


                            <h3 style={{ color: '#0aa80f', fontSize: '18px', marginBottom: '8px' }}>Our Mission</h3>
                            <p style={{ fontSize: '15px', color: '#333', marginBottom: '12px' }}>We focus on quality, safety, sustainability, and client satisfaction. Our projects feature optimized layouts, high-quality components, intelligent energy management, and precise engineering for maximum efficiency and longevity.</p>

                            <p style={{ fontSize: '15px', color: '#333', marginBottom: '12px' }}>Deliver clean, reliable, and affordable energy solutions while continuously innovating and enhancing performance for every client and project.</p>

                            <h3 style={{ color: '#0aa80f', fontSize: '18px', marginBottom: '8px' }}>Our Vision</h3>

                            <h3 style={{ color: '#0aa80f', fontSize: '18px', marginBottom: '8px' }}>Core Values</h3>
                            <p style={{ fontSize: '15px', color: '#333', marginBottom: '12px' }}>To become the leading renewable energy brand in Africa, empowering communities, businesses, and industries with sustainable and uninterrupted power solutions.</p>
                            <ul style={{ marginLeft: '20px', marginBottom: '14px', color: '#333' }}>
                                <li>Innovation and continuous improvement</li>
                                <li>Professional integrity and transparency</li>
                                <li>Commitment to safety and quality</li>
                                <li>Customer satisfaction and partnership</li>
                                <li>Environmental responsibility</li>
                            </ul>

                            <div style={{ background: '#e9f2ff', border: '1px solid #d0e3ff', padding: '12px', borderRadius: '8px', marginBottom: '16px' }}>
                                <span style={{ display: 'inline-block', background: '#e9f2ff', border: '1px solid #d0e3ff', padding: '8px 14px', borderRadius: '40px', margin: '4px 6px 0 0', fontSize: '13px', color: '#333' }}>Email: A.Erenewablesolution@gmail.com</span>
                                <span style={{ display: 'inline-block', background: '#e9f2ff', border: '1px solid #d0e3ff', padding: '8px 14px', borderRadius: '40px', margin: '4px 6px 0 0', fontSize: '13px', color: '#333' }}>www.aerenewable.com</span>
                                <span style={{ display: 'inline-block', background: '#e9f2ff', border: '1px solid #d0e3ff', padding: '8px 14px', borderRadius: '40px', margin: '4px 6px 0 0', fontSize: '13px', color: '#333' }}>Phone: 08133615132</span>
                                <span style={{ display: 'inline-block', background: '#e9f2ff', border: '1px solid #d0e3ff', padding: '8px 14px', borderRadius: '40px', margin: '4px 6px 0 0', fontSize: '13px', color: '#333' }}>Abuja, Nigeria</span>
                            </div>

                            <h3 style={{ color: '#044381', fontSize: '22px', marginBottom: '14px', marginTop: '20px' }}>Services & Technical Capabilities</h3>
                            <p style={{ fontSize: '15px', color: '#333', marginBottom: '12px' }}>We offer a full suite of energy solutions, combining innovative engineering with advanced components and professional project management.</p>

                            <div style={{ border: '1px solid #e9eef5', borderRadius: '12px', padding: '14px', marginBottom: '10px', background: '#fcfdff' }}>
                                <h4 style={{ color: '#0aa80f', fontSize: '16px', marginBottom: '6px' }}>Solar Home & Office Systems</h4>
                                <p style={{ fontSize: '14px', color: '#333', marginBottom: '8px' }}>Design and installation of hybrid/off-grid systems with inverters, batteries, solar panels, and smart monitoring for seamless power supply.</p>
                            </div>

                            <div style={{ border: '1px solid #e9eef5', borderRadius: '12px', padding: '14px', marginBottom: '10px', background: '#fcfdff' }}>
                                <h4 style={{ color: '#0aa80f', fontSize: '16px', marginBottom: '6px' }}>Solar Street Lights</h4>
                                <p style={{ fontSize: '14px', color: '#333', marginBottom: '8px' }}>Automated solar streetlights with durable poles, energy-saving LEDs, and night-time optimization for urban and rural applications.</p>
                            </div>

                            <div style={{ border: '1px solid #e9eef5', borderRadius: '12px', padding: '14px', marginBottom: '10px', background: '#fcfdff' }}>
                                <h4 style={{ color: '#0aa80f', fontSize: '16px', marginBottom: '6px' }}>Mini-Grid & Off-Grid Power</h4>
                                <p style={{ fontSize: '14px', color: '#333', marginBottom: '8px' }}>Community electrification, industrial clusters, and farm solutions featuring hybrid solar-diesel systems and energy management technologies.</p>
                            </div>

                            <div style={{ border: '1px solid #e9eef5', borderRadius: '12px', padding: '14px', marginBottom: '10px', background: '#fcfdff' }}>
                                <h4 style={{ color: '#0aa80f', fontSize: '16px', marginBottom: '6px' }}>Electrical Installations</h4>
                                <p style={{ fontSize: '14px', color: '#333', marginBottom: '8px' }}>Professional wiring, breaker panels, load balancing, surge protection, and full compliance with national and international electrical codes.</p>
                            </div>

                            <div style={{ border: '1px solid #e9eef5', borderRadius: '12px', padding: '14px', marginBottom: '10px', background: '#fcfdff' }}>
                                <h4 style={{ color: '#0aa80f', fontSize: '16px', marginBottom: '6px' }}>Maintenance & Troubleshooting</h4>
                                <p style={{ fontSize: '14px', color: '#333', marginBottom: '8px' }}>Periodic system checks, diagnostics, battery health monitoring, inverter repairs, panel cleaning, and optimization services.</p>
                            </div>

                            <div style={{ border: '1px solid #e9eef5', borderRadius: '12px', padding: '14px', marginBottom: '10px', background: '#fcfdff' }}>
                                <h4 style={{ color: '#0aa80f', fontSize: '16px', marginBottom: '6px' }}>Smart Home & Industrial Automation</h4>
                                <p style={{ fontSize: '14px', color: '#333', marginBottom: '8px' }}>IoT-based automation, CCTV, access control, energy monitoring, and smart facility management systems for modern infrastructure.</p>
                            </div>

                            <h3 style={{ color: '#0aa80f', fontSize: '18px', marginBottom: '8px', marginTop: '16px' }}>Project Execution & Quality Assurance</h3>
                            <div style={{ textAlign: 'center', marginBottom: '12px' }}>
                                <h4 style={{ color: '#044381', fontSize: '16px', margin: '0 0 8px 0' }}>Process Steps</h4>
                                <ul style={{ display: 'inline-block', textAlign: 'left', margin: 0, paddingLeft: '20px', color: '#333', fontSize: '14px' }}>
                                    <li><strong>Site Survey & Assessment:</strong> Evaluate load requirements, roof structures, exposure, and safety considerations.</li>
                                    <li><strong>Design & Quotation:</strong> Optimize inverters, batteries, panels, cables, and protective devices with advanced tools.</li>
                                    <li><strong>Professional Installation:</strong> Certified materials, precise wiring, grounding, and neat component placement.</li>
                                    <li><strong>Testing & Handover:</strong> Performance verification, user training, warranty, and documentation.</li>
                                    <li><strong>After-Service Care:</strong> Monitoring, periodic maintenance, upgrades, and ongoing client support.</li>
                                </ul>
                            </div>

                            <h4 style={{ color: '#044381', fontSize: '16px', marginBottom: '8px' }}>Why Clients Trust Us</h4>
                            <ul style={{ marginLeft: '20px', marginBottom: '14px', color: '#333', fontSize: '14px' }}>
                                <li>High-quality materials and workmanship</li>
                                <li>Professional, certified engineers and technicians</li>
                                <li>Transparent pricing and documentation</li>
                                <li>Long-term maintenance and support</li>
                                <li>Ethical and reliable service delivery</li>
                            </ul>

                            <p style={{ textAlign: 'center', fontSize: '12px', color: '#999', marginTop: '30px', paddingTop: '15px', borderTop: '1px solid #e4e4e4', borderRight: '12px solid #044381', borderRadius: '20px' }}>
                                © 2024 A.E RENEWABLE LTD — Clean Energy • Smart Power • Professional Installation
                            </p>
                        </div>
                    </div>
                </div>


                {/* LAST PAGE: Bank / Account Details */}
                <div className="quotation-page-last">
                    <h3>Bank / Account Details</h3>
                    <div className="flex flex-wrap gap-3 items-center">
                        <div className="min-w-[220px] text-sm text-[#333]"><strong>Account Name:</strong> <span>A.E RENEWABLE LTD</span></div>
                        <div className="min-w-[200px] text-sm text-[#333]"><strong>Account Number:</strong> <span>0123456789</span></div>
                        <div className="min-w-[180px] text-sm text-[#333]"><strong>Bank:</strong> <span>Example Bank PLC</span></div>
                        <div className="min-w-[150px] text-sm text-[#333]"><strong>Branch:</strong> <span>Abuja Branch</span></div>
                    </div>
                    <p className="mt-3 text-xs text-[#666]">Please make payments to the account above. For assistance, call +234 813 361 5132.</p>
                </div>

                <div className="flex justify-center mt-6">
                    <button onClick={() => window.print()} className="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-blue-700">Print / Save PDF</button>
                </div>
            </div>
        </div>
    );
};

export default QuotationPreview;
