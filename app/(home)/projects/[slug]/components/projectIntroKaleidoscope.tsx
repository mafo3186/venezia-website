"use client";

import { useState } from 'react';
import Kaleidoscope from './kaleidoscope';
import styles from './projectIntroKaleidoscope.module.css';
import { ProjectBySlugQueryResult } from '@/sanity.types';
import { notFound } from 'next/navigation';
import ProjectDetailPage from './projectDetails';

type ProjectIntroKaleidoscopeProps = {
    project: ProjectBySlugQueryResult;
};


export default function ProjectIntroKaleidoscope({ project }: ProjectIntroKaleidoscopeProps) {
    const [showDetails, setShowDetails] = useState(false);

    if (!project?._id) {
        return notFound();
    }

    //add switch case for different projects
    const projectSlug = project.slug;
    let shapes = ['circle', 'square', 'triangle'];
    let colors = ['#f133ff', '#a792f8', '#3357FF'];
    let quantity = 14;
    let speed = 0.7;
    let edge = 10;
    let minSize = 20;
    let maxSize = 60;
    switch (projectSlug) {
        case "nacktschnecken":
            shapes = ['moon', 'pentagon', 'butterfly'];
            colors = ['darkgreen', 'lightgreen', 'brown'];
            quantity = 20;
            speed = 0.3;
            edge = 8;
            minSize = 30;
            maxSize = 120;
            break;
        case "mareikes-spielwiese":
            shapes = ['circle', 'square', 'triangle'];
            colors = ['#f133ff', '#a792f8', '#3357FF'];
            quantity = 30;
            speed = 0.7;
            edge = 10;
            minSize = 20;
            maxSize = 80;
            break;
        case "der-stoer-eine-oral-history":
            shapes = ['drop', 'amoeba', 'pentagon'];
            colors = ['blue', 'lightblue', 'darkblue'];
            quantity = 70;
            speed = 0.5;
            edge = 10;
            minSize = 10;
            maxSize = 100;
            break;
        case "demoprojekt":
            shapes = ['heart', 'star', 'moon'];
            colors = ['red', 'yellow', 'lightgray'];
            quantity = 50;
            speed = 0.7;
            edge = 16;
            minSize = 20;
            maxSize = 60;
            break;
        default: break;
    }

    return (
        <>
            {showDetails && (
                <ProjectDetailPage project={project} />
            )}
            <div className={styles.container}>

                <div style={{ height: '100vh', width: '100vw', overflow: 'hidden' }}>
                    <Kaleidoscope
                        edge={edge}
                        shapes={shapes}
                        minSize={minSize}
                        maxSize={maxSize}
                        colors={colors}
                        quantity={quantity}
                        speed={speed}
                    />
                </div>
                {!showDetails && (
                    <div className={styles.menu}>
                        <button className={styles.menuButton} onClick={() => setShowDetails(!showDetails)}>
                            {project?.title}
                        </button>
                    </div>
                )}

            </div>
        </>
    );

}