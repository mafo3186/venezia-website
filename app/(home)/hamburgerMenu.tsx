'use client';
import { useState } from 'react';
import Link from 'next/link';
import styles from './hamburgerMenu.module.css'; // Neues CSS für das Menü
import { ProjectsQueryResult } from '@/sanity.types';

interface HamburgerMenuProps {
    projects: ProjectsQueryResult;
}

const HamburgerMenu = ({ projects }: HamburgerMenuProps) => {
    const [menuOpen, setMenuOpen] = useState(false);

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);  // Menü öffnen/schließen
    };

    return (
        <header className={styles.header}>
            <div className={styles.hamburger} onClick={toggleMenu}>
                {/* Hamburger Icon */}
                <div className={styles.hamburgerIcon}></div>
            </div>

            {/* Dropdown-Menü */}
            {menuOpen && (
                <nav className={styles.navMenu}>
                    <ul>
                        {/* Home-Link */}
                        <li>
                            <Link href="/">
                                Home
                            </Link>
                        </li>
                        {/* Links zu Projekten */}
                        {projects.map((project) => (
                            <li key={project._id}>
                                <Link href={`/projects/${project.slug}`}>
                                    {project.title}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </nav>
            )}
        </header>
    );
};

export default HamburgerMenu;
