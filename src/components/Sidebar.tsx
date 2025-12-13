import { Link, useLocation } from "react-router-dom"
import {
    Zap,
    AppWindow,
    AlignLeft,
    Box,
    Wrench,
    FileCheck,
    ClipboardCheck,
    Shield,
    Menu,
} from "lucide-react"
import { cn } from "../lib/utils"

const sidebarItems = [
    { name: "Home", href: "/", icon: Zap },
    { name: "Panel Sizer", href: "/panel-sizer", icon: AppWindow },
    { name: "Charge Controller", href: "/charge-controller", icon: AlignLeft },
    { name: "Breaker Selection", href: "/breaker-selection", icon: Zap },
    { name: "Cable Sizer", href: "/cable-sizer", icon: FileCheck },
    { name: "Kit", href: "/kit", icon: Box },
    { name: "ToolBox", href: "/toolbox", icon: Wrench },
    { name: "Certificate", href: "/certificate", icon: FileCheck },
    { name: "Completion", href: "/completion", icon: ClipboardCheck },
    { name: "Earthing", href: "/earthing", icon: Shield },
]

interface SidebarProps {
    isOpen: boolean
    toggleSidebar: () => void
    collapsed: boolean
    toggleCollapse: () => void
}

export function Sidebar({ isOpen, toggleSidebar, collapsed, toggleCollapse }: SidebarProps) {
    const location = useLocation()

    return (
        <>
            {/* Mobile Overlay */}
            <div
                className={cn(
                    "fixed inset-0 z-40 bg-gray-900/50 backdrop-blur-sm transition-opacity lg:hidden",
                    isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
                )}
                onClick={toggleSidebar}
            />

            {/* Sidebar Container */}
            <aside
                className={cn(
                    "fixed inset-y-0 left-0 z-50 flex flex-col bg-[#0f1422] border-r border-[#1e2736] transition-all duration-300 ease-in-out",
                    collapsed ? "w-16" : "w-64",
                    isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
                )}
            >
                {/* Header */}
                <div className="flex items-center justify-between h-16 px-4 border-b border-[#1e2736]">
                    {!collapsed && (
                        <span className="text-xl font-bold text-white tracking-wide">
                            ENGR Tools
                        </span>
                    )}
                    <button
                        onClick={toggleCollapse}
                        className="p-1.5 rounded-md text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
                    >
                        <Menu className="h-6 w-6" />
                    </button>
                </div>

                {/* Navigation */}
                <div className="flex-1 overflow-y-auto py-6 px-3">
                    <nav className="space-y-4">
                        {sidebarItems.map((item) => {
                            const isActive = location.pathname === item.href
                            return (
                                <Link
                                    key={item.name}
                                    to={item.href}
                                    className={cn(
                                        "group flex items-center px-3 py-3 text-sm font-medium rounded-md transition-all duration-200",
                                        isActive
                                            ? "bg-[#044381] text-white shadow-lg shadow-blue-900/20"
                                            : "text-gray-300 hover:text-white hover:bg-white/5",
                                        collapsed && "justify-center px-2"
                                    )}
                                    title={collapsed ? item.name : undefined}
                                >
                                    <item.icon
                                        className={cn(
                                            "flex-shrink-0 h-5 w-5 transition-transform group-hover:scale-110",
                                            isActive ? "text-white" : "text-gray-300 group-hover:text-white",
                                            !collapsed && "mr-3"
                                        )}
                                    />
                                    {!collapsed && <span className="truncate">{item.name}</span>}
                                </Link>
                            )
                        })}
                    </nav>
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-[#1e2736] bg-[#0b0e1a]">
                    {!collapsed && (
                        <p className="text-xs text-center text-gray-500 font-medium">
                            Engineering Tools v1.0
                        </p>
                    )}
                </div>
            </aside>
        </>
    )
}
