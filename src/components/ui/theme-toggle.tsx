import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as "light" | "dark";
    const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    const initialTheme = savedTheme || systemTheme;
    
    setTheme(initialTheme);
    document.documentElement.classList.toggle("dark", initialTheme === "dark");
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={toggleTheme}
      className="transition-all duration-300 hover:scale-105 hover:shadow-lg"
    >
      {theme === "light" ? (
        <Moon className="h-4 w-4 transition-transform duration-300" />
      ) : (
        <Sun className="h-4 w-4 transition-transform duration-300 rotate-180" />
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}