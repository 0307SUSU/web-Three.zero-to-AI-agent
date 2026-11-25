import assert from "node:assert/strict";
import test from "node:test";

import {
  validateSimulationLogFile,
  type SimulationLogFile,
} from "./simulationLog.ts";

test("accepts a valid simulation log file", () => {
  const input: SimulationLogFile = {
    version: 1,
    runId: "run-001",
    logs: [
      {
        id: "log-001",
        timestampMs: 1000,
        level: "info",
        source: "planner",
        message: "Route planning started",
      },
      {
        id: "log-002",
        timestampMs: 1120,
        level: "warning",
        source: "localization",
        message: "Position confidence dropped",
      },
    ],
  };

  const actual = validateSimulationLogFile(input);

  assert.equal(actual.ok, true);
  if (actual.ok) {
    assert.deepEqual(actual.data, input);
  }
});

test("accepts an empty logs array", () => {
  const input: SimulationLogFile = {
    version: 1,
    runId: "run-empty",
    logs: [],
  };

  const actual = validateSimulationLogFile(input);

  assert.deepEqual(actual, {
    ok: true,
    data: input,
  });
});

test("rejects a non-object root value", () => {
  const actual = validateSimulationLogFile(null);

  assert.deepEqual(actual, {
    ok: false,
    errors: ["数据必须是对象"],
  });
});

test("reports invalid top-level fields together", () => {
  const actual = validateSimulationLogFile({
    version: 2,
    runId: "   ",
    logs: "not-an-array",
  });

  assert.deepEqual(actual, {
    ok: false,
    errors: [
      "version 必须是 1",
      "runId 必须是非空字符串",
      "logs 必须是数组",
    ],
  });
});

test("rejects a log that is not an object", () => {
  const actual = validateSimulationLogFile({
    version: 1,
    runId: "run-invalid-log",
    logs: [null],
  });

  assert.deepEqual(actual, {
    ok: false,
    errors: ["logs[0] 必须是对象"],
  });
});

test("reports all invalid fields of one log", () => {
  const actual = validateSimulationLogFile({
    version: 1,
    runId: "run-invalid-fields",
    logs: [
      {
        id: "   ",
        timestampMs: Number.NaN,
        level: "success",
        source: "",
        message: 42,
      },
    ],
  });

  assert.deepEqual(actual, {
    ok: false,
    errors: [
      "logs[0].id 必须是非空字符串",
      "logs[0].timestampMs 必须是有限数字",
      "logs[0].level 必须是 info、debug、warning 或 error",
      "logs[0].source 必须是非空字符串",
      "logs[0].message 必须是字符串",
    ],
  });
});

test("rejects non-finite timestamps", () => {
  const actual = validateSimulationLogFile({
    version: 1,
    runId: "run-infinite-time",
    logs: [
      {
        id: "log-infinity",
        timestampMs: Number.POSITIVE_INFINITY,
        level: "info",
        source: "planner",
        message: "Invalid timestamp",
      },
    ],
  });

  assert.deepEqual(actual, {
    ok: false,
    errors: ["logs[0].timestampMs 必须是有限数字"],
  });
});

test("allows an empty message string", () => {
  const input: SimulationLogFile = {
    version: 1,
    runId: "run-empty-message",
    logs: [
      {
        id: "log-empty-message",
        timestampMs: 0,
        level: "debug",
        source: "test",
        message: "",
      },
    ],
  };

  const actual = validateSimulationLogFile(input);

  assert.deepEqual(actual, {
    ok: true,
    data: input,
  });
});

test("returns errors for a mixed valid and invalid log list", () => {
  const actual = validateSimulationLogFile({
    version: 1,
    runId: "run-mixed",
    logs: [
      {
        id: "log-valid",
        timestampMs: 100,
        level: "info",
        source: "planner",
        message: "Valid",
      },
      {
        id: "log-invalid",
        timestampMs: 200,
        level: "fatal",
        source: "planner",
        message: "Invalid level",
      },
    ],
  });

  assert.deepEqual(actual, {
    ok: false,
    errors: [
      "logs[1].level 必须是 info、debug、warning 或 error",
    ],
  });
});
