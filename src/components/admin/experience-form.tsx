
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { db } from '@/lib/firebase';
import { collection, getDocs, writeBatch, doc, query, orderBy, deleteDoc } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import type { Experience } from '@/lib/types';
import { CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Loader2, PlusCircle, Trash2, GripVertical, Languages, X } from 'lucide-react';
import { Reorder } from 'framer-motion';
import 'framer-motion';
import { Badge } from '../ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';

const experienceSchema = z.object({
  id: z.string().optional(),
  position_fr: z.string().min(1, 'Le poste (FR) est requis.'),
  position_en: z.string().min(1, 'Le poste (EN) est requis.'),
  company: z.string().min(1, 'L\'entreprise est requise.'),
  duration: z.string().min(1, 'La durée est requise.'),
  description_fr: z.string().min(1, 'La description (FR) est requise.'),
  description_en: z.string().min(1, 'La description (EN) est requise.'),
  technologies: z.array(z.string()).min(1, 'Ajoutez au moins une technologie.'),
});

const formSchema = z.object({
  experiences: z.array(experienceSchema),
});

export function ExperienceForm() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [lang, setLang] = useState<'fr' | 'en'>('fr');

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { experiences: [] },
  });

  const { fields, append, remove, move } = useFieldArray({
    control: form.control,
    name: 'experiences',
  });

  const [techInputs, setTechInputs] = useState<string[]>(Array(fields.length).fill(''));

  const fetchData = useCallback(async () => {
    setIsFetching(true);
    try {
      const q = query(collection(db, 'experiences'), orderBy('order', 'asc'));
      const querySnapshot = await getDocs(q);
      const fetchedExperiences = querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          position_fr: data.position.fr,
          position_en: data.position.en,
          company: data.company,
          duration: data.duration,
          description_fr: data.description.fr,
          description_en: data.description.en,
          technologies: data.technologies,
        };
      });
      form.reset({ experiences: fetchedExperiences });
      setTechInputs(Array(fetchedExperiences.length).fill(''));
    } catch (error) {
      console.error('Error fetching experiences:', error);
      toast({ variant: 'destructive', title: 'Erreur', description: 'Impossible de charger les expériences.' });
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
      const experiencesCollection = collection(db, 'experiences');

      // First, get all existing docs to find which ones to delete
      const existingDocsSnapshot = await getDocs(experiencesCollection);
      const existingIds = existingDocsSnapshot.docs.map(d => d.id);
      const submittedIds = data.experiences.map(exp => exp.id).filter(Boolean);
      
      // Delete experiences that are no longer in the form
      const idsToDelete = existingIds.filter(id => !submittedIds.includes(id));
      for (const id of idsToDelete) {
        batch.delete(doc(experiencesCollection, id));
      }

      data.experiences.forEach((exp, index) => {
        const docRef = exp.id ? doc(experiencesCollection, exp.id) : doc(experiencesCollection);
        const experienceToSave = {
          position: { fr: exp.position_fr, en: exp.position_en },
          company: exp.company,
          duration: exp.duration,
          description: { fr: exp.description_fr, en: exp.description_en },
          technologies: exp.technologies,
          order: index,
        };
        batch.set(docRef, experienceToSave);
      });
      
      await batch.commit();
      toast({ title: 'Succès', description: 'Expériences sauvegardées avec succès.' });
      fetchData(); // Refresh data to get new IDs
    } catch (error) {
      console.error('Error saving experiences:', error);
      toast({ variant: 'destructive', title: 'Erreur', description: 'Une erreur est survenue.' });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleAddExperience = () => {
    append({
      position_fr: '', position_en: '',
      company: '', duration: '',
      description_fr: '', description_en: '',
      technologies: [],
    });
    setTechInputs(prev => [...prev, '']);
  };

  const handleAddTechnology = (index: number) => {
    const techInput = techInputs[index];
    if (techInput && !form.getValues(`experiences.${index}.technologies`).includes(techInput)) {
      const newTechs = [...form.getValues(`experiences.${index}.technologies`), techInput];
      form.setValue(`experiences.${index}.technologies`, newTechs, { shouldValidate: true });
      const newTechInputs = [...techInputs];
      newTechInputs[index] = '';
      setTechInputs(newTechInputs);
    }
  };

  const handleRemoveTechnology = (expIndex: number, tech: string) => {
    const newTechs = form.getValues(`experiences.${expIndex}.technologies`).filter(t => t !== tech);
    form.setValue(`experiences.${expIndex}.technologies`, newTechs, { shouldValidate: true });
  };
  
  const handleRemoveExperience = async (index: number, id?: string) => {
    if (id) {
        setIsLoading(true);
        try {
            await deleteDoc(doc(db, "experiences", id));
            toast({ title: "Succès", description: "Expérience supprimée de la base de données." });
        } catch (error) {
            toast({ variant: "destructive", title: "Erreur", description: "Impossible de supprimer l'expérience." });
        } finally {
            setIsLoading(false);
        }
    }
    remove(index);
    const newTechInputs = [...techInputs];
    newTechInputs.splice(index, 1);
    setTechInputs(newTechInputs);
  }
  
  const onReorder = (reorderedList: any[]) => {
    form.setValue('experiences', reorderedList);
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

          <Reorder.Group axis="y" values={fields} onReorder={onReorder} className="space-y-4">
             {fields.map((field, index) => (
              <Reorder.Item key={field.id} value={field} className="rounded-lg border bg-card">
                 <Accordion type="single" collapsible defaultValue="item-0">
                  <AccordionItem value={`item-${index}`} className="border-none">
                    <div className="flex items-center px-4 py-2">
                       <GripVertical className="h-5 w-5 text-muted-foreground cursor-grab" />
                       <AccordionTrigger className="flex-1 text-lg font-semibold hover:no-underline">
                        {form.watch(`experiences.${index}.position_${lang}`) || 'Nouvelle Expérience'}
                       </AccordionTrigger>
                       <Button type="button" variant="ghost" size="icon" onClick={() => handleRemoveExperience(index, field.id)}>
                        <Trash2 className="h-5 w-5 text-destructive" />
                      </Button>
                    </div>
                    <AccordionContent className="space-y-6 px-6 pb-6">
                        {lang === 'fr' ? (
                            <>
                                <FormField control={form.control} name={`experiences.${index}.position_fr`} render={({ field }) => (
                                    <FormItem><FormLabel>Poste (FR)</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                                )} />
                                <FormField control={form.control} name={`experiences.${index}.description_fr`} render={({ field }) => (
                                    <FormItem><FormLabel>Description (FR)</FormLabel><FormControl><Textarea {...field} rows={4} /></FormControl><FormMessage /></FormItem>
                                )} />
                            </>
                        ) : (
                             <>
                                <FormField control={form.control} name={`experiences.${index}.position_en`} render={({ field }) => (
                                    <FormItem><FormLabel>Position (EN)</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                                )} />
                                <FormField control={form.control} name={`experiences.${index}.description_en`} render={({ field }) => (
                                    <FormItem><FormLabel>Description (EN)</FormLabel><FormControl><Textarea {...field} rows={4} /></FormControl><FormMessage /></FormItem>
                                )} />
                            </>
                        )}
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField control={form.control} name={`experiences.${index}.company`} render={({ field }) => (
                                <FormItem><FormLabel>Entreprise</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                            <FormField control={form.control} name={`experiences.${index}.duration`} render={({ field }) => (
                                <FormItem><FormLabel>Durée</FormLabel><FormControl><Input placeholder="Ex: Jan 2020 - Présent" {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
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
                                  onKeyDown={e => {
                                    if(e.key === 'Enter') {
                                        e.preventDefault();
                                        handleAddTechnology(index);
                                    }
                                  }}
                                  placeholder="Appuyez sur Entrée pour ajouter"
                                />
                                <Button type="button" onClick={() => handleAddTechnology(index)}>Ajouter</Button>
                            </div>
                            <div className="flex flex-wrap gap-2 mt-2">
                                {form.watch(`experiences.${index}.technologies`).map(tech => (
                                    <Badge key={tech} variant="secondary" className="flex items-center gap-1">
                                        {tech}
                                        <button type="button" onClick={() => handleRemoveTechnology(index, tech)} className="rounded-full hover:bg-destructive/20 p-0.5">
                                            <X className="h-3 w-3" />
                                        </button>
                                    </Badge>
                                ))}
                            </div>
                             <FormMessage>{(form.formState.errors.experiences?.[index]?.technologies as any)?.message}</FormMessage>
                        </div>
                    </AccordionContent>
                  </AccordionItem>
                 </Accordion>
               </Reorder.Item>
            ))}
          </Reorder.Group>

          <Button type="button" variant="outline" onClick={handleAddExperience} className="w-full">
            <PlusCircle className="mr-2" />
            Ajouter une expérience
          </Button>
        </CardContent>
        <CardFooter className="border-t px-6 py-4">
          <Button type="submit" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Sauvegarder les expériences
          </Button>
        </CardFooter>
      </form>
    </Form>
  );
}
