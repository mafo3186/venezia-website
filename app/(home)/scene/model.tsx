"use client";

import { useGLTF } from '@react-three/drei';
import { useMemo } from 'react';

export default function Model() {
    const model = useGLTF("/assets/scene.gltf");

    const scene = useMemo(() => {
        model.scene.castShadow = true;
        model.scene.receiveShadow = true;
        model.scene.traverse((node) => {
            if (node.type === 'Mesh') {
                node.castShadow = true;
                node.receiveShadow = true;
            }
        });
        return model.scene;
    }, [model]);

    return scene ? <primitive object={scene} position={[-0.67, 0, 0]} /> : null;
}

