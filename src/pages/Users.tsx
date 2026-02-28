import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Shield, UserCog, Mail, Key, Trash2, Edit2, X, Loader2, AlertCircle } from "lucide-react";
import api from "@/lib/api";

interface User {
    id: string;
    full_name: string;
    email: string;
    role: string;
    created_at: string;
}

export function Users() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Add User Modal state
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [addForm, setAddForm] = useState({ full_name: "", email: "", password: "", role: "admin" });
    const [addLoading, setAddLoading] = useState(false);
    const [addError, setAddError] = useState<string | null>(null);

    // Delete state
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [deleteLoading, setDeleteLoading] = useState(false);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            setError(null);
            const res = await api.get("/api/users");
            setUsers(res.data);
        } catch (err: any) {
            setError(err.response?.data?.message || "Failed to load users.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchUsers(); }, []);

    const handleAddUser = async (e: React.FormEvent) => {
        e.preventDefault();
        setAddError(null);
        setAddLoading(true);
        try {
            await api.post("/api/users", addForm);
            setIsAddOpen(false);
            setAddForm({ full_name: "", email: "", password: "", role: "admin" });
            fetchUsers();
        } catch (err: any) {
            setAddError(err.response?.data?.message || "Failed to create user.");
        } finally {
            setAddLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        setDeleteLoading(true);
        try {
            await api.delete(`/api/users/${id}`);
            setDeleteId(null);
            setUsers(prev => prev.filter(u => u.id !== id));
        } catch (err: any) {
            alert(err.response?.data?.message || "Failed to delete user.");
        } finally {
            setDeleteLoading(false);
        }
    };

    return (
        <div className="space-y-8 py-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-white">System Users</h1>
                    <p className="text-muted-foreground mt-2">Manage administrative access and user roles.</p>
                </div>
                <Button
                    className="bg-engineering-green hover:bg-engineering-green/90 text-white"
                    onClick={() => { setIsAddOpen(true); setAddError(null); }}
                >
                    <Plus className="h-4 w-4 mr-2" />
                    Add New User
                </Button>
            </div>

            <div className="grid gap-6">
                <Card className="bg-card/50 border-border backdrop-blur-sm overflow-hidden">
                    <CardHeader className="bg-[#111521]/50 border-b border-border">
                        <CardTitle className="text-white text-lg flex items-center gap-2">
                            <Shield className="h-5 w-5 text-engineering-blue" />
                            Role Management
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-border text-xs font-semibold uppercase text-muted-foreground bg-[#111521]/30">
                                        <th className="px-6 py-4">Full Name</th>
                                        <th className="px-6 py-4">Email Address</th>
                                        <th className="px-6 py-4">Role</th>
                                        <th className="px-6 py-4">Status</th>
                                        <th className="px-6 py-4 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border">
                                    {loading ? (
                                        <tr>
                                            <td colSpan={5} className="px-6 py-10 text-center">
                                                <Loader2 className="h-6 w-6 animate-spin text-engineering-blue mx-auto" />
                                            </td>
                                        </tr>
                                    ) : error ? (
                                        <tr>
                                            <td colSpan={5} className="px-6 py-10 text-center text-engineering-red text-sm flex items-center justify-center gap-2">
                                                <AlertCircle className="h-4 w-4" /> {error}
                                            </td>
                                        </tr>
                                    ) : users.length === 0 ? (
                                        <tr>
                                            <td colSpan={5} className="px-6 py-10 text-center text-muted-foreground text-sm">No users found.</td>
                                        </tr>
                                    ) : users.map((user) => (
                                        <tr key={user.id} className="group hover:bg-white/5 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-8 w-8 rounded-md bg-[#111521] border border-border flex items-center justify-center">
                                                        <UserCog className="h-4 w-4 text-muted-foreground group-hover:text-white transition-colors" />
                                                    </div>
                                                    <span className="text-sm font-medium text-white">{user.full_name}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                    <Mail className="h-3 w-3" />
                                                    {user.email}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-xs px-2 py-1 rounded bg-engineering-blue/10 text-engineering-blue font-medium border border-engineering-blue/20">
                                                    {user.role}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="inline-flex items-center gap-1.5 text-xs font-medium text-engineering-green">
                                                    <div className="h-1.5 w-1.5 rounded-full bg-engineering-green" />
                                                    Active
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-white hover:bg-white/5">
                                                        <Edit2 className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8 text-engineering-red/70 hover:text-engineering-red hover:bg-engineering-red/10"
                                                        onClick={() => setDeleteId(user.id)}
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
                    </CardContent>
                </Card>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    <Card className="bg-engineering-blue/5 border-engineering-blue/20 backdrop-blur-sm">
                        <CardHeader>
                            <div className="p-2 rounded-md bg-engineering-blue/10 w-fit mb-3">
                                <Shield className="h-5 w-5 text-engineering-blue" />
                            </div>
                            <CardTitle className="text-md text-white">Security Policies</CardTitle>
                            <CardDescription>Manage password requirements and 2FA.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Button variant="outline" size="sm" className="w-full border-engineering-blue/20 text-engineering-blue hover:bg-engineering-blue/10">
                                Configure Policies
                            </Button>
                        </CardContent>
                    </Card>

                    <Card className="bg-engineering-orange/5 border-engineering-orange/20 backdrop-blur-sm">
                        <CardHeader>
                            <div className="p-2 rounded-md bg-engineering-orange/10 w-fit mb-3">
                                <Key className="h-5 w-5 text-engineering-orange" />
                            </div>
                            <CardTitle className="text-md text-white">API Access</CardTitle>
                            <CardDescription>Generate and revoke developer API keys.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Button variant="outline" size="sm" className="w-full border-engineering-orange/20 text-engineering-orange hover:bg-engineering-orange/10">
                                Manage API Keys
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Add User Modal */}
            {isAddOpen && (
                <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
                    <div className="fixed inset-0 bg-black/70 backdrop-blur-md" onClick={() => setIsAddOpen(false)} />
                    <Card className="w-full max-w-md bg-[#0a0d14] border-engineering-blue/30 shadow-2xl relative z-[1001]">
                        <CardHeader className="bg-[#111521]/80 border-b border-white/5 flex flex-row items-center justify-between py-5 px-6">
                            <CardTitle className="text-white text-lg flex items-center gap-2">
                                <UserCog className="h-5 w-5 text-engineering-blue" />
                                Add New User
                            </CardTitle>
                            <button
                                onClick={() => setIsAddOpen(false)}
                                className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </CardHeader>
                        <CardContent className="pt-6">
                            <form onSubmit={handleAddUser} className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-muted-foreground">Full Name</label>
                                    <input
                                        type="text"
                                        placeholder="John Doe"
                                        value={addForm.full_name}
                                        onChange={e => setAddForm(f => ({ ...f, full_name: e.target.value }))}
                                        required
                                        className="w-full px-4 py-2.5 bg-[#111521] border border-border rounded-lg text-sm text-white focus:outline-none focus:ring-1 focus:ring-engineering-blue transition-all"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-muted-foreground">Email Address</label>
                                    <input
                                        type="email"
                                        placeholder="name@aerenewable.com"
                                        value={addForm.email}
                                        onChange={e => setAddForm(f => ({ ...f, email: e.target.value }))}
                                        required
                                        className="w-full px-4 py-2.5 bg-[#111521] border border-border rounded-lg text-sm text-white focus:outline-none focus:ring-1 focus:ring-engineering-blue transition-all"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-muted-foreground">Password</label>
                                    <input
                                        type="password"
                                        placeholder="••••••••"
                                        value={addForm.password}
                                        onChange={e => setAddForm(f => ({ ...f, password: e.target.value }))}
                                        required
                                        minLength={6}
                                        className="w-full px-4 py-2.5 bg-[#111521] border border-border rounded-lg text-sm text-white focus:outline-none focus:ring-1 focus:ring-engineering-blue transition-all"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-muted-foreground">Role</label>
                                    <select
                                        value={addForm.role}
                                        onChange={e => setAddForm(f => ({ ...f, role: e.target.value }))}
                                        className="w-full px-4 py-2.5 bg-[#111521] border border-border rounded-lg text-sm text-white focus:outline-none focus:ring-1 focus:ring-engineering-blue transition-all"
                                    >
                                        <option value="admin">Admin</option>
                                        <option value="engineer">Engineer</option>
                                        <option value="sales">Sales</option>
                                        <option value="technician">Technician</option>
                                    </select>
                                </div>

                                {addError && (
                                    <div className="flex items-center gap-2 text-sm text-engineering-red bg-engineering-red/10 border border-engineering-red/20 rounded-lg px-4 py-3">
                                        <AlertCircle className="h-4 w-4 flex-shrink-0" />
                                        <span>{addError}</span>
                                    </div>
                                )}

                                <div className="flex gap-3 pt-2">
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        className="flex-1 text-muted-foreground hover:text-white"
                                        onClick={() => setIsAddOpen(false)}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        type="submit"
                                        disabled={addLoading}
                                        className="flex-1 bg-engineering-green hover:bg-engineering-green/90 text-white"
                                    >
                                        {addLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Create User"}
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* Delete Confirm Modal */}
            {deleteId && (
                <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4">
                    <div className="fixed inset-0 bg-black/80 backdrop-blur-md" onClick={() => setDeleteId(null)} />
                    <Card className="w-full max-w-sm bg-[#0a0d14] border-engineering-red/30 shadow-2xl relative z-[2001]">
                        <CardHeader className="text-center pt-10">
                            <div className="mx-auto h-16 w-16 rounded-2xl bg-engineering-red/10 border border-engineering-red/20 flex items-center justify-center mb-6">
                                <Trash2 className="h-8 w-8 text-engineering-red" />
                            </div>
                            <h2 className="text-2xl font-black text-white uppercase tracking-tight">Delete User?</h2>
                            <p className="text-sm text-muted-foreground mt-4 leading-relaxed font-sans px-4">
                                This will permanently remove the user and their access.
                            </p>
                        </CardHeader>
                        <CardContent className="flex flex-col gap-3 pt-8 pb-10 px-8">
                            <Button
                                className="w-full bg-engineering-red hover:bg-engineering-red/90 text-white font-black uppercase tracking-widest py-6 rounded-xl"
                                disabled={deleteLoading}
                                onClick={() => handleDelete(deleteId)}
                            >
                                {deleteLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Confirm Deletion"}
                            </Button>
                            <Button
                                variant="ghost"
                                className="w-full text-muted-foreground hover:text-white font-bold uppercase tracking-widest py-4"
                                onClick={() => setDeleteId(null)}
                            >
                                Cancel Action
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    );
}
