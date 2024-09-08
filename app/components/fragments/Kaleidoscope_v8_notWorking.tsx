'use client';
import React, { useRef, useEffect } from 'react';

interface KaleidoscopeProps {
    // Hier können weitere Props hinzugefügt werden, falls nötig
}

/*
const Kaleidoscope: React.FC<KaleidoscopeProps> = () => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    interface IOptions {
        selector: string;
        edge: number;
        shapes?: string[];
        minSize?: number;
        maxSize?: number;
        color?: string[];
        globalCompositeOperation?: string;
        quantity?: number;
        speed?: number;
    }

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const context = canvas.getContext('2d');
        if (!context) return;

        // Kaleidoscope-Parameter
        const options = {
            selector: 'canvas',
            edge: 10,  // Anzahl der Spiegelungen
            shapes: ['circle', 'square'],  // Formen, die gespiegelt werden sollen
            minSize: 20,
            maxSize: 50,
            color: ['#FF0000', '#00FF00', '#0000FF'],  // Farben der Formen
            globalCompositeOperation: 'overlay',
            quantity: 50,
            speed: 0.3,
        };

        // Merges the keys of two objects.
        function extend(
            source: { [index: string]: any },
            obj: { [index: string]: any },
        ) {
            Object.keys(obj).forEach((key: string) => {
                source[key] = obj[key];
            });
            return source;
        }

        function getRandomInt(max: number): number {
            return Math.floor(Math.random() * Math.floor(max));
        }

        // Rotate the point around the center point.
        function rotate(
            x: number,
            y: number,
            centerX: number,
            centerY: number,
            rad: number,
        ) {
            const X =
                Math.cos(rad) * (x - centerX) - Math.sin(rad) * (y - centerY) + centerX;
            const Y =
                Math.sin(rad) * (x - centerX) + Math.cos(rad) * (y - centerY) + centerY;
            return { x: X, y: Y };
        }

        // Definition der Pipe und Particle Klassen aus dem Beispielcode
        class Pipe {
            // Die Pipe-Klasse bleibt wie im Beispielcode
            // Hier ist sie nur verkürzt dargestellt
            // Implementiere die Methoden und Eigenschaften entsprechend dem Beispielcode
            public directionX: number = 0;
            public directionY: number = 0;
            private context: CanvasRenderingContext2D;
            private pointO: { x: number; y: number } = { x: 0, y: 0 };
            private radianAOB: number = 0;
            private pointA: { x: number; y: number } = { x: 0, y: 0 };
            private pointB: { x: number; y: number } = { x: 0, y: 0 };

            private isSharp: boolean = false;
            private inclinationOA: number = 0;
            private interceptOA: number = 0;
            private inclinationOB: number = 0;
            private interceptOB: number = 0;
            private inclinationAB: number = 0;
            private interceptAB: number = 0;

            private listenerMousemove: (this: Window, ev: UIEvent) => any;
            private options: IOptions;

            constructor(context: CanvasRenderingContext2D, options: IOptions) {
                this.context = context;
                this.options = options;

                this.radianAOB = (2 * Math.PI) / options.edge;
                this.calculateBorder();

                // this.initializeEvents(); // Removed as it does not exist
            }

            // Get the center point of the kaleidoscope.
            public getPointO() {
                return this.pointO;
            }

            // Get the random point in the pipe.

            public getRandomCoordinates() {
                const x =
                    getRandomInt(Math.max(this.pointO.x, this.pointB.x) - this.pointA.x) +
                    this.pointA.x;

                let minY;
                let maxY;
                let y;
                if (this.isSharp) {
                    minY = Math.max(
                        this.inclinationOB * x + this.interceptOB,
                        this.inclinationAB * x + this.interceptAB,
                    );
                    maxY = this.inclinationOA * x + this.interceptOA;
                } else {
                    minY = this.inclinationAB * x + this.interceptAB;
                    maxY = Math.min(
                        this.inclinationOA * x + this.interceptOA,
                        this.inclinationOB * x + this.interceptOB,
                    );
                }
                y = getRandomInt(maxY - minY) + minY;

                return { x, y };
            }


            // Return whether the particle is in the pipe.
            public isIn(particle: Particle) {
                let retval = true;
                const x = particle.x;
                const y = particle.y;
                const size = particle.size * 2; // Oversized

                if (this.isSharp) {
                    const minY = Math.max(
                        this.inclinationOB * x + this.interceptOB,
                        this.inclinationAB * x + this.interceptAB,
                    );
                    const maxY = this.inclinationOA * x + this.interceptOA;
                    if (y - size > maxY || y + size < minY) {
                        retval = false;
                    }
                } else {
                    const minY = this.inclinationAB * x + this.interceptAB;
                    const maxY = Math.min(
                        this.inclinationOA * x + this.interceptOA,
                        this.inclinationOB * x + this.interceptOB,
                    );
                    if (y - size > maxY || y + size < minY) {
                        retval = false;
                    }
                }

                return retval;
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

            // destroy the object.
            public destroy() {
                window.removeEventListener('mousemove', this.listenerMousemove);
            }

            // Calculate the formula for the border.
            private calculateBorder() {
                const canvas: HTMLCanvasElement = document.querySelector(
                    this.options.selector,
                );
                this.pointO.x = canvas.offsetParent
                    ? canvas.offsetParent.clientWidth / 2
                    : canvas.clientWidth / 2;
                if (canvas.offsetParent && canvas.offsetParent.nodeName === 'BODY') {
                    this.pointO.y = window.innerHeight / 2;
                } else {
                    this.pointO.y = canvas.offsetParent
                        ? canvas.offsetParent.clientHeight / 2
                        : canvas.clientHeight / 2;
                }
                const diagonal = Math.sqrt(this.pointO.x ** 2 + this.pointO.y ** 2);
                const radius = diagonal / Math.cos(this.radianAOB / 2);
                this.pointA = {
                    x: (1 - radius / diagonal) * this.pointO.x,
                    y: (1 - radius / diagonal) * this.pointO.y,
                };
                this.pointB = rotate(
                    this.pointA.x,
                    this.pointA.y,
                    this.pointO.x,
                    this.pointO.y,
                    this.radianAOB,
                );

                const pointO = this.pointO;
                const pointA = this.pointA;
                const pointB = this.pointB;

                this.isSharp = pointB.x < this.pointO.x;
                this.inclinationOA = (pointA.y - pointO.y) / (pointA.x - pointO.x);
                this.interceptOA = pointO.y - this.inclinationOA * pointO.x;
                this.inclinationOB = (pointB.y - pointO.y) / (pointB.x - pointO.x);
                this.interceptOB = pointO.y - this.inclinationOB * pointO.x;
                this.inclinationAB = (pointB.y - pointA.y) / (pointB.x - pointA.x);
                this.interceptAB = pointA.y - this.inclinationAB * pointA.x;
            }
        }

        class Particle {
            public size: number = 0;
            public x: number = 0;
            public y: number = 0;

            private options: IOptions = null;
            private context: CanvasRenderingContext2D = null;
            private pipe: Pipe = null;

            private shape: string = null;
            private color: string = null;
            private opacity: number = 0;
            private v: number = 0;
            private radian: number = (2 * Math.PI) / (getRandomInt(6) + 1);
            private directionX: number = 0;
            private directionY: number = 0;

            constructor(
                context: CanvasRenderingContext2D,
                options: IOptions,
                pipe: Pipe,
            ) {
                this.context = context;
                this.options = options;
                this.pipe = pipe;

                this.shape = options.shapes[getRandomInt(options.shapes.length)];
                this.size =
                    getRandomInt(options.maxSize - options.minSize) + options.minSize;
                this.color = options.color[getRandomInt(options.color.length)];
                const p = pipe.getRandomCoordinates();
                this.x = p.x;
                this.y = p.y;
                this.v = (Math.random() + 0.5) * options.speed;
                this.directionX = pipe.directionX;
                this.directionY = pipe.directionY;

                this.initializeEvents();
            }

            public draw() {
                const context = this.context;
                context.save();
                context.fillStyle = this.color;
                switch (this.shape) {
                    case 'circle':
                        context.beginPath();
                        context.arc(this.x, this.y, this.size / 2, 0, 2 * Math.PI);
                        context.fill();
                        break;
                    case 'square':
                        context.fillRect(this.x - this.size / 2, this.y - this.size / 2, this.size, this.size);
                        break;
                }
                context.restore();
            }
        }

        class Plugin {
            private context: CanvasRenderingContext2D;
            private pipe: Pipe;
            private particles: Particle[];

            constructor(context: CanvasRenderingContext2D, options: any) {
                this.context = context;
                this.pipe = new Pipe(context, options);
                this.particles = Array.from({ length: options.quantity }, () => new Particle(context, options));
                this.animate();
            }

            private animate() {
                this.context.clearRect(0, 0, this.context.canvas.width, this.context.canvas.height);
                this.pipe.mirror(0, () => {
                    this.particles.forEach(particle => particle.draw());
                });
                requestAnimationFrame(() => this.animate());
            }
        }

        new Plugin(context, options);

    }, []);

    return (
        <canvas ref={canvasRef} style={{ width: '100%', height: '100%' }} />
    );
};

export default Kaleidoscope;
*/
