"use client";

import { useThree } from '@react-three/fiber';

export default function Globals() {
    useThree(({ camera }) => {
        camera.position.x = 0
        camera.position.y = 2.5
        camera.position.z = 0
    })
    return <></>;
}
