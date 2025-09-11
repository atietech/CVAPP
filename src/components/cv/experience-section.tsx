'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Briefcase } from 'lucide-react';
import type { Experience } from '@/lib/types';
import { useLanguage } from '@/context/language-context';
import { motion } from 'framer-motion';

const animationVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

type ExperienceSectionProps = {
  initialData: Experience[];
};

export function ExperienceSection({ initialData }: ExperienceSectionProps) {
  const { language } = useLanguage();
  const experiences = initialData;

  const sectionTitle = language === 'fr' ? 'Expérience Professionnelle' : 'Work Experience';

  if (!experiences || experiences.length === 0) {
    return null;
  }

  return (
    <motion.section
      id="experience"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={animationVariants}
    >
      <h2 className="mb-8 flex items-center gap-3 font-headline text-3xl font-bold text-primary">
        <Briefcase className="h-8 w-8" />
        {sectionTitle}
      </h2>
      <div className="relative pl-6 before:absolute before:left-0 before:top-2 before:h-full before:w-1 before:rounded before:bg-primary/20">
        {experiences.map((exp, index) => (
          <div key={exp.id || index} className="relative mb-8 flex items-start gap-6">
            <div className="absolute -left-1.5 top-2 h-4 w-4 rounded-full border-2 border-primary/50 bg-primary" />
            <Card className="w-full shadow-md transition-shadow duration-300 hover:shadow-xl">
              <CardHeader>
                <div className="flex flex-col justify-between gap-2 md:flex-row md:items-center">
                  <CardTitle className="font-headline text-xl">{exp.position[language]}</CardTitle>
                  <div className="text-sm text-muted-foreground">{exp.duration}</div>
                </div>
                <p className="font-semibold text-accent">{exp.company}</p>
              </CardHeader>
              <CardContent>
                <p className="mb-4 text-muted-foreground">{exp.description[language]}</p>
                <div className="flex flex-wrap gap-2">
                  {exp.technologies.map((tech) => (
                    <Badge key={tech} variant="secondary">{tech}</Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        ))}
      </div>
    </motion.section>
  );
}
