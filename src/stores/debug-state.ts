import { create } from "zustand";
import type { NodeIOData } from "~/api/workflow/type";

export type DebugRunState = {
  runId: string
  workflowId?: string

  status: 'idle' | 'running' | 'finished'

  /** 执行顺序（严格递增） */
  nodeOrder: string[]

  /** 当前播放到的 index（用于 UI） */
  cursor: number

  /** 当前节点（派生，不直接由 SSE 写） */
  currentNodeId?: string

  nodes: Record<string, {
    nodeId: string
    duration?: number
    inputs?: NodeIOData<any>[]
    outputs?: NodeIOData<any>[]
  }>

  streamOutput: string
  startTime?: number
  endTime?: number
}

export type DebugSSEEvent = {
  runId: string
  workflowId?: string
  mode?: 'DEBUG'
  error?: string;

  status: -1 | 1 | 2 | 3

  nodeId?: string
  duration?: number

  inputs?: NodeIOData<any>[]
  outputs?: NodeIOData<any>[]

  output?: string // 流式 token
}

export type DebugStore = {
  runs: Record<string, DebugRunState>

  onSSE: (event: DebugSSEEvent) => void

  resetRun: (runId: string) => void
  getLatestRun: () => DebugRunState | undefined
  playRun: (runId: string, interval: number) => void;
}

export const useDebugStore = create<DebugStore>((set, get) => ({
  runs: {},

  onSSE: (event) => {
    const { runId } = event
    const prev = get().runs[runId]

    set(state => {
      const run: DebugRunState = prev ?? {
        runId,
        workflowId: event.workflowId,
        status: 'idle',
        nodeOrder: [],
        cursor: -1,
        nodes: {},
        streamOutput: '',
      }

      if (event.status === 1) {
        run.status = 'running'
        run.startTime = Date.now()
      }

      if (event.status === 2 && event.nodeId) {
        if (!run.nodes[event.nodeId]) {
          run.nodeOrder.push(event.nodeId)
        }

        run.nodes[event.nodeId] = {
          nodeId: event.nodeId,
          duration: event.duration,
          inputs: event.inputs,
          outputs: event.outputs,
        }
      }

      if(event.status === -1) {
        run.streamOutput += event.error;
      }

      if (typeof event.output === 'string') {
        run.streamOutput += event.output
      }

      if (event.status === 3) {
        run.status = 'finished'
        run.endTime = Date.now()
      }

      return {
        runs: {
          ...state.runs,
          [runId]: { ...run },
        },
      }
    })
  },

  resetRun: (runId) => {
    set(state => {
      const next = { ...state.runs }
      delete next[runId]
      return { runs: next }
    })
  },

  /** ✅ 最近执行的 run */
  getLatestRun: () => {
    const runs = Object.values(get().runs)
    if (runs.length === 0) return undefined

    return runs.reduce((latest, curr) => {
      const latestTime =
        latest.endTime ?? latest.startTime ?? 0
      const currTime =
        curr.endTime ?? curr.startTime ?? 0

      return currTime > latestTime ? curr : latest
    })
  },
  playRun: (runId: string, interval = 300) => {
    const timer = setInterval(() => {
      set(state => {
        const run = state.runs[runId]
        if (!run) return state

        if (run.cursor >= run.nodeOrder.length - 1) {
          clearInterval(timer)
          return state
        }

        const nextCursor = run.cursor + 1
        return {
          runs: {
            ...state.runs,
            [runId]: {
              ...run,
              cursor: nextCursor,
              currentNodeId: run.nodeOrder[nextCursor],
            },
          },
        }
      })
    }, interval)
  }

}))


