export type Point = { x: number; y: number };

export function countUsablePoints(points: Array<Point | undefined>): number {
  if (points.length === 0) return 0;
  return points.filter((point)=>{
    if(point === undefined) return false;
    if(!Number.isFinite(point.x) || !Number.isFinite(point.y)) return false;
    if (point.x === 0 && point.y === 0) return false;
    return true;
  }).length;
}

