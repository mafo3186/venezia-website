// Kaledoscope_v2.tsx: 6 sich drehende Flächen (ohne Kaleidoskop-Effekt)

'use client';

import { useEffect, useRef } from "react";
import * as THREE from "three";
import styles from './kaleidoscopeCanvas.module.css';

export default function KaleidoscopeV1() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        if (!canvasRef.current) return;

        // Erstelle eine Szene
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

        const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current });
        renderer.setSize(window.innerWidth, window.innerHeight);

        const geometry = new THREE.PlaneGeometry(5, 5, 32);
        const material = new THREE.MeshBasicMaterial({ color: 0x00e5e5, side: THREE.DoubleSide });
        const plane = new THREE.Mesh(geometry, material);

        scene.add(plane);
        camera.position.z = 5;

        const animate = () => {
            requestAnimationFrame(animate);
            plane.rotation.x += 0.01;
            plane.rotation.y += 0.01;
            renderer.render(scene, camera);
        };

        animate();

        return () => {
            renderer.dispose();
        };
    }, []);

    return <canvas ref={canvasRef} className={styles.kaleidoscopeCanvas} />;
};
