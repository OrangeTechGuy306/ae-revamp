import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    Search, Filter, User, Eye,
    Trash2, CheckCircle2, XCircle, Loader2, AlertCircle, Phone, MapPin
} from "lucide-react";
import api from "@/lib/api";

export function Installers() {
    const [installers, setInstallers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState("");

    const fetchInstallers = async () => {
        try {
            setLoading(true);
            setError(null);
            const res = await api.get("/api/installers");
            setInstallers(res.data);
        } catch (err: any) {
            setError(err.response?.data?.message || "Failed to load installers.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchInstallers();
    }, []);

    const handleUpdateStatus = async (id: string, status: string) => {
        try {
            await api.patch(`/api/installers/${id}/status`, { status });
            setInstallers(prev => prev.map(inst => inst.id === id ? { ...inst, status } : inst));
        } catch (err: any) {
            alert(err.response?.data?.message || "Failed to update status");
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm("Are you sure you want to delete this installer?")) return;
        try {
            await api.delete(`/api/installers/${id}`);
            setInstallers(prev => prev.filter(inst => inst.id !== id));
        } catch (err: any) {
            alert(err.response?.data?.message || "Failed to delete installer");
        }
    };

    const [selectedInstaller, setSelectedInstaller] = useState<any>(null);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);

    const filteredInstallers = installers.filter(inst =>
        inst.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inst.phone.includes(searchTerm)
    );

    const handleViewDetails = (installer: any) => {
        setSelectedInstaller(installer);
        setIsViewModalOpen(true);
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white">Installer Network</h1>
                    <p className="text-gray-400 text-sm">Manage and verify company installers</p>
                </div>
            </div>

            <Card className="bg-[#111521] border-gray-800">
                <CardHeader className="border-b border-gray-800 pb-4">
                    <div className="flex flex-col md:flex-row gap-4 justify-between">
                        <div className="relative flex-1 max-w-sm">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                            <input
                                type="text"
                                placeholder="Search installers..."
                                className="w-full bg-[#0b0e14] border-gray-800 rounded-md py-2 pl-10 pr-4 text-sm text-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="flex gap-2">
                            <Button variant="outline" size="sm" className="bg-transparent border-gray-800 text-gray-400">
                                <Filter className="h-4 w-4 mr-2" />
                                Filter
                            </Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-20 text-gray-500">
                            <Loader2 className="h-8 w-8 animate-spin mb-4" />
                            <p>Loading installers...</p>
                        </div>
                    ) : error ? (
                        <div className="flex flex-col items-center justify-center py-20 text-red-400">
                            <AlertCircle className="h-8 w-8 mb-4" />
                            <p>{error}</p>
                            <Button variant="ghost" className="mt-4 text-blue-400" onClick={fetchInstallers}>Try Again</Button>
                        </div>
                    ) : filteredInstallers.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 text-gray-500">
                            <User className="h-12 w-12 mb-4 opacity-20" />
                            <p>No installers found</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="border-b border-gray-800 text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        <th className="px-6 py-4">Installer</th>
                                        <th className="px-6 py-4">Contact</th>
                                        <th className="px-6 py-4">Address</th>
                                        <th className="px-6 py-4">Status</th>
                                        <th className="px-6 py-4">Joined</th>
                                        <th className="px-6 py-4 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-800">
                                    {filteredInstallers.map((inst) => (
                                        <tr key={inst.id} className="text-sm text-gray-300 hover:bg-white/5 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-10 w-10 rounded-full bg-gray-800 border border-gray-700 overflow-hidden flex items-center justify-center">
                                                        {inst.photo_url ? (
                                                            <img src={inst.photo_url} alt="" className="h-full w-full object-cover" />
                                                        ) : (
                                                            <User className="h-5 w-5 text-gray-600" />
                                                        )}
                                                    </div>
                                                    <div className="font-medium text-gray-200">
                                                        {inst.full_name}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="space-y-1">
                                                    <div className="flex items-center text-xs">
                                                        <Phone className="h-3 w-3 mr-1 text-gray-500" />
                                                        {inst.phone}
                                                    </div>
                                                    {inst.other_phone && (
                                                        <div className="text-[10px] text-gray-500 ml-4">
                                                            Alt: {inst.other_phone}
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 max-w-xs">
                                                <div className="flex items-start text-xs text-gray-400">
                                                    <MapPin className="h-3 w-3 mr-1 mt-0.5 text-gray-500 shrink-0" />
                                                    <span className="truncate">{inst.address}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium uppercase tracking-wider ${inst.status === 'verified' ? 'bg-green-500/10 text-green-500 border border-green-500/20' :
                                                    inst.status === 'rejected' ? 'bg-red-500/10 text-red-500 border border-red-500/20' :
                                                        'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20'
                                                    }`}>
                                                    {inst.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-xs text-gray-500">
                                                {new Date(inst.created_at).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8 text-blue-500 hover:bg-blue-500/10"
                                                        onClick={() => handleViewDetails(inst)}
                                                        title="View Details"
                                                    >
                                                        <Eye className="h-4 w-4" />
                                                    </Button>
                                                    {inst.status !== 'verified' && (
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-8 w-8 text-green-500 hover:bg-green-500/10"
                                                            onClick={() => handleUpdateStatus(inst.id, 'verified')}
                                                            title="Verify Installer"
                                                        >
                                                            <CheckCircle2 className="h-4 w-4" />
                                                        </Button>
                                                    )}
                                                    {inst.status !== 'rejected' && (
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-8 w-8 text-red-500 hover:bg-red-500/10"
                                                            onClick={() => handleUpdateStatus(inst.id, 'rejected')}
                                                            title="Reject Installer"
                                                        >
                                                            <XCircle className="h-4 w-4" />
                                                        </Button>
                                                    )}
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8 text-gray-500 hover:bg-white/5"
                                                        onClick={() => handleDelete(inst.id)}
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* View Details Modal */}
            {isViewModalOpen && selectedInstaller && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-[#111521] border border-gray-800 rounded-xl max-w-2xl w-full shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="flex justify-between items-center p-6 border-b border-gray-800">
                            <div>
                                <h2 className="text-xl font-bold text-white">Installer Details</h2>
                                <p className="text-gray-400 text-xs">Review registration information</p>
                            </div>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-white" onClick={() => setIsViewModalOpen(false)}>
                                <XCircle className="h-5 w-5" />
                            </Button>
                        </div>

                        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Photo Section */}
                            <div className="space-y-4 text-center">
                                <div className="aspect-[3/4] rounded-lg bg-gray-900 border border-gray-800 overflow-hidden flex items-center justify-center shadow-inner">
                                    {selectedInstaller.photo_url ? (
                                        <img src={selectedInstaller.photo_url} alt={selectedInstaller.full_name} className="w-full h-full object-cover" />
                                    ) : (
                                        <User className="h-20 w-20 text-gray-800" />
                                    )}
                                </div>
                                <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${selectedInstaller.status === 'verified' ? 'bg-green-500/10 text-green-500' :
                                    selectedInstaller.status === 'rejected' ? 'bg-red-500/10 text-red-500' :
                                        'bg-yellow-500/10 text-yellow-500'
                                    }`}>
                                    {selectedInstaller.status}
                                </div>
                            </div>

                            {/* Details Section */}
                            <div className="space-y-6">
                                <div>
                                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-1">Full Name</label>
                                    <p className="text-lg font-semibold text-white">{selectedInstaller.full_name}</p>
                                </div>

                                <div className="grid grid-cols-1 gap-4">
                                    <div>
                                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-1">Primary Phone</label>
                                        <div className="flex items-center gap-2 text-gray-200">
                                            <Phone className="h-4 w-4 text-blue-500" />
                                            {selectedInstaller.phone}
                                        </div>
                                    </div>
                                    {selectedInstaller.other_phone && (
                                        <div>
                                            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-1">Other Number</label>
                                            <div className="flex items-center gap-2 text-gray-200">
                                                <Phone className="h-4 w-4 text-blue-500" />
                                                {selectedInstaller.other_phone}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div>
                                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-1">Home Address</label>
                                    <div className="flex items-start gap-2 text-gray-200">
                                        <MapPin className="h-4 w-4 text-blue-500 shrink-0 mt-1" />
                                        <p className="text-sm leading-relaxed">{selectedInstaller.address}</p>
                                    </div>
                                </div>

                                <div>
                                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-1">Registration Date</label>
                                    <div className="flex items-center gap-2 text-gray-400 text-sm">
                                        {new Date(selectedInstaller.created_at).toLocaleString()}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="p-6 bg-gray-900/30 border-t border-gray-800 flex justify-end gap-3">
                            {selectedInstaller.status !== 'rejected' && (
                                <Button
                                    className="bg-red-600 hover:bg-red-700 text-white font-bold"
                                    onClick={() => {
                                        handleUpdateStatus(selectedInstaller.id, 'rejected');
                                        setIsViewModalOpen(false);
                                    }}
                                >
                                    Reject Application
                                </Button>
                            )}
                            {selectedInstaller.status !== 'verified' && (
                                <Button
                                    className="bg-green-600 hover:bg-green-700 text-white font-bold"
                                    onClick={() => {
                                        handleUpdateStatus(selectedInstaller.id, 'verified');
                                        setIsViewModalOpen(false);
                                    }}
                                >
                                    Verify Installer
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
