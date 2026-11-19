function wait(ms: number, signal: AbortSignal): Promise<string> {
  return new Promise((resolve, reject) => {
    if (signal.aborted) {
      reject(signal.reason);
      return;
    }

    const onAbort = () => {
      clearTimeout(timer);
      reject(signal.reason);
    };

    const timer = setTimeout(() => {
      signal.removeEventListener("abort", onAbort);
      resolve("等待完成");
    }, ms);

    signal.addEventListener("abort", onAbort, { once: true });
  });
}

const controller = new AbortController();
const { signal } = controller;

console.log("创建控制器后，signal.aborted：", signal.aborted);

signal.addEventListener(
  "abort",
  () => {
    console.log("signal 收到了 abort 事件");
    console.log("signal.aborted：", signal.aborted);
  },
  { once: true },
);

const pendingWait = wait(500, signal);

setTimeout(() => {
  console.log("调用 controller.abort()");
  controller.abort();
}, 50);

try {
  await pendingWait;
  console.log("等待正常完成");
} catch (error) {
  console.log("等待被取消：", error instanceof Error ? error.name : String(error));
}

try {
  await wait(10, signal);
} catch (error) {
  console.log(
    "复用已取消的 signal 会立即失败：",
    error instanceof Error ? error.name : String(error),
  );
}
