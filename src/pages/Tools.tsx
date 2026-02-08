import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
// import { Wrench, Zap, Grid, Settings, Box, ArrowRight, Icon } from "lucide-react";
import SolarToolbox from '../components/toolbox/SolarToolbox';
import EquipmentKits from '../components/toolbox/EquipmentKits';
import Certificates from '../components/toolbox/Certificates';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Zap, FileCheck, ClipboardCheck, Shield, Box, Wrench, SignalZero, LucideWrench, PanelBottomDashedIcon, ChartNoAxesGantt, Cable } from "lucide-react";

interface ToolCardProps {
    title: string;
    description: string;
    icon: React.ReactNode;
    // action?: () => void;
    action: string;
    highlight?: boolean;
    color: string;
}

const colorMap: Record<string, { bg: string, text: string, hsl: string }> = {
    'engineering-orange': { bg: 'bg-engineering-orange/10', text: 'text-engineering-orange', hsl: '25 95% 53%' },
    'engineering-green': { bg: 'bg-engineering-green/10', text: 'text-engineering-green', hsl: '142 76% 36%' },
    'engineering-blue': { bg: 'bg-engineering-blue/10', text: 'text-engineering-blue', hsl: '217 91% 60%' },
    'engineering-red': { bg: 'bg-engineering-red/10', text: 'text-engineering-red', hsl: '0 84% 60%' },
};

const ToolCard = ({ title, description, icon, action, highlight, color }: ToolCardProps) => {
    const hsl = colorMap[color]?.hsl || '217 91% 60%';
    return (
        <Link to={action}>
            <Card className="h-full transition-all duration-300 hover:shadow-lg hover:scale-105 cursor-pointer border-[1px] hover:border-primary bg-card/50 backdrop-blur-sm">
                <CardHeader>
                    <div
                        style={{ backgroundColor: `hsl(${hsl} / 0.15)` }}
                        className="p-3 rounded-lg w-fit mb-3"
                    >
                        <div style={{ color: `hsl(${hsl})` }}>
                            {icon}
                        </div>
                    </div>
                    <CardTitle className="text-xl">{title}</CardTitle>
                    {/* <CardDescription className="text-sm">{description}</CardDescription> */}
                    <CardDescription className="text-sm leading-6">
                        {
                            description.split('\n').map((line, index) => (
                                <span key={index}>{line}<br /></span>
                            ))}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <button className="w-full group py-2 rounded-sm bg-[#111521] transition-all text-primary-foreground hover:bg-[#044381] group">
                        Access Tool
                        <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
                    </button>
                </CardContent>
            </Card>
        </Link>
    );
};
const tools = [
    {
        title: "Integrated Tool Hub",
        description: "Your all-in-one smart result",
        subdescription: "Generator.",
        icon: Wrench,
        link: "/toolbox",
        color: "engineering-orange",
    },
    {
        title: "Panel Sizing Tool",
        description: "Advanced anylyzer for solar panel ",
        subdescription: "Capacity and output.",
        icon: PanelBottomDashedIcon,
        link: "/panel-sizer",
        color: "engineering-green",
    },
    {
        title: "Charge Controller Sizer",
        description: "Easily size and select the right con-",
        subdescription: "troller of your solar setup.",
        icon: ChartNoAxesGantt,
        link: "/charge-controller",
        color: "engineering-blue",
    },

    {
        title: "Breaker Selection Tool",
        description: "Ensure safety and reliable electrical",
        subdescription: "installations.",
        icon: Zap,
        link: "/breaker-selection",
        color: "engineering-blue",
    },
    {
        title: "Cable Sizer",
        description: "Ensure safe and efficient power",
        subdescription: "delivery with accurate wire sizing.",
        icon: Cable,
        link: "/cable-sizer",
        color: "engineering-green",
    },

    {
        title: "Equipment Kits",
        description: "Standard installation kits and ",
        subdescription: "inventory",
        icon: Box,
        link: "/kit",
        color: "engineering-red",
    },

];

export function ToolboxDashboard() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen  text-white font-sans selection:bg-blue-900/30">
            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8  py-5">

                {/* Header */}
                <div className="text-center mb-20">
                    <div className="flex justify-center mb-4">
                        <div className="h-40 w-40 bg-white rounded-full flex items-center justify-center shadow-2xl shadow-blue-900/20 overflow-hidden">
                            <img src="/logo.jpeg" alt="" />
                        </div>
                    </div>

                    <div className="inline-flex items-center px-3 py-1 rounded-full border border-gray-800 bg-gray-900/50 text-sm text-white mb-6">
                        Professional Solar Engineering Tools
                    </div>

                    <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white mb-4">
                        A.E RENEWABLE LTD
                    </h1>
                    <p className="text-lg text-white max-w-2xl mx-auto">
                        Complete suite of professional tools for solar system design, sizing, and <br /> installation management.
                    </p>
                </div>

                {/* Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
                    {tools.map((tool) => {
                        const Icon = tool.icon;
                        return (
                            <ToolCard
                                key={tool.link}
                                title={tool.title}
                                description={tool.description + (tool.subdescription ? '\n' + tool.subdescription : '')}
                                icon={<Icon className={`h-8 w-8 ${colorMap[tool.color]?.text || 'text-gray-600'}`} />}
                                action={tool.link}
                                color={tool.color}
                            />
                        );
                    })}
                </div>


                {/* About Section */}
                <div className="rounded-2xl p-5 border border-gray-800 relative overflow-hidden bg-card/50">
                    <div className="relative z-10">
                        <h2 className="text-2xl font-bold text-white mb-4">About A.E Renewable Ltd</h2>
                        <p className="text-gray-400 mb-10 leading-relaxed">
                            A.E Renewable Ltd provides comprehensive solar engineering solutions for residential, commercial, and industrial projects. Our professional toolkit ensures accurate system sizing, optimal component selection, and reliable installation management.
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="bg-engineering-blue/20 p-5 rounded-sm border border-gray-800/50">
                                <h4 className="text-white font-semibold mb-2 text-sm">Precision Engineering</h4>
                                <p className="text-xs text-gray-500 leading-relaxed">100% accurate calculations for optimal system design</p>
                            </div>
                            <div className="bg-engineering-green/20 p-5 rounded-sm border border-gray-800/50">
                                <h4 className="text-white font-semibold mb-2 text-sm">Cost Efficiency</h4>
                                <p className="text-xs text-gray-500 leading-relaxed">Smart sizing reduces waste and maximizes ROI</p>
                            </div>
                            <div className="bg-red-800/20 p-5 rounded-sm border border-gray-800/50">
                                <h4 className="text-white font-semibold mb-2 text-sm">Professional Tools</h4>
                                <p className="text-xs text-gray-500 leading-relaxed">Industry-standard equipment and calculations</p>
                            </div>
                        </div>

                        <div className="mt-5 text-right">
                            <span className="text-gray-600 text-[18px] font-bold">RC: <span className="text-red-500/80" style={{ letterSpacing: 2 }}>9010643</span></span>
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
                                        <p className="text-sm text-white font-semibold">+23408 133 6151 32</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 bg-[#161b2c] px-5 py-3 rounded-lg border border-gray-800/50">
                                    <div className="p-2 bg-green-900/20 rounded-md text-green-400">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-mail"><rect width="20" height="16" x="2" y="4" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /></svg>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 font-medium">Email Us</p>
                                        <p className="text-sm text-white font-semibold">A.E.RenewableSolution@gmail.com</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div >
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
