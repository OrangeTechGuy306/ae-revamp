import { useState } from "react"
import { Outlet } from "react-router-dom"
import { DashboardSidebar } from "./DashboardSidebar"
import { Menu } from "lucide-react"

export function AdminLayout() {
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const [collapsed, setCollapsed] = useState(false)

    const toggleSidebar = () => setSidebarOpen(!sidebarOpen)
    const toggleCollapse = () => setCollapsed(!collapsed)

    return (
        <div className="min-h-screen bg-[#0b0e14] transition-colors duration-300">
            <DashboardSidebar
                isOpen={sidebarOpen}
                toggleSidebar={toggleSidebar}
                collapsed={collapsed}
                toggleCollapse={toggleCollapse}
            />

            <div className={`transition-all duration-300 ease-in-out ${collapsed ? "lg:ml-16" : "lg:ml-64"}`}>
                <header className="sticky top-0 z-30 flex h-16 items-center justify-between backdrop-blur-md px-4 sm:px-6 lg:px-8 bg-[#0b0e14]/50 border-b border-[#1e2736]">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={toggleSidebar}
                            className="lg:hidden p-2 -ml-2 text-gray-400 hover:bg-white/5 rounded-md"
                        >
                            <Menu className="h-6 w-6" />
                        </button>
                        <span className="text-sm font-medium text-muted-foreground uppercase tracking-widest px-2">
                            Dashboard Portal
                        </span>
                    </div>
                </header>

                <main className="md:w-[95%] mx-auto py-6">
                    <Outlet />
                </main>
            </div>
        </div>
    )
}
