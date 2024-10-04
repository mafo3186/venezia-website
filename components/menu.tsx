'use client';
import {useEffect, useState} from 'react';
import Link from 'next/link';
import styles from './menu.module.css';
import { ProjectsQueryResult } from '@/sanity.types';
import IconKompass from "@/components/iconKompass";
import { Vector3, Quaternion } from 'three';
import { PreDefinedView } from './types';

const hotspots: {
  name: string;
  location: PreDefinedView;
}[] = [
  {
    name: "Beispiel 1",
    location: {
      position: new Vector3(-9.109529454242123, 2.2, 5.858578021419353),
      rotation: new Quaternion(0.006220933713422264, 0.9334824322569065, 0.016211870364617766, -0.35820249009567745),
    },
  },
  {
    name: "Beispiel 2",
    location: {
      position: new Vector3(1.065526115270215, 1.1711130832595043, -0.7411182563298189),
      rotation: new Quaternion(-0.015218747421268157, 0.8901484421997149, 0.029810209439842337, 0.45443975617181787),
    },
  },
];

interface MenuProps {
    projects: ProjectsQueryResult;
    onHotspotClick?: (hotspot: PreDefinedView) => void;
}

const Menu = ({ projects, onHotspotClick }: MenuProps) => {
    const [menuOpen, setMenuOpen] = useState(false);
    const [showAllAsVisited, setShowAllAsVisited] = useState(false);
    const [visitedProjects, setVisitedProjects] = useState<string[]>([]);

    useEffect(() => {
      const storedVisitedProjects = JSON.parse(localStorage.getItem('visitedProjects') || '[]');
      setVisitedProjects(storedVisitedProjects);
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

    const generateAnagram = (title: string) => {
      return title.split('').sort(() => Math.random() - 0.5).join('');
    };

    return (
        <header className={styles.header}>
            <div
              className={`${styles.menu} ${menuOpen ? styles.active : ''}`} 
              onClick={toggleMenu}
            >
              <IconKompass height={'80%'} width={'80%'}/>
            </div>

            {/* Dropdown-Menü */}
            {menuOpen && (
              <nav className={styles.navMenu}>
                <ul>
                  <li>
                    <Link href="/" onClick={closeMenu}>
                      Fremde entdecken
                    </Link>
                  </li>
                  {projects.map((project) => {
                    const visited = isVisited(project.slug);
                    const shouldShowAsVisited = showAllAsVisited || visited;
                    return (
                      <li key={project._id}>
                        <Link
                          href={`/projects/${project.slug}`}
                          onClick={closeMenu}
                          className={shouldShowAsVisited ? styles.visited : styles.unvisited}
                        >
                          {shouldShowAsVisited ? project.title : generateAnagram(project.title)}
                        </Link>
                      </li>
                    )
                  })}
                  {hotspots.map((hotspot) => (
                    <li key={hotspot.name} onClick={() => onHotspotClick?.(hotspot.location)}>
                      {hotspot.name}
                    </li>
                  ))}
                </ul>
                {/* Buttons für besuchte/unbesuchte Projekte */}
                <button onClick={toggleShowAllAsVisited} className={styles.buttonToggleVisited}>
                  {showAllAsVisited ? 'Als unbesucht anzeigen' : 'Alle als besucht anzeigen'}
                </button>
                <button onClick={clearVisitedProjects} className={styles.buttonClearVisited}>
                  Alle Besuche zurücksetzen
                </button>
                <div className={styles.staticLinks}>
                  <ul>
                    <li>
                      <Link href={"/fremde"} onClick={closeMenu}>
                        Fremde überall
                      </Link>
                    </li>
                    <li>
                      <Link href={"/impressum"} onClick={closeMenu}>
                        Impressum
                      </Link>
                    </li>
                    <li>
                      <Link href={"/datenschutz"} onClick={closeMenu}>
                        Datenschutz
                      </Link>
                    </li>
                  </ul>
                </div>
                
              </nav>
            )}
        </header>
    );
};

export default Menu;
