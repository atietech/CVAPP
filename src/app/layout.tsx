
import type {Metadata} from 'next';
import { Toaster } from "@/components/ui/toaster"
import { ThemeProvider } from "@/components/theme-provider";
import './globals.css';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { themes } from '@/lib/themes';

export const metadata: Metadata = {
  title: 'CVMaster',
  description: 'Your professional online CV, built with Next.js and Firebase.',
};

async function getTheme() {
    try {
        const themeRef = doc(db, 'cv-data', 'theme');
        const themeSnap = await getDoc(themeRef);
        if (themeSnap.exists()) {
            return themeSnap.data();
        }
    } catch (e) {
        // This can happen during build or if firestore is not available.
        // We'll fallback to the default theme.
        console.log('Could not fetch theme, falling back to default.');
    }
    return themes.find(t => t.name === 'default');
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const theme = await getTheme();
  
  const themeStyle = theme ? `
    :root {
        --background: ${theme.light.background};
        --foreground: ${theme.light.foreground};
        --card: ${theme.light.card};
        --primary: ${theme.light.primary};
        --primary-foreground: 210 40% 98%;
        --secondary: ${theme.light.secondary};
        --secondary-foreground: ${theme.light.foreground};
        --accent: ${theme.light.accent};
        --accent-foreground: 210 40% 98%;
        --border: ${theme.light.secondary};
        --input: ${theme.light.secondary};
        --ring: ${theme.light.primary};
    }
    .dark {
        --background: ${theme.dark.background};
        --foreground: ${theme.dark.foreground};
        --card: ${theme.dark.card};
        --primary: ${theme.dark.primary};
        --primary-foreground: 210 40% 98%;
        --secondary: ${theme.dark.secondary};
        --secondary-foreground: ${theme.dark.foreground};
        --accent: ${theme.dark.accent};
        --accent-foreground: 210 40% 98%;
        --border: ${theme.dark.secondary};
        --input: ${theme.dark.secondary};
        --ring: ${theme.dark.primary};
    }
  ` : '';

  return (
    <html lang="en" className="!scroll-smooth" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap" rel="stylesheet" />
        <style dangerouslySetInnerHTML={{ __html: themeStyle }} />
      </head>
      <body className="font-body antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
