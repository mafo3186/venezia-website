"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { PerspectiveCamera, useGLTF } from "@react-three/drei";
import { Object3D, Vector3, Quaternion, Mesh, MathUtils } from "three";
import { Node, Pathfinding } from "three-pathfinding";
import { animated, config, useSpring } from "@react-spring/three";
import { FirstPersonDragControls } from "./controls";
import { Path3D } from "./path";
import { easeInOut } from "framer-motion";
import { LookTutorial } from "./tutorial";
import { PreDefinedView } from "@/components/types";
import { PerspectiveCamera as PerspectiveCameraImpl } from "three";

const metadataPath = "/assets/metadata.glb";
useGLTF.preload(metadataPath);

const ZONE = 'level1';

const initialRotation = new Quaternion().setFromAxisAngle(new Vector3(0, 1, 0), Math.PI * 0.5);
const maxTeleportDistance = 5;

export function Player({
  debug,
  view,
  onViewReached,
}: {
  debug?: boolean,
  view?: PreDefinedView,
  onViewReached?: (success: boolean) => void,
}) {
  const navmesh = ((useGLTF(metadataPath)).nodes.Navmesh as Mesh).geometry;
  const [pathFinding] = useMemo(() => {
    const pathFinding = new Pathfinding();
    pathFinding.setZoneData(ZONE, Pathfinding.createZone(navmesh));
    return [pathFinding];
  }, [navmesh]);
  const playerRef = useRef<Object3D>(null!);
  const rayTarget = useRef<Object3D>(null!);
  const node = useRef<Node | undefined>();
  const camera = useThree(({ camera }) => camera);
  const [moving, setMoving] = useState(false);
  const [targetVisible, setTargetVisible] = useState(false);
  const targetSpring = useSpring({
    scale: targetVisible && !moving ? 1 : 0,
    config: config.wobbly,
  });
  const [moveForward, setMoveForward] = useState(false);
  const [moveBackward, setMoveBackward] = useState(false);
  const [moveLeft, setMoveLeft] = useState(false);
  const [moveRight, setMoveRight] = useState(false);
  const [lookedAround, setLookedAround] = useState(false);
  const [enableLookTutorial, setEnableLookTutorial] = useState(false);
  useEffect(() => {
    const timeout = setTimeout(() => setEnableLookTutorial(true), 5000);
    return () => {
      clearTimeout(timeout);
    };
  }, []);
  const sourceRotation = useMemo(() => new Quaternion(), []);
  const targetRotation = useMemo(() => new Quaternion(), []);
  const motionTimeRef = useRef<number | undefined>();
  const motionDurationRef = useRef<number | undefined>();
  const motionPath = useRef<Path3D | undefined>();
  const endNavigation = useCallback((success = true) => {
    setMoving(false);
    setTargetVisible(false);
    motionTimeRef.current = undefined;
    motionDurationRef.current = undefined;
    motionPath.current = undefined;
    onViewReached?.(success);
  }, [onViewReached]);
  const beginNavigation = useCallback(
    (target: Vector3, rotation: Quaternion) => {
      if (moving) {
        endNavigation(false);
      }
      const start = playerRef.current.position.clone();
      const groupId = pathFinding.getGroup(ZONE, start);
      let pathNodes = pathFinding.findPath(start, target, ZONE, groupId);
      if (!pathNodes || pathNodes.length === 0) {
        pathNodes = [target];
      }
      setMoving(true);
      motionTimeRef.current = 0;
      const path = new Path3D([start, ...pathNodes]);
      motionPath.current = path;
      sourceRotation.copy(camera.quaternion);
      targetRotation.copy(rotation);
      const rotationDistance = sourceRotation.angleTo(targetRotation);
      const duration = Math.min(
        Math.max(path.length / 8, rotationDistance / Math.PI),
        4,
      );
      motionDurationRef.current = duration;
      node.current = undefined;
      if (duration < 0.01) {
        camera.quaternion.copy(targetRotation);
        endNavigation();
      }
    },
    [camera.quaternion, endNavigation, moving, pathFinding, sourceRotation, targetRotation],
  );
  // set initial camera rotation
  useLayoutEffect(() => {
    if (view) {
      camera.quaternion.fromArray(view.rotation);
      playerRef.current.position.fromArray(view.position);
    } else {
      camera.quaternion.copy(initialRotation);
    }
  // should only run once the camera is set up properly
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [camera]);
  useEffect(() => {
    const keyDown = (event: KeyboardEvent) => {
      switch (event.code) {
        case "KeyW":
        case "ArrowUp":
          setMoveForward(true);
          break;
        case "KeyA":
        case "ArrowLeft":
          setMoveLeft(true);
          break;
        case "KeyS":
        case "ArrowDown":
          setMoveBackward(true);
          break;
        case "KeyD":
        case "ArrowRight":
          setMoveRight(true);
          break;
        case "KeyP":
          navigator.clipboard.writeText(JSON.stringify({
            position: playerRef.current.position.toArray(),
            rotation: camera.quaternion.toArray(),
          }, undefined, "  "));
          break;
      }
    };
    const keyUp = (event: KeyboardEvent) => {
      switch (event.code) {
        case "KeyW":
        case "ArrowUp":
          setMoveForward(false);
          break;
        case "KeyA":
        case "ArrowLeft":
          setMoveLeft(false);
          break;
        case "KeyS":
        case "ArrowDown":
          setMoveBackward(false);
          break;
        case "KeyD":
        case "ArrowRight":
          setMoveRight(false);
          break;
      }
    };
    window.addEventListener("keydown", keyDown);
    window.addEventListener("keyup", keyUp);
    return () => {
      window.removeEventListener("keydown", keyDown);
      window.removeEventListener("keyup", keyUp);
    }
  }, [camera.quaternion]);
  useEffect(() => {
    if (view) {
      const position = new Vector3().fromArray(view.position);
      const rotation = new Quaternion().fromArray(view.rotation);
      beginNavigation(position, rotation);
    }
  // intentionally omitting everything else from dependencies
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [view]);
  const direction = new Vector3();
  const frontVector = new Vector3();
  const sideVector = new Vector3();
  const pathFindingNext = new Vector3();
  const playerNextStep = new Vector3();
  const cameraWorldDirection = new Vector3();
  const axis = new Vector3(0, 1, 0);
  const rayTargetDiff = new Vector3();
  useFrame(({ camera }, delta) => {
    frontVector.set(0, 0, (moveBackward ? 1 : 0) - (moveForward ? 1 : 0));
    sideVector.set((moveLeft ? 1 : 0) - (moveRight ? 1 : 0), 0, 0);
    camera.getWorldDirection(cameraWorldDirection);
    const theta = Math.atan2(cameraWorldDirection.x,cameraWorldDirection.z);
    direction
      .subVectors(frontVector, sideVector)
      .normalize()
      .multiplyScalar(2.5)
      .applyAxisAngle(axis, theta + Math.PI);
    if (pathFinding) {
      const path = motionPath.current;
      if (!path) {
        pathFindingNext.copy(direction).multiplyScalar(delta * 0.75).add(playerRef.current.position);
        const groupID = pathFinding.getGroup(ZONE, playerRef.current.position);
        if (!node.current) {
          node.current = pathFinding.getClosestNode(playerRef.current.position, ZONE, groupID);
        }
        node.current = pathFinding.clampStep(playerRef.current.position, pathFindingNext, node.current, ZONE, groupID, playerNextStep);
        playerRef.current.position.copy(playerNextStep);
      }
    }
    const motionTime = motionTimeRef.current;
    const motionDuration = motionDurationRef.current;
    if (motionTime !== undefined && motionDuration !== undefined) {
      const nextMotionTime = Math.min(motionTime + delta, motionDuration);
      const progress = motionTime / motionDuration;
      const progressEasing = easeInOut(progress);
      const path = motionPath.current;
      if (pathFinding && path) {
        path.at(progressEasing, playerRef.current.position);
      }
      camera.quaternion.slerpQuaternions(sourceRotation, targetRotation, progressEasing);
      if (nextMotionTime >= motionDuration) {
        camera.quaternion.copy(targetRotation);
        endNavigation();
        motionTimeRef.current = undefined;
        motionDurationRef.current = undefined;
      } else {
        motionTimeRef.current = nextMotionTime;
      }
    }
  });
  return <>
    <group ref={playerRef as any}>
      <mesh position={[0, 0.4, 0]}>
        <capsuleGeometry args={[0.2, 0.8, 3, 6]} />
        <meshBasicMaterial />
      </mesh>
      <mesh position={[0, 0.8, 0]}>
        <sphereGeometry args={[0.21]} />
        <meshBasicMaterial color="red" />
        <PerspectiveCamera
          fov={90}
          near={.04}
          far={100}
          makeDefault={!debug}
        />
        <FirstPersonDragControls
          enabled={!debug}
          makeDefault={!debug}
          onChange={() => setLookedAround(true)}
        />
      </mesh>
      <LookTutorial enable={enableLookTutorial} completed={lookedAround} />
    </group>
    {navmesh && <>
      <mesh
        position={[0, 0, 0]}
        geometry={navmesh}
        visible={debug}
        onPointerEnter={() => setTargetVisible(true)}
        onPointerLeave={() => setTargetVisible(false)}
        onPointerMove={(event) => {
          rayTargetDiff.subVectors(event.point, playerRef.current.position);
          if (rayTargetDiff.length() <= maxTeleportDistance) {
            setTargetVisible(true);
              rayTarget.current.position.copy(event.point);
          } else {
            setTargetVisible(false);
          }
        }}
        onClick={(event) => {
          rayTargetDiff.subVectors(event.point, playerRef.current.position);
          if (rayTargetDiff.length() <= maxTeleportDistance) {
            beginNavigation(event.point, camera.quaternion);
          }
        }}
      >
        <meshBasicMaterial color="cyan" opacity={0.5} transparent />
      </mesh>
      <animated.group ref={rayTarget as any} scale={targetSpring.scale}>
        <mesh
          castShadow
          receiveShadow
          position={[0, 0.25, 0]}
          scale-y={1.5}
        >
          <octahedronGeometry args={[0.1]} />
          <meshPhysicalMaterial
            attach="material"
            color="white"
            transmission={0.6}
            thickness={0.5}
            roughness={0.1} />
        </mesh>
      </animated.group>
    </>}
  </>;
}
