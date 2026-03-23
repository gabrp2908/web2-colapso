import { Moon, Sun } from "lucide-react";
import { Button } from "./ui/button";
import { useTheme } from "@/contexts/ThemeContext";

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className="text-white dark:text-foreground hover:bg-white/10 dark:hover:bg-secondary"
      title={theme === "dark" ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
    >
      {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
    </Button>
  );
};

export default ThemeToggle;
