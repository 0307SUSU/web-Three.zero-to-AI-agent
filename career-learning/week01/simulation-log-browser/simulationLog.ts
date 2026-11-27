export type LogLevel = "info" | "debug" | "warning" | "error";

export type SimulationLog = {
  id: string;
  timestampMs: number;
  level: LogLevel;
  source: string;
  message: string;
};

export type SimulationLogFile = {
  version: 1;
  runId: string;
  logs: SimulationLog[];
};

type ParseSuccess = {
  ok: true;
  data: SimulationLogFile;
};

type ParseFailure = {
  ok: false;
  errors: string[];
};

export type ParseResult = ParseSuccess | ParseFailure;

function isRecord(value: unknown): value is Record<string, unknown> {
  return (
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value)
  );
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim() !== "";
}

function isSimulationLog(
  value: unknown,
  path: string,
  errors: string[],
): value is SimulationLog {
  if (!isRecord(value)) {
    errors.push(`${path} 必须是对象`);
    return false;
  }

  let valid = true;

  const id = value.id;
  if (!isNonEmptyString(id)) {
    errors.push(`${path}.id 必须是非空字符串`);
    valid = false;
  }

  const timestampMs = value.timestampMs;
  if (
    typeof timestampMs !== "number" ||
    !Number.isFinite(timestampMs)
  ) {
    errors.push(`${path}.timestampMs 必须是有限数字`);
    valid = false;
  }

  const level = value.level;
  if (
    level !== "info" &&
    level !== "debug" &&
    level !== "warning" &&
    level !== "error"
  ) {
    errors.push(`${path}.level 必须是 info、debug、warning 或 error`);
    valid = false;
  }

  const source = value.source;
  if (!isNonEmptyString(source)) {
    errors.push(`${path}.source 必须是非空字符串`);
    valid = false;
  }

  const message = value.message;
  if (typeof message !== "string") {
    errors.push(`${path}.message 必须是字符串`);
    valid = false;
  }

  return valid;
}

export function validateSimulationLogFile(raw: unknown): ParseResult {
  const errors: string[] = [];

  if (!isRecord(raw)) {
    return {
      ok: false,
      errors: ["数据必须是对象"],
    };
  }

  if (raw.version !== 1) {
    errors.push("version 必须是 1");
  }

  const runId = raw.runId;
  if (!isNonEmptyString(runId)) {
    errors.push("runId 必须是非空字符串");
  }

  const rawLogs = raw.logs;
  if (!Array.isArray(rawLogs)) {
    errors.push("logs 必须是数组");
    return {
      ok: false,
      errors,
    };
  }

  const logCandidates: unknown[] = rawLogs;
  const validLogs: SimulationLog[] = [];

  for (const [index, candidate] of logCandidates.entries()) {
    const path = `logs[${index}]`;

    if (isSimulationLog(candidate, path, errors)) {
      validLogs.push(candidate);
    }
  }

  if (errors.length > 0) {
    return {
      ok: false,
      errors,
    };
  }

  return {
    ok: true,
    data: {
      version: 1,
      runId,
      logs: validLogs,
    },
  };
}
