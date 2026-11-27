# summarizeFrames 实现演进

> 目的：保留有复盘价值的错误实现与思考过程，用于回顾与面试复盘。
> 注意：历史代码不是当前实现，不要直接复制运行。
> 当前实现见 `summarizeFrames.ts`，测试见 `summarizeFrames.test.ts`。

## 阶段 1：map(...)[0] 聚合（错误）

重写前的实现用 `map` 遍历帧、在回调里修改外部 `summary`，最后取 `[0]`：

```ts
// 旧实现（已删除，仅存档）
return frames.map((obj) => {
  if (obj.status === "warning") summary.warnings += 1;
  if (obj.status === "failed") summary.failures += 1;
  if (
    obj.position != undefined &&
    Number.isFinite(obj.position.x) &&
    Number.isFinite(obj.position.y) &&
    !(obj.position.x === 0 && obj.position.y === 0)
  ) summary.usable += 1;
  return summary;
})[0];
```

当时的想法（待补，用自己的话写）：

为什么错（待补，用自己的话写）：

## 阶段 2：三元表达式尝试（弯路）

曾在循环内尝试用三元表达式原地累加：

```ts
// summary.usable = ((position != undefined) && Number.isFinite(x) && Number.isFinite(y) &&
// !(x === 0 && y === 0)) ? summary.usable += 1 : summary.usable;
// summary.warnings = obj.status === "warning" ? summary.warnings += 1 : summary.warnings;
// summary.failures = obj.status === "failed" ? summary.failures += 1 : summary.failures;
```

当时为什么放弃（待补，用自己的话写）：

## 阶段 3：for...of 一趟循环（当前实现）

判断数据关系为"多对一聚合"，改用 `for...of` 一趟循环累加三个计数器，不修改外部结构。

对应能力问题：K-001（混淆数组方法返回形状）、M-001（未先判断数据转换形状）。
