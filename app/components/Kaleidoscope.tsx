'use client';

import { useEffect, useRef } from "react";
import * as THREE from "three";
import styles from './kaleidoscopeCanvas.module.css';

export default function Kaleidoscope() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        if (!canvasRef.current) return;

        // Erstelle eine Szene
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

        const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current });
        renderer.setSize(window.innerWidth, window.innerHeight);

        // Kaleidoskop-Material

        const material = new THREE.MeshBasicMaterial({ color: 0x00e5e5, side: THREE.DoubleSide });

        // Erstelle mehrere Flächen für das Kaleidoskop
        const numPlanes = 6;
        const angleStep = (2 * Math.PI) / numPlanes;
        for (let i = 0; i < numPlanes; i++) {
            const geometry = new THREE.PlaneGeometry(5, 5, 32);
            const plane = new THREE.Mesh(geometry, material);
            plane.rotation.z = i * angleStep;
            plane.position.x = Math.cos(i * angleStep) * 5;
            plane.position.y = Math.sin(i * angleStep) * 5;
            scene.add(plane);
        }

        camera.position.z = 10;

        const animate = () => {
            requestAnimationFrame(animate);

            // Animation der Flächen
            scene.children.forEach((child) => {
                if (child instanceof THREE.Mesh) {
                    child.rotation.x += 0.01;
                    child.rotation.y += 0.01;
                }
            });

            renderer.render(scene, camera);
        };

        animate();

        return () => {
            renderer.dispose();
        };
    }, []);

    return <canvas ref={canvasRef} className={styles.kaleidoscopeCanvas} />;
};