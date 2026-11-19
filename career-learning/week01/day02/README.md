# 第 1 周第 2 天：事件循环与异步请求

日期：2026-11-19

预计用时：90–120 分钟。

## 今日规则

- 先推理，再运行代码；
- 不使用 AI 或资料判断输出顺序；
- 不满足于只说“同步先执行”，要讲清后续顺序；
- 每个结论都要说明原因；
- 第 2 天未重新验收通过前，不开始第 3 天。

## 任务一：判断输出顺序

不要运行，先写出输出顺序：

```ts
console.log("A");

setTimeout(() => console.log("B"), 0);

Promise.resolve().then(() => console.log("C"));

queueMicrotask(() => console.log("D"));

console.log("E");
```

回答时必须说明：

1. 哪些代码属于当前同步任务；
2. `Promise.then` 和 `queueMicrotask` 进入哪个队列；
3. 定时器回调什么时候执行；
4. 为什么微任务全部完成后才执行下一个宏任务。

## 任务二：请求取消

```ts
useEffect(() => {
  let cancelled = false;

  fetch(`/api/search?q=${query}`)
    .then((response) => response.json())
    .then((data) => {
      if (!cancelled) {
        setResults(data);
      }
    });

  return () => {
    cancelled = true;
  };
}, [query]);
```

回答：

1. `cancelled` 防止了什么错误？
2. 它是否会真正停止网络请求？
3. `AbortController` 解决什么问题？
4. 当前代码还缺少哪些错误处理？

## 验收

- 正确给出输出顺序；
- 不混淆微任务和宏任务；
- 能解释旧请求覆盖新结果的问题；
- 能区分“忽略结果”和“取消请求”；
- 能说出非 2xx 响应和网络错误需要处理。

## 完成后记录

- 实际用时：
- 第一次答案：`A、E、C、D、B`，微任务、宏任务顺序判断正确
- 修正内容：`cancelled` 只阻止旧结果写入状态，不暂停代码或停止请求；`AbortController.abort()` 才主动取消请求
- 仍不确定的知识：需要亲手实现一次完整的 `fetch + AbortController` React 请求

## 验收结果

- 事件循环顺序：通过
- 微任务和宏任务区分：重新验收通过
- 旧请求覆盖新结果：概念回答部分通过
- `cancelled` 与 `AbortController`：概念仍需重新验收
- 错误状态处理：尚未完成独立实现和验证

## 重新验收要求

必须不查资料完成：

1. 说明宏任务和微任务分别由什么来源产生；
2. 判断 `Promise.then`、`queueMicrotask`、`setTimeout` 和 `await` 后续代码分别属于哪一类执行时机；
3. 解释 Promise 执行器为什么同步执行；
4. 给出一段包含多个微任务和多个宏任务的正确顺序；
5. 区分“忽略旧结果”和“主动取消请求”。

事件循环重新验收记录：

- `1、4、6、3、5、2` 顺序正确；
- 能说明 `2` 是宏任务；
- 能说明 `3` 和 `5` 是微任务；
- 能说明同步代码结束后先清空微任务队列；
- 能说明微任务遵循先进先出。

## 任务二未通过原因

- 尚未独立写出 `fetch + AbortController`；
- 曾把 `catch` 中的 `signal.aborted` 判断误认为阻止旧结果写入；
- 没有实际验证 `abort()` 发出后请求如何结束；
- 尚未独立说明 `response.ok`、网络错误、JSON 错误和主动取消的处理位置；
- 没有完成“实现 + 解释 + 验证”三项验收。

### 原理重新验收

- `fetch` 只需要观察取消状态，不应获得整个控制器的取消权限：通过；
- 不监听 `signal` 的自定义异步函数不会因为 `abort()` 自动停止：通过；
- 能说明异步函数缺少对取消状态的监听：通过。

原理验收通过，但任务二仍未完成。下一步必须从设计结构和 API 类型开始，独立实现请求代码，并解释三个关键位置。

### 代码提交检查

提交文件：`fetchreq.ts`

最终状态：通过学习验收。

第四次提交已经正确完成：

- `useEffect` 位于自定义 Hook 中；
- 每次 effect 创建独立 `AbortController`；
- 使用 `encodeURIComponent(query)`；
- 把 `controller.signal` 传给 `fetch`；
- 检查 `response.ok`；
- 取消时不会写入结果；
- loading 已放入 `finally`；
- 网络错误、JSON 错误和 HTTP 错误都会结束 loading；
- 在清理函数中调用 `controller.abort()`；
- 返回 `results`、`error`、`loading`。

最终修正：

- 非 `Error` 的 `unknown` 已统一转换为 `Error`；
- 请求取消、HTTP 错误、JSON 错误和 loading 路径已通过代码检查。

已接受：

- `useState<unknown>(null)` 和 `useState<Error | null>(null)` 已明确状态类型；
- 新请求开始时已调用 `setError(null)`；
- `if (!controller.signal.aborted) return setResults(data)` 的取消语义正确，不再因写法风格阻塞；
- `home/about` 作为无后端练习的占位地址可以保留，但正式项目必须替换成真实 API。

验证范围：

- `demo:day02` 已验证成功请求、HTTP 500 和取消慢请求；
- `demo:abort` 已验证取消信号、事件和一次性状态；
- 当前学习目录没有 React 运行时，因此该 Hook 尚未进行真实 React 挂载测试；
- 真实 React 集成将在个人项目阶段完成。

### 请求基础概念

- `encodeURIComponent`：把查询参数值编码成安全的 URL 片段；
- `setResults`：`useState` 返回的状态更新函数，不会自动存在；
- `setError`：错误状态更新函数，也不会自动存在；
- `void request()`：明确表示调用异步函数但不等待 Promise；
- loading：使用单独的布尔状态表示请求是否进行中。

状态：第 2 天已完成，可以开始第 3 天。
