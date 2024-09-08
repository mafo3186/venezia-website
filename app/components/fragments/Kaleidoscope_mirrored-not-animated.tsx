// component/Kaleidoscope.tsx
'use client';

import React, { useEffect, useRef } from 'react';

type KaleidoscopeProps = {
    edge?: number; // Number of mirror sections
    shapes?: string[]; // Shapes to render
    minSize?: number; // Minimum size of shapes
    maxSize?: number; // Maximum size of shapes
    colors?: string[]; // Colors of shapes
    quantity?: number; // Number of shapes
    speed?: number; // Movement speed of shapes
    canvasWidth?: number;
    canvasHeight?: number;
};

export default function Kaleidoscope({
    edge = 8, // Default: 8 sections for mirror
    shapes = ['circle', 'square', 'triangle'], // Default shapes
    minSize = 20, // Minimum size
    maxSize = 50, // Maximum size
    colors = ['#f133ff', '#a792f8', '#3357FF'], // Default colors
    quantity = 30, // Number of shapes
    speed = 0.1, // Default speed
    canvasWidth = window.innerWidth,
    canvasHeight = window.innerHeight,
}: KaleidoscopeProps) {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const animationRef = useRef<number | null>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        canvas.width = canvasWidth;
        canvas.height = canvasHeight;

        const drawShape = (x: number, y: number, size: number, shape: string, color: string) => {
            ctx.fillStyle = color;
            ctx.beginPath();
            if (shape === 'circle') {
                ctx.arc(x, y, size / 2, 0, Math.PI * 2);
            } else if (shape === 'square') {
                ctx.rect(x - size / 2, y - size / 2, size, size);
            } else if (shape === 'triangle') {
                ctx.moveTo(x, y - size / 2);
                ctx.lineTo(x + size / 2, y + size / 2);
                ctx.lineTo(x - size / 2, y + size / 2);
            }
            ctx.closePath();
            ctx.fill();
        };

        let lastTime = 0;
        const fps = 1; // Ziel-FPS (Beispiel: 10 FPS)
        const frameDuration = 2000 / fps;

        let yPos = 0;

        const animate = (time: number) => {
            if (time - lastTime >= frameDuration) {
                ctx.clearRect(0, 0, canvas.width, canvas.height);

                for (let i = 0; i < quantity; i++) {
                    const x = Math.random() * canvas.width;
                    const y = Math.random() * canvas.height;
                    const size = minSize + Math.random() * (maxSize - minSize);
                    const shape = shapes[Math.floor(Math.random() * shapes.length)];
                    const color = colors[Math.floor(Math.random() * colors.length)];

                    // Draw shape and mirrored versions
                    for (let section = 0; section < edge; section++) {
                        const angle = (section * 2 * Math.PI) / edge;
                        ctx.save();
                        ctx.translate(canvas.width / 2, canvas.height / 2);
                        ctx.rotate(angle);
                        drawShape(x - canvas.width / 2, y - canvas.height / 2, size, shape, color);
                        ctx.restore();
                    }
                }
                lastTime = time;
            }
            animationRef.current = requestAnimationFrame(animate);
        };

        animationRef.current = requestAnimationFrame(animate);

        return () => {
            // Cleanup on component unmount
            if (canvas) {
                canvas.width = 0;
                canvas.height = 0;
            }
        };
    }, [edge, shapes, minSize, maxSize, colors, quantity, speed, canvasWidth, canvasHeight]);

    return <canvas ref={canvasRef} />;
}
