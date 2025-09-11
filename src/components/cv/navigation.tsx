
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { navLinks } from '@/lib/data';
import { Download, Languages, Loader2 } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { ThemeSwitcher } from '@/components/theme-switcher';
import { Separator } from '../ui/separator';
import { useLanguage } from '@/context/language-context';
import { generateCvPdf } from './pdf-generator-simple';
import type { PersonalInfo, Experience, Education, SkillCategory, Project } from '@/lib/types';
import { db } from '@/lib/firebase';
import { doc, increment, setDoc } from 'firebase/firestore';

const translations = {
    fr: {
        download: "Télécharger le CV",
        toggleLang: "Switch to English",
        generatingPDF: "Génération du PDF..."
    },
    en: {
        download: "Download CV",
        toggleLang: "Passer au Français",
        generatingPDF: "Generating PDF..."
    }
}

type CvData = {
    personalInfo: PersonalInfo | null;
    experiences: Experience[];
    educations: Education[];
    skills: SkillCategory[];
    projects: Project[];
};

type NavigationProps = {
  cvData: CvData;
};

const cleanDataForPdf = (data: CvData, lang: 'fr' | 'en') => {
  if (!data.personalInfo) {
    return null;
  }
  return {
    personalInfo: {
        name: data.personalInfo.name?.[lang] || "",
        title: data.personalInfo.title?.[lang] || "",
        email: data.personalInfo.contact?.email || "",
        phone: data.personalInfo.contact?.phone || "",
        location: data.personalInfo.contact?.location || "",
        summary: data.personalInfo.summary?.[lang] || "",
        socials: data.personalInfo.socials || { github: '', linkedin: '', website: ''},
    },
    experiences: (data.experiences || []).map(exp => ({
        position: exp.position?.[lang] || "",
        company: exp.company || "",
        duration: exp.duration || "",
        description: exp.description?.[lang] || "",
        technologies: exp.technologies || []
    })),
    educations: (data.educations || []).map(edu => ({
        degree: edu.degree?.[lang] || "",
        institution: edu.institution || "",
        duration: edu.duration || "",
        description: edu.description?.[lang] || ""
    })),
    skills: (data.skills || []).map(skill => ({
        category: skill.category || "",
        technologies: skill.technologies || []
    })),
    projects: (data.projects || []).map(proj => ({
        title: proj.title?.[lang] || "",
        description: proj.description?.[lang] || "",
        technologies: proj.technologies || [],
        demoLink: proj.demoLink || "",
        githubLink: proj.githubLink || ""
    }))
  };
};

export function Navigation({ cvData }: NavigationProps) {
  const [activeSection, setActiveSection] = useState('profile');
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const { language, toggleLanguage } = useLanguage();
  const t = translations[language];

  useEffect(() => {
    const handleScroll = () => {
      const sections = navLinks(language).map(link => document.getElementById(link.href.substring(1)));
      const scrollPosition = window.scrollY + window.innerHeight / 2;

      for (const section of sections) {
        if (section && scrollPosition >= section.offsetTop && scrollPosition < section.offsetTop + section.offsetHeight) {
          setActiveSection(section.id);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [language]);
  
  const trackDownload = async () => {
      try {
        if (process.env.NODE_ENV === 'development') {
            console.log("Dev mode: Download tracking skipped.");
            return;
        }
        const statRef = doc(db, 'stats', 'cv');
        await setDoc(statRef, { downloads: increment(1) }, { merge: true });
        console.log("Download tracked successfully.");
      } catch (error) {
        console.error("Error tracking download:", error);
      }
  };

  const handleDownloadPdf = () => {
    if (isGeneratingPdf) return;
    
    setIsGeneratingPdf(true);

    if (!cvData || !cvData.personalInfo) {
      alert("Les données du CV ne sont pas encore chargées. Veuillez patienter.");
      setIsGeneratingPdf(false);
      return;
    }
    
    const pdfData = cleanDataForPdf(cvData, language);

    if (!pdfData) {
        alert("Les informations personnelles sont manquantes, impossible de générer le PDF.");
        setIsGeneratingPdf(false);
        return;
    }
    
    // On lance le suivi sans attendre (fire and forget)
    // pour s'assurer qu'il est exécuté même si le navigateur bloque après le téléchargement.
    trackDownload();

    try {
        generateCvPdf(pdfData, language);
    } catch (error) {
        console.error("Échec de la génération du PDF :", error);
        alert("Une erreur est survenue lors de la génération du PDF. Consultez la console pour plus de détails.");
    } finally {
        setIsGeneratingPdf(false);
    }
  };

  return (
    <TooltipProvider>
      <nav className="fixed left-0 top-0 hidden h-full flex-col items-center justify-center p-4 lg:flex">
        <div className="flex flex-col items-center gap-2 rounded-full border bg-card/50 p-2 backdrop-blur-sm">
          {navLinks(language).map((link) => (
            <Tooltip key={link.href}>
              <TooltipTrigger asChild>
                <Button
                  asChild
                  variant={activeSection === link.href.substring(1) ? 'default' : 'ghost'}
                  size="icon"
                  className="rounded-full"
                >
                  <Link href={link.href}>
                    <link.icon className="h-5 w-5" />
                  </Link>
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>{link.name}</p>
              </TooltipContent>
            </Tooltip>
          ))}
          <Separator className="my-2" />
          <Tooltip>
            <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full" onClick={toggleLanguage}>
                    <Languages className="h-5 w-5" />
                </Button>
            </TooltipTrigger>
            <TooltipContent side="right">
                <p>{t.toggleLang}</p>
            </TooltipContent>
          </Tooltip>
          <ThemeSwitcher side="right" />
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full"
                onClick={handleDownloadPdf}
                disabled={isGeneratingPdf}
              >
                {isGeneratingPdf ? <Loader2 className="h-5 w-5 animate-spin" /> : <Download className="h-5 w-5" />}
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>{isGeneratingPdf ? t.generatingPDF : t.download}</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </nav>
    </TooltipProvider>
  );
}
