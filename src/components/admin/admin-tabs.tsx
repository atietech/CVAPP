
'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProfileForm } from "./profile-form";
import { Card, CardDescription, CardHeader, CardTitle, CardContent } from "../ui/card";
import { ExperienceForm } from "./experience-form";
import { EducationForm } from "./education-form";
import { SkillsForm } from "./skills-form";
import { ProjectsForm } from "./projects-form";

export function AdminTabs() {
  return (
    <Tabs defaultValue="profile" className="w-full">
      <TabsList className="grid w-full grid-cols-5">
        <TabsTrigger value="profile">Profil</TabsTrigger>
        <TabsTrigger value="experience">Expérience</TabsTrigger>
        <TabsTrigger value="education">Formation</TabsTrigger>
        <TabsTrigger value="skills">Compétences</TabsTrigger>
        <TabsTrigger value="projects">Projets</TabsTrigger>
      </TabsList>
      <TabsContent value="profile">
        <Card>
            <CardHeader>
                <CardTitle>Profil Personnel</CardTitle>
                <CardDescription>Gérez les informations de base de votre CV. Ces informations seront visibles publiquement.</CardDescription>
            </CardHeader>
            <ProfileForm />
        </Card>
      </TabsContent>
      <TabsContent value="experience">
        <Card>
            <CardHeader>
                <CardTitle>Expériences Professionnelles</CardTitle>
                <CardDescription>Gérez les expériences affichées sur votre CV. Vous pouvez les réorganiser par glisser-déposer.</CardDescription>
            </CardHeader>
            <ExperienceForm />
        </Card>
      </TabsContent>
      <TabsContent value="education">
        <Card>
            <CardHeader>
                <CardTitle>Formations</CardTitle>
                <CardDescription>Gérez les formations et diplômes affichés sur votre CV. Vous pouvez les réorganiser par glisser-déposer.</CardDescription>
            </CardHeader>
            <EducationForm />
        </Card>
      </TabsContent>
      <TabsContent value="skills">
        <Card>
            <CardHeader>
                <CardTitle>Compétences</CardTitle>
                <CardDescription>Gérez les catégories et les compétences affichées sur votre CV.</CardDescription>
            </CardHeader>
            <SkillsForm />
        </Card>
      </TabsContent>
      <TabsContent value="projects">
        <Card>
            <CardHeader>
                <CardTitle>Projets</CardTitle>
                <CardDescription>Gérez les projets affichés sur votre CV. Vous pouvez les réorganiser par glisser-déposer.</CardDescription>
            </CardHeader>
            <ProjectsForm />
        </Card>
      </TabsContent>
    </Tabs>
  );
}
