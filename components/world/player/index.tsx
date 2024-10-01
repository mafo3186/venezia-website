"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { PerspectiveCamera, useGLTF } from "@react-three/drei";
import { Object3D, Vector3, Quaternion } from "three";
import { Node, Pathfinding } from "three-pathfinding";
import { animated, config, useSpring } from "@react-spring/three";
import { GLTFResult } from "../model";
import { FirstPersonDragControls } from "./controls";
import { Path3D } from "./path";
import { easeInOut } from "framer-motion";

const ZONE = 'level1';

const initialRotation = new Quaternion().setFromAxisAngle(new Vector3(0, 1, 0), Math.PI * 0.5);
const maxTeleportDistance = 5;

export function Player({
  debug,
  targetPosition,
  targetRotation,
  onTargetCompleted,
}: {
  debug?: boolean,
  targetPosition?: Vector3,
  targetRotation?: Quaternion,
  onTargetCompleted?: (success: boolean) => void,
}) {
  const navmesh = (useGLTF('/assets/venice.glb') as GLTFResult).nodes.Navmesh.geometry;
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
  const [navigatingToTarget, setNavigatingToTarget] = useState(false);
  const [sourceRotation, setSourceRotation] = useState<Quaternion | undefined>();
  const motionTimeRef = useRef<number | undefined>();
  const motionDurationRef = useRef<number | undefined>();
  const motionPath = useRef<Path3D | undefined>();
  const endNavigation = useCallback(() => {
    setMoving(false);
    setTargetVisible(false);
    motionTimeRef.current = undefined;
    motionDurationRef.current = undefined;
    motionPath.current = undefined;
    if (navigatingToTarget) {
      setNavigatingToTarget(false);
      onTargetCompleted?.(true);
    }
  }, [navigatingToTarget, onTargetCompleted]);
  const beginNavigation = useCallback((target: Vector3, duration: number) => {
    const start = playerRef.current.position.clone();
    const groupId = pathFinding.getGroup(ZONE, start);
    const path = pathFinding.findPath(start, target, ZONE, groupId);
    if (!path || path.length === 0) {
      endNavigation();
    } else {
      setMoving(true);
      motionTimeRef.current = 0;
      motionDurationRef.current = duration;
      motionPath.current = new Path3D([start, ...path]);
      console.log(motionPath.current)
      node.current = undefined;
    }
  }, [endNavigation, pathFinding]);
  // set initial camera rotation
  useLayoutEffect(() => {
    camera.quaternion.copy(initialRotation);
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
  }, [camera]);
  useEffect(() => {
    if (targetPosition) {
      setNavigatingToTarget(true);
      beginNavigation(targetPosition, 2.0);
    }
  // intentionally omitting beginNavigation from dependencies
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [targetPosition]);
  useEffect(() => {
    if (targetRotation) {
      setSourceRotation(camera.quaternion.clone());
    } else {
      setSourceRotation(undefined);
    }
  // intentionally omitting camera from dependencies
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [targetRotation]);
  const direction = new Vector3();
  const frontVector = new Vector3();
  const sideVector = new Vector3();
  const pathFindingNext = new Vector3();
  const playerNextStep = new Vector3();
  const cameraWorldDirection = new Vector3();
  const axis = new Vector3(0, 1, 0);
  const rayTargetDiff = new Vector3();
  useFrame(({ camera }, delta) => {
    const currentPlayer = playerRef.current;
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
      if (sourceRotation && targetRotation) {
        if (progress < 1) {
          camera.quaternion.slerpQuaternions(sourceRotation, targetRotation, progressEasing);
        } else {
          camera.quaternion.copy(targetRotation);
          setSourceRotation(undefined);
        }
      }
      const path = motionPath.current;
      if (pathFinding && path) {
        path.at(progressEasing, playerRef.current.position);
      }
      if (nextMotionTime >= motionDuration) {
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
        />
      </mesh>
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
            if (navigatingToTarget) {
              onTargetCompleted?.(false);
              setNavigatingToTarget(false);
            }
            beginNavigation(event.point, 0.5);
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
