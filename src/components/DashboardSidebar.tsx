import { Link, useLocation } from "react-router-dom"
import {
    LayoutDashboard,
    Users,
    UserCog,
    Settings,
    Menu,
    LogOut,
    Home,
} from "lucide-react"
import { cn } from "../lib/utils"
import { useAuth } from "@/context/AuthContext"

const dashboardItems = [
    { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
    { name: "Customers", href: "/customers", icon: Users },
    { name: "System Users", href: "/users", icon: UserCog },
    { name: "Settings", href: "/settings", icon: Settings },
]

interface SidebarProps {
    isOpen: boolean
    toggleSidebar: () => void
    collapsed: boolean
    toggleCollapse: () => void
}

export function DashboardSidebar({ isOpen, toggleSidebar, collapsed, toggleCollapse }: SidebarProps) {
    const location = useLocation()
    const { logout } = useAuth()

    const handleLogout = () => {
        if (window.confirm("Are you sure you want to logout?")) {
            logout()
        }
    }

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
                    "fixed inset-y-0 left-0 z-50 flex flex-col bg-background border-r border-[#1e2736] transition-all duration-300 ease-in-out",
                    collapsed ? "w-16" : "w-64",
                    isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
                )}
            >
                {/* Header */}
                <div className="flex items-center justify-between h-16 px-4 border-b border-[#1e2736]">
                    {!collapsed && (
                        <span className="text-MD font-bold text-white tracking-wide">
                            ADMIN PORTAL
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
                        {dashboardItems.map((item) => {
                            const isActive = location.pathname === item.href
                            return (
                                <Link
                                    key={item.name}
                                    to={item.href}
                                    className={cn(
                                        "group flex items-center px-3 py-3 text-sm font-medium rounded-md transition-all duration-200",
                                        isActive
                                            ? "bg-engineering-blue text-white shadow-lg shadow-blue-900/20"
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
                <div className="p-4 border-t border-[#1e2736] bg-background space-y-2">
                    <Link
                        to="/"
                        className={cn(
                            "flex items-center px-3 py-2 text-sm font-medium text-gray-400 hover:text-white hover:bg-white/5 rounded-md transition-all",
                            collapsed && "justify-center"
                        )}
                        title={collapsed ? "Back to Site" : undefined}
                    >
                        <Home className={cn("h-5 w-5", !collapsed && "mr-3")} />
                        {!collapsed && <span>Back to Site</span>}
                    </Link>

                    <button
                        onClick={handleLogout}
                        className={cn(
                            "w-full flex items-center px-3 py-2 text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-950/20 rounded-md transition-all",
                            collapsed && "justify-center"
                        )}
                        title={collapsed ? "Logout" : undefined}
                    >
                        <LogOut className={cn("h-5 w-5", !collapsed && "mr-3")} />
                        {!collapsed && <span>Logout</span>}
                    </button>
                </div>
            </aside>
        </>
    )
}
