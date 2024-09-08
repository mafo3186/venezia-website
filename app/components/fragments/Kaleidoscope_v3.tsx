//Kaleidoscope_v3.tsx: Kaleidoskop-Achtel oben links mit bewegten Teilen, ohne Spiegelung in andere Teile

'use client';

import { useEffect, useRef } from "react";
import * as THREE from "three";
import styles from './kaleidoscopeCanvas.module.css';

interface KaleidoscopeProps {
    // Hier können weitere Props hinzugefügt werden, falls nötig
}

interface IOptions {
    selector: string;
    edge?: number;
    shapes?: string[];
    minSize?: number;
    maxSize?: number;
    color?: string[];
    globalCompositeOperation?: string;
    quantity?: number;
    speed?: number;
}

export default function Kaleidoscope({ }: KaleidoscopeProps) {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const context = canvas.getContext('2d');
        if (!context) return;

        // Kaleidoscope-Parameter
        const options: IOptions = {
            selector: 'canvas',
            edge: 10,  // Anzahl der Spiegelungen
            shapes: ['circle', 'square'],  // Formen, die gespiegelt werden sollen
            minSize: 20,
            maxSize: 50,
            color: ['#00E5E5', '#A792F8FF', '#0000FF', '#000000'],  // Farben der Formen
            globalCompositeOperation: 'overlay',
            quantity: 50,
            speed: 0.3,
        };

        // Definition der Pipe und Particle Klassen aus dem Beispielcode
        class Pipe {
            public directionX: number = 0;
            public directionY: number = 0;
            private context: CanvasRenderingContext2D;
            private pointO: { x: number; y: number } = { x: 0, y: 0 };
            private radianAOB: number = 0;
            private pointA: { x: number; y: number } = { x: 0, y: 0 };
            private pointB: { x: number; y: number } = { x: 0, y: 0 };

            constructor(context: CanvasRenderingContext2D, options: IOptions) {
                this.context = context;
                const edge = options.edge ?? 6;
                this.radianAOB = (2 * Math.PI) / edge;
                this.calculateBorder();
            }

            public mirror(index: number, drawFunc: () => void) {
                const context = this.context;
                context.save();
                context.translate(this.pointO.x, this.pointO.y);
                context.rotate(this.radianAOB * index);
                context.translate(-this.pointO.x, -this.pointO.y);
                context.beginPath();
                context.moveTo(this.pointO.x, this.pointO.y);
                context.lineTo(this.pointA.x, this.pointA.y);
                context.lineTo(this.pointB.x, this.pointB.y);
                context.closePath();
                context.clip();
                drawFunc();
                context.restore();
            }

            private calculateBorder() {
                const canvas = this.context.canvas;
                this.pointO.x = canvas.width / 2;
                this.pointO.y = canvas.height / 2;
                // Berechnung der Punkte A und B für die Spiegelung
                const diagonal = Math.sqrt(this.pointO.x ** 2 + this.pointO.y ** 2);
                const radius = diagonal / Math.cos(this.radianAOB / 2);
                this.pointA = {
                    x: (1 - radius / diagonal) * this.pointO.x,
                    y: (1 - radius / diagonal) * this.pointO.y,
                };
                this.pointB = this.rotate(this.pointA.x, this.pointA.y, this.pointO.x, this.pointO.y, this.radianAOB);
            }

            private rotate(x: number, y: number, centerX: number, centerY: number, rad: number) {
                const X = Math.cos(rad) * (x - centerX) - Math.sin(rad) * (y - centerY) + centerX;
                const Y = Math.sin(rad) * (x - centerX) + Math.cos(rad) * (y - centerY) + centerY;
                return { x: X, y: Y };
            }
        }

        class Particle {
            public size: number = 0;
            public x: number = 0;
            public y: number = 0;
            public vx: number = 0;
            public vy: number = 0;
            public color: string = '';
            public shape: string = '';

            private context: CanvasRenderingContext2D;
            private options: IOptions;
            private radian: number = 0;


            constructor(context: CanvasRenderingContext2D, options: IOptions) {
                this.context = context;
                this.options = options;

                const minSize = options.minSize ?? 20;
                const maxSize = options.maxSize ?? 50;
                this.size = Math.random() * (maxSize - minSize) + minSize;
                this.shape = this.options.shapes[Math.floor(Math.random() * (options.shapes?.length ?? 0)) ?? 0];
                this.color = options.color[Math.floor(Math.random() * (options.color?.length ?? 0)) ?? 0];
                this.x = Math.random() * context.canvas.width;
                this.y = Math.random() * context.canvas.height;

                // Initialisieren von Geschwindigkeiten
                const speed = options.speed ?? 0.3;
                this.vx = (Math.random() - 0.5) * speed;
                this.vy = (Math.random() - 0.5) * speed;
            }



            public update() {
                this.x += this.vx;
                this.y += this.vy;
                this.radian += 0.01; // Rotation speed
                this.checkBounds();
            }

            // Check if the particle is out of bounds and reset position if necessary
            private checkBounds() {
                const canvas = this.context.canvas;
                if (this.x < 0) this.x = canvas.width;
                if (this.x > canvas.width) this.x = 0;
                if (this.y < 0) this.y = canvas.height;
                if (this.y > canvas.height) this.y = 0;
            }

            // Draw the particle
            public draw() {
                const context = this.context;
                context.save();
                context.translate(this.x, this.y);
                context.rotate(this.radian);
                context.fillStyle = this.color;

                switch (this.shape) {
                    case 'circle':
                        context.beginPath();
                        context.arc(0, 0, this.size / 2, 0, 2 * Math.PI);
                        context.fill();
                        break;
                    case 'square':
                        context.beginPath();
                        context.rect(-this.size / 2, -this.size / 2, this.size, this.size);
                        context.fill();
                        break;
                    // Add more shapes if needed
                }
                context.restore();
            }
        }


        class Plugin {
            private context: CanvasRenderingContext2D;
            private pipe: Pipe;
            private particles: Particle[];

            constructor(context: CanvasRenderingContext2D, options: IOptions) {
                this.context = context;
                this.pipe = new Pipe(context, options);
                this.particles = Array.from({ length: options.quantity ?? 100 }, () => new Particle(context, options));
                this.animate();
            }

            private animate() {
                // Clear the canvas before updating and drawing
                this.context.clearRect(0, 0, this.context.canvas.width, this.context.canvas.height);

                // Update and draw particles
                this.pipe.mirror(0, () => {
                    this.particles.forEach(particle => {
                        particle.update(); // Update particle position and state
                    });
                    this.particles.forEach(particle => {
                        particle.draw(); // Draw particle after updating
                    });
                });

                // Request the next frame
                requestAnimationFrame(() => this.animate());
            }
        }


        new Plugin(context, options);

    }, []);


    return (
        <canvas ref={canvasRef} style={{ width: '100%', height: '100%' }} />
    );
}
