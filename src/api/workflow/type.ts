export interface CreateWorkflowBo {
    title: string;
    description?: string;
}

export interface RunWorkflowBo<T> {
    workflowId: string;
    inputs: NodeIOData<T>[]
}

export interface NodeIOData<T> {
    fromNodeId?: string;
    name: string;
    content: {
        label: string;
        type: number;
        value: T
    }
}

export interface WorkflowBo {
    workflowId: string;
    nodes: any;
    edges: any
}

export interface WorkflowResponse {
    runId: string;
    workflowId: string;
    status: number;
    nodeId: string;
    duration: number;
    error?: string;
    inputs: any;
    outputs: any;
    output?: string;
}

export type WorkflowStreamEvent<T = any> = {
  event?: string
  data: T
}

export type RunWorkflowOptions<T = any> = {
  onMessage?: (event: WorkflowStreamEvent<T>) => void
  onError?: (err: any) => void
  signal?: AbortSignal
}


