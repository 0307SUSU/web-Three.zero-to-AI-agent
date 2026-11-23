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

  let summary: FrameSummary = {
      total:frames.length,
      usable: 0,
      warnings: 0,
      failures: 0
  }



    // return frames.map((obj)=>{
    //   if (obj.status === "warning") summary.warnings += 1;
    //   if (obj.status === "failed") summary.failures += 1;
    //   if ((obj.position != undefined) && Number.isFinite(obj.position.x) && Number.isFinite(obj.position.y) &&
    //   !(obj.position.x === 0 && obj.position.y === 0)) summary.usable += 1;
    //   return summary
    // })[0]



    for (const frame of frames){
      const position = frame.position;
      const status = frame.status;
      const x = position?.x;
      const y = position?.y;
      // summary.usable = ((position != undefined) && Number.isFinite(x) && Number.isFinite(y) &&
      // !(x === 0 && y === 0)) ? summary.usable += 1 : summary.usable;
      if ((position != undefined) && Number.isFinite(x) && Number.isFinite(y) &&
      !(x === 0 && y === 0)) summary.usable += 1;
      // summary.warnings = obj.status === "warning" ? summary.warnings += 1 : summary.warnings;
      // summary.failures = obj.status === "failed" ? summary.failures += 1 : summary.failures;
      if (status === "warning") summary.warnings += 1;
      if (status === "failed") summary.failures += 1;
    }

    return summary

}
