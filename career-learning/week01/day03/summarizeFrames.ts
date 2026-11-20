export type FrameStatus = "ok" | "warning" | "failed";

export type TelemetryFrame = {
  id: string;
  timestamp: number;
  position: { x: number; y: number } | undefined;
  status: FrameStatus;
};

export type FrameSummary = {
  total: number;
  usable: number;
  warnings: number;
  failures: number;
};

export function summarizeFrames(frames: readonly TelemetryFrame[]): FrameSummary {
    let summary = {
      total:frames.length,
      usable: 0,
      warnings: 0,
      failures: 0
    }
    if (frames.length >0){
    return frames.map((obj)=>{
      if (obj.status === "warning") summary.warnings += 1;
      if (obj.status === "failed") summary.failures += 1;
      if ((obj.position != undefined) && Number.isFinite(obj.position.x) && Number.isFinite(obj.position.y) &&
      !(obj.position.x === 0 && obj.position.y === 0)) summary.usable += 1;
      return summary
    })[0]
    }
    return summary
}
