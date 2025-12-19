import { nanoid } from 'nanoid'

import { BuilderNode, DEFAULT_END_ID, DEFAULT_START_ID } from '~/modules/nodes/types'
import {  createNodeWithDefaultData, createNodeWithDefaultId } from '~/modules/nodes/utils'

const startNode = createNodeWithDefaultId(DEFAULT_START_ID,BuilderNode.START, { position: { x: 0, y: 267 } })
const questionClassifierNode = createNodeWithDefaultData(BuilderNode.QUESTION_CLASSIFIER, {position: {x:230, y:230}})
const llmOutputNode1 = createNodeWithDefaultData(BuilderNode.LLM_OUTPUT, { position: { x: 850, y: -67 } })
const userPromptNode = createNodeWithDefaultData(BuilderNode.PROMPT_SELECTOR, { position: { x: 550, y: 200 } })
const llmOutputNode2 = createNodeWithDefaultData(BuilderNode.LLM_OUTPUT, { position: { x: 850, y: -67 } })
const endNode = createNodeWithDefaultId(DEFAULT_END_ID,BuilderNode.END, { position: { x: 1500, y: -100 } })

const nodes = [
  startNode,
  questionClassifierNode,
  userPromptNode,
  llmOutputNode1,
  llmOutputNode2,
  endNode,
]

const edges = [
  { id: nanoid(), source: startNode.id, target: userPromptNode.id, type: 'deletable' },
  { id: nanoid(), source: userPromptNode.id, target: llmOutputNode1.id, type: 'deletable' },
  { id: nanoid(), source: llmOutputNode2.id, target: endNode.id, type: 'deletable' },
]

export {
  edges as defaultEdges,
  nodes as defaultNodes,
}
