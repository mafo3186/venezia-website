'use client';
import { useCallback, useState } from "react";
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import styles from './menu.module.css';
import IconKompass from "@/components/navigation/iconKompass";
import { CiGlobe, CiRedo, CiViewList } from "react-icons/ci";
import { PiEye, PiEyeClosed } from "react-icons/pi";
import {HotspotsWithProjects, PreDefinedView} from "@/components/types";
import { useHotspot, useVisited } from '@/components/contexts';
import { generateAnagram } from "./anagram";

interface MenuProps {
  projects: HotspotsWithProjects;
}

const getFullPath = (pathname: string, subpath: string | null) => {
  if (pathname.includes("/projectlist")) {
    return `/projectlist/${subpath}`;
  }
  return `/${subpath}`;
};

const Menu = ({ projects }: MenuProps) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { showView } = useHotspot();
  const pathname = usePathname();
  const router = useRouter();
  const [showAllAsVisited, setShowAllAsVisited] = useState(false);
  const [visitedProjects, setVisitedProjects] = useVisited();
  const listView = pathname.includes('/projectlist');

  const toggleMenu = useCallback(() => {
    setMenuOpen(!menuOpen);
  }, [menuOpen]);

  const closeMenu = useCallback(() => {
    setMenuOpen(false);
  }, []);

  const isVisited = useCallback((slug: string | null) => {
    if (!slug) return false;
    return visitedProjects.includes(slug);
  }, [visitedProjects]);

  const toggleShowAllAsVisited = useCallback(() => {
    setShowAllAsVisited(!showAllAsVisited);
  }, [showAllAsVisited]);

  const clearVisitedProjects = useCallback(() => {
    setVisitedProjects([]);
    localStorage.removeItem('visitedProjects');
    setShowAllAsVisited(false);
  }, [setVisitedProjects]);

  const handleNavigationAndView = useCallback((
    event: React.MouseEvent,
    hotspotLocation: PreDefinedView,
    projectSlug: string | null = null
  ) => {
    event.preventDefault();
    closeMenu();
    if (projectSlug) {
      router.push(getFullPath(pathname, projectSlug));
    } else {
      router.push("/");
    }
    showView(hotspotLocation);
  }, [closeMenu, pathname, router, showView]);

  const handleProjectClick = useCallback((event: React.MouseEvent, projectSlug: string | null, hotspotLocation: PreDefinedView) => {
    closeMenu();
    if (listView) {
      router.push(getFullPath(pathname, projectSlug));
    } else {
      handleNavigationAndView(event, hotspotLocation, projectSlug);
    }
  }, [closeMenu, handleNavigationAndView, listView, pathname, router]);

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
                    onClick={(event) => handleNavigationAndView(event, hotspot.hotspot.location)}
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
                            onClick={(event) => handleProjectClick(event, project.slug, hotspot.hotspot.location)}
                            className={!shouldShowAsVisited ? styles.unvisited : ''}
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
