import { Vector3 } from "three";

function catmullRom(t: number, p0: number, p1: number, p2: number, p3: number) {
  const v0 = (p2 - p0) * 0.5;
  const v1 = (p3 - p1) * 0.5;
  const t2 = t * t;
  const t3 = t * t2;
  return (
    (2 * p1 - 2 * p2 + v0 + v1) * t3 +
    (-3 * p1 + 3 * p2 - 2 * v0 - v1) * t2 +
    v0 * t +
    p1
  );
}

export class Path3D {
  public length: number;
  private segmentLengths: number[];
  private segmentStart = new Vector3();

  constructor(
    public points: Vector3[],
    public smooth: boolean = true,
  ) {
    this.points = this.points.map((p) => p.clone());
    this.segmentLengths = [];
    let length = 0;
    let previous = points[0].clone();
    for (let i = 1; i < points.length; i++) {
      const point = points[i];
      const segmentLength = previous.distanceTo(point);
      this.segmentLengths.push(segmentLength);
      length += segmentLength;
      previous.copy(point);
    }
    this.length = length;
  }

  at(t: number, destination: Vector3) {
    const distance = t * this.length;
    let segmentStart = new Vector3().copy(this.points[0]);
    let previousDistance = 0;
    for (let i = 1; i < this.points.length; i++) {
      const segmentEnd = this.points[i];
      const segmentLength = this.segmentLengths[i - 1];
      const nextDistance = previousDistance + segmentLength;
      if (nextDistance >= distance) {
        const segmentT = (distance - previousDistance) / segmentLength;
        const p0 = this.points[Math.max(i - 2, 0)];
        const p3 = this.points[Math.min(i + 1, this.points.length - 1)];
        if (this.smooth) {
          destination.set(
            catmullRom(segmentT, p0.x, segmentStart.x, segmentEnd.x, p3.x),
            catmullRom(segmentT, p0.y, segmentStart.y, segmentEnd.y, p3.y),
            catmullRom(segmentT, p0.z, segmentStart.z, segmentEnd.z, p3.z),
          );
        } else {
          destination.copy(segmentStart).lerp(segmentEnd, segmentT);
        }
        return;
      }
      segmentStart.copy(segmentEnd);
      previousDistance = nextDistance;
    }
    destination.copy(segmentStart);
  }
}
