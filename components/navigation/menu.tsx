'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './menu.module.css';
import IconKompass from "@/components/navigation/iconKompass";
import { CiGlobe, CiRedo, CiViewList } from "react-icons/ci";
import { PiEye, PiEyeClosed } from "react-icons/pi";
import { HotspotsWithProjects } from "@/components/types";
import { useHotspot } from '@/components/contexts';

interface MenuProps {
  projects: HotspotsWithProjects;
}

const Menu = ({ projects }: MenuProps) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { setHotspot } = useHotspot();
  const pathname = usePathname();
  const [showAllAsVisited, setShowAllAsVisited] = useState(false);
  const [visitedProjects, setVisitedProjects] = useState<string[]>([]);

  useEffect(() => {
    const storedVisitedProjects = JSON.parse(localStorage.getItem('visitedProjects') || '[]');
    setVisitedProjects(storedVisitedProjects);

    // Listener for the visitedProjectsUpdated event, registration and cleanup on unmount
    const handleVisitedProjectsUpdate = () => {
      const updatedVisitedProjects = JSON.parse(localStorage.getItem('visitedProjects') || '[]');
      setVisitedProjects(updatedVisitedProjects);
    };
    window.addEventListener('visitedProjectsUpdated', handleVisitedProjectsUpdate);
    return () => {
      window.removeEventListener('visitedProjectsUpdated', handleVisitedProjectsUpdate);
    };
  }, []);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  const isVisited = (slug: string | null) => {
    if (!slug) return false;
    return visitedProjects.includes(slug);
  };

  const toggleShowAllAsVisited = () => {
    setShowAllAsVisited(!showAllAsVisited);
  };

  const clearVisitedProjects = () => {
    setVisitedProjects([]);
    localStorage.removeItem('visitedProjects');
  };

  const generateAnagram = (string: string) => {
    return string.split('').sort(() => Math.random() - 0.5).join('');
  };

  const getFullPath = (pathname: string, subpath: string | null) => {
    if (pathname.includes('/projectlist')) {
      return `/projectlist/${subpath}`;
    }
    return `/${subpath}`;
  };

  return (
    <header className={styles.header}>
      <div
        className={`${styles.menu} ${menuOpen ? styles.active : ''}`}
        onClick={toggleMenu}
      >
        <IconKompass height={'80%'} width={'80%'} />
      </div>

      {/* Dropdown-Menü */}
      {menuOpen && (
        <nav className={styles.navMenu}>
          {/* Abschnitt für die Ansichten-Links */}
          <div className={styles.viewsSection}>
            <Link href="/" onClick={closeMenu} aria-label="Fremde überall - 3D-Welt" title="Fremde überall - 3D-Welt">
              <CiGlobe/> Welt
            </Link>
            <Link href="/projectlist" onClick={closeMenu} aria-label="Listenansicht" title="Listenansicht">
              <CiViewList /> Liste
            </Link>
          </div>
          {/* Statische Seiten */}
          <div className={styles.staticLinks}>
            <Link href={getFullPath(pathname, "fremde")}onClick={closeMenu}>
              Fremde überall – Fremde entdecken
            </Link>
          </div>
          {/* Abschnitt für die Projekte */}
          <div className={styles.projects}>
            <ul>
              {projects.map((hotspot) => (
                <li key={hotspot.hotspotId} className={styles.hotSpot}>
                  <a
                    onClick={() => {
                      closeMenu();
                      setHotspot(hotspot.hotspot.location);
                    }}
                  >
                    {hotspot.hotspot.title}
                  </a>
                  <ul>
                    {hotspot.projects.map(({ project }) => {
                      const visited = isVisited(project.slug);
                      const shouldShowAsVisited = showAllAsVisited || visited;
                      return (
                        <li key={project._id}>
                          <Link
                            href={getFullPath(pathname, project.slug)}
                            onClick={closeMenu}
                            className={
                              shouldShowAsVisited
                                ? styles.visited
                                : styles.unvisited
                            }
                          >
                            {shouldShowAsVisited
                              ? project.title
                              : generateAnagram(project.title)}
                            {project.author && (
                              <>
                                {" – "}
                                {shouldShowAsVisited
                                  ? project.author
                                  : generateAnagram(project.author)}
                              </>
                            )}
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </li>
              ))}
            </ul>
            {/* Buttons für besuchte/unbesuchte Projekte */}
            <div className={styles.buttonContainer}>
              {/* Button für "Alle anzeigen" */}
              <button
                onClick={toggleShowAllAsVisited}
                aria-label={showAllAsVisited ? 'Fremde überall - Unbekannte Projekte selbst entdecken' : 'Entdeckung - Alle Projekte enthüllen'}
                title={showAllAsVisited ? 'Fremde überall - Unbekannte Projekte selbst entdecken' : 'Entdeckung - Alle Projekte enthüllen'}
                className={styles.iconButton}
              >
                {showAllAsVisited ? <PiEye /> : <PiEyeClosed />}
              </button>
              {/* Button für "Alle zurücksetzen" */}
              <button
                onClick={clearVisitedProjects}
                aria-label='Alle Projekte neu entdecken'
                title='Alle Projekte neu entdecken'
                className={styles.iconButton}
              >
                <CiRedo />
              </button>
            </div>
          </div>
          {/* Abschnitt für Datenschutz und Impressum */}
          <div className={styles.legals}>
            <Link href={getFullPath(pathname, "impressum")} onClick={closeMenu}>
              Impressum
            </Link>
            <div className={styles.separator} />
            <Link href={getFullPath(pathname, "datenschutz")} onClick={closeMenu}>
              Datenschutz
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
};

export default Menu;
