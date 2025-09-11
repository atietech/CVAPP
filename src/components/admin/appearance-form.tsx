
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Loader2, Check } from 'lucide-react';
import { themes, type Theme } from '@/lib/themes';
import { cn } from '@/lib/utils';

const formSchema = z.object({
  themeName: z.string().min(1, 'Veuillez sélectionner un thème.'),
});

export function AppearanceForm() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      themeName: 'default',
    },
  });

  const fetchData = useCallback(async () => {
    setIsFetching(true);
    try {
      const docRef = doc(db, 'cv-data', 'theme');
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        form.reset({ themeName: data.name });
      } else {
        form.reset({ themeName: 'default' });
      }
    } catch (error) {
      console.error('Error fetching theme:', error);
      toast({ variant: 'destructive', title: 'Erreur', description: 'Impossible de charger le thème actuel.' });
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
      const selectedTheme = themes.find(t => t.name === data.themeName);
      if (!selectedTheme) {
        toast({ variant: 'destructive', title: 'Erreur', description: 'Thème invalide.' });
        return;
      }
      await setDoc(doc(db, 'cv-data', 'theme'), selectedTheme);
      toast({ title: 'Succès', description: 'Thème sauvegardé avec succès.' });
      fetchData();
    } catch (error) {
      console.error('Error saving theme:', error);
      toast({ variant: 'destructive', title: 'Erreur', description: 'Une erreur est survenue lors de la sauvegarde.' });
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <CardContent className="pt-6">
          <FormField
            control={form.control}
            name="themeName"
            render={({ field }) => (
              <FormItem className="space-y-4">
                <FormLabel className="text-base">Palettes de couleurs</FormLabel>
                <FormControl>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {themes.map((theme) => (
                      <button
                        key={theme.name}
                        type="button"
                        onClick={() => field.onChange(theme.name)}
                        className={cn(
                          'rounded-lg border-2 p-4 transition-all',
                          field.value === theme.name ? 'border-primary ring-2 ring-primary' : 'border-muted'
                        )}
                      >
                        <div className="flex items-center justify-between">
                            <span className="font-semibold capitalize">{theme.name}</span>
                            {field.value === theme.name && <Check className="h-5 w-5 text-primary" />}
                        </div>
                        <div className="mt-2 flex -space-x-1 overflow-hidden">
                            <div className="h-8 w-8 rounded-full border-2 border-white" style={{ backgroundColor: `hsl(${theme.light.primary})` }} />
                            <div className="h-8 w-8 rounded-full border-2 border-white" style={{ backgroundColor: `hsl(${theme.light.secondary})` }} />
                            <div className="h-8 w-8 rounded-full border-2 border-white" style={{ backgroundColor: `hsl(${theme.light.accent})` }} />
                        </div>
                      </button>
                    ))}
                  </div>
                </FormControl>
              </FormItem>
            )}
          />
        </CardContent>
        <CardFooter className="border-t px-6 py-4">
          <Button type="submit" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Sauvegarder l'apparence
          </Button>
        </CardFooter>
      </form>
    </Form>
  );
}
