
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { CardContent, CardFooter } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { db, storage } from '@/lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { getDownloadURL, ref, uploadString } from 'firebase/storage';
import React, { useEffect, useState } from 'react';
import { Loader2, Upload } from 'lucide-react';
import Image from 'next/image';

// Schéma pour les champs non traduisibles + l'avatar
const commonSchema = z.object({
  avatar: z.string().url("L'URL de l'avatar est invalide.").optional().or(z.literal('')),
  email: z.string().email("L'e-mail est invalide."),
  phone: z.string().min(10, "Le téléphone est invalide."),
  location: z.string().min(3, "La localisation est requise."),
  github: z.string().url("L'URL GitHub est invalide.").optional().or(z.literal('')),
  linkedin: z.string().url("L'URL LinkedIn est invalide.").optional().or(z.literal('')),
  website: z.string().url("L'URL du site web est invalide.").optional().or(z.literal('')),
});

// Schéma pour les champs français
const frSchema = z.object({
  name_fr: z.string().min(2, "Le nom (FR) est requis."),
  title_fr: z.string().min(5, "Le titre (FR) est requis."),
  summary_fr: z.string().min(20, "Le résumé (FR) doit faire au moins 20 caractères."),
});

// Schéma pour les champs anglais
const enSchema = z.object({
  name_en: z.string().min(2, "Le nom (EN) est requis."),
  title_en: z.string().min(5, "Le titre (EN) est requis."),
  summary_en: z.string().min(20, "Le résumé (EN) doit faire au moins 20 caractères."),
});

// Schéma complet combinant les trois
const formSchema = commonSchema.merge(frSchema).merge(enSchema);

