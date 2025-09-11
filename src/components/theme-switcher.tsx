"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { useLanguage } from "@/context/language-context"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip"

const translations = {
  fr: {
    tooltip: "Changer de thème",
    light: "Clair",
    dark: "Sombre",
    system: "Système",
  },
  en: {
    tooltip: "Change theme",
    light: "Light",
    dark: "Dark",
    system: "System",
  },
}

export function ThemeSwitcher({side, align}: {side?: "right" | "top" | "bottom" | "left", align?: "center" | "start" | "end"}) {
  const { setTheme } = useTheme()
  // Utilise un try-catch pour éviter les erreurs si le contexte n'est pas disponible (comme dans l'admin)
  let lang: 'fr' | 'en' = 'fr';
  try {
    const { language } = useLanguage();
    lang = language;
  } catch (error) {
    // Le contexte n'est pas fourni, on garde 'fr' par défaut.
    // L'admin n'est pas multilingue pour l'instant.
  }
  
  const t = translations[lang] || translations.fr;

  return (
    <DropdownMenu>
      <Tooltip>
        <TooltipTrigger asChild>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full h-8 w-8">
              <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>
          </DropdownMenuTrigger>
        </TooltipTrigger>
        <TooltipContent side={side ?? "right"}>
          <p>{t.tooltip}</p>
        </TooltipContent>
      </Tooltip>
      <DropdownMenuContent align={align ?? "end"}>
        <DropdownMenuItem onClick={() => setTheme("light")}>
          {t.light}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>
          {t.dark}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")}>
          {t.system}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
