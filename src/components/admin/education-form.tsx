
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { db } from '@/lib/firebase';
import { collection, getDocs, writeBatch, doc, query, orderBy, deleteDoc } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import type { Education } from '@/lib/types';
import { CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Loader2, PlusCircle, Trash2, GripVertical, Languages } from 'lucide-react';
import { Reorder } from 'framer-motion';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';

const educationSchema = z.object({
  id: z.string().optional(),
  degree_fr: z.string().min(1, 'Le diplôme (FR) est requis.'),
  degree_en: z.string().min(1, 'Le diplôme (EN) est requis.'),
  institution: z.string().min(1, 'L\'établissement est requis.'),
  duration: z.string().min(1, 'La durée est requise.'),
  description_fr: z.string().min(1, 'La description (FR) est requise.'),
  description_en: z.string().min(1, 'La description (EN) est requise.'),
});

const formSchema = z.object({
  educations: z.array(educationSchema),
});

export function EducationForm() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [lang, setLang] = useState<'fr' | 'en'>('fr');

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { educations: [] },
  });

  const { fields, append, remove, move } = useFieldArray({
    control: form.control,
    name: 'educations',
  });

  const fetchData = useCallback(async () => {
    setIsFetching(true);
    try {
      const q = query(collection(db, 'education'), orderBy('order', 'asc'));
      const querySnapshot = await getDocs(q);
      const fetchedData = querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          degree_fr: data.degree.fr,
          degree_en: data.degree.en,
          institution: data.institution,
          duration: data.duration,
          description_fr: data.description.fr,
          description_en: data.description.en,
        };
      });
      form.reset({ educations: fetchedData });
    } catch (error) {
      console.error('Error fetching education:', error);
      toast({ variant: 'destructive', title: 'Erreur', description: 'Impossible de charger les formations.' });
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
      const collectionRef = collection(db, 'education');

      const existingDocsSnapshot = await getDocs(collectionRef);
      const existingIds = existingDocsSnapshot.docs.map(d => d.id);
      const submittedIds = data.educations.map(edu => edu.id).filter(Boolean);
      
      const idsToDelete = existingIds.filter(id => !submittedIds.includes(id));
      for (const id of idsToDelete) {
        batch.delete(doc(collectionRef, id));
      }

      data.educations.forEach((edu, index) => {
        const docRef = edu.id ? doc(collectionRef, edu.id) : doc(collectionRef);
        const dataToSave = {
          degree: { fr: edu.degree_fr, en: edu.degree_en },
          institution: edu.institution,
          duration: edu.duration,
          description: { fr: edu.description_fr, en: edu.description_en },
          order: index,
        };
        batch.set(docRef, dataToSave);
      });
      
      await batch.commit();
      toast({ title: 'Succès', description: 'Formations sauvegardées avec succès.' });
      fetchData();
    } catch (error) {
      console.error('Error saving education:', error);
      toast({ variant: 'destructive', title: 'Erreur', description: 'Une erreur est survenue.' });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleAdd = () => {
    append({
      degree_fr: '', degree_en: '',
      institution: '', duration: '',
      description_fr: '', description_en: '',
    });
  };
  
  const handleRemove = async (index: number, id?: string) => {
    if (id) {
        setIsLoading(true);
        try {
            await deleteDoc(doc(db, "education", id));
            toast({ title: "Succès", description: "Formation supprimée de la base de données." });
        } catch (error) {
            toast({ variant: "destructive", title: "Erreur", description: "Impossible de supprimer la formation." });
        } finally {
            setIsLoading(false);
        }
    }
    remove(index);
  }
  
  const onReorder = (reorderedList: any[]) => {
    form.setValue('educations', reorderedList);
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
                        {form.watch(`educations.${index}.degree_${lang}`) || 'Nouvelle Formation'}
                       </AccordionTrigger>
                       <Button type="button" variant="ghost" size="icon" onClick={() => handleRemove(index, field.id)}>
                        <Trash2 className="h-5 w-5 text-destructive" />
                      </Button>
                    </div>
                    <AccordionContent className="space-y-6 px-6 pb-6">
                        {lang === 'fr' ? (
                            <>
                                <FormField control={form.control} name={`educations.${index}.degree_fr`} render={({ field }) => (
                                    <FormItem><FormLabel>Diplôme (FR)</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                                )} />
                                <FormField control={form.control} name={`educations.${index}.description_fr`} render={({ field }) => (
                                    <FormItem><FormLabel>Description (FR)</FormLabel><FormControl><Textarea {...field} rows={3} /></FormControl><FormMessage /></FormItem>
                                )} />
                            </>
                        ) : (
                             <>
                                <FormField control={form.control} name={`educations.${index}.degree_en`} render={({ field }) => (
                                    <FormItem><FormLabel>Degree (EN)</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                                )} />
                                <FormField control={form.control} name={`educations.${index}.description_en`} render={({ field }) => (
                                    <FormItem><FormLabel>Description (EN)</FormLabel><FormControl><Textarea {...field} rows={3} /></FormControl><FormMessage /></FormItem>
                                )} />
                            </>
                        )}
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField control={form.control} name={`educations.${index}.institution`} render={({ field }) => (
                                <FormItem><FormLabel>Établissement</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                            <FormField control={form.control} name={`educations.${index}.duration`} render={({ field }) => (
                                <FormItem><FormLabel>Durée</FormLabel><FormControl><Input placeholder="Ex: 2018 - 2020" {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                        </div>
                    </AccordionContent>
                  </AccordionItem>
                 </Accordion>
               </Reorder.Item>
            ))}
          </Reorder.Group>

          <Button type="button" variant="outline" onClick={handleAdd} className="w-full">
            <PlusCircle className="mr-2" />
            Ajouter une formation
          </Button>
        </CardContent>
        <CardFooter className="border-t px-6 py-4">
          <Button type="submit" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Sauvegarder les formations
          </Button>
        </CardFooter>
      </form>
    </Form>
  );
}
