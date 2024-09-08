'use client';

import React, { useEffect, useRef } from 'react';

interface KaleidoscopeProps {
    edge?: number;
    shapes?: string[];
    minSize?: number;
    maxSize?: number;
    color?: string[];
    globalCompositeOperation?: string;
    quantity?: number;
    speed?: number;
}

const defaultOptions: KaleidoscopeProps = {
    edge: 10,
    shapes: ['square', 'circle', 'wave'],
    minSize: 30,
    maxSize: 50,
    color: ['#FFD1B9', '#564138', '#2E86AB', '#F5F749', '#F24236'],
    globalCompositeOperation: 'overlay',
    quantity: 50,
    speed: 0.3,
};

export default function Kaleidoscope(props: KaleidoscopeProps) {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const options = { ...defaultOptions, ...props };

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');
        let animationFrameId: number;

        if (canvas && ctx) {
            const shapes = options.shapes || ['square', 'circle', 'wave'];
            const colors = options.color || ['#FFD1B9', '#564138', '#2E86AB', '#F5F749', '#F24236'];
            const edge = options.edge || 10;
            const quantity = options.quantity || 50;
            const speed = options.speed || 0.3;
            const globalCompositeOperation = options.globalCompositeOperation || 'overlay';

            const width = canvas.width = canvas.offsetWidth;
            const height = canvas.height = canvas.offsetHeight;

            let items: any[] = [];

            // Initialisieren der Elemente für das Kaleidoskop
            for (let i = 0; i < quantity; i++) {
                const shape = shapes[Math.floor(Math.random() * shapes.length)];
                const size = Math.random() * (options.maxSize! - options.minSize!) + options.minSize!;
                const posX = Math.random() * width;
                const posY = Math.random() * height;
                const velocityX = (Math.random() - 0.5) * speed;
                const velocityY = (Math.random() - 0.5) * speed;
                const color = colors[Math.floor(Math.random() * colors.length)];
                items.push({ shape, size, posX, posY, velocityX, velocityY, color });
            }

            // Zeichenfunktion
            const draw = () => {
                ctx.clearRect(0, 0, width, height);
                ctx.globalCompositeOperation = globalCompositeOperation;

                items.forEach((item) => {
                    ctx.fillStyle = item.color;

                    switch (item.shape) {
                        case 'square':
                            ctx.fillRect(item.posX, item.posY, item.size, item.size);
                            break;
                        case 'circle':
                            ctx.beginPath();
                            ctx.arc(item.posX, item.posY, item.size / 2, 0, Math.PI * 2);
                            ctx.fill();
                            ctx.closePath();
                            break;
                        case 'wave':
                            ctx.beginPath();
                            ctx.moveTo(item.posX, item.posY);
                            for (let i = 0; i < item.size; i++) {
                                ctx.lineTo(item.posX + i, item.posY + Math.sin(i * 0.1) * 10);
                            }
                            ctx.strokeStyle = item.color;
                            ctx.stroke();
                            break;
                    }

                    // Bewegung der Elemente
                    item.posX += item.velocityX;
                    item.posY += item.velocityY;

                    // Randkollision
                    if (item.posX < 0 || item.posX > width) item.velocityX *= -1;
                    if (item.posY < 0 || item.posY > height) item.velocityY *= -1;
                });

                animationFrameId = requestAnimationFrame(draw);
            };

            draw();

            return () => cancelAnimationFrame(animationFrameId); // Cleanup bei Unmount
        }
    }, [options]);

    return <canvas ref={canvasRef} style={{ width: '100%', height: '100%' }} />;
};
