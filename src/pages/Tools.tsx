
import { useNavigate } from 'react-router-dom';
import { Wrench, Zap, Grid, Settings, Box, ArrowRight } from "lucide-react";
import SolarToolbox from '../components/toolbox/SolarToolbox';
import EquipmentKits from '../components/toolbox/EquipmentKits';
import Certificates from '../components/toolbox/Certificates';

// Logo Component
const AE_Logo = () => (
    <svg viewBox="0 0 64 40" className="h-12 w-auto" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <rect x="0" y="8" width="48" height="24" rx="2" fill="#044381" fillOpacity="0.08" />
        <path d="M6 22c0-1.1.9-2 2-2h30v8H8c-1.1 0-2-.9-2-2v-4z" fill="#044381" fillOpacity="0.1" />
        <g transform="translate(4,4)">
            <circle cx="8" cy="6" r="6" fill="#f4a600" />
            <rect x="18" y="2" width="16" height="10" rx="1" fill="#0aa80f" transform="rotate(-12 26 7)" />
        </g>
    </svg>
);

interface ToolCardProps {
    title: string;
    description: string;
    icon: React.ReactNode;
    action?: () => void;
    highlight?: boolean;
}

const ToolCard = ({ title, description, icon, action, highlight }: ToolCardProps) => (
    <div
        onClick={action}
        className={`group relative p-6 rounded-xl border transition-all duration-300 cursor-pointer 
        ${highlight
                ? 'bg-[#111521] border-blue-900/40 hover:border-blue-500 hover:shadow-lg hover:shadow-blue-900/20'
                : 'bg-[#111521] border-gray-800 hover:border-gray-700 hover:bg-[#161b2c]'}`}
    >
        <div className={`h-12 w-12 rounded-lg mb-4 flex items-center justify-center 
            ${highlight ? 'bg-blue-900/20 text-blue-400' : 'bg-gray-800/50 text-gray-400 group-hover:text-gray-200'}`}>
            {icon}
        </div>
        <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
        <p className="text-sm text-gray-400 mb-6 leading-relaxed">{description}</p>

        <div className="flex items-center text-sm font-medium text-gray-500 group-hover:text-blue-400 transition-colors">
            Access Tool <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
        </div>
    </div>
);

