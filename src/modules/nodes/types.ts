import type { ComponentType } from 'react'

export const DEFAULT_START_ID = "START";
export const DEFAULT_END_ID = "END";

export enum BuilderNode {
  START = 'start', // 开始节点
  END = 'end', // 结束节点
  USER_INPUT = 'user-input', // 用户输入
  LLM_OUTPUT = 'llm-output', // 大模型输出
  PROMPT_SELECTOR = 'prompt-selector', // 提示词选择器
  CONDITIONAL_PATH = 'conditional-path', // 分支判断节点
}

export type BuilderNodeType = `${BuilderNode}`


export interface VariableDescription {
  name: string;
  value: string;
}
export interface RegisterNodeMetadata<T = Record<string, any>> {
  type: BuilderNodeType; // 节点类型
  node: ComponentType<any>; // 实际渲染的组件
  detail: {
    icon: string; // 图标
    title: string; // 名称
    description: string; // 描述
  };
  connection: {
    inputs: number; // 输入端口数量
    outputs: number; // 输出端口数量
  };
  requiredVariable: VariableDescription[], // 节点运行所需的变量
  available?: boolean; // 是否可用
  defaultData?: T; // 默认数据
  propertyPanel?: ComponentType<any>; // 面板组件
}

export interface BaseNodeData<T> extends Record<string, any> {
  deletable?: boolean;
  inputConfig: {
    userInputs: NodeIOData[], // 节点输入变量
    refInputs: NodeParamRefData[] // 节点引用变量
  },
  nodeConfig: T, // 节点配置
  nodeOutput: NodeIOData[] // 节点输出数据
}

export interface NodeIOData {
  id?: string;
  type: number;
  name: string;
  label: string;
  required: boolean;
}

export interface NodeParamRefData {
  nodeId: string;
  nodeParamName: string;
  name: string;
}


export const InputTypeOptions = [
  {
    label: "文本",
    icon: 'i-mynaui:type-text',
    value: 1
  },
  {
    label: '数字',
    icon: 'i-mynaui:math',
    value: 2
  },
  {
    label: '复选框',
    icon: 'i-mynaui:check-square',
    value: 3
  }
]

export const InputTypeEnum = {
  TEXT: 1,
  NUMBER: 2,
  BOOLEAN: 3
}

export type InputType = "text" | "number" | "boolean" | "none"

export const GetInputType = (value: number) => {
  return InputTypeOptions.find(item => item.value === value) || {
    label: '未知类型',
    icon: 'i-mynaui:dot',
    value: 0
  }
}