export function ProfileForm() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const avatarFileRef = React.useRef<HTMLInputElement>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
        name_fr: 'Jean Dupont', name_en: 'John Doe',
        title_fr: 'Développeur Full-Stack', title_en: 'Full-Stack Developer',
        summary_fr: 'Passionné par le développement web et les nouvelles technologies, avec une solide expérience dans la création d\'applications web modernes.',
        summary_en: 'Passionate about web development and new technologies, with solid experience in creating modern web applications.',
        avatar: '', 
        email: 'contact@exemple.com', 
        phone: '+33 6 01 02 03 04', 
        location: 'Paris, France',
        github: 'https://github.com', 
        linkedin: 'https://linkedin.com', 
        website: 'https://example.com'
    },
  });
  
  useEffect(() => {
    const fetchData = async () => {
        setIsFetching(true);
        try {
            const docRef = doc(db, 'cv-data', 'personalInfo');
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                const data = docSnap.data();
                const defaultValues = form.getValues();
                form.reset({
                    name_fr: data.name?.fr || defaultValues.name_fr,
                    name_en: data.name?.en || defaultValues.name_en,
                    title_fr: data.title?.fr || defaultValues.title_fr,
                    title_en: data.title?.en || defaultValues.title_en,
                    summary_fr: data.summary?.fr || defaultValues.summary_fr,
                    summary_en: data.summary?.en || defaultValues.summary_en,
                    avatar: data.avatar || defaultValues.avatar,
                    email: data.contact?.email || defaultValues.email,
                    phone: data.contact?.phone || defaultValues.phone,
                    location: data.contact?.location || defaultValues.location,
                    github: data.socials?.github || defaultValues.github,
                    linkedin: data.socials?.linkedin || defaultValues.linkedin,
                    website: data.socials?.website || defaultValues.website,
                });
                setAvatarPreview(data.avatar || null);
            }
        } catch (error) {
            console.error("Error fetching data:", error);
            toast({ variant: "destructive", title: "Erreur", description: "Impossible de charger les données." });
        } finally {
            setIsFetching(false);
        }
    };
    fetchData();
  }, [form, toast]);


  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async () => {
        const dataUrl = reader.result as string;
        setAvatarPreview(dataUrl); // Optimistic update
        const storageRef = ref(storage, `avatars/${Date.now()}_${file.name}`);
        try {
            const snapshot = await uploadString(storageRef, dataUrl, 'data_url');
            const downloadURL = await getDownloadURL(snapshot.ref);
            form.setValue('avatar', downloadURL, { shouldValidate: true });
            toast({ title: "Succès", description: "Avatar mis à jour. N'oubliez pas de sauvegarder les changements." });
        } catch (error) {
            console.error("Upload error:", error);
            toast({ variant: 'destructive', title: "Erreur d'upload", description: "Impossible de sauvegarder l'avatar." });
            setAvatarPreview(form.getValues('avatar')); // Revert on error
        } finally {
            setIsLoading(false);
        }
    };
  };

  const onSubmit = async () => {
    setIsLoading(true);
    try {
        const values = form.getValues();
        const dataToSave = {
            name: { fr: values.name_fr, en: values.name_en },
            title: { fr: values.title_fr, en: values.title_en },
            summary: { fr: values.summary_fr, en: values.summary_en },
            avatar: values.avatar,
            contact: {
                email: values.email,
                phone: values.phone,
                location: values.location,
            },
            socials: {
                github: values.github,
                linkedin: values.linkedin,
                website: values.website,
            }
        };

        await setDoc(doc(db, 'cv-data', 'personalInfo'), dataToSave, { merge: true });
        toast({
            title: 'Profil sauvegardé !',
            description: 'Vos informations ont été mises à jour avec succès.',
        });
    } catch (error) {
        console.error("Save error:", error)
        toast({
            title: 'Erreur',
            description: 'Une erreur est survenue lors de la sauvegarde.',
            variant: 'destructive',
        });
    } finally {
        setIsLoading(false);
    }
  };
  
  if (isFetching) {
      return (
          <div className="flex justify-center items-center p-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
      )
  }

  return (
    <Form {...form}>
       <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-8 pt-6">
                <div className="flex flex-col md:flex-row items-center gap-6">
                <div className='flex-shrink-0'>
                    {avatarPreview ? (
                        <Image src={avatarPreview} alt="Avatar" width={100} height={100} className="rounded-full object-cover" />
                    ) : (
                        <div className="w-[100px] h-[100px] rounded-full bg-secondary flex items-center justify-center">
                            <span className="text-xs text-muted-foreground">Aucune image</span>
                        </div>
                    )}
                </div>
                <div className="flex-grow w-full">
                    <FormLabel>Avatar</FormLabel>
                    <div className='flex gap-2 mt-2'>
                        <FormField
                            control={form.control}
                            name="avatar"
                            render={({ field }) => (
                            <FormItem className="flex-grow">
                                <FormControl>
                                <Input {...field} readOnly placeholder="URL de l'avatar..." />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                            <Button type="button" variant="outline" onClick={() => avatarFileRef.current?.click()} disabled={isLoading}>
                            <Upload className="mr-2 h-4 w-4" />
                            Uploader
                        </Button>
                    </div>
                    <input type="file" ref={avatarFileRef} onChange={handleAvatarUpload} accept="image/*" className="hidden" />
                </div>
                </div>

                <Tabs defaultValue="fr" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="fr">Français</TabsTrigger>
                    <TabsTrigger value="en">Anglais</TabsTrigger>
                </TabsList>
                <TabsContent value="fr" className="space-y-6 pt-4">
                    <FormField control={form.control} name="name_fr" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Nom Complet *</FormLabel>
                        <FormControl><Input placeholder="Ex: Jean Dupont" {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                    )} />
                    <FormField control={form.control} name="title_fr" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Titre / Poste *</FormLabel>
                        <FormControl><Input placeholder="Ex: Développeur Full-Stack" {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                    )} />
                    <FormField control={form.control} name="summary_fr" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Résumé *</FormLabel>
                        <FormControl><Textarea placeholder="Présentez-vous en quelques phrases..." {...field} rows={5}/></FormControl>
                        <FormMessage />
                    </FormItem>
                    )} />
                </TabsContent>
                <TabsContent value="en" className="space-y-6 pt-4">
                    <FormField control={form.control} name="name_en" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Full Name *</FormLabel>
                        <FormControl><Input placeholder="Ex: John Doe" {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                    )} />
                    <FormField control={form.control} name="title_en" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Title / Position *</FormLabel>
                        <FormControl><Input placeholder="Ex: Full-Stack Developer" {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                    )} />
                    <FormField control={form.control} name="summary_en" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Summary *</FormLabel>
                        <FormControl><Textarea placeholder="Introduce yourself in a few sentences..." {...field} rows={5}/></FormControl>
                        <FormMessage />
                    </FormItem>
                    )} />
                </TabsContent>
                </Tabs>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField control={form.control} name="email" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl><Input type="email" placeholder="contact@exemple.com" {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                    )} />
                    <FormField control={form.control} name="phone" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Téléphone</FormLabel>
                        <FormControl><Input placeholder="+33 6 12 34 56 78" {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                    )} />
                </div>
                <FormField control={form.control} name="location" render={({ field }) => (
                <FormItem>
                    <FormLabel>Localisation</FormLabel>
                    <FormControl><Input placeholder="Paris, France" {...field} /></FormControl>
                    <FormMessage />
                </FormItem>
                )} />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <FormField control={form.control} name="github" render={({ field }) => (
                    <FormItem>
                        <FormLabel>GitHub</FormLabel>
                        <FormControl><Input placeholder="https://github.com/..." {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                    )} />
                    <FormField control={form.control} name="linkedin" render={({ field }) => (
                    <FormItem>
                        <FormLabel>LinkedIn</FormLabel>
                        <FormControl><Input placeholder="https://linkedin.com/in/..." {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                    )} />
                    <FormField control={form.control} name="website" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Site Web</FormLabel>
                        <FormControl><Input placeholder="https://mon-site.dev" {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                    )} />
                </div>
            </CardContent>
            <CardFooter className="border-t px-6 py-4">
                <Button type="submit" disabled={isLoading}>
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Sauvegarder les changements
                </Button>
            </CardFooter>
       </form>
    </Form>
  );
}
