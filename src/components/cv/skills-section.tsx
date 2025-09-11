'use client';
import React from 'react';
import { Progress } from '@/components/ui/progress';
import { Star } from 'lucide-react';
import type { SkillCategory } from '@/lib/types';
import { useLanguage } from '@/context/language-context';
import { motion } from 'framer-motion';

const animationVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

type SkillsSectionProps = {
  initialData: SkillCategory[];
};

export function SkillsSection({ initialData }: SkillsSectionProps) {
  const { language } = useLanguage();
  const skills = initialData;

  const sectionTitle = language === 'fr' ? 'Compétences' : 'Skills';

  if (!skills || skills.length === 0) {
    return null;
  }

  return (
    <motion.section
      id="skills"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={animationVariants}
    >
      <h2 className="mb-8 flex items-center gap-3 font-headline text-3xl font-bold text-primary">
        <Star className="h-8 w-8" />
        {sectionTitle}
      </h2>
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {skills.map((skillCategory) => (
          <div key={skillCategory.id} className="rounded-lg border bg-card p-6 shadow-md">
            <h3 className="mb-4 font-headline text-xl font-semibold text-accent">{skillCategory.category}</h3>
            <div className="space-y-4">
              {skillCategory.technologies.map((tech) => (
                <div key={tech.name}>
                  <div className="mb-1 flex justify-between">
                    <span className="text-sm font-medium text-foreground">{tech.name}</span>
                    <span className="text-sm font-medium text-muted-foreground">{tech.level}%</span>
                  </div>
                  <Progress value={tech.level} aria-label={`${tech.name} proficiency`} />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </motion.section>
  );
}
