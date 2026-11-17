import assert from "node:assert/strict";
import test from "node:test";

import { countUsablePoints, type Point } from "./countUsablePoints.ts";

test("counts valid points", () => {
  const points: Array<Point | undefined> = [
    { x: 1, y: 2 },
    { x: -1, y: -2 },
    { x: 100, y: 200 },
  ];

  assert.equal(countUsablePoints(points), 3);
});

test("returns zero for an empty array", () => {
  assert.equal(countUsablePoints([]), 0);
});

test("returns zero when every point is undefined", () => {
  assert.equal(countUsablePoints([undefined, undefined]), 0);
});

test("ignores coordinates that are not finite numbers", () => {
  const points: Array<Point | undefined> = [
    { x: Number.NaN, y: 2 },
    { x: 1, y: Number.POSITIVE_INFINITY },
    { x: Number.NEGATIVE_INFINITY, y: 2 },
    { x: 5, y: 6 },
  ];

  assert.equal(countUsablePoints(points), 1);
});

test("ignores only the origin when a point has a zero coordinate", () => {
  const points: Array<Point | undefined> = [
    { x: 0, y: 0 },
    { x: 0, y: 5 },
    { x: 5, y: 0 },
  ];

  assert.equal(countUsablePoints(points), 2);
});

test("applies all rules to a mixed input", () => {
  const points: Array<Point | undefined> = [
    { x: 1, y: 2 },
    undefined,
    { x: Number.NaN, y: 2 },
    { x: 1, y: Number.POSITIVE_INFINITY },
    { x: 0, y: 0 },
    { x: 0, y: 5 },
    { x: 5, y: 0 },
    { x: -1, y: -2 },
  ];

  assert.equal(countUsablePoints(points), 4);
});


test("counts valid points beside undefined",()=>{
  const points: Array<Point | undefined> = [
    {x:1,y:2},
    undefined
  ];

  const actual = countUsablePoints(points);
  const expected = 1;
  assert.equal(actual, expected);
})