
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AuthProvider } from "@/context/auth-context";
import AuthGuard from "@/components/auth/auth-guard";
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/auth-context';
import { auth } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import { 
  Home, 
  User, 
  Briefcase, 
  GraduationCap, 
  Star, 
  Code,
  LogOut,
  Menu,
  Settings,
  Mail,
  Eye
} from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ThemeSwitcher } from '@/components/theme-switcher';

const navItems = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: Home },
  { href: '/admin/dashboard/profile', label: 'Profil', icon: User },
  { href: '/admin/dashboard/experience', label: 'Expérience', icon: Briefcase },
  { href: '/admin/dashboard/education', label: 'Formation', icon: GraduationCap },
  { href: '/admin/dashboard/skills', label: 'Compétences', icon: Star },
  { href: '/admin/dashboard/projects', label: 'Projets', icon: Code },
  { href: '/admin/dashboard/contacts', label: 'Contacts', icon: Mail },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <AuthGuard>
        <AdminDashboardLayout>{children}</AdminDashboardLayout>
      </AuthGuard>
    </AuthProvider>
  );
}


function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = async () => {
    await auth.signOut();
    router.push('/admin/login');
  };

  const SidebarNav = ({ className }: { className?: string }) => (
    <nav className={`flex flex-col h-full ${className}`}>
      <div className="flex h-16 items-center justify-between border-b px-4 lg:h-[60px] lg:px-6">
        <Link href="/admin/dashboard" className="flex items-center gap-2 font-semibold">
          <Settings className="h-6 w-6" />
          <span className="">Admin CVMaster</span>
        </Link>
         <Tooltip>
            <TooltipTrigger asChild>
                <Button asChild variant="outline" size="icon" className='h-8 w-8'>
                    <Link href="/" target="_blank">
                        <Eye className="h-4 w-4" />
                    </Link>
                </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom"><p>Voir le site</p></TooltipContent>
        </Tooltip>
      </div>
      <div className="flex-1 overflow-y-auto">
        <nav className="grid items-start px-2 text-sm font-medium lg:px-4 gap-2 mt-4">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary ${
                pathname === item.href ? 'bg-muted text-primary' : 'text-muted-foreground'
              }`}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
      <div className="mt-auto p-4 border-t">
          {user && (
            <div className="flex items-center gap-3 text-sm text-muted-foreground mb-4">
                <div className='flex items-center gap-2 flex-grow min-w-0'>
                    <img src={user.photoURL || `https://avatar.vercel.sh/${user.email}.png`} alt="avatar" className="w-8 h-8 rounded-full" />
                    <span className="truncate flex-shrink min-w-0">{user.email}</span>
                </div>
                <ThemeSwitcher />
            </div>
          )}
          <Button variant="outline" className="w-full justify-start" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Déconnexion
          </Button>
      </div>
    </nav>
  );

  return (
     <TooltipProvider>
      <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
        <div className="hidden border-r bg-muted/40 md:block">
          <SidebarNav />
        </div>
        <div className="flex flex-col">
          <header className="flex h-14 items-center justify-between gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6 md:hidden">
             <Sheet>
                <SheetTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className="shrink-0"
                  >
                    <Menu className="h-5 w-5" />
                    <span className="sr-only">Toggle navigation menu</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="flex flex-col p-0">
                  <SidebarNav />
                </SheetContent>
              </Sheet>
            <h1 className="text-lg font-semibold">Admin CVMaster</h1>
             <Button asChild variant="outline" size="icon" className='h-8 w-8'>
                <Link href="/" target="_blank">
                    <Eye className="h-4 w-4" />
                </Link>
            </Button>
          </header>
          <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 bg-background">
            {children}
          </main>
        </div>
      </div>
     </TooltipProvider>
  );
}
