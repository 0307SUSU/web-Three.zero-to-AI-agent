import http from "node:http";

function listen(server: http.Server): Promise<void> {
  return new Promise((resolve, reject) => {
    server.once("error", reject);
    server.listen(0, "127.0.0.1", () => {
      server.off("error", reject);
      resolve();
    });
  });
}

function close(server: http.Server): Promise<void> {
  return new Promise((resolve) => {
    server.close(() => resolve());
  });
}

const server = http.createServer((request, response) => {
  if (request.url === "/ok") {
    response.statusCode = 200;
    response.setHeader("content-type", "application/json");
    response.end(JSON.stringify({ message: "request succeeded" }));
    return;
  }

  if (request.url === "/fail") {
    response.statusCode = 500;
    response.setHeader("content-type", "application/json");
    response.end(JSON.stringify({ message: "server failed" }));
    return;
  }

  if (request.url === "/slow") {
    const timer = setTimeout(() => {
      response.statusCode = 200;
      response.end("slow response");
    }, 500);

    request.once("close", () => clearTimeout(timer));
    return;
  }

  response.statusCode = 404;
  response.end("not found");
});

await listen(server);

const address = server.address();
if (address == undefined || typeof address === "string") {
  await close(server);
  throw new Error("无法获取本地测试服务器地址");
}

const baseUrl = `http://127.0.0.1:${address.port}`;

try {
  console.log("1. 成功请求");
  const successResponse = await fetch(`${baseUrl}/ok`);
  console.log("HTTP 状态：", successResponse.status);
  console.log("response.ok：", successResponse.ok);
  console.log("JSON：", await successResponse.json());

  console.log("\n2. HTTP 500 不会自动进入 catch");
  const failedResponse = await fetch(`${baseUrl}/fail`);
  console.log("HTTP 状态：", failedResponse.status);
  console.log("response.ok：", failedResponse.ok);
  console.log("仍可读取响应体：", await failedResponse.json());

  console.log("\n3. 使用 AbortController 取消慢请求");
  const controller = new AbortController();
  setTimeout(() => controller.abort(), 50);

  try {
    await fetch(`${baseUrl}/slow`, { signal: controller.signal });
    console.log("请求没有取消");
  } catch (error) {
    console.log("请求已取消");
    console.log("signal.aborted：", controller.signal.aborted);
    console.log("错误名称：", error instanceof Error ? error.name : String(error));
  }
} finally {
  await close(server);
}
