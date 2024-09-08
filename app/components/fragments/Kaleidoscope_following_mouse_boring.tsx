// component/Kaleidoscope.tsx
'use client';

import React, { useEffect, useRef, useState } from 'react';

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

type Shape = {
    x: number;
    y: number;
    size: number;
    shape: string;
    color: string;
    dx: number;
    dy: number;
};

class Pipe {
    public directionX: number = 0;
    public directionY: number = 0;
    private center: { x: number; y: number };

    constructor(center: { x: number; y: number }) {
        this.center = center;
        this.initializeEvents();
    }

    private initializeEvents() {
        window.addEventListener('mousemove', this.handleMouseMove);
    }

    private handleMouseMove = (event: MouseEvent) => {
        const unit = Math.sqrt(
            (event.clientX - this.center.x) ** 2 +
            (event.clientY - this.center.y) ** 2
        );
        if (unit === 0) return;

        this.directionX = (event.clientX - this.center.x) / unit;
        this.directionY = (event.clientY - this.center.y) / unit;

        const element = document.querySelector('canvas');
        element.dispatchEvent(new Event('change:direction'));
    };

    public destroy() {
        window.removeEventListener('mousemove', this.handleMouseMove);
    }
}

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
    const center = { x: canvasWidth / 2, y: canvasHeight / 2 };
    const pipe = useRef(new Pipe(center));

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        canvas.width = canvasWidth;
        canvas.height = canvasHeight;

        // Generate random shapes
        const shapesArray: Shape[] = [];
        for (let i = 0; i < quantity; i++) {
            const size = minSize + Math.random() * (maxSize - minSize);
            const shape = shapes[Math.floor(Math.random() * shapes.length)];
            const color = colors[Math.floor(Math.random() * colors.length)];
            const x = Math.random() * canvas.width;
            const y = Math.random() * canvas.height;
            const dx = (Math.random() - 0.5) * speed * 4; // Initial random velocity
            const dy = (Math.random() - 0.5) * speed * 4; // Initial random velocity

            shapesArray.push({ x, y, size, shape, color, dx, dy });
        }

        // Draw shape in CanvasRenderingContext2D
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

        const updateShapes = () => {
            shapesArray.forEach((shape) => {
                // Update shape directions based on velocity (dx, dy) and mouse position influence
                shape.dx += (pipe.current.directionX * speed - shape.dx) * 0.05;
                shape.dy += (pipe.current.directionY * speed - shape.dy) * 0.05;

                shape.x += shape.dx;
                shape.y += shape.dy;

                // Bounce off edges
                /*
                if (shape.x - shape.size / 2 < 0 || shape.x + shape.size / 2 > canvas.width) {
                    shape.dx = -shape.dx;
                }
                if (shape.y - shape.size / 2 < 0 || shape.y + shape.size / 2 > canvas.height) {
                    shape.dy = -shape.dy;
                }
                    */

                // Bounce off edges
                if (shape.x - shape.size / 2 < 0) {
                    shape.x = shape.size / 2;
                    shape.dx = -shape.dx;
                }
                if (shape.x + shape.size / 2 > canvas.width) {
                    shape.x = canvas.width - shape.size / 2;
                    shape.dx = -shape.dx;
                }
                if (shape.y - shape.size / 2 < 0) {
                    shape.y = shape.size / 2;
                    shape.dy = -shape.dy;
                }
                if (shape.y + shape.size / 2 > canvas.height) {
                    shape.y = canvas.height - shape.size / 2;
                    shape.dy = -shape.dy;
                }
            });
        };

        // Animation function
        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            updateShapes();

            shapesArray.forEach((shape) => {
                // Draw shape and mirrored versions
                for (let section = 0; section < edge; section++) {
                    const angle = (section * 2 * Math.PI) / edge;
                    ctx.save();
                    ctx.translate(canvas.width / 2, canvas.height / 2);
                    ctx.rotate(angle);
                    drawShape(shape.x - canvas.width / 2, shape.y - canvas.height / 2, shape.size, shape.shape, shape.color);
                    ctx.restore();
                }
            });

            requestAnimationFrame(animate);
        };

        // Start animation
        animate();

        return () => {
            // Cleanup on component unmount
            if (canvas) {
                canvas.width = 0;
                canvas.height = 0;
            }
            pipe.current.destroy();
        };
    }, [edge, shapes, minSize, maxSize, colors, quantity, speed, canvasWidth, canvasHeight]);

    return <canvas ref={canvasRef} />;
}