# 仿真日志校验器实现演进

> 目的：保留错误实现和重构过程，用于回顾、对比与面试复盘。  
> 注意：本文档中的历史代码不是当前实现，不要直接复制运行。

当前实现见 [`simulationLog.ts`](./simulationLog.ts)。  
测试见 [`simulationLog.test.ts`](./simulationLog.test.ts)。

---

## 阶段 0：空白实现

最初只定义了函数契约：

```ts
export function validateSimulationLogFile(
  raw: unknown,
): ParseResult {
  throw Error("Not implemented");
}
```

这个阶段确定了输入是 `unknown`、输出是 `ParseResult`，但还没有设计最终成功对象如何构造。

---

## 阶段 1：类型守卫和顶层校验

增加普通对象类型守卫：

```ts
function isRecord(
  value: unknown,
): value is Record<string, unknown> {
  return (
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value)
  );
}
```

随后逐步实现根对象、`version`、`runId`、`logs` 数组和单条日志对象检查。

这个方向是正确的。

---

## 阶段 2：循环内 `checkString`（错误抽象）

为了避免重复字符串检查，曾在每条日志循环内部定义：

```ts
function checkString(
  value: unknown,
  name: string,
  num: number = index,
) {
  if (
    typeof value !== "string" ||
    value.trim() === ""
  ) {
    errors.push(
      `logs[${num}].${name} 必须是字符串,且不能为空`,
    );
  }
}
```

调用：

```ts
checkString(id, "id");
checkString(source, "source");
checkString(message, "message");
```

### 错误

1. 函数定义在循环内部，会为每条日志创建一次函数；
2. `message` 规则只要求字符串，允许空字符串；
3. 不同字段规则被错误合并成一个 helper；
4. 调用方无法从 `checkString` 获得字段类型收窄。

### 修正

- 删除该 helper；
- `id`、`source` 使用非空字符串规则；
- `message` 只检查字符串类型；
- 最终改用业务类型守卫。

---

## 阶段 3：用 `errors.length` 判断日志合法

曾试图用错误数量判断当前日志是否合法：

```ts
const errorsBeforeLog = errors.length;

// 校验五个字段

if (errors.length === errorsBeforeLog) {
  validLogs.push({
    id,
    timestampMs,
    level,
    source,
    message,
  });
}
```

TypeScript 报错：

```text
Type 'unknown' is not assignable to type 'string'.
Type 'unknown' is not assignable to type 'number'.
Type 'unknown' is not assignable to type 'LogLevel'.
```

### 根因

```text
错误数组长度没有变化
```

不能证明：

```text
id 是 string
timestampMs 是 number
level 是 LogLevel
```

TypeScript 不理解数组长度和无关字段类型之间的业务因果。

### 核心教训

> 间接状态不能替代编译器所需的直接类型证明。

---

## 阶段 4：重复条件让编译通过

为了解决阶段 3 的错误，又重复写了一遍字段类型条件：

```ts
if (
  errors.length === errorsBeforeLog &&
  typeof id === "string" &&
  typeof timestampMs === "number" &&
  (
    level === "info" ||
    level === "debug" ||
    level === "warning" ||
    level === "error"
  ) &&
  typeof source === "string" &&
  typeof message === "string"
) {
  validLogs.push({
    id,
    timestampMs,
    level,
    source,
    message,
  });
}
```

这段代码可以编译，也能运行。

### 问题

- 同一业务规则写了两遍；
- 收集错误和构造对象的条件必须手动保持一致；
- 修改一个字段规则时容易只改一处；
- 这是维护风险，不是运行性能问题。

---

## 阶段 5：单个领域类型守卫

最终把单条日志规则集中到：

```ts
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
    errors.push(
      `${path}.level 必须是 info、debug、warning 或 error`,
    );
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
```

主循环：

```ts
for (const [index, candidate] of logCandidates.entries()) {
  const path = `logs[${index}]`;

  if (isSimulationLog(candidate, path, errors)) {
    validLogs.push(candidate);
  }
}
```

### 为什么采用这个方案

- 一个函数对应一个业务实体 `SimulationLog`；
- 运行时校验和类型收窄同时完成；
- 字段规则只写一次；
- 错误路径集中；
- 主校验函数保持简单；
- 没有引入通用 Schema 框架。

---

## 版本对比

| 版本 | 能编译 | 功能正确 | 主要问题 |
|---|---:|---:|---|
| 空白 `TODO` | 是 | 否 | 尚未实现 |
| 顶层校验 | 是 | 部分 | 单条字段未完成 |
| 循环内 `checkString` | 是 | 否 | 函数重复创建、`message` 规则错误 |
| `errors.length` 直接构造 | 否 | 否 | 间接现象不能证明字段类型 |
| 重复完整条件 | 是 | 是 | 规则重复、维护风险 |
| `isSimulationLog` 类型守卫 | 是 | 是 | 当前采用 |

---

## 回顾时重点比较

1. 为什么“错误数量没变”不能证明字段类型？
2. 为什么 `isRecord` 后字段仍然是 `unknown`？
3. 为什么 `checkString` 会把不同业务规则错误合并？
4. 为什么最终的 `isSimulationLog` 同时解决重复和类型收窄？
5. 为什么不必再拆四个通用 `isString` 辅助函数？
6. 为什么抽象前要先确认复用频率、业务语义和类型证明需求？

---

## 结论

这段实现演进说明：

```text
局部能编译
≠
整体设计正确

源码短
≠
可读性高

重复代码消除
≠
抽象一定合理
```

最终方案选择的是：

> 一个符合业务语义、同时完成运行时校验与类型证明的最小抽象。
