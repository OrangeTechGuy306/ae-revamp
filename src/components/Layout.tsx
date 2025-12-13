import { Navbar } from "./Navbar"
import { Footer } from "./Footer"
import { Outlet } from "react-router-dom"

export function Layout() {
    return (
        <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-slate-950 text-gray-900 dark:text-gray-100 transition-colors duration-300">
            <Navbar />
            <main className="flex-grow container mx-auto px-4 py-8 sm:px-6 lg:px-8">
                <Outlet />
            </main>
            <Footer />
        </div>
    )
}
