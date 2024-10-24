import { useGLTF } from "@react-three/drei";
import { Group, MathUtils, Mesh, Object3D } from "three";
import {
  GroupProps,
  MeshProps,
  ThreeEvent,
  useFrame,
} from "@react-three/fiber";
import { useEffect, useRef } from "react";
import { easeInOut } from "framer-motion";

type OnActivate = (id: string) => void;
type ActivateProps = { onActivate?: OnActivate };

const flashDuration = 0.5;

function useShimmer<T extends Object3D>() {
  const ref = useRef<T>(null!);
  const hover = useRef(false);
  useEffect(() => {
    const object = ref.current;
    object?.traverse((child) => {
      if (child instanceof Mesh) {
        // child.userData.emissiveMap = child.material.emissiveMap;
        // child.material.emissiveMap = child.material.map;
        child.userData.emissive = child.material.emissive.clone();
        child.userData.emissiveIntensity = child.material.emissiveIntensity;
      }
    });
    return () => {
      object?.traverse((child) => {
        if (child instanceof Mesh) {
          // child.material.emissiveMap = child.userData.emissiveMap;
          child.material.emissive.copy(child.userData.emissive);
          child.material.emissiveIntensity = child.userData.emissiveIntensity;
        }
      });
    };
  }, []);
  const onOver = (event: ThreeEvent<PointerEvent>) => {
    event.stopPropagation();
    hover.current = true;
    time.current = 0;
  };
  const onOut = (event: ThreeEvent<PointerEvent>) => {
    event.stopPropagation();
    hover.current = false;
    ref.current?.traverse((child) => {
      if (child instanceof Mesh) {
        child.material.emissive.copy(child.userData.emissive);
        child.material.emissiveIntensity = child.userData.emissiveIntensity;
      }
    });
  };
  const time = useRef(0);
  useFrame((_, delta) => {
    if (hover.current) {
      time.current += delta;
      const t = easeInOut(
        MathUtils.pingpong(time.current, flashDuration) / flashDuration,
      );
      ref.current?.traverse((child) => {
        if (child instanceof Mesh) {
          child.material.emissive.lerpColors(
            child.userData.emissive,
            child.material.color,
            t,
          );
          child.material.emissiveIntensity =
            child.userData.emissiveIntensity + MathUtils.lerp(0, 0.5, t);
        }
      });
    }
  });
  return [ref, onOver, onOut] as const;
}

function InteractiveMesh({ onActivate, ...props }: ActivateProps & MeshProps) {
  const [ref, onOver, onOut] = useShimmer<Mesh>();
  const onClick = (event: ThreeEvent<MouseEvent>) => {
    if (onActivate && props.name) {
      event.stopPropagation();
      onActivate(props.name);
    }
  };
  return (
    <mesh
      ref={ref}
      onPointerOver={onOver}
      onPointerOut={onOut}
      onClick={onClick}
      {...props}
    />
  );
}

const InteractivePlane = InteractiveMesh;

function InteractiveModel(props: ActivateProps & MeshProps) {
  return <InteractiveMesh castShadow receiveShadow {...props} />;
}

function InteractiveGroup({
  children,
  onActivate,
  ...props
}: ActivateProps & GroupProps) {
  const [ref, onOver, onOut] = useShimmer<Group>();
  const onClick = (event: ThreeEvent<MouseEvent>) => {
    if (onActivate && props.name) {
      event.stopPropagation();
      onActivate(props.name);
    }
  };
  return (
    <group
      ref={ref}
      onPointerOver={onOver}
      onPointerOut={onOut}
      onClick={onClick}
      {...props}
    >
      {children}
    </group>
  );
}

function InteractivePrimitive({
  node,
  withinParent,
  show,
  onActivate,
}: {
  node: Object3D;
  withinParent?: boolean;
  show?: string[];
  onActivate?: OnActivate;
}) {
  const visible = !node.userData.hidden;
  if (node instanceof Mesh) {
    if (withinParent) {
      return (
        <mesh
          castShadow={node.userData.model}
          receiveShadow={node.userData.model}
          name={node.name}
          geometry={node.geometry}
          material={node.material}
          position={node.position}
          rotation={node.rotation}
          scale={node.scale}
          visible={visible}
        >
          {node.children.map((child) => (
            <InteractivePrimitive
              key={child.name}
              node={child}
              withinParent={true}
              show={show}
            />
          ))}
        </mesh>
      );
    } else {
      const Type = node.userData.model ? InteractiveModel : InteractivePlane;
      return (
        <Type
          name={node.name}
          geometry={node.geometry}
          material={node.material}
          position={node.position}
          rotation={node.rotation}
          scale={node.scale}
          visible={visible && (!show || show.includes(node.name))}
          onActivate={onActivate}
        >
          {node.children.map((child) => (
            <InteractivePrimitive
              key={child.name}
              node={child}
              withinParent={true}
              show={show}
            />
          ))}
        </Type>
      );
    }
  } else {
    if (node.userData.spot) {
      return (
        <InteractiveGroup
          name={node.name}
          position={node.position}
          rotation={node.rotation}
          scale={node.scale}
          visible={visible && (!show || show.includes(node.name))}
          onActivate={onActivate}
        >
          {node.children.map((child) => (
            <InteractivePrimitive
              key={child.name}
              node={child}
              withinParent={true}
              show={show}
            />
          ))}
        </InteractiveGroup>
      );
    } else {
      return (
        <group
          name={node.name}
          position={node.position}
          rotation={node.rotation}
          scale={node.scale}
          visible={visible}
        >
          {node.children.map((child) => (
            <InteractivePrimitive
              key={child.name}
              node={child}
              show={show}
              onActivate={onActivate}
            />
          ))}
        </group>
      );
    }
  }
}

export function Model({
  show,
  onActivate,
}: {
  show?: string[];
  onActivate?: OnActivate;
}) {
  const { scene } = useGLTF("/assets/pieces.glb");
  return (
    <InteractivePrimitive node={scene} show={show} onActivate={onActivate} />
  );
}

useGLTF.preload("/assets/pieces.glb");
