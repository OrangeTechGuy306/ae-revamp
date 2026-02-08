import { useState } from "react"
import { Outlet } from "react-router-dom"
import { Sidebar } from "./Sidebar"
import { Menu } from "lucide-react"

export function DashboardLayout() {
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const [collapsed, setCollapsed] = useState(false)

    const toggleSidebar = () => setSidebarOpen(!sidebarOpen)
    const toggleCollapse = () => setCollapsed(!collapsed)

    return (
        <div className="min-h-screen transition-colors duration-300">
            <Sidebar
                isOpen={sidebarOpen}
                toggleSidebar={toggleSidebar}
                collapsed={collapsed}
                toggleCollapse={toggleCollapse}
            />

            <div className={`transition-all duration-300 ease-in-out ${collapsed ? "lg:ml-16" : "lg:ml-64"}`}>
                <header className="sticky top-0 z-30 flex h-16 items-center justify-between backdrop-blur-md px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={toggleSidebar}
                            className="lg:hidden p-2 -ml-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-slate-800 rounded-md"
                        >
                            <Menu className="h-6 w-6" />
                        </button>
                        {/* Breadcrumbs or Page Title could go here */}
                    </div>

                </header>

                <main className=" md:w-[95%] mx-auto">
                    <Outlet />
                </main>
            </div>
        </div>
    )
}
