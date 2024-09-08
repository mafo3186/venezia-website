'use client';

import { useEffect, useRef } from "react";
import * as THREE from "three";
import styles from './KaleidoscopeCanvas.module.css';

const numberOfProjects = 6; // Anzahl der Symmetrie-Achsen
const elementsPerAxis = 6; // Anzahl der Elemente pro Symmetrie-Achse
const radius = 5; // Radius des Kaleidoskops

export default function Kaleidoscope() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        if (!canvasRef.current) return;

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current });
        renderer.setSize(window.innerWidth, window.innerHeight);

        const loader = new THREE.TextureLoader();

        // Setzt den Hintergrund auf weiß
        renderer.setClearColor(0xffffff);

        // Funktion zum Erstellen eines Projekts
        const createProject = (index: number, axis: number) => {
            const geometry = new THREE.PlaneGeometry(1, 1);
            const texture = loader.load(`/images/project${index}.jpg`); // Bildpfad anpassen
            const material = new THREE.MeshBasicMaterial({
                map: texture,
                side: THREE.DoubleSide
            });
            const plane = new THREE.Mesh(geometry, material);

            // Positioniere das Projekt entlang einer Symmetrie-Achse
            const angle = (axis / numberOfProjects) * 2 * Math.PI;
            plane.position.set(radius * Math.cos(angle), radius * Math.sin(angle), 0);

            // Spiegeln über die Symmetrie-Achsen
            const mirrorCount = numberOfProjects;
            for (let i = 0; i < mirrorCount; i++) {
                const mirrorPlane = plane.clone();
                mirrorPlane.rotation.z = angle + (i / mirrorCount) * 2 * Math.PI;
                scene.add(mirrorPlane);
            }
        };

        // Erstelle und füge alle Projekte zur Szene hinzu
        for (let axis = 0; axis < numberOfProjects; axis++) {
            for (let i = 0; i < elementsPerAxis; i++) {
                createProject(i, axis);
            }
        }

        camera.position.z = 10;

        const animate = () => {
            requestAnimationFrame(animate);
            scene.rotation.z += 0.01; // Rotationsgeschwindigkeit
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
