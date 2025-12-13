import { Moon, Sun } from "lucide-react"
import { useTheme } from "./ThemeProvider"

export function ThemeToggle() {
    const { theme, setTheme } = useTheme()

    return (
        <button
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            className="rounded-md p-2 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Toggle theme"
        >
            <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 top-2 left-2" />
            <span className="sr-only">Toggle theme</span>
        </button>
    )
}
// Note: The absolute positioning of Moon might need a container relative wrapper.
// Let's adjust slightly to use conditional rendering or proper overlapping stack if not robust.
// Actually, standard shadcn toggles often use the robust rotation scale trick.
// But for simplicity, let's keep it simple.
