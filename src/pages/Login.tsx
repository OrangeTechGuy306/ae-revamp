import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShieldCheck, Mail, Lock, ArrowRight } from "lucide-react";

export function Login() {
    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-6 relative overflow-hidden">
            {/* Background Orbs */}
            <div className="absolute top-1/4 -left-20 w-80 h-80 bg-engineering-blue/10 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-engineering-orange/10 rounded-full blur-[100px] pointer-events-none" />

            <div className="w-full max-w-md relative z-10">
                <div className="flex justify-center mb-8">
                    <div className="h-24 w-24 bg-white rounded-2xl flex items-center justify-center shadow-2xl p-2">
                        <img src="/logo.jpeg" alt="Logo" className="w-full h-full object-contain" />
                    </div>
                </div>

                <Card className="bg-card/50 border-border backdrop-blur-xl">
                    <CardHeader className="text-center">
                        <CardTitle className="text-2xl font-bold text-white tracking-tight">Welcome Back</CardTitle>
                        <CardDescription>Enter your credentials to access the A.E Renewable dashboard.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6 pt-4">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-muted-foreground">Email Address</label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <input
                                        type="email"
                                        placeholder="name@aerenewable.com"
                                        className="w-full pl-10 pr-4 py-2.5 bg-[#111521] border border-border rounded-lg text-sm text-white focus:outline-none focus:ring-1 focus:ring-engineering-blue transition-all"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <label className="text-sm font-medium text-muted-foreground">Password</label>
                                    <a href="#" className="text-xs text-engineering-blue hover:underline">Forgot password?</a>
                                </div>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <input
                                        type="password"
                                        placeholder="••••••••"
                                        className="w-full pl-10 pr-4 py-2.5 bg-[#111521] border border-border rounded-lg text-sm text-white focus:outline-none focus:ring-1 focus:ring-engineering-blue transition-all"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center space-x-2">
                            <input type="checkbox" id="remember" className="h-4 w-4 rounded border-border bg-[#111521] text-engineering-blue" />
                            <label htmlFor="remember" className="text-sm text-muted-foreground">Remember me for 30 days</label>
                        </div>

                        <Button className="w-full bg-engineering-blue hover:bg-engineering-blue/90 text-white py-6 text-md font-semibold font-sans">
                            Sign In
                            <ArrowRight className="ml-2 h-5 w-5" />
                        </Button>

                        <div className="text-center text-sm text-muted-foreground">
                            Need help? <a href="#" className="text-engineering-blue hover:underline">Contact system administrator</a>
                        </div>
                    </CardContent>
                </Card>

                <div className="mt-8 flex items-center justify-center gap-2 text-muted-foreground text-xs uppercase tracking-widest font-medium">
                    <ShieldCheck className="h-4 w-4" />
                    Secure Enterprise Gateway
                </div>
            </div>
        </div>
    );
}
