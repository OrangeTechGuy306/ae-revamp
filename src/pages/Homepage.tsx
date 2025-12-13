import { Link } from "react-router-dom"
import { Sun, BatteryCharging, ToggleLeft, Activity, Package, ArrowRight } from "lucide-react"

const tools = [
    {
        name: "Panel Sizer",
        description: "Calculate the number of solar panels needed for your system based on load and location.",
        icon: Sun,
        href: "/panel-sizer",
        color: "text-amber-500",
    },
    {
        name: "Charge Controller Sizer",
        description: "Determine the right size for your MPPT or PWM charge controller.",
        icon: BatteryCharging,
        href: "/charge-controller",
        color: "text-green-500",
    },
    {
        name: "Breaker Selection",
        description: "Select the correct circuit breaker size for your solar installation safety.",
        icon: ToggleLeft,
        href: "/breaker-selection",
        color: "text-blue-500",
    },
    {
        name: "Cable Sizer",
        description: "Calculate the appropriate cable gauge to minimize voltage drop.",
        icon: Activity,
        href: "/cable-sizer",
        color: "text-red-500",
    },
    {
        name: "Solar Kit Generator",
        description: "Generate a complete solar kit list based on your requirements.",
        icon: Package,
        href: "/kit",
        color: "text-purple-500",
    },
]

export function Homepage() {
    return (
        <div className="space-y-12">
            {/* Hero Section */}
            <section className="text-center py-16 lg:py-24">
                <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl mb-6">
                    <span className="block text-gray-900 dark:text-gray-100">Engineering Tools Platform</span>
                    <span className="block text-indigo-600 dark:text-indigo-400 mt-2">Electrical Safety & Management</span>
                </h1>
                <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500 dark:text-gray-400">
                    A comprehensive suite of tools for renewable energy professionals to design, size, and manage solar installations efficiently.
                </p>
                <div className="mt-10 flex justify-center gap-4">
                    <Link
                        to="/toolbox"
                        className="px-8 py-3 rounded-md bg-indigo-600 hover:bg-indigo-700 text-white font-medium transition-colors shadow-lg hover:shadow-xl"
                    >
                        Get Started
                    </Link>
                    <a
                        href="#"
                        className="px-8 py-3 rounded-md bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-700 font-medium hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
                    >
                        Learn More
                    </a>
                </div>
            </section>

            {/* Feature Grid */}
            <section className="py-12">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Available Tools</h2>
                    <p className="mt-2 text-gray-500 dark:text-gray-400">Select a tool to begin your calculation.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {tools.map((tool) => (
                        <Link
                            key={tool.name}
                            to={tool.href}
                            className="group relative p-6 bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 hover:shadow-md hover:border-indigo-500 dark:hover:border-indigo-500 transition-all duration-300"
                        >
                            <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity">
                                <ArrowRight className="h-5 w-5 text-indigo-500" />
                            </div>
                            <div className={`h-12 w-12 rounded-lg bg-gray-50 dark:bg-slate-800 flex items-center justify-center mb-4 ${tool.color}`}>
                                <tool.icon className="h-7 w-7" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                                {tool.name}
                            </h3>
                            <p className="mt-2 text-gray-500 dark:text-gray-400">
                                {tool.description}
                            </p>
                        </Link>
                    ))}
                </div>
            </section>
        </div>
    )
}
