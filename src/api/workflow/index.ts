import request, { formatToken } from "~/api/request";
import { type WorkflowResponse, type CreateWorkflowBo, type RunWorkflowBo, type WorkflowBo, type RunWorkflowOptions } from "~/api/workflow/type";

// 创建工作流
export const createWorkflow = (data: CreateWorkflowBo) => {
  return request.post<string>('/workflow/create', data);
}

// 执行工作流
export const updateWorkflow = (data: WorkflowBo) => {
  return request.post<boolean>('/workflow/update', data);
}

// 执行工作流 会流式返回数据
export const runWorkflow = async <T = any>(
  data: any,
  options: RunWorkflowOptions<T>
) => {
  const token = import.meta.env.VITE_APP_TEST_JWT;
  const baseUrl = import.meta.env.VITE_APP_BASE_API;
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    // "Accept": "text/event-stream",
    "ClientID": import.meta.env.VITE_GLOB_APP_CLIENT_ID,
    "Accept-Language": "zh_CN",
    "Content-Language": "zh_CN",
  }

  const auth = formatToken(token as string)
  if (auth) {
    headers.Authorization = auth
  }
  const res = await fetch(baseUrl + "/workflow/run", {
    method: "POST",
    headers,
    body: JSON.stringify(data),
    signal: options.signal,
  })

  if (!res.ok || !res.body) {
    throw new Error("Workflow stream failed")
  }

  const reader = res.body.getReader()
  const decoder = new TextDecoder("utf-8")

  let buffer = ""

  try {
    while (true) {
      const { value, done } = await reader.read()
      if (done) break

      buffer += decoder.decode(value, { stream: true })

      // 一个 event 以空行分隔
      const chunks = buffer.split("\n\n")
      buffer = chunks.pop() || ""

      for (const chunk of chunks) {
        const event = parseSSEChunk<T>(chunk)
        if (event) {
          options.onMessage?.(event)
        }
      }
    }
  } catch (err) {
    options.onError?.(err)
  }
}


export const debugWorkflow = async <T = any>(
  data: any,
  options: RunWorkflowOptions<T>
) => {
  const token = import.meta.env.VITE_APP_TEST_JWT;
  const baseUrl = import.meta.env.VITE_APP_BASE_API;
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    // "Accept": "text/event-stream",
    "ClientID": import.meta.env.VITE_GLOB_APP_CLIENT_ID,
    "Accept-Language": "zh_CN",
    "Content-Language": "zh_CN",
  }

  const auth = formatToken(token as string)
  if (auth) {
    headers.Authorization = auth
  }
  const res = await fetch(baseUrl + "/workflow/debug", {
    method: "POST",
    headers,
    body: JSON.stringify(data),
    signal: options.signal,
  })

  if (!res.ok || !res.body) {
    throw new Error("Workflow stream failed")
  }

  const reader = res.body.getReader()
  const decoder = new TextDecoder("utf-8")

  let buffer = ""

  try {
    while (true) {
      const { value, done } = await reader.read()
      if (done) break

      buffer += decoder.decode(value, { stream: true })

      // 一个 event 以空行分隔
      const chunks = buffer.split("\n\n")
      buffer = chunks.pop() || ""

      for (const chunk of chunks) {
        const event = parseSSEChunk<T>(chunk)
        if (event) {
          options.onMessage?.(event)
        }
      }
    }
  } catch (err) {
    options.onError?.(err)
  }
}


function parseSSEChunk<T = any>(chunk: string): {
  event?: string
  data: T
} | null {
  let event: string | undefined
  let dataStr = ""

  const lines = chunk.split("\n")

  for (const line of lines) {
    if (line.startsWith("event:")) {
      event = line.slice(6).trim()
    } else if (line.startsWith("data:")) {
      dataStr += line.slice(5).trim()
    }
  }

  if (!dataStr) return null

  try {
    return {
      event,
      data: JSON.parse(dataStr),
    }
  } catch {
    return {
      event,
      data: dataStr as unknown as T,
    }
  }
}
