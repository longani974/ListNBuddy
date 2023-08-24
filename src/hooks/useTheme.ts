import { useEffect, useState } from "react";

const useTheme = () => {
    const [theme, setTheme] = useState<string | null>(null);
    const [isChecked, setIsChecked] = useState<boolean>(false);

    // Set the initial theme based on the user's OS preferences
    useEffect(() => {
        const storedTheme = localStorage.getItem("theme");

        if (storedTheme === "dark" || storedTheme === "light") {
            setTheme(storedTheme);
        } else {
            const prefersDark = window.matchMedia(
                "(prefers-color-scheme: dark)"
            ).matches;
            setTheme(prefersDark ? "dark" : "light");
        }
    }, []);

    // Listen for changes to the prefers-color-scheme media query
    useEffect(() => {
        const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
        const handleChange = () => {
            setTheme(mediaQuery.matches ? "dark" : "light");
            localStorage.setItem(
                "theme",
                mediaQuery.matches ? "dark" : "light"
            );
        };
        mediaQuery.addEventListener("change", handleChange);
        return () => mediaQuery.removeEventListener("change", handleChange);
    }, []);

    // Update the theme when it changes
    useEffect(() => {
        if (theme !== null) {
            document.documentElement.setAttribute("data-theme", theme);
            setIsChecked(theme === "dark");
        }
    }, [theme]);

    const toggleTheme = () => {
        const newTheme = theme === "dark" ? "light" : "dark";
        setTheme(newTheme);
        localStorage.setItem("theme", newTheme);
    };

    return { theme, toggleTheme, isChecked };
};

export default useTheme;
