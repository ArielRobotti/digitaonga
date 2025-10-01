import { useEffect, useState } from "react";

export default function ThemeToggle({className = ""}) {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    // inicializar desde localStorage
    const stored = localStorage.getItem("theme");
    if (stored === "dark") setDark(true);
    else if (stored === "light") setDark(false);
  }, []);

  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [dark]);

  return (
    <button
      onClick={() => setDark(!dark)}
      className={` rounded-full h-10 w-16
                 transition-colors ${className}`}
    >
      {dark ? "☀️" : "🌙"}
    </button>
  );
}
