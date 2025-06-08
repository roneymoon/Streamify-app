import { create } from "zustand"

export const useThemeStore = create((set) => ({
    theme: localStorage.getItem("color-theme") || "coffee",
    setTheme: (theme) => {
        set({theme})
        localStorage.setItem("color-theme", theme)
    }
}))