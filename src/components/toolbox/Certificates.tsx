

import { FileText, CheckCircle, Clock, Users, FileCheck } from "lucide-react";

interface CertCardProps {
    title: string;
    description: string;
    status: 'Valid' | 'Expires Soon' | 'Expired';
}

const CertCard = ({ title, description, status }: CertCardProps) => (
    <div className="bg-[#111521] p-5 rounded-lg border border-gray-800 flex items-center justify-between group hover:border-gray-700 transition-colors">
        <div>
            <h4 className="text-white font-semibold mb-1">{title}</h4>
            <p className="text-sm text-gray-500">{description}</p>
        </div>
        <div>
            <span className={`px-3 py-1 rounded-full text-xs font-medium border
                ${status === 'Valid' ? 'bg-green-900/20 text-green-500 border-green-900/30' :
                    status === 'Expires Soon' ? 'bg-orange-900/20 text-orange-500 border-orange-900/30' :
                        'bg-red-900/20 text-red-500 border-red-900/30'}`}>
                {status}
            </span>
        </div>
    </div>
);

export default function Certificates() {
    return (
        <div className="min-h-screen bg-[#0b0e14] text-white p-6 lg:p-10 font-sans">
            <div className="max-w-6xl mx-auto">

                {/* Header */}
                <div className="flex items-center gap-4 mb-10">
                    <div className="p-3 bg-green-900/20 rounded-xl text-green-500 border border-green-900/30">
                        <FileText className="h-8 w-8" />
                    </div>
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-white">Certificates & Documentation</h1>
                        <p className="text-gray-400">Compliance and certification management</p>
                    </div>
                </div>

                {/* Stats Row */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    {/* Active - Designed a bit differently in screenshot, matching it */}
                    <div className="bg-[#111521] p-6 rounded-xl border border-gray-800 h-full">
                        <div className="flex items-center gap-2 text-green-500 mb-4">
                            <CheckCircle className="h-5 w-5" />
                            <span className="font-semibold text-white">Active</span>
                        </div>
                        <div className="text-4xl font-bold text-green-500 mb-1">12</div>
                        <div className="text-sm text-gray-500">Valid certificates</div>
                    </div>

                    <div className="bg-[#111521] p-6 rounded-xl border border-gray-800 h-full">
                        <div className="flex items-center gap-2 text-orange-500 mb-4">
                            <Clock className="h-5 w-5" />
                            <span className="font-semibold text-white">Expiring Soon</span>
                        </div>
                        <div className="text-4xl font-bold text-orange-500 mb-1">3</div>
                        <div className="text-sm text-gray-500">Within 30 days</div>
                    </div>

                    <div className="bg-[#111521] p-6 rounded-xl border border-gray-800 h-full">
                        <div className="flex items-center gap-2 text-blue-500 mb-4">
                            <Users className="h-5 w-5" />
                            <span className="font-semibold text-white">Personnel</span>
                        </div>
                        <div className="text-4xl font-bold text-blue-500 mb-1">8</div>
                        <div className="text-sm text-gray-500">Certified engineers</div>
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="bg-[#111521] border border-gray-800 rounded-xl p-6 md:p-8 mb-8">
                    <div className="mb-8">
                        <h2 className="text-xl font-bold text-white mb-2">Required Certifications</h2>
                        <p className="text-gray-400 text-sm">Industry standard certifications for electrical work</p>
                    </div>

                    <div className="space-y-4">
                        <CertCard
                            title="Electrical Installation Certificate (EIC)"
                            description="BS 7671 compliant installation records"
                            status="Valid"
                        />
                        <CertCard
                            title="Minor Electrical Installation Works Certificate"
                            description="For additions or alterations to existing installations"
                            status="Valid"
                        />
                        <CertCard
                            title="Electrical Installation Condition Report (EICR)"
                            description="Periodic inspection and testing"
                            status="Expires Soon"
                        />
                        <CertCard
                            title="PAT Testing Certificate"
                            description="Portable appliance testing records"
                            status="Valid"
                        />
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="flex gap-4">
                    <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-medium flex items-center transition-colors">
                        <FileCheck className="h-4 w-4 mr-2" />
                        Generate Certificate
                    </button>
                    <button className="bg-[#161b2c] border border-gray-700 hover:bg-gray-800 text-gray-300 px-6 py-2.5 rounded-lg font-medium transition-colors">
                        View Archive
                    </button>
                </div>

            </div>
        </div>
    );
}
