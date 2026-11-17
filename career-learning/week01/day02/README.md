# 第 1 周第 2 天：事件循环与异步请求

日期：2026-11-17

预计用时：90–120 分钟。

## 今日规则

- 先推理，再运行代码；
- 不使用 AI 或资料判断输出顺序；
- 不满足于只说“同步先执行”，要讲清后续顺序；
- 每个结论都要说明原因。

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
- 第一次答案：
- 修正内容：
- 仍不确定的知识：