export function ToolboxDashboard() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-[#0b0e14] text-white font-sans selection:bg-blue-900/30">
            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">

                {/* Header */}
                <div className="text-center mb-20">
                    <div className="flex justify-center mb-8">
                        <div className="h-24 w-24 bg-white rounded-full flex items-center justify-center shadow-2xl shadow-blue-900/20">
                            <AE_Logo />
                        </div>
                    </div>

                    <div className="inline-flex items-center px-3 py-1 rounded-full border border-gray-800 bg-gray-900/50 text-xs text-gray-400 mb-6">
                        Professional Solar Engineering Tools
                    </div>

                    <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white mb-4">
                        A.E RENEWABLE LTD
                    </h1>
                    <p className="text-lg text-gray-400 max-w-2xl mx-auto">
                        Complete suite of professional tools for solar system design, sizing, and installation management.
                    </p>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-24">
                    <ToolCard
                        title="Integrated Tool Hub"
                        description="Your all-in-one smart result Generator."
                        icon={<Wrench className="h-6 w-6" />}
                        highlight={true}
                        action={() => navigate('/toolbox')}
                    />
                    <ToolCard
                        title="Panel Sizing Tool"
                        description="Advanced anylyzer for solar panel Capacity and output."
                        icon={<Grid className="h-6 w-6 text-green-500" />}
                        highlight={false}
                        action={() => navigate('/panel-sizer')}
                    />
                    <ToolCard
                        title="Charge Controller Sizer"
                        description="Easily size and select the right controller for your solar setup."
                        icon={<Settings className="h-6 w-6 text-blue-400" />}
                        highlight={false}
                        action={() => navigate('/charge-controller')}
                    />
                    <ToolCard
                        title="Breaker Selection Tool"
                        description="Ensure safety and reliable electrical installations."
                        icon={<Zap className="h-6 w-6 text-blue-500" />}
                        highlight={false}
                        action={() => navigate('/breaker-selection')}
                    />
                    <ToolCard
                        title="Cable Sizer"
                        description="Ensure safe and efficient power delivery with accurate wire sizing."
                        icon={<Box className="h-6 w-6 text-green-500" />}
                        highlight={false}
                        action={() => navigate('/cable-sizer')}
                    />
                    <ToolCard
                        title="Equipment Kits"
                        description="Standard installation kits and inventory."
                        icon={<Box className="h-6 w-6 text-blue-600" />}
                        highlight={false}
                        action={() => navigate('/kit')}
                    />
                </div>

                {/* About Section */}
                <div className="bg-[#111521] rounded-2xl p-8 md:p-12 border border-gray-800 relative overflow-hidden">
                    <div className="relative z-10">
                        <h2 className="text-2xl font-bold text-white mb-4">About A.E Renewable Ltd</h2>
                        <p className="text-gray-400 mb-10 max-w-3xl leading-relaxed">
                            A.E Renewable Ltd provides comprehensive solar engineering solutions for residential, commercial, and industrial projects. Our professional toolkit ensures accurate system sizing, optimal component selection, and reliable installation management.
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="bg-[#161b2c] p-5 rounded-lg border border-gray-800/50">
                                <h4 className="text-white font-semibold mb-2 text-sm">Precision Engineering</h4>
                                <p className="text-xs text-gray-500 leading-relaxed">100% accurate calculations for optimal system design</p>
                            </div>
                            <div className="bg-[#161b2c] p-5 rounded-lg border border-gray-800/50">
                                <h4 className="text-white font-semibold mb-2 text-sm">Cost Efficiency</h4>
                                <p className="text-xs text-gray-500 leading-relaxed">Smart sizing reduces waste and maximizes ROI</p>
                            </div>
                            <div className="bg-[#161b2c] p-5 rounded-lg border border-gray-800/50">
                                <h4 className="text-white font-semibold mb-2 text-sm">Professional Tools</h4>
                                <p className="text-xs text-gray-500 leading-relaxed">Industry-standard equipment and calculations</p>
                            </div>
                        </div>

                        <div className="mt-12 text-right">
                            <span className="text-gray-600 text-xs font-mono">RC: <span className="text-red-500/80">9010643</span></span>
                        </div>
                    </div>
                </div>

                {/* Contact Section */}
                <div className="mt-6 bg-[#111521] rounded-2xl p-8 md:p-12 border border-gray-800 relative overflow-hidden">
                    <div className="relative z-10">
                        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                            <div className="text-center md:text-left">
                                <h2 className="text-2xl font-bold text-white mb-2">Get in Touch</h2>
                                <p className="text-gray-400">Have questions about our tools or services? Reach out to our team.</p>
                            </div>
                            <div className="flex flex-col sm:flex-row gap-6">
                                <div className="flex items-center gap-3 bg-[#161b2c] px-5 py-3 rounded-lg border border-gray-800/50">
                                    <div className="p-2 bg-blue-900/20 rounded-md text-blue-400">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-phone"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" /></svg>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 font-medium">Phone Support</p>
                                        <p className="text-sm text-white font-semibold">0813 534 9474</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 bg-[#161b2c] px-5 py-3 rounded-lg border border-gray-800/50">
                                    <div className="p-2 bg-green-900/20 rounded-md text-green-400">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-mail"><rect width="20" height="16" x="2" y="4" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /></svg>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 font-medium">Email Us</p>
                                        <p className="text-sm text-white font-semibold">aerenewableltd@gmail.com</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}

// Placeholder for other tools
export function ToolPlaceholder({ title }: { title: string }) {
    return (
        <div className="flex flex-col items-center justify-center min-h-[50vh] text-center p-8 bg-[#0b0e14] text-white">
            <div className="h-20 w-20 bg-gray-800 rounded-full flex items-center justify-center mb-6">
                <Wrench className="h-10 w-10 text-gray-400" />
            </div>
            <h1 className="text-3xl font-bold mb-4">{title}</h1>
            <p className="text-lg text-gray-500 max-w-md">
                This tool is currently under development. Please check back later for updates.
            </p>
        </div>
    )
}

// Route Components
export function PanelSizer() {
    return <SolarToolbox />;
}
export const ChargeControllerSizer = () => <ToolPlaceholder title="Charge Controller Sizer" />
export const BreakerSelection = () => <ToolPlaceholder title="Breaker Selection" />
export const CableSizer = () => <ToolPlaceholder title="Cable Sizer" />
export const KitGenerator = () => <EquipmentKits />;

// Export Toolbox to use the Dashboard
export const Toolbox = () => <ToolboxDashboard />;
export const CertificatesPage = () => <Certificates />;
