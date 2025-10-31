import type { Node } from '@xyflow/react'

import type { BuilderNode, BuilderNodeType } from '~/modules/nodes/types'
import { nanoid } from 'nanoid'

import { NODES } from '~/modules/nodes'

export function getNodeDetail(nodeType: BuilderNodeType | string | undefined) {
  const node = NODES.find(node => node.type === nodeType)
  if (!node) { throw new Error(`Node type "${nodeType}" not found`) }

  return node.detail
}

export function createNodeData<T extends BuilderNodeType>(type: T, data: any) {
  return {
    id: nanoid(),
    type,
    data,
  }
}

export function createNodeDataWithId<T extends BuilderNodeType>(id: string, type: T, data: any) {
  return {
    id: id,
    type,
    data,
  }
}

export function createNodeWithDefaultId(id: string, type: BuilderNodeType, data?: Partial<Node>) {
  const defaultData = NODES.find(node => node.type === type)?.defaultData
  if (!defaultData) { throw new Error(`No default data found for node type "${type}"`) }
  return Object.assign(createNodeDataWithId(id, type, defaultData), data) as Node
}

export function createNodeWithDefaultData(type: BuilderNodeType, data?: Partial<Node>) {
  const defaultData = NODES.find(node => node.type === type)?.defaultData
  if (!defaultData) { throw new Error(`No default data found for node type "${type}"`) }
  return Object.assign(createNodeData(type, defaultData), data) as Node
}

export function createNodeWithData<T>(type: BuilderNode, data: T, node: Partial<Node> = {}) {
  return Object.assign(createNodeData(type, data), node) as Node
}
