
'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { db, storage } from '@/lib/firebase';
import { getDownloadURL, ref, uploadString } from 'firebase/storage';
import { collection, getDocs, writeBatch, doc, query, orderBy, deleteDoc } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import type { Project } from '@/lib/types';
import { CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Loader2, PlusCircle, Trash2, GripVertical, Languages, X, Upload } from 'lucide-react';
import { Reorder } from 'framer-motion';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';
import Image from 'next/image';
import { Badge } from '../ui/badge';

const projectSchema = z.object({
  id: z.string().optional(),
  title_fr: z.string().min(1, 'Le titre (FR) est requis.'),
  title_en: z.string().min(1, 'Le titre (EN) est requis.'),
  description_fr: z.string().min(1, 'La description (FR) est requise.'),
  description_en: z.string().min(1, 'La description (EN) est requise.'),
  image: z.string().optional(),
  technologies: z.array(z.string()).min(1, 'Ajoutez au moins une technologie.'),
  demoLink: z.string().url('URL invalide').optional().or(z.literal('')),
  githubLink: z.string().url('URL invalide').optional().or(z.literal('')),
});

const formSchema = z.object({
  projects: z.array(projectSchema),
});

export function ProjectsForm() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [lang, setLang] = useState<'fr' | 'en'>('fr');

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { projects: [] },
  });

  const { fields, append, remove, move } = useFieldArray({
    control: form.control,
    name: 'projects',
  });

  const [techInputs, setTechInputs] = useState<string[]>(Array(fields.length).fill(''));
  const imageFileRefs = useRef<(HTMLInputElement | null)[]>([]);

  const fetchData = useCallback(async () => {
    setIsFetching(true);
    try {
      const q = query(collection(db, 'projects'), orderBy('order', 'asc'));
      const querySnapshot = await getDocs(q);
      const fetchedData = querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          title_fr: data.title.fr, title_en: data.title.en,
          description_fr: data.description.fr, description_en: data.description.en,
          image: data.image,
          technologies: data.technologies,
          demoLink: data.demoLink,
          githubLink: data.githubLink,
        };
      });
      form.reset({ projects: fetchedData });
      setTechInputs(Array(fetchedData.length).fill(''));
    } catch (error) {
      console.error('Error fetching projects:', error);
      toast({ variant: 'destructive', title: 'Erreur', description: 'Impossible de charger les projets.' });
    } finally {
      setIsFetching(false);
    }
  }, [form, toast]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    try {
      const batch = writeBatch(db);
      const collectionRef = collection(db, 'projects');
      
      const existingDocsSnapshot = await getDocs(collectionRef);
      const existingIds = existingDocsSnapshot.docs.map(d => d.id);
      const submittedIds = data.projects.map(p => p.id).filter(Boolean);
      
      const idsToDelete = existingIds.filter(id => !submittedIds.includes(id));
      for (const id of idsToDelete) {
        batch.delete(doc(collectionRef, id));
      }

      data.projects.forEach((project, index) => {
        const docRef = project.id ? doc(collectionRef, project.id) : doc(collectionRef);
        const dataToSave = {
          title: { fr: project.title_fr, en: project.title_en },
          description: { fr: project.description_fr, en: project.description_en },
          image: project.image || '',
          technologies: project.technologies,
          demoLink: project.demoLink || '',
          githubLink: project.githubLink || '',
          order: index,
        };
        batch.set(docRef, dataToSave);
      });
      
      await batch.commit();
      toast({ title: 'Succès', description: 'Projets sauvegardés avec succès.' });
      fetchData();
    } catch (error) {
      console.error('Error saving projects:', error);
      toast({ variant: 'destructive', title: 'Erreur', description: 'Une erreur est survenue.' });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleAddProject = () => {
    append({
      title_fr: '', title_en: '',
      description_fr: '', description_en: '',
      image: '',
      technologies: [],
      demoLink: '',
      githubLink: '',
    });
    setTechInputs(prev => [...prev, '']);
  };

  const handleRemoveProject = async (index: number, id?: string) => {
    if (id) {
        setIsLoading(true);
        try {
            await deleteDoc(doc(db, "projects", id));
            toast({ title: "Succès", description: "Projet supprimé." });
        } catch (error) {
            toast({ variant: "destructive", title: "Erreur", description: "Impossible de supprimer le projet." });
        } finally {
            setIsLoading(false);
        }
    }
    remove(index);
    const newTechInputs = [...techInputs];
    newTechInputs.splice(index, 1);
    setTechInputs(newTechInputs);
  };
  
  const handleAddTechnology = (index: number) => {
    const techInput = techInputs[index];
    if (techInput && !form.getValues(`projects.${index}.technologies`).includes(techInput)) {
      const newTechs = [...form.getValues(`projects.${index}.technologies`), techInput];
      form.setValue(`projects.${index}.technologies`, newTechs, { shouldValidate: true });
      const newTechInputs = [...techInputs];
      newTechInputs[index] = '';
      setTechInputs(newTechInputs);
    }
  };

  const handleRemoveTechnology = (projIndex: number, tech: string) => {
    const newTechs = form.getValues(`projects.${projIndex}.technologies`).filter(t => t !== tech);
    form.setValue(`projects.${projIndex}.technologies`, newTechs, { shouldValidate: true });
  };
  
  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async () => {
        const dataUrl = reader.result as string;
        form.setValue(`projects.${index}.image`, dataUrl, { shouldValidate: true }); // Optimistic update for preview
        const storageRef = ref(storage, `projects/${Date.now()}_${file.name}`);
        try {
            const snapshot = await uploadString(storageRef, dataUrl, 'data_url');
            const downloadURL = await getDownloadURL(snapshot.ref);
            form.setValue(`projects.${index}.image`, downloadURL, { shouldValidate: true });
            toast({ title: "Succès", description: "Image téléversée. N'oubliez pas de sauvegarder." });
        } catch (error) {
            toast({ variant: 'destructive', title: "Erreur d'upload", description: "Impossible de sauvegarder l'image." });
        } finally {
            setIsLoading(false);
        }
    };
  };

  if (isFetching) {
    return <div className="flex justify-center items-center p-8"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <CardContent className="space-y-6 pt-6">
           <div className="flex justify-end">
             <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                         <Button type="button" variant={lang === 'fr' ? 'default' : 'outline'} size="sm" onClick={() => setLang(l => l === 'fr' ? 'en' : 'fr')}>
                            <Languages className="mr-2" /> {lang.toUpperCase()}
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent><p>Changer la langue de saisie</p></TooltipContent>
                </Tooltip>
             </TooltipProvider>
          </div>
          
          <Reorder.Group axis="y" values={fields} onReorder={(v) => form.setValue('projects', v)} className="space-y-4">
             {fields.map((field, index) => (
              <Reorder.Item key={field.id} value={field} className="rounded-lg border bg-card">
                 <Accordion type="single" collapsible defaultValue="item-0">
                  <AccordionItem value={`item-${index}`} className="border-none">
                    <div className="flex items-center px-4 py-2">
                       <GripVertical className="h-5 w-5 text-muted-foreground cursor-grab" />
                       <AccordionTrigger className="flex-1 text-lg font-semibold hover:no-underline">
                        {form.watch(`projects.${index}.title_${lang}`) || 'Nouveau Projet'}
                       </AccordionTrigger>
                       <Button type="button" variant="ghost" size="icon" onClick={() => handleRemoveProject(index, field.id)}>
                        <Trash2 className="h-5 w-5 text-destructive" />
                      </Button>
                    </div>
                    <AccordionContent className="space-y-6 px-6 pb-6">
                        {lang === 'fr' ? (
                            <div className="space-y-4">
                                <FormField control={form.control} name={`projects.${index}.title_fr`} render={({ field }) => (
                                    <FormItem><FormLabel>Titre (FR)</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                                )} />
                                <FormField control={form.control} name={`projects.${index}.description_fr`} render={({ field }) => (
                                    <FormItem><FormLabel>Description (FR)</FormLabel><FormControl><Textarea {...field} rows={3} /></FormControl><FormMessage /></FormItem>
                                )} />
                            </div>
                        ) : (
                             <div className="space-y-4">
                                <FormField control={form.control} name={`projects.${index}.title_en`} render={({ field }) => (
                                    <FormItem><FormLabel>Title (EN)</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                                )} />
                                <FormField control={form.control} name={`projects.${index}.description_en`} render={({ field }) => (
                                    <FormItem><FormLabel>Description (EN)</FormLabel><FormControl><Textarea {...field} rows={3} /></FormControl><FormMessage /></FormItem>
                                )} />
                            </div>
                        )}
                        
                        <div>
                            <FormLabel>Image du projet</FormLabel>
                            <div className="mt-2 flex items-center gap-4">
                                <Image 
                                    src={form.watch(`projects.${index}.image`) || 'https://placehold.co/150x150.png'}
                                    alt="Aperçu"
                                    width={100}
                                    height={100}
                                    className="rounded-md object-cover"
                                />
                                <Button type="button" variant="outline" onClick={() => imageFileRefs.current[index]?.click()} disabled={isLoading}>
                                    <Upload className="mr-2 h-4 w-4" /> Uploader
                                </Button>
                                <input type="file" ref={el => imageFileRefs.current[index] = el} onChange={(e) => handleImageUpload(e, index)} accept="image/*" className="hidden" />
                            </div>
                        </div>

                         <div>
                            <FormLabel>Technologies</FormLabel>
                            <div className="flex gap-2 mt-2">
                                <Input 
                                  value={techInputs[index]}
                                  onChange={e => {
                                      const newTechInputs = [...techInputs];
                                      newTechInputs[index] = e.target.value;
                                      setTechInputs(newTechInputs);
                                  }}
                                  onKeyDown={e => { if(e.key === 'Enter') { e.preventDefault(); handleAddTechnology(index); } }}
                                  placeholder="Appuyez sur Entrée pour ajouter"
                                />
                                <Button type="button" onClick={() => handleAddTechnology(index)}>Ajouter</Button>
                            </div>
                            <div className="flex flex-wrap gap-2 mt-2">
                                {form.watch(`projects.${index}.technologies`).map(tech => (
                                    <Badge key={tech} variant="secondary" className="flex items-center gap-1">
                                        {tech}
                                        <button type="button" onClick={() => handleRemoveTechnology(index, tech)} className="rounded-full hover:bg-destructive/20 p-0.5"><X className="h-3 w-3" /></button>
                                    </Badge>
                                ))}
                            </div>
                             <FormMessage>{(form.formState.errors.projects?.[index]?.technologies as any)?.message}</FormMessage>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField control={form.control} name={`projects.${index}.demoLink`} render={({ field }) => (
                                <FormItem><FormLabel>Lien de la démo</FormLabel><FormControl><Input placeholder="https://..." {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                            <FormField control={form.control} name={`projects.${index}.githubLink`} render={({ field }) => (
                                <FormItem><FormLabel>Lien GitHub</FormLabel><FormControl><Input placeholder="https://github.com/..." {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                        </div>
                    </AccordionContent>
                  </AccordionItem>
                 </Accordion>
               </Reorder.Item>
            ))}
          </Reorder.Group>

          <Button type="button" variant="outline" onClick={handleAddProject} className="w-full">
            <PlusCircle className="mr-2" />
            Ajouter un projet
          </Button>
        </CardContent>
        <CardFooter className="border-t px-6 py-4">
          <Button type="submit" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Sauvegarder les projets
          </Button>
        </CardFooter>
      </form>
    </Form>
  );
}
