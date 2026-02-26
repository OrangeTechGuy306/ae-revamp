import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, Bell, Shield, Globe, Save } from "lucide-react";

export function Settings() {
    return (
        <div className="space-y-8 py-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-white">Settings</h1>
                <p className="text-muted-foreground mt-2">Manage your account and system configuration.</p>
            </div>

            <div className="grid gap-8 lg:grid-cols-4 whitespace-nowrap overflow-x-auto pb-4 lg:overflow-x-visible lg:pb-0">
                <div className="lg:col-span-1 space-y-1">
                    <button className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg bg-engineering-blue/10 text-engineering-blue font-medium transition-colors">
                        <User className="h-4 w-4" />
                        Profile Information
                    </button>
                    <button className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-muted-foreground hover:text-white hover:bg-white/5 font-medium transition-colors text-left">
                        <Bell className="h-4 w-4" />
                        Notifications
                    </button>
                    <button className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-muted-foreground hover:text-white hover:bg-white/5 font-medium transition-colors text-left">
                        <Shield className="h-4 w-4" />
                        Security & Access
                    </button>
                    <button className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-muted-foreground hover:text-white hover:bg-white/5 font-medium transition-colors text-left">
                        <Globe className="h-4 w-4" />
                        System Preferences
                    </button>
                </div>

                <div className="lg:col-span-3 space-y-6">
                    <Card className="bg-card/50 border-border backdrop-blur-sm">
                        <CardHeader>
                            <CardTitle className="text-white text-lg">Profile Information</CardTitle>
                            <CardDescription>Update your personal details and how others see you on the platform.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-muted-foreground">Full Name</label>
                                    <input
                                        type="text"
                                        defaultValue="Admin User"
                                        className="w-full px-4 py-2 bg-[#111521] border border-border rounded-md text-sm text-white focus:outline-none focus:ring-1 focus:ring-engineering-blue transition-all"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-muted-foreground">Email Address</label>
                                    <input
                                        type="email"
                                        defaultValue="admin@aerenewable.com"
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

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-muted-foreground">Biography</label>
                                <textarea
                                    rows={4}
                                    className="w-full px-4 py-2 bg-[#111521] border border-border rounded-md text-sm text-white focus:outline-none focus:ring-1 focus:ring-engineering-blue transition-all resize-none"
                                    placeholder="Tell us about yourself..."
                                />
                            </div>

                            <div className="flex justify-end pt-4">
                                <Button className="bg-engineering-blue hover:bg-engineering-blue/90 text-white">
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
