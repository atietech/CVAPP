
'use client';

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Eye, Users, FileText, Loader2 } from "lucide-react";

type Stats = {
  views: number;
  contacts: number;
  downloads: number;
};

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats>({
    views: 0,
    contacts: 0,
    downloads: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        // Récupérer le nombre de contacts
        const contactsCollection = collection(db, 'contacts');
        const contactsSnapshot = await getDocs(contactsCollection);
        const contactsCount = contactsSnapshot.size;

        // Récupérer les stats de vues et téléchargements depuis un document unique
        const statsRef = doc(db, 'stats', 'cv');
        const statsSnap = await getDoc(statsRef);
        
        let viewsCount = 0;
        let downloadsCount = 0;

        if (statsSnap.exists()) {
          const statsData = statsSnap.data();
          viewsCount = statsData.views || 0;
          downloadsCount = statsData.downloads || 0;
        }
        
        setStats({
          contacts: contactsCount,
          views: viewsCount,
          downloads: downloadsCount,
        });

      } catch (error) {
        console.error("Erreur lors de la récupération des statistiques:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const StatCard = ({ title, value, icon: Icon, loading }: { title: string, value: number, icon: React.ElementType, loading: boolean }) => (
     <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center pt-2">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        ) : (
          <>
            <div className="text-2xl font-bold">
              {value}
            </div>
            <p className="text-xs text-muted-foreground">
              Total depuis le début
            </p>
          </>
        )}
      </CardContent>
    </Card>
  )

  return (
    <div>
        <h1 className="text-3xl font-bold text-primary mb-8">Tableau de bord</h1>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <StatCard 
            title="Vues du CV"
            value={stats.views}
            icon={Eye}
            loading={loading}
          />
          <StatCard 
            title="Leads / Contacts"
            value={stats.contacts}
            icon={Users}
            loading={loading}
          />
           <StatCard 
            title="Téléchargements du CV"
            value={stats.downloads}
            icon={FileText}
            loading={loading}
          />
        </div>
    </div>
  );
}
