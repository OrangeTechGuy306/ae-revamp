import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, Bell, Shield, Globe, Save, Loader2 } from "lucide-react";
import api from "@/lib/api";

export function Settings() {
    const [profile, setProfile] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await api.get("/api/users/profile");
                setProfile(res.data);
            } catch (err) {
                console.error("Failed to fetch profile", err);
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    if (loading) {
        return (
            <div className="flex h-[50vh] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-engineering-blue" />
            </div>
        );
    }
    return (
        <div className="space-y-8 py-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-white">Settings</h1>
                <p className="text-muted-foreground mt-2">Manage your account and system configuration.</p>
            </div>

            <div className="flex flex-col lg:flex-row gap-8">
                {/* Navigation Sidebar */}
                <div className="w-full lg:w-64 flex-shrink-0">
                    <div className="flex flex-row lg:flex-col gap-2 overflow-x-auto hide-scrollbar pb-2 lg:pb-0">
                        <button className="flex items-center gap-3 px-4 py-2.5 rounded-lg bg-engineering-blue/10 text-engineering-blue font-medium transition-colors whitespace-nowrap lg:whitespace-normal text-left">
                            <User className="h-4 w-4 shrink-0" />
                            Profile Information
                        </button>
                        <button className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-muted-foreground hover:text-white hover:bg-white/5 font-medium transition-colors whitespace-nowrap lg:whitespace-normal text-left">
                            <Bell className="h-4 w-4 shrink-0" />
                            Notifications
                        </button>
                        <button className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-muted-foreground hover:text-white hover:bg-white/5 font-medium transition-colors whitespace-nowrap lg:whitespace-normal text-left">
                            <Shield className="h-4 w-4 shrink-0" />
                            Security & Access
                        </button>
                        <button className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-muted-foreground hover:text-white hover:bg-white/5 font-medium transition-colors whitespace-nowrap lg:whitespace-normal text-left">
                            <Globe className="h-4 w-4 shrink-0" />
                            System Preferences
                        </button>
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="flex-1 space-y-6 min-w-0">
                    <Card className="bg-card/50 border-border backdrop-blur-sm">
                        <CardHeader>
                            <CardTitle className="text-white text-lg">Profile Information</CardTitle>
                            <CardDescription>Update your personal details and how others see you on the platform.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-8">
                            {/* Personal Details Section */}
                            <div className="space-y-4">
                                <h3 className="text-sm font-medium text-white border-b border-border pb-2">Personal Details</h3>
                                <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-muted-foreground">Full Name</label>
                                        <input
                                            type="text"
                                            defaultValue={profile?.full_name || "Admin User"}
                                            className="w-full px-4 py-2 bg-[#111521] border border-border rounded-md text-sm text-white focus:outline-none focus:ring-1 focus:ring-engineering-blue transition-all"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-muted-foreground">Email Address</label>
                                        <input
                                            type="email"
                                            defaultValue={profile?.email || "admin@aerenewable.com"}
                                            className="w-full px-4 py-2 bg-[#111521] border border-border rounded-md text-sm text-white focus:outline-none focus:ring-1 focus:ring-engineering-blue transition-all"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-muted-foreground">Job Title</label>
                                        <input
                                            type="text"
                                            defaultValue="Project Manager"
                                            className="w-full px-4 py-2 bg-[#111521] border border-border rounded-md text-sm text-white focus:outline-none focus:ring-1 focus:ring-engineering-blue transition-all"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-muted-foreground">Department</label>
                                        <input
                                            type="text"
                                            defaultValue="Engineering"
                                            className="w-full px-4 py-2 bg-[#111521] border border-border rounded-md text-sm text-white focus:outline-none focus:ring-1 focus:ring-engineering-blue transition-all"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Bio Section */}
                            <div className="space-y-4">
                                <h3 className="text-sm font-medium text-white border-b border-border pb-2">About</h3>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-muted-foreground">Biography</label>
                                    <textarea
                                        rows={4}
                                        className="w-full px-4 py-2 bg-[#111521] border border-border rounded-md text-sm text-white focus:outline-none focus:ring-1 focus:ring-engineering-blue transition-all resize-y min-h-[100px]"
                                        placeholder="Tell us about yourself..."
                                    />
                                    <p className="text-xs text-muted-foreground">Brief description for your profile. URLs are hyperlinked.</p>
                                </div>
                            </div>

                            <div className="flex justify-end pt-4 border-t border-border mt-6">
                                <Button className="bg-engineering-blue hover:bg-engineering-blue/90 text-white shadow-lg shadow-blue-900/20">
                                    <Save className="h-4 w-4 mr-2" />
                                    Save Changes
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-card/50 border-border border-dashed border-red-500/20 backdrop-blur-sm">
                        <CardHeader>
                            <CardTitle className="text-white text-lg font-bold">Danger Zone</CardTitle>
                            <CardDescription>Permanently delete your account and all associated data.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Button variant="outline" className="border-red-500/50 text-red-500 hover:bg-red-500/10">
                                Delete Account
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
