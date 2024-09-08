// components/Kaleidoscope.tsx
'use client';

import { useEffect, useRef } from "react";
import * as THREE from "three";
import styles from './KaleidoscopeCanvas.module.css';

const numberOfProjects = 10; // Anzahl der Projekte (Elemente im Kaleidoskop)
const radius = 5; // Radius des Kaleidoskops

export default function Kaleidoscope() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        if (!canvasRef.current) return;

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current });
        renderer.setSize(window.innerWidth, window.innerHeight);

        // Funktion zum Erstellen eines Projekts
        const createProject = (index: number) => {
            const geometry = new THREE.PlaneGeometry(1, 1);
            const material = new THREE.MeshBasicMaterial({
                color: Math.random() * 0xffffff, // Zufällige Farbe für jedes Projekt
                side: THREE.DoubleSide
            });
            const plane = new THREE.Mesh(geometry, material);

            // Positioniere jedes Projekt entlang eines Kreises
            const angle = (index / numberOfProjects) * 2 * Math.PI;
            plane.position.set(radius * Math.cos(angle), radius * Math.sin(angle), 0);
            plane.rotation.z = angle;

            scene.add(plane);
            return plane;
        };

        // Erstelle und füge alle Projekte zur Szene hinzu
        const projects = [];
        for (let i = 0; i < numberOfProjects; i++) {
            const project = createProject(i);
            projects.push(project);
        }

        camera.position.z = 10;

        const animate = () => {
            requestAnimationFrame(animate);

            // Drehe die Szene, um den Kaleidoskop-Effekt zu erzeugen
            scene.rotation.z += 0.01;

            renderer.render(scene, camera);
        };
        animate();

        return () => {
            renderer.dispose();
        };
    }, []);

    return (
        <canvas ref={canvasRef} className={styles.kaleidoscopeCanvas} />
    );
}
