import {useEffect,useState} from "react";

function useFetch(query: string){

    const [results,setResults] = useState<unknown>(null);
    const [error,setError] = useState<null | Error>(null);
    const [loading,setLoading] = useState<boolean>(false);

useEffect(()=>{
    // 每次查询创建独立的AbortController
    const controller = new AbortController();
    // 定义异步函数，避免立即执行
    const request =async ()=>{
        try{
            setLoading(true);
            setError(null);
            // 发送请求
            const response = await fetch(`home/about?q=${encodeURIComponent(query)}`,{
                // 传递取消信号signal
                signal: controller.signal
            });
             // 检查请求响应是否ok
            if (!response.ok){
                throw new Error(`失败：${response.status}`)
            }
            // 解析响应数据
            const data = await response.json();
            if (!controller.signal.aborted) return setResults(data);
        }catch (error){
            // 如果请求被取消，直接返回
            if (controller.signal.aborted) return;
            // 设置错误状态
            setError(error instanceof Error ?error : new Error(String(error)));
        }finally{
            if (!controller.signal.aborted) {
                setLoading(false);
            }
        }
    };
    // 立即执行异步函数
    void request();
    return ()=>{
        // 取消请求
        controller.abort();
    }

},[query])
return {results,error,loading};
}