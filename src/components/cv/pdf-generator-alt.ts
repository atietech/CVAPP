// Générateur PDF alternatif utilisant les APIs natives du navigateur
type PersonalInfo = {
    name: string;
    title: string;
    email: string;
    phone: string;
    location: string;
    summary: string;
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

export const generateCvPdf = (data: PdfData) => {
    // Créer le contenu HTML stylé pour PDF
    const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <title>CV - ${data.personalInfo.name}</title>
        <style>
            @page {
                margin: 1cm;
                size: A4;
            }
            body { 
                font-family: Arial, sans-serif; 
                line-height: 1.4;
                color: #333;
                margin: 0;
                padding: 20px;
                font-size: 12px;
            }
            .header { 
                text-align: center; 
                margin-bottom: 25px;
                border-bottom: 2px solid #2563eb;
                padding-bottom: 15px;
            }
            .name { 
                font-size: 24px; 
                font-weight: bold; 
                color: #2563eb;
                margin-bottom: 5px;
            }
            .title { 
                font-size: 14px; 
                color: #666;
                margin-bottom: 10px;
            }
            .contact {
                font-size: 11px;
                color: #555;
            }
            .contact-item {
                display: inline-block;
                margin: 0 15px;
            }
            .section {
                margin: 20px 0;
                page-break-inside: avoid;
            }
            .section-title {
                font-size: 14px;
                font-weight: bold;
                color: #2563eb;
                margin-bottom: 10px;
                border-bottom: 1px solid #ddd;
                padding-bottom: 3px;
                text-transform: uppercase;
            }
            .item {
                margin-bottom: 15px;
                page-break-inside: avoid;
            }
            .item-title {
                font-weight: bold;
                font-size: 12px;
                color: #333;
            }
            .item-subtitle {
                font-weight: bold;
                font-size: 11px;
                color: #2563eb;
                margin-bottom: 3px;
            }
            .item-duration {
                font-size: 10px;
                color: #666;
                float: right;
            }
            .item-description {
                font-size: 11px;
                color: #555;
                margin-bottom: 5px;
            }
            .technologies {
                font-size: 10px;
                color: #666;
                font-style: italic;
            }
            .skills-grid {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 15px;
            }
            .skill-category {
                margin-bottom: 10px;
            }
            .skill-category-title {
                font-weight: bold;
                font-size: 12px;
                color: #2563eb;
                margin-bottom: 5px;
            }
            .skill-item {
                font-size: 10px;
                margin-bottom: 2px;
            }
            .clearfix::after {
                content: "";
                display: table;
                clear: both;
            }
            @media print {
                body { margin: 0; padding: 15px; }
                .section { page-break-inside: avoid; }
            }
        </style>
    </head>
    <body>
        <div class="header">
            <div class="name">${data.personalInfo.name}</div>
            <div class="title">${data.personalInfo.title}</div>
            <div class="contact">
                <span class="contact-item">✉️ ${data.personalInfo.email}</span>
                <span class="contact-item">📱 ${data.personalInfo.phone}</span>
                <span class="contact-item">📍 ${data.personalInfo.location}</span>
            </div>
        </div>
        
        ${data.personalInfo.summary ? `
        <div class="section">
            <div class="section-title">Profil</div>
            <div class="item-description">${data.personalInfo.summary}</div>
        </div>
        ` : ''}
        
        ${data.experiences.length > 0 ? `
        <div class="section">
            <div class="section-title">Expérience Professionnelle</div>
            ${data.experiences.map(exp => `
                <div class="item clearfix">
                    <div class="item-duration">${exp.duration}</div>
                    <div class="item-title">${exp.position}</div>
                    <div class="item-subtitle">${exp.company}</div>
                    <div class="item-description">${exp.description}</div>
                    ${exp.technologies.length > 0 ? `<div class="technologies">Technologies: ${exp.technologies.join(', ')}</div>` : ''}
                </div>
            `).join('')}
        </div>
        ` : ''}
        
        ${data.educations.length > 0 ? `
        <div class="section">
            <div class="section-title">Formation</div>
            ${data.educations.map(edu => `
                <div class="item clearfix">
                    <div class="item-duration">${edu.duration}</div>
                    <div class="item-title">${edu.degree}</div>
                    <div class="item-subtitle">${edu.institution}</div>
                    <div class="item-description">${edu.description}</div>
                </div>
            `).join('')}
        </div>
        ` : ''}
        
        ${data.skills.length > 0 ? `
        <div class="section">
            <div class="section-title">Compétences</div>
            <div class="skills-grid">
                ${data.skills.map(skillCat => `
                    <div class="skill-category">
                        <div class="skill-category-title">${skillCat.category}</div>
                        ${skillCat.technologies.map(tech => `
                            <div class="skill-item">${tech.name} (${tech.level}%)</div>
                        `).join('')}
                    </div>
                `).join('')}
            </div>
        </div>
        ` : ''}
        
        ${data.projects.length > 0 ? `
        <div class="section">
            <div class="section-title">Projets</div>
            ${data.projects.map(proj => `
                <div class="item">
                    <div class="item-title">${proj.title}</div>
                    <div class="item-description">${proj.description}</div>
                    ${proj.technologies.length > 0 ? `<div class="technologies">Technologies: ${proj.technologies.join(', ')}</div>` : ''}
                    ${proj.demoLink ? `<div class="technologies">Demo: ${proj.demoLink}</div>` : ''}
                    ${proj.githubLink ? `<div class="technologies">GitHub: ${proj.githubLink}</div>` : ''}
                </div>
            `).join('')}
        </div>
        ` : ''}
    </body>
    </html>`;

    // Créer et télécharger le fichier HTML
    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `CV_${data.personalInfo.name.replace(/[^a-zA-Z0-9]/g, '_')}.html`;
    
    // Ajouter au DOM temporairement pour le téléchargement
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    // Ouvrir dans une nouvelle fenêtre pour que l'utilisateur puisse l'imprimer en PDF
    const printWindow = window.open('', '_blank');
    if (printWindow) {
        printWindow.document.write(htmlContent);
        printWindow.document.close();
        
        // Ajouter un message d'instructions
        setTimeout(() => {
            if (window.confirm('Le fichier HTML a été téléchargé. Voulez-vous également ouvrir la version imprimable pour sauvegarder en PDF ?')) {
                printWindow.focus();
                setTimeout(() => {
                    printWindow.print();
                }, 1000);
            }
        }, 500);
    }
    
    return { success: true };
};
