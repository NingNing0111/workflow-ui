import type { ComponentType } from 'react'

export const DEFAULT_START_ID = "__START__";
export const DEFAULT_END_ID = "__END__";

export enum BuilderNode {
  START = 'start', // 开始节点
  END = 'end', // 结束节点
  USER_INPUT = 'user-input', // 用户输入
  LLM_OUTPUT = 'llm-output', // 程序输出
  SEARCH = 'search', // 检索节点
  PROMPT = 'prompt', // 提示词节点
  LLM = 'llm', // 大模型节点
  TEXT_MESSAGE = 'text-message', 
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

export interface BaseNodeData extends Record<string, any> {
  deletable?: boolean;
}
