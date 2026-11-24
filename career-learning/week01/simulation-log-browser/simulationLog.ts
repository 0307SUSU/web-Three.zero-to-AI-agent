// TODO: 先定义数据契约，再实现解析和搜索。
// 数据示例见 sampleLogs.json。

export type LogLevel = "info" | "debug" | "warning" | "error"
export type SimulationLog = {
    id: string;
    timestampMs: number;
    level: LogLevel;
    source: string;
    message: string;
}
export type SimulationLogFile = {
    version: 1;
    runId: string;
    logs: SimulationLog[];
}

type ParseSuccess = {
    ok: true;
    data: SimulationLogFile;
};
type ParseFailure = {
    ok: false;
    errors: string[];
};
export type ParseResult = ParseSuccess | ParseFailure;

function isRecord (value: unknown): value is Record<string, unknown>{
    return(
        typeof value === "object" &&
        value !== null &&
        !Array.isArray(value)
    )
}

export function validateSimulationLogFile(raw: unknown): ParseResult {
    /**
     * 1. 检查输入是否是非空普通对象
2. 创建 errors 数组
3. 检查 version
4. 检查 runId
5. 检查 logs 是否为数组
6. 如果 logs 不是数组，后续不能继续遍历
7. 如果 logs 是数组，逐条检查每个日志
8. 检查日志是否为对象
9. 检查 id
10. 检查 timestampMs
11. 检查 level
12. 检查 source
13. 检查 message
14. 根据 errors 是否为空返回失败或成功
15. 成功时把原始数据视为已校验的 SimulationLogFile
     */
    const errors: string[] = [];
    if(!isRecord(raw)){
        return {
            ok: false,
            errors: ["数据必须是对象"]
        };
    }
    const version = raw.version;
    if (version !== 1) {
        errors.push("version 必须是 1");
    }
    const runId = raw.runId;
    if (typeof runId !== "string" || runId.trim() === "") {
        errors.push("runId 必须是字符串,且不能为空");
    }
    const logs = raw.logs;
    if (!Array.isArray(logs)) {
        errors.push("logs 必须是数组");
        return {
            ok: false,
            errors
        }
    }
    for (const [index, log] of logs.entries()) {
        if (!isRecord(log)) {
            errors.push(`logs[${index}]必须是对象`);
            continue;
        }
    }
    throw Error("Not implemented");
}