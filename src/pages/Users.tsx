import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Shield, UserCog, Mail, Key, Trash2, Edit2 } from "lucide-react";

export function Users() {
    const users = [
        { id: 1, name: "Admin User", email: "admin@aerenewable.com", role: "Super Admin", status: "Active" },
        { id: 2, name: "Engineer Dave", email: "dave.e@aerenewable.com", role: "Engineer", status: "Active" },
        { id: 3, name: "Sales Support", email: "sales@aerenewable.com", role: "Sales", status: "Active" },
        { id: 4, name: "Maintenance Lead", email: "tech@aerenewable.com", role: "Technician", status: "Inactive" },
    ];

    return (
        <div className="space-y-8 py-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-white">System Users</h1>
                    <p className="text-muted-foreground mt-2">Manage administrative access and user roles.</p>
                </div>
                <Button className="bg-engineering-green hover:bg-engineering-green/90 text-white">
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
                                    {users.map((user) => (
                                        <tr key={user.id} className="group hover:bg-white/5 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-8 w-8 rounded-md bg-[#111521] border border-border flex items-center justify-center">
                                                        <UserCog className="h-4 w-4 text-muted-foreground group-hover:text-white transition-colors" />
                                                    </div>
                                                    <span className="text-sm font-medium text-white">{user.name}</span>
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
                                                <span className={`inline-flex items-center gap-1.5 text-xs font-medium ${user.status === 'Active' ? 'text-engineering-green' : 'text-engineering-red'
                                                    }`}>
                                                    <div className={`h-1.5 w-1.5 rounded-full ${user.status === 'Active' ? 'bg-engineering-green' : 'bg-engineering-red'}`} />
                                                    {user.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-white hover:bg-white/5">
                                                        <Edit2 className="h-4 w-4" />
                                                    </Button>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-engineering-red/70 hover:text-engineering-red hover:bg-engineering-red/10">
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
        </div>
    );
}
