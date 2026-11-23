// 第 3 天验收：summarizeFrames 的测试，请自己写
/**
 * 输入：frames
输出：
 {
      total:frames.length,
      usable: 0,
      warnings: 0,
      failures: 0
    }
核心规则：
    1. total：输出frames的长度，获取字段frames.length，frames长度是0时，total为0
    2. usable: 统计frames中position不为undefined、x和y都是有限数字、且x与y不同时为0的帧的个数，操作方法：通过判断条件过滤掉不符合条件的项
    3. warnings: 统计frames中status为warning的个数，操作放法：通过判断status是否为warning
    4. failures: 统计frames中status为failed的个数，操作放法：通过判断status是否为failed
边界情况：
    1. frames为空时，total为0，跳过其余几项的计算，其余几项都为默认值0
    2. frames中position为undefined时，该帧不计入usable，其他有效帧照常统计
算法或数据结构：
    1. 期初我选用的是map方法，其余方法我没想到，或者对其余方法不熟悉，我需要尽可能的知道更多方法的实现方式，并了解其优缺点可以判断那种事最优解，这个需要你来指导
 */


import assert from "node:assert/strict";
import test from "node:test";

import {
  summarizeFrames,
  type TelemetryFrame,
} from "./summarizeFrames.ts";

test("returns a zero summary for an empty array", () => {
  const frames: TelemetryFrame[] = [];

  const actual = summarizeFrames(frames);
  const expected = {
    total: 0,
    usable: 0,
    warnings: 0,
    failures: 0,
  };

  assert.deepEqual(actual, expected);
});

test("test total count",()=>{
    // Arrange:准备输入
    const frames: TelemetryFrame[] = [
        {
            id: "invalid-x",
            timestamp: 1,
            position: { x: Number.NaN, y: 2 },
            status: "ok"
        }
    ];

    // Act: 调用函数
    const actual = summarizeFrames(frames);
    // Assert: 检查结果
    const expected = {
        total: 1,
        usable: 0,
        warnings: 0,
        failures: 0,
      };
    assert.deepEqual(actual, expected);
})

test("test warnings count",()=>{
    // Arrange:准备输入
    const frames: TelemetryFrame[] = [
        {
            id: "invalid-x",
            timestamp: 1,
            position: { x: Number.NaN, y: 2 },
            status: "warning"
        },
        {
            id: "invalid-x",
            timestamp: 1,
            position: { x: Number.NaN, y: 2 },
            status: "ok"
        }
    ];

    // Act: 调用函数
    const actual = summarizeFrames(frames);
    // Assert: 检查结果
    const expected = {
        total: 2,
        usable: 0,
        warnings: 1,
        failures: 0,
      };
    assert.deepEqual(actual, expected);
})

test("test failed count",()=>{
    // Arrange:准备输入
    const frames: TelemetryFrame[] = [
        {
            id: "invalid-x",
            timestamp: 1,
            position: { x: Number.NaN, y: 2 },
            status: "ok"
        },
        {
            id: "invalid-x",
            timestamp: 1,
            position: { x: Number.NaN, y: 2 },
            status: "failed"
        }
    ];

    // Act: 调用函数
    const actual = summarizeFrames(frames);
    // Assert: 检查结果
    const expected = {
        total: 2,
        usable: 0,
        warnings: 0,
        failures: 1,
      };
    assert.deepEqual(actual, expected);
})

test("非有限数字测试",()=>{
    // Arrange:准备输入
    const frames: TelemetryFrame[] = [
        {
            id: "invalid-x",
            timestamp: 1,
            position: { x: 1, y: 2 },
            status: "ok"
        },
        {
            id: "invalid-x",
            timestamp: 1,
            position: { x: Number.NaN, y: 2 },
            status: "failed"
        }
    ];

    // Act: 调用函数
    const actual = summarizeFrames(frames);
    // Assert: 检查结果
    const expected = {
        total: 2,
        usable: 1,
        warnings: 0,
        failures: 1,
      };
    assert.deepEqual(actual, expected);
})



test("原点测试",()=>{
    // Arrange:准备输入
    const frames: TelemetryFrame[] = [
        {
            id: "invalid-x",
            timestamp: 1,
            position: { x: 0, y: 0 },
            status: "ok"
        },
        {
            id: "invalid-x",
            timestamp: 1,
            position: { x: Number.NaN, y: 2 },
            status: "ok"
        }
    ];

    // Act: 调用函数
    const actual = summarizeFrames(frames);
    // Assert: 检查结果
    const expected = {
        total: 2,
        usable: 0,
        warnings: 0,
        failures: 0,
      };
    assert.deepEqual(actual, expected);
})



test("混合数据测试",()=>{
    // Arrange:准备输入
    const frames: TelemetryFrame[] = [
        {
            id: "invalid-x",
            timestamp: 1,
            position: { x: 0, y: 0 },
            status: "ok"
        },
        {
            id: "invalid-x",
            timestamp: 1,
            position: { x: 1, y: 2 },
            status: "ok"
        },
        {
            id: "invalid-x",
            timestamp: 1,
            position: { x: 0, y: Number.NaN },
            status: "warning"
        },
        {
            id: "invalid-x",
            timestamp: 1,
            position: { x: Number.NaN, y: 2 },
            status: "failed"
        },
        {
            id: "invalid-x",
            timestamp: 1,
            position: { x: 3, y: 5 },
            status: "ok"
        },
        {
            id: "invalid-x",
            timestamp: 1,
            position: { x: Number.NEGATIVE_INFINITY, y: 2 },
            status: "warning"
        },
        {
            id: "invalid-x",
            timestamp: 1,
            position: undefined,
            status: "warning"
        },
        {
            id: "invalid-x",
            timestamp: 1,
            position: { x: 6, y: 0 },
            status: "ok"
        },
        {
            id: "invalid-x",
            timestamp: 1,
            position: { x: 0, y: 6 },
            status: "ok"
        },
        {
            id: "invalid-x",
            timestamp: 1,
            position: { x: Number.POSITIVE_INFINITY, y: 0 },
            status: "ok"
        },
    ];

    // Act: 调用函数
    const actual = summarizeFrames(frames);
    // Assert: 检查结果
    const expected = {
        total: 10,
        usable: 4,
        warnings: 3,
        failures: 1,
      };
    assert.deepEqual(actual, expected);
})