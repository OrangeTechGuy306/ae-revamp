import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Users, Zap, Battery, Activity, ArrowUpRight, ArrowDownRight } from "lucide-react";

export function Overview() {
    const stats = [
        {
            title: "Total Customers",
            value: "1,284",
            change: "+12.5%",
            trend: "up",
            icon: Users,
            color: "text-engineering-blue",
            bg: "bg-engineering-blue/10",
        },
        {
            title: "Active Projets",
            value: "42",
            change: "+3.2%",
            trend: "up",
            icon: Zap,
            color: "text-engineering-orange",
            bg: "bg-engineering-orange/10",
        },
        {
            title: "System Health",
            value: "98.2%",
            change: "+0.4%",
            trend: "up",
            icon: Activity,
            color: "text-engineering-green",
            bg: "bg-engineering-green/10",
        },
        {
            title: "Energy Generated",
            value: "12.4 MWh",
            change: "-2.1%",
            trend: "down",
            icon: Battery,
            color: "text-engineering-red",
            bg: "bg-engineering-red/10",
        },
    ];

    return (
        <div className="space-y-8 py-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-white">Dashboard Overview</h1>
                <p className="text-muted-foreground mt-2">
                    Monitor your solar operations and customer engagement in real-time.
                </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat) => (
                    <Card key={stat.title} className="bg-card/50 border-border backdrop-blur-sm">
                        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                {stat.title}
                            </CardTitle>
                            <div className={`p-2 rounded-md ${stat.bg}`}>
                                <stat.icon className={`h-4 w-4 ${stat.color}`} />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-white">{stat.value}</div>
                            <div className="flex items-center mt-1">
                                {stat.trend === "up" ? (
                                    <ArrowUpRight className="h-4 w-4 text-engineering-green mr-1" />
                                ) : (
                                    <ArrowDownRight className="h-4 w-4 text-engineering-red mr-1" />
                                )}
                                <span className={`text-xs font-medium ${stat.trend === "up" ? "text-engineering-green" : "text-engineering-red"}`}>
                                    {stat.change}
                                </span>
                                <span className="text-xs text-muted-foreground ml-1">from last month</span>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-full lg:col-span-4 bg-card/50 border-border backdrop-blur-sm">
                    <CardHeader>
                        <CardTitle className="text-white">Recent Activity</CardTitle>
                        <CardDescription>Latest system updates and installations</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-6">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="flex items-center gap-4">
                                    <div className="h-10 w-10 rounded-full bg-[#111521] border border-border flex items-center justify-center">
                                        <Zap className="h-5 w-5 text-engineering-blue" />
                                    </div>
                                    <div className="flex-1 space-y-1">
                                        <p className="text-sm font-medium text-white">New Installation Complete</p>
                                        <p className="text-xs text-muted-foreground">Customer ID: #4521 - 5kW Residential System</p>
                                    </div>
                                    <div className="text-xs text-muted-foreground">2 hours ago</div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                <Card className="col-span-full lg:col-span-3 bg-card/50 border-border backdrop-blur-sm">
                    <CardHeader>
                        <CardTitle className="text-white">System Status</CardTitle>
                        <CardDescription>Live monitoring across regions</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {['Lagos', 'Abuja', 'Port Harcourt', 'Kano'].map((region, idx) => (
                                <div key={region} className="flex items-center justify-between">
                                    <span className="text-sm text-muted-foreground">{region}</span>
                                    <div className="flex items-center gap-2">
                                        <div className={`h-2 w-2 rounded-full ${idx === 2 ? 'bg-engineering-orange' : 'bg-engineering-green'}`} />
                                        <span className="text-xs font-medium text-white">{idx === 2 ? 'Warning' : 'Optimal'}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
