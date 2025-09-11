'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Mail, Send } from 'lucide-react';
import { db } from '@/lib/firebase';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { useState } from 'react';
import { useLanguage } from '@/context/language-context';
import { motion } from 'framer-motion';

const formSchemaEN = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters long.' }),
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  message: z.string().min(10, { message: 'Message must be at least 10 characters long.' }),
});

const formSchemaFR = z.object({
  name: z.string().min(2, { message: 'Le nom doit contenir au moins 2 caractères.' }),
  email: z.string().email({ message: 'Veuillez saisir une adresse e-mail valide.' }),
  message: z.string().min(10, { message: 'Le message doit contenir au moins 10 caractères.' }),
});

const translations = {
  fr: {
    sectionTitle: 'Me Contacter',
    description: 'Une question ou une proposition ? N\'hésitez pas à utiliser le formulaire ci-dessous pour me laisser un message.',
    nameLabel: 'Nom',
    namePlaceholder: 'Votre nom',
    emailLabel: 'Email',
    emailPlaceholder: 'Votre adresse e-mail',
    messageLabel: 'Message',
    messagePlaceholder: 'Votre message...',
    sendButton: 'Envoyer',
    sendingButton: 'Envoi en cours...',
    successTitle: 'Message envoyé !',
    successDescription: 'Merci de m\'avoir contacté. Je vous répondrai bientôt.',
    errorTitle: 'Erreur',
    errorDescription: 'Une erreur est survenue lors de l\'envoi du message.',
    schema: formSchemaFR,
  },
  en: {
    sectionTitle: 'Contact Me',
    description: 'Have a question or a proposal? Feel free to use the form below to leave me a message.',
    nameLabel: 'Name',
    namePlaceholder: 'Your name',
    emailLabel: 'Email',
    emailPlaceholder: 'Your email address',
    messageLabel: 'Message',
    messagePlaceholder: 'Your message...',
    sendButton: 'Send',
    sendingButton: 'Sending...',
    successTitle: 'Message Sent!',
    successDescription: 'Thank you for contacting me. I will get back to you soon.',
    errorTitle: 'Error',
    errorDescription: 'An error occurred while sending the message.',
    schema: formSchemaEN,
  }
}

const animationVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export function ContactSection() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const { language } = useLanguage();
  
  const t = translations[language];

  const form = useForm<z.infer<typeof t.schema>>({
    resolver: zodResolver(t.schema),
    defaultValues: {
      name: '',
      email: '',
      message: '',
    },
  });

  async function onSubmit(values: z.infer<typeof t.schema>) {
    setIsLoading(true);
    try {
        await addDoc(collection(db, "contacts"), {
            ...values,
            createdAt: serverTimestamp(),
            lang: language,
        });

        toast({
            title: t.successTitle,
            description: t.successDescription,
            variant: 'default',
        });
        form.reset();
    } catch (error) {
        console.error("Error sending message: ", error);
        toast({
            title: t.errorTitle,
            description: t.errorDescription,
            variant: 'destructive',
        });
    } finally {
        setIsLoading(false);
    }
  }

  return (
    <motion.section
      id="contact"
      className="pb-12 md:pb-16"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={animationVariants}
    >
      <h2 className="mb-8 flex items-center gap-3 font-headline text-3xl font-bold text-primary">
        <Mail className="h-8 w-8" />
        {t.sectionTitle}
      </h2>
      <Card className="shadow-lg">
        <CardContent className="p-6 md:p-8">
          <p className="mb-6 text-muted-foreground">
            {t.description}
          </p>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t.nameLabel}</FormLabel>
                      <FormControl>
                        <Input placeholder={t.namePlaceholder} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t.emailLabel}</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder={t.emailPlaceholder} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t.messageLabel}</FormLabel>
                    <FormControl>
                      <Textarea placeholder={t.messagePlaceholder} className="min-h-[150px]" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-end">
                <Button type="submit" className="bg-accent hover:bg-accent/90" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {t.sendingButton}
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      {t.sendButton}
                    </>
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </motion.section>
  );
}
