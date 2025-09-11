
import { User, Briefcase, GraduationCap, Star, Code, Mail, Phone, MapPin, Github, Linkedin, Globe } from 'lucide-react';

// Ce fichier sert maintenant principalement à exporter les icônes.
// Les données sont chargées depuis Firestore.

export const navLinks = (lang: 'fr' | 'en' = 'fr') => [
  { name: lang === 'fr' ? 'Profil' : 'Profile', href: '#profile', icon: User },
  { name: lang === 'fr' ? 'Expérience' : 'Experience', href: '#experience', icon: Briefcase },
  { name: lang === 'fr' ? 'Formation' : 'Education', href: '#education', icon: GraduationCap },
  { name: lang === 'fr' ? 'Compétences' : 'Skills', href: '#skills', icon: Star },
  { name: lang === 'fr' ? 'Projets' : 'Projects', href: '#projects', icon: Code },
  { name: lang === 'fr' ? 'Contact' : 'Contact', href: '#contact', icon: Mail },
];

export const contactIcons = {
  email: Mail,
  phone: Phone,
  location: MapPin,
};

export const socialIcons = {
  github: Github,
  linkedin: Linkedin,
  website: Globe,
};
