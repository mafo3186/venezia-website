"use client";

import { Canvas, useLoader, useThree } from "@react-three/fiber";
import { startTransition, Suspense, useEffect, useMemo, useRef, useState } from "react";
import { DepthOfField, EffectComposer, N8AO, Vignette } from "@react-three/postprocessing";
import { Environment, OrbitControls, useProgress } from "@react-three/drei";
import styles from "./world.module.css";
import { AudioContext, Color, Euler, FogExp2, MathUtils, PositionalAudio as PositionalAudioImpl } from "three";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";
import { Player } from "./player";
import { Model as EnvironmentModel } from "./model";
import Stats, { Panel } from "./stats";
import { CascadedShadowMap } from "./csm/cascaded-shadow-map";
import { HotspotsWithProjects, PreDefinedView, Spot } from "@/components/types";
import { ProjectBox } from "./project-box";
import { Water } from "./water";
import { DebugProvider } from "./debug";
import { PositionalAudio } from "./audio/positional-audio";
import wind from "./ambience/527281__dlgebert__monologue-wind.wav";
import shore from "./ambience/58408__sinatra314__shore1001.wav";
import birds from "./ambience/345852__hargissssound__spring-birds-loop-with-low-cut-new-jersey.wav";
import meow from "./ambience/412017__skymary__cat-meow-short.wav";
import { AudioListenerProvider } from "./audio/audio";

type BaseProps = {
  projects: HotspotsWithProjects,
  emptySpots: Spot[],
  inBackground: boolean,
  view?: PreDefinedView,
  onViewReached?: (success: boolean) => void,
  foreignness: number,
  volume?: number,
};

const baseShoreVolume = 0.5;
const baseBirdsVolume = 1.5;

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
    fogFrom: new Color("#6c6b6a"),
    fogTo: new Color("#4b4a4a"),
  },
];

for (const environment of environments) {
  useLoader.preload(RGBELoader, environment.file);
}

