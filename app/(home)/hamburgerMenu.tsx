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
        setMenuOpen(!menuOpen);
    };

    const closeMenu = () => {
        setMenuOpen(false);
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
                        <li>
                            <Link href="/" onClick={closeMenu}>
                                Home
                            </Link>
                        </li>
                        {projects.map((project) => (
                            <li key={project._id}>
                                <Link href={`/kaleidoscope/${project.slug}`} onClick={closeMenu}>
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
