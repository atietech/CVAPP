
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { db } from '@/lib/firebase';
import { collection, getDocs, writeBatch, doc, query, orderBy, deleteDoc } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import type { SkillCategory } from '@/lib/types';
import { CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Loader2, PlusCircle, Trash2, GripVertical, X } from 'lucide-react';
import { Reorder } from 'framer-motion';
import { Badge } from '../ui/badge';

const technologySchema = z.object({
  name: z.string().min(1, 'Le nom est requis.'),
  level: z.number().min(0).max(100),
});

const skillCategorySchema = z.object({
  id: z.string().optional(),
  category: z.string().min(1, 'La catégorie est requise.'),
  technologies: z.array(technologySchema).min(1, 'Ajoutez au moins une compétence.'),
});

const formSchema = z.object({
  skills: z.array(skillCategorySchema),
});

export function SkillsForm() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { skills: [] },
  });

  const { fields, append, remove, move, update } = useFieldArray({
    control: form.control,
    name: 'skills',
  });

  const fetchData = useCallback(async () => {
    setIsFetching(true);
    try {
      const q = query(collection(db, 'skills'), orderBy('order', 'asc'));
      const querySnapshot = await getDocs(q);
      const fetchedData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as SkillCategory));
      form.reset({ skills: fetchedData });
    } catch (error) {
      console.error('Error fetching skills:', error);
      toast({ variant: 'destructive', title: 'Erreur', description: 'Impossible de charger les compétences.' });
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
      const collectionRef = collection(db, 'skills');
      
      const existingDocsSnapshot = await getDocs(collectionRef);
      const existingIds = existingDocsSnapshot.docs.map(d => d.id);
      const submittedIds = data.skills.map(skill => skill.id).filter(Boolean);

      const idsToDelete = existingIds.filter(id => !submittedIds.includes(id));
      for (const id of idsToDelete) {
        batch.delete(doc(collectionRef, id));
      }

      data.skills.forEach((skill, index) => {
        const docRef = skill.id ? doc(collectionRef, skill.id) : doc(collectionRef);
        batch.set(docRef, { ...skill, order: index });
      });
      
      await batch.commit();
      toast({ title: 'Succès', description: 'Compétences sauvegardées avec succès.' });
      fetchData();
    } catch (error) {
      console.error('Error saving skills:', error);
      toast({ variant: 'destructive', title: 'Erreur', description: 'Une erreur est survenue.' });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleAddCategory = () => append({ category: '', technologies: [] });
  
  const handleRemoveCategory = async (index: number, id?: string) => {
    if (id) {
      setIsLoading(true);
      try {
        await deleteDoc(doc(db, "skills", id));
        toast({ title: "Succès", description: "Catégorie supprimée." });
      } catch (error) {
        toast({ variant: "destructive", title: "Erreur", description: "Impossible de supprimer la catégorie." });
      } finally {
        setIsLoading(false);
      }
    }
    remove(index);
  }

  const handleAddTechnology = (categoryIndex: number, name: string) => {
    if (name) {
      const category = form.getValues(`skills.${categoryIndex}`);
      const newTech = { name, level: 50 };
      const updatedTechnologies = [...category.technologies, newTech];
      update(categoryIndex, { ...category, technologies: updatedTechnologies });
    }
  };

  const handleRemoveTechnology = (categoryIndex: number, techIndex: number) => {
    const category = form.getValues(`skills.${categoryIndex}`);
    const updatedTechnologies = category.technologies.filter((_, i) => i !== techIndex);
    update(categoryIndex, { ...category, technologies: updatedTechnologies });
  };
  
  if (isFetching) {
    return <div className="flex justify-center items-center p-8"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <CardContent className="space-y-6 pt-6">
          <Reorder.Group axis="y" values={fields} onReorder={(v) => v.forEach((value, index) => move(fields.findIndex(f => f.id === (value as any).id), index))} className="space-y-4">
             {fields.map((field, index) => (
              <Reorder.Item key={field.id} value={field} className="rounded-lg border bg-card">
                 <Accordion type="single" collapsible defaultValue="item-0">
                  <AccordionItem value={`item-${index}`} className="border-none">
                    <div className="flex items-center px-4 py-2">
                       <GripVertical className="h-5 w-5 text-muted-foreground cursor-grab" />
                       <AccordionTrigger className="flex-1 text-lg font-semibold hover:no-underline">
                        {form.watch(`skills.${index}.category`) || 'Nouvelle Catégorie'}
                       </AccordionTrigger>
                       <Button type="button" variant="ghost" size="icon" onClick={() => handleRemoveCategory(index, field.id)}>
                        <Trash2 className="h-5 w-5 text-destructive" />
                      </Button>
                    </div>
                    <AccordionContent className="space-y-6 px-6 pb-6">
                        <FormField control={form.control} name={`skills.${index}.category`} render={({ field }) => (
                            <FormItem><FormLabel>Nom de la catégorie</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                        )} />

                        <div>
                            <FormLabel>Compétences</FormLabel>
                            <div className="space-y-4 mt-2">
                                <TechnologyAdder onAdd={(name) => handleAddTechnology(index, name)} />
                                {form.watch(`skills.${index}.technologies`).map((tech, techIndex) => (
                                  <div key={techIndex} className="flex items-center gap-4">
                                    <span className="w-1/4 truncate">{tech.name}</span>
                                    <Controller
                                        control={form.control}
                                        name={`skills.${index}.technologies.${techIndex}.level`}
                                        render={({ field }) => (
                                            <div className="w-2/4 flex items-center gap-2">
                                                <Slider
                                                    defaultValue={[field.value]}
                                                    onValueChange={(value) => field.onChange(value[0])}
                                                    max={100}
                                                    step={1}
                                                />
                                                <Badge variant="outline" className="w-12 justify-center">{field.value}%</Badge>
                                            </div>
                                        )}
                                    />
                                    <Button type="button" variant="ghost" size="icon" onClick={() => handleRemoveTechnology(index, techIndex)}>
                                        <X className="h-4 w-4" />
                                    </Button>
                                  </div>  
                                ))}
                            </div>
                            <FormMessage>{(form.formState.errors.skills?.[index]?.technologies as any)?.message}</FormMessage>
                        </div>
                    </AccordionContent>
                  </AccordionItem>
                 </Accordion>
               </Reorder.Item>
            ))}
          </Reorder.Group>

          <Button type="button" variant="outline" onClick={handleAddCategory} className="w-full">
            <PlusCircle className="mr-2" />
            Ajouter une catégorie
          </Button>
        </CardContent>
        <CardFooter className="border-t px-6 py-4">
          <Button type="submit" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Sauvegarder les compétences
          </Button>
        </CardFooter>
      </form>
    </Form>
  );
}

function TechnologyAdder({ onAdd }: { onAdd: (name: string) => void }) {
  const [name, setName] = useState('');
  
  const handleAdd = () => {
    if (name) {
      onAdd(name);
      setName('');
    }
  };

  return (
    <div className="flex gap-2">
      <Input
        value={name}
        onChange={(e) => setName(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            handleAdd();
          }
        }}
        placeholder="Nouvelle compétence..."
      />
      <Button type="button" onClick={handleAdd}>Ajouter</Button>
    </div>
  );
}

