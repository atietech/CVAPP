import { jsPDF } from 'jspdf';

type PersonalInfo = {
    name: string;
    title: string;
    email: string;
    phone: string;
    location: string;
    summary: string;
    socials: {
        github: string;
        linkedin: string;
        website: string;
    }
};

type ExperienceData = {
    position: string;
    company: string;
    duration: string;
    description: string;
    technologies: string[];
};

type EducationData = {
    degree: string;
    institution: string;
    duration: string;
    description: string;
};

type SkillCategory = {
    category: string;
    technologies: Array<{ name: string; level: number }>;
};

type ProjectData = {
    title: string;
    description: string;
    technologies: string[];
    demoLink: string;
    githubLink: string;
};

type PdfData = {
    personalInfo: PersonalInfo;
    experiences: ExperienceData[];
    educations: EducationData[];
    skills: SkillCategory[];
    projects: ProjectData[];
};

// Couleurs et polices
const PRIMARY_COLOR = '#2563eb';
const TEXT_COLOR = '#2d3748';
const MUTED_COLOR = '#718096';

const sectionTitles = {
    fr: {
        profile: 'Profil',
        experience: 'Expérience Professionnelle',
        education: 'Formation',
        skills: 'Compétences',
        projects: 'Projets',
    },
    en: {
        profile: 'Profile',
        experience: 'Work Experience',
        education: 'Education',
        skills: 'Skills',
        projects: 'Projects',
    }
}

