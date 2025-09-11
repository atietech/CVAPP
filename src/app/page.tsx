
'use client';

import { ProfileSection } from '@/components/cv/profile-section';
import { ExperienceSection } from '@/components/cv/experience-section';
import { EducationSection } from '@/components/cv/education-section';
import { SkillsSection } from '@/components/cv/skills-section';
import { ProjectsSection } from '@/components/cv/projects-section';
import { ContactSection } from '@/components/cv/contact-section';
import { Navigation } from '@/components/cv/navigation';
import { LanguageProvider } from '@/context/language-context';
import { collection, getDocs, orderBy, query, doc, getDoc, setDoc, increment } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { PersonalInfo, Experience, Education, SkillCategory, Project } from '@/lib/types';
import { useEffect, useState } from 'react';

// Define the type for all CV data
type CvData = {
  personalInfo: PersonalInfo | null;
  experiences: Experience[];
  educations: Education[];
  skills: SkillCategory[];
  projects: Project[];
};

export default function Home() {
  const [cvData, setCvData] = useState<CvData>({
    personalInfo: null,
    experiences: [],
    educations: [],
    skills: [],
    projects: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getCvData() {
      try {
        const personalInfoRef = doc(db, 'cv-data', 'personalInfo');
        const personalInfoSnap = await getDoc(personalInfoRef);
        const personalInfo = personalInfoSnap.exists() ? (personalInfoSnap.data() as PersonalInfo) : null;

        const experiencesQuery = query(collection(db, 'experiences'), orderBy('order', 'asc'));
        const experiencesSnap = await getDocs(experiencesQuery);
        const experiences = experiencesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Experience));
        
        const educationQuery = query(collection(db, 'education'), orderBy('order', 'asc'));
        const educationSnap = await getDocs(educationQuery);
        const educations = educationSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Education));
        
        const skillsQuery = query(collection(db, 'skills'), orderBy('order', 'asc'));
        const skillsSnap = await getDocs(skillsQuery);
        const skills = skillsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as SkillCategory));

        const projectsQuery = query(collection(db, 'projects'), orderBy('order', 'asc'));
        const projectsSnap = await getDocs(projectsQuery);
        const projects = projectsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Project));

        setCvData({ personalInfo, experiences, educations, skills, projects });
      } catch (error) {
        console.error("Error fetching CV data:", error);
      } finally {
        setLoading(false);
      }
    }

    const trackView = async () => {
      try {
        // Ne pas tracker les vues en local pour ne pas fausser les stats
        if (process.env.NODE_ENV === 'development') return;
        const statRef = doc(db, 'stats', 'cv');
        await setDoc(statRef, { views: increment(1) }, { merge: true });
      } catch (error) {
        console.error("Error tracking view:", error);
      }
    };
    
    getCvData();
    trackView();

  }, []);

  return (
    <LanguageProvider>
      <div className="flex min-h-screen w-full bg-secondary">
        <Navigation cvData={cvData} />
        <main className="flex-1 p-4 sm:p-6 md:p-8 lg:p-10 lg:pl-24">
          <div className="mx-auto max-w-4xl space-y-12 md:space-y-20">
            <ProfileSection initialData={cvData.personalInfo} />
            <ExperienceSection initialData={cvData.experiences} />
            <EducationSection initialData={cvData.educations} />
            <SkillsSection initialData={cvData.skills} />
            <ProjectsSection initialData={cvData.projects} />
            <ContactSection />
          </div>
        </main>
      </div>
    </LanguageProvider>
  );
}
