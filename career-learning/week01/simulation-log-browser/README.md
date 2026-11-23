# 个人仿真日志浏览器

日期：2026-11-23

## 目标

使用完全自造的合成 JSON 构建一个仿真日志浏览器的数据层，然后逐步进入 React 界面。

不使用公司源码、内部 topic、真实业务数据或公司截图。

## 分阶段任务

### 阶段 1：数据契约与解析

实现：

- `SimulationLogFile` 数据类型；
- `SimulationLog` 数据类型；
- `LogLevel` 联合类型；
- 将 `unknown` 数据解析为合法 `SimulationLogFile`；
- 收集并返回可读的校验错误；
- 按关键字搜索日志。

### 阶段 2：React 界面

实现：

- 读取或粘贴 JSON；
- 展示校验错误；
- 日志列表；
- 关键字搜索；
- level 筛选；
- 空结果和空文件状态。

### 阶段 3：验证与复盘

- 为解析和搜索编写测试；
- 覆盖正常、空数据、字段缺失、非法 level、非有限时间戳和搜索无结果；
- 人工执行样例；
- 更新复习文档和能力问题分析。

## 数据格式

示例文件：`sampleLogs.json`

顶层结构：

```ts
{
  version: 1;
  runId: string;
  logs: SimulationLog[];
}
```

单条日志：

```ts
{
  id: string;
  timestampMs: number;
  level: "debug" | "info" | "warning" | "error";
  source: string;
  message: string;
}
```

## 阶段 1 规则

- `version` 必须为 `1`；
- `runId` 必须是非空字符串；
- `logs` 必须是数组；
- `id` 必须是非空字符串；
- `timestampMs` 必须是有限数字；
- `level` 只能是四种合法状态；
- `source` 必须是非空字符串；
- `message` 必须是字符串；
- 校验失败时返回全部可识别的错误；
- 搜索不区分大小写，匹配 `id`、`source` 或 `message`。

## 阶段 1 验收

- 能用 TypeScript 表达数据契约；
- 解析函数输入为 `unknown`，不能假设数据天然合法；
- 返回结果使用可区分成功/失败的联合类型；
- 非法数据不会伪装成成功；
- 能解释为什么网络或文件数据必须校验。
