# Web Three to AI Agent

这是一个用于前端工程师向具身智能 / 机器人数据可视化与数据平台方向转型的个人学习仓库，AI 应用全栈作为第二目标和技能底座。

仓库记录学习计划、知识复习、练习代码、测试和阶段性复盘。内容只使用公开资料、合成数据和独立练习，不包含公司源码、内部 topic、业务数据或敏感配置。

## 文档说明

| 文档 | 用途 |
|---|---|
| `AI_APPLICATION_ENGINEER_TRANSITION_PLAN_2026-11-16.md` | 24 周转型计划、能力标准、阶段任务、求职策略和动态调整规则 |
| `复习文档.md` | 全仓库唯一的复习文档，持续记录知识、代码、测试、错误和面试表达 |
| `能力问题分析.md` | 记录能力缺口、错误习惯、根因、纠正动作和复发状态 |
| `知识体系.md` | 最终目标驱动的 24 周能力时间线、掌握状态、缺失能力和阶段自检入口 |
| `协作协议.md` | 双机与两套 Codex 的同步、验收和 Git 协作规则 |
| `方向与求职.md` | 具身智能数据可视化方向、目标公司与薪资策略 |
| `交接记录.md` | 每次学习结束的跨机交接状态 |
| `career-learning/README.md` | 练习区状态、运行命令和学习进度 |
| `career-learning/week01/` | 第 1 周的任务说明、实现和测试 |

不创建每日独立复习文件，已掌握和未掌握的知识统一维护在 `复习文档.md` 中。

## 当前进度

| 任务 | 状态 |
|---|---|
| 第 1 天：有效轨迹点、函数与测试 | 已完成 |
| 第 2 天任务一：事件循环与宏微任务 | 已完成 |
| 第 2 天任务二：请求取消、loading 与错误处理 | 已完成学习验收 |
| 第 3 天：TypeScript 数据建模与转换 | 已完成 |
| 第 1 周剩余任务：个人仿真日志浏览器 | 进行中 |

当前任务只使用自造合成 JSON，先完成类型约束（数据契约）、`unknown` 运行时校验和搜索，再进入 React 列表与空状态。

当前下一步：完成每条日志的字段校验，构造合法日志列表并返回 `ParseResult`。

已掌握内容：

- 同步代码、微任务和宏任务的执行顺序；
- Promise 回调与 `async/await` 的恢复时机；
- 使用 `AbortController` 和 `AbortSignal` 取消 `fetch`；
- 区分“忽略旧结果”和“主动取消请求”；
- 处理 HTTP、网络、JSON 和取消错误；
- 在 `finally` 中正确结束 loading；
- 将 `catch` 中的 `unknown` 转换为安全的 `Error`。
- TypeScript 类型与字符串联合类型；
- `for...of`、`reduce`、`forEach`、`map`、`filter` 的适用语义；
- 从业务规则推导测试用例；
- 使用 `assert.deepEqual` 比较对象结果。

## 双机同步

- 每次开工：`git pull`，先读 `协作协议.md` 和 `交接记录.md`。
- 每次收工：更新计划状态与文档，提交并 `git push`。

## 学习规则

- 先独立尝试，再使用 AI 提供提示、解释或审查；
- AI 生成的代码必须能够解释、修改和验证；
- 当天所有任务分别验收通过后，才能开始下一天；
- 允许犯错，但必须记录、纠正并重新验收；
- 不以学习时长或课程进度代替实际掌握；
- 根据实际表现动态调整后续难度、顺序和周期。

## 运行练习

进入练习目录：

```bash
cd career-learning
```

第 1 天测试：

```bash
npm run test:day01
```

第 2 天请求与取消演示：

```bash
npm run demo:day02
npm run demo:abort
```

第 3 天测试与方法练习：

```bash
npm run test:day03
npm run practice:day03
```

演示使用本地 HTTP 服务和 Node.js 内置 `fetch`，不访问公司系统或外部业务数据。

## 目录结构

```text
.
├── AI_APPLICATION_ENGINEER_TRANSITION_PLAN_2026-11-16.md
├── README.md
├── 协作协议.md
├── 交接记录.md
├── 方向与求职.md
├── 复习文档.md
├── 能力问题分析.md
├── 知识体系.md
└── career-learning
    ├── README.md
    ├── package.json
    └── week01
        ├── day01
        ├── day02
        ├── day03
        └── simulation-log-browser
```

## 学习目标

目标是在持续补齐 JavaScript、TypeScript、React、Node.js、数据库和 AI 应用工程能力后，能够独立交付包含前端、后端、RAG、工具调用、测试和部署的完整项目。

求职第一目标是杭州的具身智能 / 机器人数据可视化与数据平台岗位，第二目标是 AI 应用全栈、数据智能和自有产品研发团队；不以外包或驻场交付为目标。
