export function Footer() {
    return (
        <footer className="bg-white dark:bg-slate-950 border-t border-gray-200 dark:border-gray-800 py-8">
            <div className="container mx-auto px-4 text-center text-gray-500 dark:text-gray-400">
                <p>&copy; {new Date().getFullYear()} A.E Renewable Solutions Ltd. All rights reserved.</p>
                <div className="mt-4 flex justify-center space-x-6">
                    <a href="#" className="hover:text-gray-900 dark:hover:text-gray-200">Privacy Policy</a>
                    <a href="#" className="hover:text-gray-900 dark:hover:text-gray-200">Terms of Service</a>
                    <a href="#" className="hover:text-gray-900 dark:hover:text-gray-200">Contact</a>
                </div>
            </div>
        </footer>
    )
}
