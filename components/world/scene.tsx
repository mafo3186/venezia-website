"use client";

import { ProjectsQueryResult } from "@/sanity.types";
import { Canvas, MeshProps, useFrame } from "@react-three/fiber"
import { useRouter } from "next/navigation";
import { Suspense, useEffect, useRef, useState } from "react";
import { DepthOfField, EffectComposer, N8AO, SSAO, ToneMapping, Vignette } from "@react-three/postprocessing";
import { BlendFunction } from 'postprocessing';
import { BakeShadows, ContactShadows, Environment, OrbitControls, PerformanceMonitor, useProgress } from "@react-three/drei";
import { PointerLockControls as PointerLockControlsImpl } from "three-stdlib";
import styles from "./world.module.css";
import { Euler, Mesh, MOUSE } from "three";
import { Player } from "./player";
import { Model as EnvironmentModel } from "./model";
import useDynamicRes from "./dynamic-res";
import Stats, { Panel } from "./stats";
import { CascadedShadowMap } from "./csm/cascaded-shadow-map";

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
        color="red"
        transmission={1}
        thickness={0.5}
        roughness={0.2} />
    </mesh>
  )
}

function Scene({ projects, inBackground }: { projects: ProjectsQueryResult, inBackground: boolean }) {
  const [iAmGod, setGod] = useState(false);
  const [debugGraphics, setDebugGraphics] = useState(false);
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
    const listener = (event: KeyboardEvent) => {
      if (event.key === "g") {
        setGod(!iAmGod);
      } else if (event.key === "h") {
        setDebugGraphics(!debugGraphics);
      }
    };
    window.addEventListener("keydown", listener);
    return () => window.removeEventListener("keydown", listener);
  }, [iAmGod, debugGraphics]);
  return (<>
    <color attach="background" args={["#96b0e4"]} />
    <Environment preset="sunset" environmentIntensity={0.8} environmentRotation={new Euler(0, -0.5, 0)} />
    <CascadedShadowMap lightIntensity={0} shadowMapSize={4096} lightDirection={[-0.5, -1.2, -0.5]} lightMargin={10} maxFar={25} />
    <fogExp2 attach="fog" color="#96b0e4" density={iAmGod ? 0 : 0.03} />
    <EffectComposer enableNormalPass frameBufferType={1016} enabled={!iAmGod}>
      <DepthOfField focusDistance={0} focalLength={inBackground ? 0.01 : 0.2} bokehScale={8} />
      <N8AO aoRadius={2} intensity={5} distanceFalloff={.4} />
      <Vignette technique={0} offset={0.1} darkness={0.75} />

    </EffectComposer>

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
  </>);
}

export function SceneCanvas({ projects, inBackground }: { projects: ProjectsQueryResult, inBackground: boolean }) {
  const dpr = useDynamicRes();
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
      <Suspense fallback={null}>
        <Scene projects={projects} inBackground={inBackground} />
      </Suspense>
      <Stats>
        <Panel title="cDPR" value={dpr * 100} maxValue={120} />
      </Stats>
    </Canvas>
    <div className={active ? styles.loaderPlaceholderActive : styles.loaderPlaceholder} />
    <div className={active ? styles.loaderActive : styles.loader}>
      <div className={styles.progress} style={{ opacity: 1 - (progress / 100) ** 2 }}>
        <div className={styles.bar} style={{ scale: progress / 100 }} />
      </div>
    </div>
  </>);
}
