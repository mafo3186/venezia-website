'use client';

import { useEffect, useRef } from "react";
import * as THREE from "three";
import styles from './KaleidoscopeCanvas.module.css';

//const image = require('@/app/public/images/project0.jpg');
const numberOfProjects = 10; // Anzahl der Projekte
const radius = 5; // Radius des Kaleidoskops

export default function Kaleidoscope() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        if (!canvasRef.current) return;

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current });
        renderer.setSize(window.innerWidth, window.innerHeight);

        // Setzt den Hintergrund auf weiß
        renderer.setClearColor(0xffffff);

        const loader = new THREE.TextureLoader();

        const createProject = (index: number) => {
            const geometry = new THREE.PlaneGeometry(1, 1);
            const texture = loader.load(`/images/project${index}.jpg`); // Bildpfad anpassen
            //const texture = loader.load(image);

            /*
            const texture = loader.load(
                '/images/project0.jpg',
                (tex) => { console.log("Texture loaded:", tex); },  // onLoad
                undefined,                                          // onProgress
                (err) => { console.error("Error loading texture:", err); } // onError
            );
            */


            const material = new THREE.MeshBasicMaterial({
                map: texture,
                side: THREE.DoubleSide
            });
            const plane = new THREE.Mesh(geometry, material);

            const angle = (index / numberOfProjects) * 2 * Math.PI;
            plane.position.set(radius * Math.cos(angle), radius * Math.sin(angle), 0);
            plane.rotation.z = angle;

            scene.add(plane);
            return plane;
        };

        const projects = [];
        for (let i = 0; i < numberOfProjects; i++) {
            const project = createProject(i);
            projects.push(project);
        }

        camera.position.z = 10;

        const animate = () => {
            requestAnimationFrame(animate);
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
