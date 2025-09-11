
export interface Translatable {
  fr: string;
  en: string;
}

export interface PersonalInfo {
  name: Translatable;
  title: Translatable;
  avatar: string;
  summary: Translatable;
  contact: {
    email: string;
    phone: string;
    location: string;
  };
  socials: {
    github: string;
    linkedin: string;
    website: string;
  };
}

export interface PersonalInfoFormData {
    name_fr: string;
    name_en: string;
    title_fr: string;
    title_en: string;
    summary_fr: string;
    summary_en: string;
    avatar: string;
    email: string;
    phone: string;
    location: string;
    github: string;
    linkedin: string;
    website: string;
}

export interface Experience {
  id?: string;
  position: Translatable;
  company: string;
  duration: string;
  description: Translatable;
  technologies: string[];
}

export interface Education {
  id?: string;
  degree: Translatable;
  institution: string;
  duration: string;
  description: Translatable;
}

export interface Technology {
    name: string;
    level: number;
}

export interface SkillCategory {
    id?: string;
    category: string;
    technologies: Technology[];
    order?: number;
}

export interface Project {
  id?: string;
  title: Translatable;
  description: Translatable;
  image: string;
  technologies: string[];
  demoLink: string;
  githubLink: string;
  order?: number;
}

export interface Contact {
  id: string;
  name: string;
  email: string;
  message: string;
  createdAt: Date;
}
