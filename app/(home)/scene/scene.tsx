"use client";

import { ProjectsQueryResult } from '@/sanity.types';
import { Canvas } from '@react-three/fiber';
import { EffectComposer, DepthOfField, Vignette } from '@react-three/postprocessing';
import { AdaptiveDpr, Environment, FirstPersonControls } from '@react-three/drei';
import { useEffect, useRef } from 'react';
import { FirstPersonControls as FirstPersonControlImpl } from 'three-stdlib';
import ProjectBox from './projectBox';
import Globals from './globals';
import Model from './model';
import styles from './Scene.module.css';

export default function Scene({ projects, inBackground }: { projects: ProjectsQueryResult, inBackground: boolean }) {
  const controls = useRef<FirstPersonControlImpl | null>(null);
  useEffect(() => {
    if (controls.current) {
      controls.current.activeLook = !inBackground;
    }
  }, [controls, inBackground])
  return (
    <Canvas
      style={{ width: "100%", height: "100vh" }}
      shadows
      className={styles.scene}
    >
      <color attach="background" args={["#96b0e4"]} />
      <Environment preset="sunset" />
      <fogExp2 attach="fog" color="#96b0e4" density={0.18} />
      <FirstPersonControls ref={controls} lookSpeed={0.1} movementSpeed={0} />
      {/* <Sky sunPosition={[2, 5, 1]} /> */}
      <Globals />
      <Model />
      <ambientLight intensity={0.1} />
      <directionalLight
        intensity={0.9}
        castShadow
        position={[2, 5, 1]}
        shadow-mapSize-height={512}
        shadow-mapSize-width={512}
        shadow-bias={-0.0001}
      />
      {projects.map((project, index) => (
        <ProjectBox
          key={project._id}
          href={`/projects/${project.slug}`}
          position={[
            Math.cos((index / projects.length + 0.125) * 2 * Math.PI) * 0.75, 2.6,
            Math.sin((index / projects.length + 0.125) * 2 * Math.PI) * 0.75
          ]}
        />
      ))}
      <EffectComposer>
        <DepthOfField focusDistance={0} focalLength={0.01} bokehScale={4} />
        <Vignette eskil={false} offset={0.1} darkness={0.75} />
      </EffectComposer>
      <AdaptiveDpr pixelated />
    </Canvas>
  );
}
