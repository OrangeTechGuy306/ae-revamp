
import React from 'react';
import { CheckCircle, AlertCircle, Package } from "lucide-react";

interface StatCardProps {
    title: string;
    value: string;
    subtext: string;
    icon: React.ReactNode;
    colorClass: string;
}

const StatCard = ({ title, value, subtext, icon, colorClass }: StatCardProps) => (
    <div className="bg-[#111521] p-6 rounded-xl border border-gray-800 flex flex-col justify-between h-full">
        <div className="flex items-start justify-between mb-4">
            <div className={`p-2 rounded-lg bg-opacity-10 ${colorClass.replace('text-', 'bg-')} ${colorClass}`}>
                {icon}
            </div>
        </div>
        <div>
            <span className="text-gray-400 text-sm font-medium">{title}</span>
            <div className="text-3xl font-bold text-white mt-1 mb-1">{value}</div>
            <span className="text-xs text-gray-500">{subtext}</span>
        </div>
    </div>
);

interface KitCardProps {
    title: string;
    subtitle: string;
    kitId: string;
    status: 'In Stock' | 'Low Stock';
    quantity: number;
    items: string[];
}

const KitCard = ({ title, subtitle, kitId, status, quantity, items }: KitCardProps) => (
    <div className="bg-[#111521] rounded-xl border border-gray-800 p-6 flex flex-col h-full">
        <div className="mb-6">
            <h3 className="text-xl font-bold text-white mb-1">{title}</h3>
            <p className="text-sm text-gray-400">{subtitle}</p>
        </div>

        <div className="grid grid-cols-2 gap-y-3 gap-x-4 mb-6 text-sm">
            <div className="text-gray-400">Kit ID:</div>
            <div className="text-white font-mono text-right bg-gray-800/50 px-2 rounded inline-block justify-self-end">{kitId}</div>

            <div className="text-gray-400">Status:</div>
            <div className={`text-right font-medium px-2 py-0.5 rounded text-xs justify-self-end flex items-center
                ${status === 'In Stock' ? 'bg-green-900/30 text-green-500' : 'bg-orange-900/30 text-orange-500'}`}>
                {status}
            </div>

            <div className="text-gray-400">Quantity:</div>
            <div className="text-white text-right font-medium">{quantity} units</div>
        </div>

        <div className="mt-auto">
            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Contains:</div>
            <ul className="space-y-2">
                {items.map((item, idx) => (
                    <li key={idx} className="text-sm text-gray-400 flex items-start">
                        <span className="mr-2 text-gray-600">•</span>
                        {item}
                    </li>
                ))}
            </ul>
        </div>
    </div>
);

export default function EquipmentKits() {
    return (
        <div className="min-h-screen bg-[#0b0e14] text-white p-6 lg:p-10 font-sans">
            <div className="max-w-7xl mx-auto">

                {/* Header */}
                <div className="flex items-center gap-4 mb-10">
                    <div className="p-3 bg-blue-600/10 rounded-xl text-blue-500">
                        <Package className="h-8 w-8" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-white">Equipment Kits</h1>
                        <p className="text-gray-400">Standard electrical installation kits and inventory</p>
                    </div>
                </div>

                {/* Stats Row */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                    <StatCard
                        title="Total Kits"
                        value="15"
                        subtext="Available kits"
                        icon={<Package className="h-5 w-5" />}
                        colorClass="text-gray-200"
                    />
                    <StatCard
                        title="In Stock"
                        value="12"
                        subtext="Ready to use"
                        icon={<CheckCircle className="h-5 w-5" />}
                        colorClass="text-green-500"
                    />
                    <StatCard
                        title="Low Stock"
                        value="3"
                        subtext="Need reorder"
                        icon={<AlertCircle className="h-5 w-5" />}
                        colorClass="text-orange-500"
                    />
                </div>

                {/* Kits Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
                    <KitCard
                        title="Installation Kit - Residential"
                        subtitle="Standard residential electrical installation kit"
                        kitId="RES-001"
                        status="In Stock"
                        quantity={5}
                        items={[
                            "Wire strippers and cutters",
                            "Screwdrivers set (flathead & Phillips)",
                            "Voltage tester",
                            "Cable ties and clips",
                            "Electrical tape",
                            "Wire connectors assortment"
                        ]}
                    />
                    <KitCard
                        title="Installation Kit - Commercial"
                        subtitle="Commercial and industrial installation kit"
                        kitId="COM-002"
                        status="In Stock"
                        quantity={3}
                        items={[
                            "Heavy-duty wire cutters",
                            "Conduit bender",
                            "Fish tape (25m)",
                            "Cable pulling lubricant",
                            "Crimping tool set",
                            "Measuring tape (10m)"
                        ]}
                    />
                    <KitCard
                        title="Testing & Inspection Kit"
                        subtitle="Comprehensive testing equipment kit"
                        kitId="TEST-003"
                        status="In Stock"
                        quantity={4}
                        items={[
                            "Multifunction tester",
                            "RCD tester",
                            "Earth loop impedance tester",
                            "Insulation resistance tester",
                            "Clamp meter",
                            "Proving unit"
                        ]}
                    />
                    <KitCard
                        title="Safety Equipment Kit"
                        subtitle="Personal protective equipment and safety gear"
                        kitId="SAFE-004"
                        status="Low Stock"
                        quantity={2}
                        items={[
                            "Safety glasses and goggles",
                            "Insulated gloves (rated)",
                            "Hard hat",
                            "High-visibility vest",
                            "Safety footwear",
                            "First aid kit"
                        ]}
                    />
                </div>

                {/* Maintenance Schedule */}
                <div className="bg-[#111521] rounded-xl border border-gray-800 p-6 md:p-8">
                    <div className="flex items-center gap-3 mb-2">
                        <AlertCircle className="h-6 w-6 text-orange-500" />
                        <h2 className="text-xl font-bold text-white">Kit Maintenance Schedule</h2>
                    </div>
                    <p className="text-gray-400 text-sm mb-8 ml-9">Regular inspection and maintenance requirements</p>

                    <div className="space-y-4">
                        <div className="bg-[#161b2c] p-4 rounded-lg flex flex-col md:flex-row md:items-center justify-between gap-4 border border-gray-800/50">
                            <div>
                                <div className="text-white font-medium mb-1">Weekly Inspection</div>
                                <div className="text-sm text-gray-500">Visual check of all tools and equipment</div>
                            </div>
                            <span className="px-3 py-1 rounded text-xs font-medium bg-green-900/30 text-green-500 self-start md:self-center">
                                Up to Date
                            </span>
                        </div>

                        <div className="bg-[#161b2c] p-4 rounded-lg flex flex-col md:flex-row md:items-center justify-between gap-4 border border-gray-800/50">
                            <div>
                                <div className="text-white font-medium mb-1">Monthly Calibration</div>
                                <div className="text-sm text-gray-500">Testing equipment calibration check</div>
                            </div>
                            <span className="px-3 py-1 rounded text-xs font-medium bg-orange-900/30 text-orange-500 self-start md:self-center">
                                Due in 5 days
                            </span>
                        </div>

                        <div className="bg-[#161b2c] p-4 rounded-lg flex flex-col md:flex-row md:items-center justify-between gap-4 border border-gray-800/50">
                            <div>
                                <div className="text-white font-medium mb-1">Quarterly Inventory</div>
                                <div className="text-sm text-gray-500">Complete stock count and assessment</div>
                            </div>
                            <span className="px-3 py-1 rounded text-xs font-medium bg-green-900/30 text-green-500 self-start md:self-center">
                                Completed
                            </span>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
