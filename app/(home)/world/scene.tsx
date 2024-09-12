"use client";

import { ProjectsQueryResult } from "@/sanity.types";
import { Canvas, MeshProps, useFrame, useThree } from "@react-three/fiber"
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { DepthOfField, EffectComposer, Vignette } from "@react-three/postprocessing";
import { AdaptiveDpr, BakeShadows, Environment, OrbitControls, PointerLockControls, Stats } from "@react-three/drei";
import { PointerLockControls as PointerLockControlsImpl } from "three-stdlib";
import styles from "../home.module.css";
import { Mesh } from "three";
import { Physics } from "@react-three/cannon";
import { Player } from "./player";
import { Model } from "./environment";

function ProjectBox({ href, ...props }: { href: string } & MeshProps) {
  const router = useRouter()
  const ref = useRef<Mesh | null>(null)
  const [hovered, hover] = useState(false)
  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.rotation.y += delta
      ref.current.rotation.x += 0.5 * delta
      ref.current.rotation.z += 0.25 * delta
    }
  })
  return (
    <mesh
      {...props}
      ref={ref}
      scale={hovered ? 1.5 : 1}
      castShadow
      receiveShadow
      onClick={() => router.push(href)}
      onPointerOver={() => hover(true)}
      onPointerOut={() => hover(false)}>
      <icosahedronGeometry args={[0.1]} />
      <meshPhysicalMaterial
        attach="material"
        color="white"
        transmission={1}
        thickness={0.5}
        roughness={0.2} />
    </mesh>
  )
}

function Globals() {
  useThree(({ performance }) => {
    console.log(performance);
  });
  return <></>;
}

function Scene({ projects, inBackground }: { projects: ProjectsQueryResult, inBackground: boolean }) {
  const [iAmGod, setGod] = useState(false);
  const controls = useRef<PointerLockControlsImpl | null>(null);
  useEffect(() => {
    if (controls.current) {
      if (inBackground && controls.current.isLocked) {
        controls.current.unlock();
      } else if (!inBackground && !controls.current.isLocked) {
        controls.current.lock();
      }
    }
  }, [controls, inBackground])
  useEffect(() => {
    window.addEventListener("keydown", (event) => {
      if (event.key === "g") {
        setGod(!iAmGod);
      }
    });
  }, [iAmGod]);

  return (<>
    <color attach="background" args={["#96b0e4"]} />
    <Environment preset="sunset" />
    <fogExp2 attach="fog" color="#96b0e4" density={iAmGod ? 0 : 0.18} />
    <OrbitControls enabled={iAmGod} />
    <PointerLockControls enabled={!iAmGod} pointerSpeed={2} ref={controls} />
    <Globals />
    <directionalLight
      intensity={0.9}
      castShadow
      position={[2, 20, 1]}
      shadow-mapSize-height={1024}
      shadow-mapSize-width={1024}
      shadow-bias={-0.0001}
      shadow-camera-left={-15}
      shadow-camera-right={15}
      shadow-camera-top={15}
      shadow-camera-bottom={-15}
    />
    <Physics>
      {/* uncomment to following tags to show a debug view for the physics */}
      {/* <Debug color="black" scale={1.001}> */}
      <Model />
      <Player position={[0, 3, 0]} enableCamera={!iAmGod} />
      {/* </Debug> */}
    </Physics>
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
    <EffectComposer enabled={!iAmGod}>
      <DepthOfField focusDistance={0} focalLength={0.01} bokehScale={2} />
      <Vignette eskil={false} offset={0.1} darkness={0.75} />
    </EffectComposer>
    {/* reduce dpr if performance is low */}
    <AdaptiveDpr pixelated />
    {/* keeping shadows static in hope for better performance */}
    <BakeShadows />
    <Stats />
  </>);
}

export function SceneCanvas({ projects, inBackground }: { projects: ProjectsQueryResult, inBackground: boolean }) {
  return (
    <Canvas
      style={{ width: "100%", height: "100vh" }}
      shadows="soft"
      className={styles.scene}
    >
      <Scene projects={projects} inBackground={inBackground} />
    </Canvas>
  );
}
