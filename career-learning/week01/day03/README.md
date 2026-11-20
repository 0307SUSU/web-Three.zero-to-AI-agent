# 第 1 周第 3 天：TypeScript 数据建模与转换

日期：2026-11-20

> 状态：进行中。第 2 天已完成验收。

预计用时：90–120 分钟。

## 学习目标

- 使用接口或类型描述业务数据；
- 使用联合类型表示有限状态；
- 使用类型收窄读取不同状态下的数据；
- 将一组原始数据转换成汇总结果；
- 先写测试验证规则，再完成实现。

## 数据模型

```ts
type FrameStatus = "ok" | "warning" | "failed";

type TelemetryFrame = {
  id: string;
  timestamp: number;
  position: { x: number; y: number } | undefined;
  status: FrameStatus;
};
```

## 任务

实现一个 `summarizeFrames` 函数，返回：

```ts
{
  total: number;
  usable: number;
  warnings: number;
  failures: number;
}
```

规则：

- 所有帧都计入 `total`；
- `status` 为 `warning` 时计入 `warnings`；
- `status` 为 `failed` 时计入 `failures`；
- `position` 存在且坐标有限时计入 `usable`；
- `(0, 0)` 不计入 `usable`。

## 验收

- 正确使用 `FrameStatus` 联合类型；
- 正确使用 `TelemetryFrame` 类型；
- 至少写六个测试；
- 测试覆盖正常、空数组、异常坐标和混合状态；
- 能解释返回结果的每个字段。
