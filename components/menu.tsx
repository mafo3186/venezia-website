'use client';
import { useState } from 'react';
import Link from 'next/link';
import styles from './menu.module.css';
import { ProjectsQueryResult } from '@/sanity.types';
import Kompass from "@/components/kompass";

interface MenuProps {
    projects: ProjectsQueryResult;
}

const Menu = ({ projects }: MenuProps) => {
    const [menuOpen, setMenuOpen] = useState(false);

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    const closeMenu = () => {
        setMenuOpen(false);
    };

    return (
        <header className={styles.header}>
            <div
              className={`${styles.menu} ${menuOpen ? styles.active : ''}`} 
              onClick={toggleMenu}
            >
              <Kompass height={'80%'} width={'80%'}/>
            </div>

            {/* Dropdown-Menü */}
            {menuOpen && (
              <nav className={styles.navMenu}>
                <ul>
                  <li>
                    <Link href="/" onClick={closeMenu}>
                      Home
                    </Link>
                  </li>
                  {projects.map((project) => (
                    <li key={project._id}>
                      <Link href={`/projects/${project.slug}`} onClick={closeMenu}>
                        {project.title}
                      </Link>
                    </li>
                  ))}
                </ul>

                <div className={styles.staticLinks}>
                  <ul>
                    <li>
                      <Link href={"/fremde"} onClick={closeMenu}>
                        Fremde überall
                      </Link>
                    </li>
                    <li>
                      <Link href={"/studio"} onClick={closeMenu}>
                        Neues Projekt anlegen
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