export const generateCvPdf = (data: PdfData, lang: 'fr' | 'en' = 'fr') => {
    try {
        const doc = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: 'a4'
        });

        const t = sectionTitles[lang];

        let yPosition = 20;
        const margin = 20;
        const pageWidth = doc.internal.pageSize.width;
        const contentWidth = pageWidth - (margin * 2);

        // Fonction pour nettoyer le texte des caractères non supportés par la police standard
        const cleanText = (text: string | null | undefined): string => {
            if (!text) return '';
            // Remplace les caractères "intelligents" par leurs équivalents basiques
            return text
                .replace(/[\u2018\u2019]/g, "'") // single quotes
                .replace(/[\u201C\u201D]/g, '"') // double quotes
                .replace(/\u2026/g, '...')   // ellipsis
                .replace(/[\u2013\u2014]/g, '-')   // dashes
                .replace(/\u00A0/g, ' ');      // non-breaking space
        };

        // Fonction pour ajouter une section avec titre
        const addSection = (title: string, bodyFn: () => void) => {
            if (yPosition > 250) { // Marge de sécurité en bas de page
                doc.addPage();
                yPosition = 20;
            }
            doc.setFontSize(16);
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(PRIMARY_COLOR);
            doc.text(title.toUpperCase(), margin, yPosition);
            doc.setDrawColor(PRIMARY_COLOR);
            doc.line(margin, yPosition + 2, margin + contentWidth, yPosition + 2);
            yPosition += 10;
            bodyFn();
            yPosition += 5; // Espace après chaque section
        };

        // En-tête
        doc.setFontSize(28);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(PRIMARY_COLOR);
        doc.text(cleanText(data.personalInfo.name), pageWidth / 2, yPosition, { align: 'center' });
        yPosition += 10;

        doc.setFontSize(14);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(TEXT_COLOR);
        doc.text(cleanText(data.personalInfo.title), pageWidth / 2, yPosition, { align: 'center' });
        yPosition += 10;

        doc.setFontSize(9);
        doc.setTextColor(MUTED_COLOR);
        const contactInfo = [
            data.personalInfo.email,
            data.personalInfo.phone,
            data.personalInfo.location
        ].filter(Boolean).join('  \u2022  ');
        doc.text(cleanText(contactInfo), pageWidth / 2, yPosition, { align: 'center' });
        yPosition += 5;

        const socialLinks = [
            data.personalInfo.socials.linkedin,
            data.personalInfo.socials.github,
            data.personalInfo.socials.website
        ].filter(Boolean).join('  \u2022  ');
        if (socialLinks) {
            doc.text(cleanText(socialLinks), pageWidth / 2, yPosition, { align: 'center' });
        }
        yPosition += 15;


        // Profil
        addSection(t.profile, () => {
            doc.setFontSize(10);
            doc.setFont('helvetica', 'normal');
            doc.setTextColor(TEXT_COLOR);
            const summaryLines = doc.splitTextToSize(cleanText(data.personalInfo.summary), contentWidth);
            doc.text(summaryLines, margin, yPosition);
            yPosition += summaryLines.length * 4;
        });

        // Expériences
        if (data.experiences && data.experiences.length > 0) {
            addSection(t.experience, () => {
                data.experiences.forEach(exp => {
                    if (yPosition > 260) { doc.addPage(); yPosition = 20; }
                    doc.setFontSize(12);
                    doc.setFont('helvetica', 'bold');
                    doc.setTextColor(TEXT_COLOR);
                    doc.text(cleanText(exp.position), margin, yPosition);

                    doc.setFontSize(10);
                    doc.setFont('helvetica', 'normal');
                    doc.setTextColor(MUTED_COLOR);
                    doc.text(cleanText(exp.duration), pageWidth - margin, yPosition, { align: 'right' });
                    yPosition += 5;

                    doc.setFontSize(11);
                    doc.setFont('helvetica', 'italic');
                    doc.setTextColor(PRIMARY_COLOR);
                    doc.text(cleanText(exp.company), margin, yPosition);
                    yPosition += 6;

                    doc.setFontSize(10);
                    doc.setFont('helvetica', 'normal');
                    doc.setTextColor(TEXT_COLOR);
                    const descLines = doc.splitTextToSize(cleanText(exp.description), contentWidth);
                    doc.text(descLines, margin, yPosition);
                    yPosition += descLines.length * 4 + 2;
                    
                    if(exp.technologies.length > 0) {
                        doc.setFontSize(9);
                        doc.setTextColor(MUTED_COLOR);
                        const techLines = doc.splitTextToSize('Technologies: ' + cleanText(exp.technologies.join(', ')), contentWidth);
                        doc.text(techLines, margin, yPosition);
                        yPosition += techLines.length * 4;
                    }
                    yPosition += 5;
                });
            });
        }
        
        // Formation
        if (data.educations && data.educations.length > 0) {
            addSection(t.education, () => {
                data.educations.forEach(edu => {
                    if (yPosition > 270) { doc.addPage(); yPosition = 20; }
                     doc.setFontSize(12);
                    doc.setFont('helvetica', 'bold');
                    doc.setTextColor(TEXT_COLOR);
                    doc.text(cleanText(edu.degree), margin, yPosition);

                    doc.setFontSize(10);
                    doc.setFont('helvetica', 'normal');
                    doc.setTextColor(MUTED_COLOR);
                    doc.text(cleanText(edu.duration), pageWidth - margin, yPosition, { align: 'right' });
                    yPosition += 5;

                    doc.setFontSize(11);
                    doc.setFont('helvetica', 'italic');
                    doc.setTextColor(PRIMARY_COLOR);
                    doc.text(cleanText(edu.institution), margin, yPosition);
                    yPosition += 6;
                    
                    const descLines = doc.splitTextToSize(cleanText(edu.description), contentWidth);
                    doc.setFontSize(10);
                    doc.setFont('helvetica', 'normal');
                    doc.setTextColor(TEXT_COLOR);
                    doc.text(descLines, margin, yPosition);
                    yPosition += descLines.length * 4 + 5;
                });
            });
        }
        
        // Nouvelle page si nécessaire pour Compétences et Projets
        if (yPosition > 180) {
            doc.addPage();
            yPosition = 20;
        }

        // Compétences
        if (data.skills && data.skills.length > 0) {
            addSection(t.skills, () => {
                 data.skills.forEach(cat => {
                    if (yPosition > 270) { doc.addPage(); yPosition = 20; }
                    doc.setFontSize(11);
                    doc.setFont('helvetica', 'bold');
                    doc.setTextColor(PRIMARY_COLOR);
                    doc.text(cleanText(cat.category), margin, yPosition);
                    yPosition += 6;

                    doc.setFontSize(10);
                    doc.setFont('helvetica', 'normal');
                    doc.setTextColor(TEXT_COLOR);
                    const skillsText = cat.technologies.map(t => t.name).join(' \u2022 ');
                    const skillLines = doc.splitTextToSize(cleanText(skillsText), contentWidth);
                    doc.text(skillLines, margin + 2, yPosition);
                    yPosition += skillLines.length * 5 + 3;
                 });
            });
        }
        
        // Projets
        if (data.projects && data.projects.length > 0) {
            addSection(t.projects, () => {
                data.projects.forEach(proj => {
                    if (yPosition > 260) { doc.addPage(); yPosition = 20; }
                    doc.setFontSize(12);
                    doc.setFont('helvetica', 'bold');
                    doc.setTextColor(TEXT_COLOR);
                    doc.text(cleanText(proj.title), margin, yPosition);
                    yPosition += 6;
                    
                    doc.setFontSize(10);
                    doc.setFont('helvetica', 'normal');
                    doc.setTextColor(TEXT_COLOR);
                    const descLines = doc.splitTextToSize(cleanText(proj.description), contentWidth);
                    doc.text(descLines, margin, yPosition);
                    yPosition += descLines.length * 4 + 2;

                    if(proj.technologies.length > 0) {
                        doc.setFontSize(9);
                        doc.setTextColor(MUTED_COLOR);
                        const techLines = doc.splitTextToSize('Technologies: ' + cleanText(proj.technologies.join(', ')), contentWidth);
                        doc.text(techLines, margin, yPosition);
                        yPosition += techLines.length * 4;
                    }
                     yPosition += 5;
                });
            });
        }

        // Télécharger le fichier
        const fileName = `CV_${cleanText(data.personalInfo.name).replace(/ /g, '_')}.pdf`;
        doc.save(fileName);
        
        return { success: true, fileName };

    } catch (error) {
        console.error('Erreur lors de la génération du PDF avec jsPDF:', error);
        return { success: false, error: error instanceof Error ? error.message : 'Erreur inconnue' };
    }
};
