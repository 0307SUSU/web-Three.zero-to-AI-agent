# Web Three to AI Agent

这是一个用于前端工程师向 AI 应用全栈方向转型的个人学习仓库。

仓库记录学习计划、知识复习、练习代码、测试和阶段性复盘。内容只使用公开资料、合成数据和独立练习，不包含公司源码、内部 topic、业务数据或敏感配置。

## 文档说明

| 文档 | 用途 |
|---|---|
| `AI_APPLICATION_ENGINEER_TRANSITION_PLAN_2026-11-16.md` | 24 周转型计划、能力标准、阶段任务、求职策略和动态调整规则 |
| `AI_APPLICATION_ENGINEER_TRANSITION_PLAN_2026-11-16.pdf` | 转型计划的便携阅读版本 |
| `复习文档.md` | 全仓库唯一的复习文档，持续记录知识、代码、测试、错误和面试表达 |
| `能力问题分析.md` | 记录能力缺口、错误习惯、根因、纠正动作和复发状态 |
| `career-learning/README.md` | 练习区状态、运行命令和学习进度 |
| `career-learning/week01/` | 第 1 周的任务说明、实现和测试 |

不创建每日独立复习文件，已掌握和未掌握的知识统一维护在 `复习文档.md` 中。

## 当前进度

| 任务 | 状态 |
|---|---|
| 第 1 天：有效轨迹点、函数与测试 | 已完成 |
| 第 2 天任务一：事件循环与宏微任务 | 已完成 |
| 第 2 天任务二：请求取消、loading 与错误处理 | 已完成学习验收 |
| 第 3 天：TypeScript 数据建模与转换 | 进行中 |

第 2 天的学习内容包括：

- 同步代码、微任务和宏任务的执行顺序；
- Promise 回调与 `async/await` 的恢复时机；
- 使用 `AbortController` 和 `AbortSignal` 取消 `fetch`；
- 区分“忽略旧结果”和“主动取消请求”；
- 处理 HTTP、网络、JSON 和取消错误；
- 在 `finally` 中正确结束 loading；
- 将 `catch` 中的 `unknown` 转换为安全的 `Error`。

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

演示使用本地 HTTP 服务和 Node.js 内置 `fetch`，不访问公司系统或外部业务数据。

## 目录结构

```text
.
├── AI_APPLICATION_ENGINEER_TRANSITION_PLAN_2026-11-16.md
├── AI_APPLICATION_ENGINEER_TRANSITION_PLAN_2026-11-16.pdf
├── README.md
├── 复习文档.md
├── 能力问题分析.md
└── career-learning
    ├── README.md
    ├── package.json
    └── week01
        ├── day01
        ├── day02
        └── day03
```

## 学习目标

目标是在持续补齐 JavaScript、TypeScript、React、Node.js、数据库和 AI 应用工程能力后，能够独立交付包含前端、后端、RAG、工具调用、测试和部署的完整项目。

求职方向以杭州的 AI 应用全栈、数据智能和自有产品研发团队为主，不以外包或驻场交付为目标。
