"use client";

import { ProjectsQueryResult } from "@/sanity.types";
import { Canvas, MeshProps, useFrame } from "@react-three/fiber"
import { useRouter } from "next/navigation";
import { Suspense, useEffect, useRef, useState } from "react";
import { DepthOfField, EffectComposer, Vignette } from "@react-three/postprocessing";
import { BakeShadows, Environment, OrbitControls, PerformanceMonitor, Stats, useProgress } from "@react-three/drei";
import { PointerLockControls as PointerLockControlsImpl } from "three-stdlib";
import styles from "./world.module.css";
import { Mesh, MOUSE } from "three";
import { Player } from "./player";
import { Model as EnvironmentModel } from "./model";

const MIN_DPR = 0.25;

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
    <OrbitControls
      enabled={!iAmGod}
      target={[-1000, 2.5, 0]}
      enableZoom={false}
      enablePan={true}
      enableRotate={false}
      panSpeed={1.5}
      keyPanSpeed={0}
      dampingFactor={0.1}
      mouseButtons={{
        RIGHT: undefined,
        LEFT: MOUSE.PAN,
        MIDDLE: undefined,
      }}
    />
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

    <EnvironmentModel />

    <Player position={[0, 3, 0]} debug={iAmGod} />
    {projects.map((project, index) => (
      <ProjectBox
        key={project._id}
        href={`/projects/${project.slug}`}
        position={[
          Math.cos((index / projects.length + 0.125) * 2 * Math.PI) * 0.75, 2,
          Math.sin((index / projects.length + 0.125) * 2 * Math.PI) * 0.75
        ]}
      />
    ))}
    <EffectComposer enabled={!iAmGod}>
      <DepthOfField focusDistance={0} focalLength={0.01} bokehScale={2} />
      <Vignette eskil={false} offset={0.1} darkness={0.75} />
    </EffectComposer>
    {/* keeping shadows static in hope for better performance */}
    <BakeShadows />
    <Stats />
  </>);
}

export function SceneCanvas({ projects, inBackground }: { projects: ProjectsQueryResult, inBackground: boolean }) {
  const [dpr, setDpr] = useState<number | undefined>(undefined);
  const { active, progress } = useProgress();
  return (<>
    <Canvas
      id="canvas-instance"
      style={{ width: "100%", height: "100vh" }}
      shadows="soft"
      className={styles.scene}
      dpr={dpr}
      frameloop={inBackground ? "demand" : "always"}
    >
      <PerformanceMonitor
        onIncline={() => setDpr(Math.min(window.devicePixelRatio, (dpr ?? window.devicePixelRatio) * 2))}
        onDecline={() => setDpr(Math.max(MIN_DPR, (dpr ?? window.devicePixelRatio) * 0.5))}
      />
      <Suspense fallback={null}>
        <Scene projects={projects} inBackground={inBackground} />
      </Suspense>
    </Canvas>
    <div className={active ? styles.loaderPlaceholderActive : styles.loaderPlaceholder} />
    <div className={active ? styles.loaderActive : styles.loader}>
      <div className={styles.progress} style={{ opacity: 1 - (progress / 100) ** 2 }}>
        <div className={styles.bar} style={{ scale: progress / 100 }} />
      </div>
    </div>
  </>);
}
