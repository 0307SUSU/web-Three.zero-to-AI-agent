# 个人仿真日志浏览器

日期：2026-11-23

## 目标

使用完全自造的合成 JSON 构建一个仿真日志浏览器的数据层，然后逐步进入 React 界面。

不使用公司源码、内部 topic、真实业务数据或公司截图。

## 这个产品是做什么的

假设你拿到了一份仿真运行产生的日志文件：

```json
{
  "version": 1,
  "runId": "run-2026-11-23-001",
  "logs": [
    {
      "id": "log-001",
      "timestampMs": 1000,
      "level": "info",
      "source": "planner",
      "message": "Route planning started"
    }
  ]
}
```

文件本身只是一段 JSON。用户需要一个页面：

1. 读取或粘贴这份 JSON；
2. 检查数据结构是否正确；
3. 把日志按时间展示出来；
4. 搜索包含某个关键字的日志；
5. 按 level 筛选；
6. 在文件为空、没有搜索结果或 JSON 非法时看到明确提示。

它类似一个简化版的机器人运行日志查看器，但数据完全由自己构造。

## 用户操作流程

```text
选择示例文件 / 粘贴 JSON
→ 点击“加载”
→ 数据合法：显示日志列表
→ 数据非法：显示具体错误
→ 输入搜索关键字
→ 选择 level
→ 列表实时过滤
→ 没有匹配结果时显示空状态
```

## 完成后的界面示意

```text
┌──────────────────────────────────────────────────┐
│ 仿真日志浏览器                                   │
├──────────────────────────────────────────────────┤
│ [选择 JSON 文件]  [粘贴 JSON]  [加载示例]        │
│                                                  │
│ 运行：run-2026-11-23-001                         │
│ 总数：6   warning：1   error：1                  │
├──────────────────────────────────────────────────┤
│ 搜索：[ planner                ]                 │
│ Level：[ 全部 ▼ ]                                │
├──────────────────────────────────────────────────┤
│ 1.000s  INFO     planner      Route planning...  │
│ 1.120s  DEBUG    perception   Detected 12...     │
│ 1.250s  WARNING  localization Position conf...   │
│ 1.530s  ERROR    planner      No valid route...  │
└──────────────────────────────────────────────────┘
```

## 页面必须处理的四种状态

| 状态 | 页面表现 |
|---|---|
| 尚未加载文件 | 显示“请选择或粘贴 JSON” |
| 数据合法 | 显示运行信息、筛选控件和日志列表 |
| JSON 或字段非法 | 显示可理解的具体错误，不展示半成品列表 |
| 合法但没有匹配结果 | 显示“没有符合条件的日志” |

## 为什么先做数据层

外部文件、网络响应和用户粘贴的内容都应该视为 `unknown`。

仅写 TypeScript 类型不能保证运行时数据真的合法。例如 JSON 可能出现：

- `version` 不是 `1`；
- `logs` 不是数组；
- `timestampMs` 是字符串；
- `level` 是 `"success"`；
- 缺少 `message`。

因此必须先：

1. 定义合法数据格式；
2. 检查 `unknown`；
3. 只有校验成功后才交给 React 展示；
4. 用测试证明非法数据不会伪装成成功。

## JSON 文本与 JavaScript 对象

“JSON 对象”这个说法容易混淆。真正的 JSON 是文本，例如：

```ts
const jsonText = '{"version":1,"runId":"run-001","logs":[]}';
```

这时 `jsonText` 的类型是 `string`，需要：

```ts
const value: unknown = JSON.parse(jsonText);
```

但下面这些情况已经得到 JavaScript 对象，不能再次 `JSON.parse`：

- `fetch(...).then((response) => response.json())` 已经解析响应；
- `import sampleLogs from "./sampleLogs.json"` 由构建工具转换成对象；
- 测试或代码中直接写了对象字面量；
- 已经调用过一次 `JSON.parse` 并保存了结果。

例如：

```ts
const value = {
  version: 1,
  runId: "run-001",
  logs: [],
};
```

此时应直接把 `value` 当作 `unknown` 校验：

```ts
const result = validateSimulationLogFile(value);
```

如果对对象再次调用：

```ts
JSON.parse(value);
```

会发生运行时错误。

因此本任务区分两个入口：

```text
JSON 文本
→ parseSimulationLogText
→ JSON.parse + 校验

已经是 JavaScript 对象
→ validateSimulationLogFile
→ 直接校验
```

