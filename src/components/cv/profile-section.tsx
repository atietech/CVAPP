'use client';

import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { contactIcons, socialIcons } from '@/lib/data';
import type { PersonalInfo } from '@/lib/types';
import { useLanguage } from '@/context/language-context';
import { motion } from 'framer-motion';

const animationVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

type ProfileSectionProps = {
  initialData: PersonalInfo | null;
};

export function ProfileSection({ initialData }: ProfileSectionProps) {
  const { language } = useLanguage();

  if (!initialData) {
    return (
        <section id="profile" className="pt-12 md:pt-16">
            <Card>
                <CardContent className="p-6 text-center">
                    <p>Les informations du profil n'ont pas pu être chargées. Veuillez configurer le profil dans le tableau de bord.</p>
                </CardContent>
            </Card>
        </section>
    )
  }

  const info = initialData;

  return (
    <motion.section
      id="profile"
      className="pt-12 md:pt-16"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={animationVariants}
    >
      <Card className="overflow-hidden shadow-lg">
        <CardContent className="p-6 md:p-8">
          <div className="flex flex-col items-center gap-8 text-center md:flex-row md:items-start md:text-left">
            <div className="relative flex-shrink-0">
              <Image
                src={info.avatar || 'https://placehold.co/150x150.png'}
                alt={info.name[language]}
                width={150}
                height={150}
                className="rounded-full border-4 border-primary shadow-md object-cover"
                data-ai-hint="professional headshot"
                priority
              />
            </div>
            <div className="flex-grow">
              <h1 className="font-headline text-4xl font-bold text-primary md:text-5xl">{info.name[language]}</h1>
              <h2 className="mt-1 font-headline text-xl text-accent md:text-2xl">{info.title[language]}</h2>
              <p className="mt-4 text-muted-foreground">{info.summary[language]}</p>
              
              <div className="mt-6 flex flex-wrap justify-center gap-x-6 gap-y-3 md:justify-start">
                {info.contact && Object.entries(info.contact).map(([key, value]) => {
                  const Icon = contactIcons[key as keyof typeof contactIcons];
                  if (!Icon || !value) return null;
                  return (
                    <div key={key} className="flex items-center gap-2 text-sm text-foreground">
                      <Icon className="h-4 w-4 text-primary" />
                      <span>{value}</span>
                    </div>
                  );
                })}
              </div>

              <div className="mt-6 flex justify-center gap-2 md:justify-start">
                {info.socials && Object.entries(info.socials).map(([key, value]) => {
                  const Icon = socialIcons[key as keyof typeof socialIcons];
                  if (!Icon || !value) return null;
                  return (
                    <Button key={key} variant="outline" size="icon" asChild>
                      <a href={value} target="_blank" rel="noopener noreferrer" aria-label={key}>
                        <Icon className="h-5 w-5" />
                      </a>
                    </Button>
                  );
                })}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.section>
  );
}
