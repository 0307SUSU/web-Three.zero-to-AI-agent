import assert from "node:assert/strict";
import test from "node:test";

import {
  validateSimulationLogFile,
  searchLogs,
  type SimulationLogFile,
  type SimulationLog,
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


/**
 * searchLogs契约
 *
 *
 * 输入：
  logs: 日志数据
  query: 字符串
  level: level的规定值或者all

输出：
  新的 过滤后的新的数组对象

核心规则：
  1. query 先去首尾空格，并忽略大小写；
  2. query 为空或纯空格时，只按 level 筛选；
  3. query 非空时，匹配 id、source、message 是否包含该词；
  4. level 为 all 时不过滤；
  5. level 为具体值时只保留同 level 日志；
  6. query 和 level 必须同时满足；
  7. 返回新数组，不修改原数组。

边界情况：
  1. logs 为空数组 → 返回空数组；
  2. query 为空或纯空格 → 只应用 level；
  3. level 为 all → 不应用 level；
  4. query 无匹配 → 返回空数组；
  5. 所有日志都被 level 过滤 → 返回空数组；
  6. 输入日志完全合法 → 返回符合条件的所有日志。

算法或数据结构：
  使用一次 filter 遍历；
  每条日志用谓词检查 level 和 query；
  保留同时满足两个条件的元素。

不变量：
  1. 原 logs 数组不被修改；
  2. 输出顺序保持原数组相对顺序；
  3. 输出结果只包含原数组中的元素；
  4. 无日志时一定返回空数组，而不是 undefined 或 null。
 */


  const searchLogsSample: SimulationLog[] = [
    {
      id: "log-1",
      timestampMs: 1000,
      level: "info",
      source: "planner",
      message: "Route planning started",
    },
    {
      id: "log-2",
      timestampMs: 1120,
      level: "warning",
      source: "localization",
      message: "Position confidence dropped",
    },
    {
      id: "log-3",
      timestampMs: 1530,
      level: "error",
      source: "planner",
      message: "No valid route found",
    },
    {
      id: "log-4",
      timestampMs: 1680,
      level: "debug",
      source: "perception",
      message: "Detected 12 obstacles",
    },
  ];

test("filters logs by keyword", () => {
  const actual = searchLogs(
    searchLogsSample,
    "planner",
    "all",
  );

  assert.deepEqual(actual, [
    searchLogsSample[0],
    searchLogsSample[2],
  ]);
});

test("applies keyword and level together", () => {
  const actual = searchLogs(
    searchLogsSample,
    "route",
    "error",
  );

  assert.deepEqual(actual, [searchLogsSample[2]]);
});

test("filters only by level when query is empty", () => {
  const actual = searchLogs(
    searchLogsSample,
    "",
    "warning",
  );

  assert.deepEqual(actual, [searchLogsSample[1]]);
});

test("treats a whitespace query as empty", () => {
  const actual = searchLogs(
    searchLogsSample,
    "   ",
    "all",
  );

  assert.deepEqual(actual, searchLogsSample);
});

test("returns an empty array when nothing matches", () => {
  const actual = searchLogs(
    searchLogsSample,
    "camera",
    "all",
  );

  assert.deepEqual(actual, []);
});

test("returns an empty array for empty logs", () => {
  const actual = searchLogs([], "route", "all");

  assert.deepEqual(actual, []);
});

test("matches keywords case-insensitively", () => {
  const actual = searchLogs(
    searchLogsSample,
    "POSITION",
    "all",
  );

  assert.deepEqual(actual, [searchLogsSample[1]]);
});

test("does not mutate the input and preserves order", () => {
  const original = searchLogsSample.map((log) => ({ ...log }));

  const actual = searchLogs(
    searchLogsSample,
    "planner",
    "all",
  );

  assert.deepEqual(actual, [
    searchLogsSample[0],
    searchLogsSample[2],
  ]);
  assert.deepEqual(searchLogsSample, original);
  assert.notEqual(actual, searchLogsSample);
});