不要假设所有输入都是字符串，也不要在已经解析后重复解析。

## 为什么需要 ParseResult

从用户流程推导：

```text
用户加载 JSON
→ 数据合法：继续展示日志
→ 数据非法：向用户显示错误
```

因此校验函数的契约是：

```text
输入：unknown
输出：
  成功：合法的 SimulationLogFile
  失败：一组可读的错误
```

两个输出分支不能同时出现，因此使用可区分联合：

```ts
export type ParseResult =
  | {
      ok: true;
      data: SimulationLogFile;
    }
  | {
      ok: false;
      errors: string[];
    };
```

调用方通过 `ok` 分支：

```ts
if (result.ok) {
  // result.data 可用
} else {
  // result.errors 可用
}
```

当前项目规模下，一个 `ParseResult` 已经足够。单独的 `ParseSuccess` 和 `ParseFailure` 只是可读性上的可选拆分，并不是必须提前定义的固定三步。

## 类型和函数谁先写

定义类型不代表校验逻辑已经实现。可以先写函数签名，再留一个明确失败的空实现：

```ts
export function validateSimulationLogFile(
  value: unknown,
): ParseResult {
  throw new Error("TODO: validateSimulationLogFile");
}
```

这里已经确定的只是函数契约：

- 接收外部未知数据；
- 成功时返回合法文件；
- 失败时返回错误数组。

具体校验代码随后实现。

如果先写函数更容易理解，也可以先写伪代码：

```text
validateSimulationLogFile(value)
  如果 value 不是对象
    返回失败和错误信息
  如果 version 不等于 1
    记录错误
  如果 logs 不是数组
    记录错误
  如果存在错误
    返回失败结果
  返回成功结果和合法数据
```

从伪代码可以看出一定存在：

```text
成功结果
失败结果
```

然后再把它转换为 `ParseResult`。

两种顺序都合理：

- 契约优先：先写 `ParseResult` 和函数签名，再实现函数体；
- 伪代码优先：先描述成功/失败分支，再抽取出结果类型。

不能省略的是成功、失败分支和验收标准；类型名称本身不是目的。

## 分阶段任务

### 阶段 1：类型约束（数据契约）与运行时校验

实现：

- `SimulationLogFile` 数据类型；
- `SimulationLog` 数据类型；
- `LogLevel` 联合类型；
- 将 `unknown` 数据解析为合法 `SimulationLogFile`；
- 收集并返回可读的校验错误；
- 按关键字搜索日志。

阶段 1 完成后，先在终端看到解析和搜索结果，不涉及浏览器页面。

### 阶段 2：React 界面

实现：

- 读取或粘贴 JSON；
- 展示校验错误；
- 日志列表；
- 关键字搜索；
- level 筛选；
- 空结果和空文件状态。

阶段 2 完成后，在浏览器中实现上面的界面示意。

### 阶段 3：验证与复盘

- 为解析和搜索编写测试；
- 覆盖正常、空数据、字段缺失、非法 level、非有限时间戳和搜索无结果；
- 人工执行样例；
- 更新复习文档和能力问题分析。

## 本项目不包含

- 不连接真实仿真系统；
- 不解析公司日志；
- 不实现登录、数据库或后端；
- 不实现 Three.js 或 3D 场景；
- 不接入 AI、RAG 或 Agent。

这些能力分别在后端、AI 和具身可视化阶段学习。当前项目只解决“数据进入前端后，如何安全校验、转换、搜索和展示”。

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

## 当日进度

- [x] 定义 `LogLevel`；
- [x] 定义 `SimulationLog`；
- [x] 定义 `SimulationLogFile`；
- [x] 设计成功/失败联合结果；
- [x] 实现 `unknown` 运行时校验；
  - [x] 根对象类型守卫；
  - [x] `version`；
  - [x] `runId`；
  - [x] `logs` 数组检查；
  - [x] 单条日志对象守卫与索引错误；
  - [x] `id`、`timestampMs`、`level`、`source`、`message`；
  - [x] 构造合法日志列表并返回最终结果；
- [ ] 实现搜索；
- [x] 编写解析测试：9 个用例通过；
- [ ] 下一阶段编写搜索测试。

## 阶段 1 验收

- 能用 TypeScript 表达外部数据的类型约束（数据契约）；
- 解析函数输入为 `unknown`，不能假设数据天然合法；
- 返回结果使用可区分成功/失败的联合类型；
- 非法数据不会伪装成成功；
- 能解释为什么网络或文件数据必须校验。
