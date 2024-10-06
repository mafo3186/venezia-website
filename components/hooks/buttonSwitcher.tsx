'use client'; 
import { usePathname } from 'next/navigation';
import { HomeButton3D, HomeButtonList } from '@/components/navigation/button';

export default function HomeButtonSwitcher() {
  const pathname = usePathname();

  // Entscheidung basierend auf dem Pfad
  if (pathname.includes('/projectlist')) {
    return <HomeButtonList />;
  }

  return <HomeButton3D />;
}