function Scene({
  projects,
  emptySpots,
  inBackground,
  view,
  onViewReached,
  foreignness: originalForeignness,
}: BaseProps) {
  const cat1Ref = useRef<PositionalAudioImpl | null>(null);
  const cat2Ref = useRef<PositionalAudioImpl | null>(null);
  const nodes = useMemo(
    () => projects.flatMap((hotspot) => hotspot.projects),
    [projects],
  );
  const [iAmGod, setGod] = useState(false);
  const dpr = useThree(({ viewport }) => viewport.dpr);
  const [overrideForeignness, setOverrideForeignness] = useState<number | undefined>(undefined);
  const foreignness = overrideForeignness ?? originalForeignness;
  useEffect(() => {
    const listener = (event: KeyboardEvent) => {
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
    };
    window.addEventListener("keydown", listener);
    return () => {
      window.removeEventListener("keydown", listener);
    };
  }, [iAmGod]);
  const desiredEnvironmentIndex = MathUtils.clamp(Math.floor(foreignness * environments.length), 0, environments.length - 1);
  const [environmentIndex, setEnvironmentIndex] = useState(desiredEnvironmentIndex);
  useEffect(() => {
    if (desiredEnvironmentIndex !== environmentIndex) {
      startTransition(() => {
        setEnvironmentIndex(desiredEnvironmentIndex);
      });
    }
  }, [desiredEnvironmentIndex, environmentIndex]);
  const environment = environments[environmentIndex];
  const fog = useRef<FogExp2>(null!);
  useEffect(() => {
    fog.current.color.lerpColors(environment.fogFrom, environment.fogTo, foreignness)
  }, [environment, foreignness]);
  const foreignVolume = MathUtils.lerp(0.2, 1.0, foreignness);
  const familiarVolume = MathUtils.lerp(1.0, 0.0, foreignness);
  useEffect(() => {
    let timeout: any;
    function doMeow() {
      const cat = Math.random() < 0.5 ? cat1Ref.current : cat2Ref.current;
      cat?.setDetune(MathUtils.randFloat(-1000, 1000));
      cat?.play();
      timeout = setTimeout(doMeow, MathUtils.randFloat(MathUtils.lerp(0, 10000, foreignness), MathUtils.lerp(20000, 30000, foreignness)));
    }
    doMeow();
    return () => {
      clearTimeout(timeout);
    };
  }, [foreignness]);
  return (<><DebugProvider debug={iAmGod}>
    <Suspense fallback={null}>
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
    </Suspense>
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
    {/* middle wind */}
    <PositionalAudio
      url={wind}
      loop
      autoplay
      distance={3}
      position={[-0.5, 2, 0]}
      volume={foreignVolume}
    />
    <PositionalAudio
      url={wind}
      loop
      autoplay
      distance={3}
      position={[12, 2, 2]}
      volume={foreignVolume}
    />
    {/* birds */}
    <PositionalAudio
      url={birds}
      loop
      autoplay
      distance={4}
      position={[-11, 8, 3]}
      volume={baseBirdsVolume * familiarVolume}
    />
    <PositionalAudio
      url={birds}
      loop
      autoplay
      distance={4}
      position={[-10, 10, 16]}
      volume={baseBirdsVolume * familiarVolume}
    />
    {/* shore middle */}
    <PositionalAudio
      url={shore}
      loop
      autoplay
      distance={1}
      position={[-3, 0, 27]}
      volume={baseShoreVolume}
    />
    {/* shore */}
    <PositionalAudio
      url={shore}
      loop
      autoplay
      distance={1}
      position={[-3, 0, 21]}
      volume={baseShoreVolume}
    />
    {/* shore */}
    <PositionalAudio
      url={shore}
      loop
      autoplay
      distance={1}
      position={[6, 0, 28]}
      volume={baseShoreVolume}
    />
    {/* stairs shore */}
    <PositionalAudio
      url={shore}
      loop
      autoplay
      distance={1}
      position={[-15, 0, 11]}
      volume={baseShoreVolume}
    />
    {/* cat stairs */}
    <PositionalAudio
      ref={cat1Ref}
      url={meow}
      distance={1}
      position={[-12.5, 1, 7.5]}
      volume={1}
      loop={false}
    />
    {/* cat water */}
    <PositionalAudio
      ref={cat2Ref}
      url={meow}
      distance={1}
      position={[8, 1, 6]}
      volume={1}
      loop={false}
    />
  </DebugProvider></>);
}

export function SceneCanvas(props: BaseProps) {
  const [showStats, setShowStats] = useState(false);
  useEffect(() => {
    const listener = (event: KeyboardEvent) => {
      if (event.key === "f") {
        setShowStats(!showStats);
      }
    };
    window.addEventListener("keydown", listener);
    return () => window.removeEventListener("keydown", listener);
  }, [showStats]);
  const [initialLoad, setInitialLoad] = useState(true);
  const { inBackground } = props;
  const dpr = .78;
  const active = useProgress((state) => state.active);
  const progress = useProgress((state) => state.progress);
  useEffect(() => {
    if (!active) {
      const timeout = setTimeout(() => setInitialLoad(false), 300);
      return () => clearTimeout(timeout);
    }
  }, [active, progress]);
  const show = initialLoad;
  return (<>
    <Canvas
      id="canvas-instance"
      style={{ width: "100%", height: "100vh" }}
      shadows="soft"
      className={`${styles.scene } ` + (show ? styles.sceneLoading : styles.sceneLoaded)}
      dpr={dpr}
      frameloop={inBackground ? "demand" : "always"}
    >
      <AudioListenerProvider volume={inBackground ? 0 : 1}>
        <Suspense fallback={null}>
          <Scene {...props} />
        </Suspense>
      </AudioListenerProvider>
      <Stats showPanel={showStats ? 0 : -1}>
        <Panel title="cDPR" value={dpr * 100} maxValue={120} />
      </Stats>
    </Canvas>
    <div
      className={
        styles.loaderPlaceholder +
        (!show ? ` ${styles.loaderPlaceholderInactive}` : "")
      }
    />
    <div
      className={styles.progress + (show ? ` ${styles.progressActive}` : "")}
    >
      <div className={styles.bar} style={{ scale: `${progress / 100} 1` }} />
    </div>
  </>);
}
