"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { PerspectiveCamera, useGLTF } from "@react-three/drei";
import { Object3D, Vector3, Quaternion } from "three";
import { Node, Pathfinding } from "three-pathfinding";
import { animated, config, useSpring } from "@react-spring/three";
import { GLTFResult } from "./model";
import { SpatialControls } from "./spatial-controls";

const ZONE = 'level1';
const SPEED = 2.0;

const initialRotation = new Quaternion().setFromAxisAngle(new Vector3(0, 1, 0), Math.PI * 0.5);
const maxTeleportDistance = 5;

function pathLength(start: Vector3, path: Vector3[]) {
  let length = 0;
  let previous = start;
  for (const point of path) {
    length += previous.clone().sub(point).length();
    previous = point;
  }
  return length;
}

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
  const [targetVisible, setTargetVisible] = useState(false);
  const targetSpring = useSpring({
    scale: targetVisible ? 1 : 0,
    config: config.wobbly,
  });
  const [moveForward, setMoveForward] = useState(false);
  const [moveBackward, setMoveBackward] = useState(false);
  const [moveLeft, setMoveLeft] = useState(false);
  const [moveRight, setMoveRight] = useState(false);
  const [navigatingToTarget, setNavigatingToTarget] = useState(false);
  const [sourceRotation, setSourceRotation] = useState<Quaternion | undefined>();
  const rotationTimerRef = useRef<number | undefined>();
  const currentPath = useRef<Vector3[] | undefined>(undefined);
  const currentPathLength = useRef(0);
  const endNavigation = useCallback(() => {
    currentPath.current = undefined;
    if (navigatingToTarget) {
      setNavigatingToTarget(false);
      onTargetCompleted?.(true);
    }
  }, [navigatingToTarget, onTargetCompleted]);
  const beginNavigation = useCallback((target: Vector3) => {
    const groupId = pathFinding.getGroup(ZONE, playerRef.current.position);
    const path = pathFinding.findPath(playerRef.current.position, target, ZONE, groupId);
    if (!path || path.length === 0) {
      endNavigation();
    } else {
      currentPath.current = path;
      currentPathLength.current = pathLength(playerRef.current.position, path);
      node.current = undefined;
    }
  }, [endNavigation, pathFinding]);
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
      beginNavigation(targetPosition);
    }
  // intentionally omitting beginNavigation from dependencies
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [targetPosition]);
  useEffect(() => {
    if (targetRotation) {
      setSourceRotation(camera.quaternion.clone());
      rotationTimerRef.current = 0;
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
  const targetDiff = new Vector3();
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
      const path = currentPath.current;
      if (path) {
        const target = path[0];
        targetDiff.subVectors(target, currentPlayer.position);
        const stepDistance = delta * currentPathLength.current * SPEED;
        if (targetDiff.length() > stepDistance) {
          targetDiff.normalize().multiplyScalar(stepDistance);
          playerNextStep.addVectors(currentPlayer.position, targetDiff);
          currentPlayer.position.copy(playerNextStep);
        } else {
          playerRef.current.position.copy(target);
          if (path.length > 1) {
            currentPath.current = path.slice(1);
          } else {
            endNavigation();
          }
        }
      } else {
        pathFindingNext.copy(direction).multiplyScalar(delta * 0.75).add(playerRef.current.position);
        const groupID = pathFinding.getGroup(ZONE, playerRef.current.position);
        if (!node.current) {
          node.current = pathFinding.getClosestNode(playerRef.current.position, ZONE, groupID);
        }
        node.current = pathFinding.clampStep(playerRef.current.position, pathFindingNext, node.current, ZONE, groupID, playerNextStep);
        playerRef.current.position.copy(playerNextStep);
      }
    }
    const rotationTimer = rotationTimerRef.current;
    if (sourceRotation && targetRotation && rotationTimer !== undefined) {
      const currentTime = rotationTimer + delta * SPEED;
      if (currentTime < 1) {
        rotationTimerRef.current = currentTime;
        camera.quaternion.slerpQuaternions(sourceRotation, targetRotation, currentTime);
      } else {
        camera.quaternion.copy(targetRotation);
        setSourceRotation(undefined);
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
        <SpatialControls
          enabled={!debug}
          domElement="canvas-instance"
          settings-rotation-invertedX
          settings-rotation-invertedY
          settings-rotation-sensitivity={2}
          initialRotation={initialRotation}
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
            beginNavigation(event.point);
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
