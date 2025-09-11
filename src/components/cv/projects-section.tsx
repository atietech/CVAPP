'use client';

import Image from 'next/image';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Code, Github, Globe } from 'lucide-react';
import type { Project } from '@/lib/types';
import { useLanguage } from '@/context/language-context';
import { motion } from 'framer-motion';

const animationVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

type ProjectsSectionProps = {
  initialData: Project[];
};

export function ProjectsSection({ initialData }: ProjectsSectionProps) {
  const { language } = useLanguage();
  const projects = initialData;

  const sectionTitle = language === 'fr' ? 'Projets Personnels' : 'Personal Projects';
  const demoButtonText = language === 'fr' ? 'Démo' : 'Demo';

  if (!projects || projects.length === 0) {
    return null;
  }

  return (
    <motion.section
      id="projects"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={animationVariants}
    >
      <h2 className="mb-8 flex items-center gap-3 font-headline text-3xl font-bold text-primary">
        <Code className="h-8 w-8" />
        {sectionTitle}
      </h2>
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((project, index) => (
          <Card key={project.id || index} className="flex flex-col overflow-hidden shadow-md transition-shadow duration-300 hover:shadow-xl">
            <CardHeader>
              <div className="aspect-video overflow-hidden rounded-md relative">
                 <Image
                    src={project.image || `https://picsum.photos/seed/${project.id || index}/600/400`}
                    alt={project.title[language]}
                    fill
                    className="object-cover transition-transform duration-300 hover:scale-105"
                    data-ai-hint="project screenshot"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
              </div>
            </CardHeader>
            <CardContent className="flex-grow">
              <CardTitle className="mb-2 font-headline text-xl">{project.title[language]}</CardTitle>
              <p className="mb-4 text-sm text-muted-foreground">{project.description[language]}</p>
              <div className="flex flex-wrap gap-2">
                {project.technologies.map((tech) => (
                  <Badge key={tech} variant="secondary">{tech}</Badge>
                ))}
              </div>
            </CardContent>
            <CardFooter className="flex gap-2">
              <Button asChild className="flex-1 bg-accent hover:bg-accent/90" disabled={!project.demoLink}>
                <a href={project.demoLink} target="_blank" rel="noopener noreferrer">
                  <Globe className="mr-2 h-4 w-4" /> {demoButtonText}
                </a>
              </Button>
              <Button asChild variant="outline" className="flex-1" disabled={!project.githubLink}>
                <a href={project.githubLink} target="_blank" rel="noopener noreferrer">
                  <Github className="mr-2 h-4 w-4" /> GitHub
                </a>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </motion.section>
  );
}
