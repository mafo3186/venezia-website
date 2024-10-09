"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { DepthOfField, EffectComposer, N8AO, Vignette } from "@react-three/postprocessing";
import { Environment, OrbitControls, useProgress, useTexture } from "@react-three/drei";
import styles from "./world.module.css";
import { Color, Euler, FogExp2, MathUtils, ReinhardToneMapping } from "three";
import { Player } from "./player";
import { Model as EnvironmentModel } from "./model";
import Stats, { Panel } from "./stats";
import { CascadedShadowMap } from "./csm/cascaded-shadow-map";
import { HotspotsWithProjects, PreDefinedView, Spot } from "@/components/types";
import { ProjectBox } from "./project-box";
import { Water } from "./water";
import { useHotspot } from "@/components/contexts";

type BaseProps = {
  projects: HotspotsWithProjects,
  emptySpots: Spot[],
  inBackground: boolean,
  view?: PreDefinedView,
  onViewReached?: () => void,
  foreignness: number,
};

const environments = [
  {
    file: "/assets/industrial_sunset_02_puresky_1k.hdr",
    intensity: 0.7,
    fogFrom: new Color("#748ea9"),
    fogTo: new Color("#375673"),
  },
  // {
  //   file: "/assets/kloppenheim_06_puresky_1k.hdr",
  //   intensity: 0.5,
  //   fogFrom: new Color("#718bae"),
  //   fogTo: new Color("#485a72"),
  // },
  {
    file: "/assets/drackenstein_quarry_puresky_1k.hdr",
    intensity: 0.4,
    fogFrom: new Color("#beb8ae"),
    fogTo: new Color("#7f7b74"),
  },
  // {
  //   file: "/assets/belfast_sunset_puresky_1k.hdr",
  //   intensity: 0.4,
  //   fogFrom: new Color("#c4c7ed"),
  //   fogTo: new Color("#8688a4"),
  // },
  {
    file: "/assets/snow_field_puresky_1k.hdr",
    intensity: 0.6,
    fogFrom: new Color("#a19f98"),
    fogTo: new Color("#85827c"),
  },
  {
    file: "/assets/overcast_soil_puresky_1k.hdr",
    intensity: 0.3,
    fogFrom: new Color("#969697"),
    fogTo: new Color("#676665"),
  },
];

function Scene({
  projects,
  emptySpots,
  inBackground,
  view,
  onViewReached,
  foreignness: originalForeignness,
}: BaseProps) {
  const nodes = useMemo(
    () => projects.flatMap((hotspot) => hotspot.projects),
    [projects],
  );
  const [iAmGod, setGod] = useState(false);
  const dpr = useThree(({ viewport }) => viewport.dpr);
  const { setHotspot } = useHotspot();
  const [overrideForeignness, setOverrideForeignness] = useState<number | undefined>(undefined);
  const foreignness = overrideForeignness ?? originalForeignness;

  useEffect(() => {
    window.addEventListener("keydown", (event) => {
      if (event.key === "g") {
        setGod(!iAmGod);
      } else if (event.key === "1") {
        setOverrideForeignness(1);
      } else if (event.key === "2") {
        setOverrideForeignness(0.875);
      } else if (event.key === "3") {
        setOverrideForeignness(0.75);
      } else if (event.key === "4") {
        setOverrideForeignness(0.625);
      } else if (event.key === "5") {
        setOverrideForeignness(0.5);
      } else if (event.key === "6") {
        setOverrideForeignness(0.375);
      } else if (event.key === "7") {
        setOverrideForeignness(0.25);
      } else if (event.key === "8") {
        setOverrideForeignness(0.125);
      } else if (event.key === "9") {
        setOverrideForeignness(0);
      } else if (event.key === "0") {
        setOverrideForeignness(undefined);
      }
    });
  }, [iAmGod]);

  useEffect(() => {
    if (view) {
      setHotspot(view);
    }
  }, [view, setHotspot]);
  const environmentIndex = MathUtils.clamp(Math.floor(foreignness * environments.length), 0, environments.length - 1);
  const environment = environments[environmentIndex];
  const fog = useRef<FogExp2>(null!);
  useEffect(() => {
    fog.current.color.lerpColors(environment.fogFrom, environment.fogTo, foreignness)
  }, [environment, foreignness]);
  return (<>
    <Environment
      files={environment.file}
      environmentIntensity={
        MathUtils.lerp(
          1.0,
          0.5,
          foreignness,
        ) * environment.intensity
      }
      environmentRotation={new Euler(0, -0.5, 0)}
      backgroundRotation={new Euler(0, -0.5, 0)}
      backgroundIntensity={MathUtils.lerp(
        1.0,
        0.5,
        foreignness,
      ) * 0.8 * environment.intensity}
      background
    />
    <CascadedShadowMap lightIntensity={0} shadowMapSize={4096} lightDirection={[-0.2, MathUtils.lerp(-0.4, -2.5, foreignness ** 2), -0.5]} lightMargin={10} maxFar={25} />
    <fogExp2 ref={fog} attach="fog" density={iAmGod ? 0 : MathUtils.lerp(0.03, 0.1, foreignness ** 2)} />
    <EffectComposer>
      <N8AO aoRadius={2} intensity={5} distanceFalloff={.4} depthAwareUpsampling quality="performance" />
      <DepthOfField
        focusDistance={0}
        focalLength={(inBackground ? 0.01 : MathUtils.lerp(0.1, 0.05, foreignness))}
        bokehScale={4 * dpr * dpr}
      />
      <Vignette technique={0} offset={0.1} darkness={0.75} />
    </EffectComposer>
    <OrbitControls enabled={iAmGod} />

    <EnvironmentModel />

    <Player
      debug={iAmGod}
      view={view}
      onViewReached={onViewReached}
    />
    {nodes.map((node) => (
      <ProjectBox
        key={node.spot.name}
        href={`/${node.project.slug}`}
        position={node.spot.translation}
        quaternion={node.spot.rotation}
      />
    ))}
    {emptySpots.map((node) => (
      <ProjectBox
        key={node.name}
        position={node.translation}
        quaternion={node.rotation}
      />
    ))}
    <Water />
  </>);
}

export function SceneCanvas(props: BaseProps) {
  const { inBackground } = props;
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
        <Scene {...props} />
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
