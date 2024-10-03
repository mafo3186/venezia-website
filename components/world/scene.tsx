"use client";

import { ProjectsQueryResult } from "@/sanity.types";
import { Canvas, useThree } from "@react-three/fiber";
import { Suspense, useEffect, useMemo, useState } from "react";
import { DepthOfField, EffectComposer, N8AO, Vignette } from "@react-three/postprocessing";
import { Environment, OrbitControls, useGLTF, useProgress } from "@react-three/drei";
import styles from "./world.module.css";
import { Euler } from "three";
import { Player } from "./player";
import { Model as EnvironmentModel } from "./model";
import Stats, { Panel } from "./stats";
import { CascadedShadowMap } from "./csm/cascaded-shadow-map";
import { PreDefinedView } from "@/components/types";
import { ProjectBox } from "./project-box";
import { Water } from "./water";
import { useHotspot } from "@/components/contexts";

const metadataPath = "/assets/metadata.glb";

useGLTF.preload(metadataPath);

function Scene({
  projects,
  inBackground,
  view,
  onViewReached,
}: {
  projects: ProjectsQueryResult,
  inBackground: boolean,
  view?: PreDefinedView,
  onViewReached?: () => void,
}) {
  const metadata = useGLTF(metadataPath);
  const nodes = useMemo(() => {
    return Object.values(metadata.nodes)
      .filter((node) => node.userData.name?.includes("."))
      .map((node) => {
        const [hotspot, numeric] = node.userData.name.split(".");
        return {
          ...node,
          userData: { ...node.userData, hotspot, index: parseInt(numeric) - 1 },
        };
      })
      .sort((a, b) => {
        if (a.userData.index !== b.userData.index) {
          return a.userData.index - b.userData.index;
        } else {
          return a.userData.hotspot.localeCompare(b.userData.hotspot);
        }
      });
  }, [metadata.nodes]);
  const [iAmGod, setGod] = useState(false);
  const dpr = useThree(({ viewport }) => viewport.dpr);
  const { setHotspot } = useHotspot();

  useEffect(() => {
    window.addEventListener("keydown", (event) => {
      if (event.key === "g") {
        setGod(!iAmGod);
      }
    });
  }, [iAmGod]);

  useEffect(() => {
    if (view) {
      setHotspot(view);
    }
  }, [view, setHotspot]);

  return (<>
    <color attach="background" args={["#96b0e4"]} />
    <Environment preset="sunset" environmentIntensity={0.8} environmentRotation={new Euler(0, -0.5, 0)} />
    <CascadedShadowMap lightIntensity={0} shadowMapSize={4096} lightDirection={[-0.5, -1.2, -0.5]} lightMargin={10} maxFar={25} />
    <fogExp2 attach="fog" color="#96b0e4" density={iAmGod ? 0 : 0.03} />
    <EffectComposer>
      <N8AO aoRadius={2} intensity={5} distanceFalloff={.4} depthAwareUpsampling quality="performance" />
      <DepthOfField
        focusDistance={0}
        focalLength={(inBackground ? 0.01 : 0.2)}
        bokehScale={4 * dpr * dpr}
      />
      <Vignette technique={0} offset={0.1} darkness={0.75} />
    </EffectComposer>
    <OrbitControls enabled={iAmGod} />

    <EnvironmentModel />

    <Player
      debug={iAmGod}
      targetPosition={view?.position}
      targetRotation={view?.rotation}
      onTargetCompleted={onViewReached}
    />
    {nodes.map((node, index) => (
      <ProjectBox
        key={node.name}
        href={projects[index] && `/${projects[index].slug}`}
        position={node.position}
        rotation={node.rotation}
      />
    ))}
    <Water />
  </>);
}

export function SceneCanvas({
  projects,
  inBackground,
  view,
  onViewReached,
}: {
  projects: ProjectsQueryResult,
  inBackground: boolean,
  view?: PreDefinedView,
  onViewReached?: () => void,
}) {
  const dpr = .78;
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
        <Scene
          projects={projects}
          inBackground={inBackground}
          view={view}
          onViewReached={onViewReached}
        />
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