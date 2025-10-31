import type { Edge, Node } from '@xyflow/react'
import type { BuilderNodeType } from '~/modules/nodes/types'
import { useReactFlow } from '@xyflow/react'
import { useCallback, useState } from 'react'
import { BuilderNode } from '~/modules/nodes/types'
import { trackFlowBuilderValidate } from '~/utils/ga4'

/**
 * 校验逻辑：
 * - Start 节点至少要有 1 条输出边
 * - End 节点至少要有 1 条输入边
 * - 所有节点不能完全孤立（即没有入边也没有出边）
 */
export function useFlowValidator(onValidate?: (isValid: boolean) => void): [boolean, () => void] {
  const [isValidating, setIsValidating] = useState(false)
  const { getNodes, getEdges } = useReactFlow()

  const validate = useCallback(async () => {
    trackFlowBuilderValidate()
    setIsValidating(true)

    // 模拟 loading 效果
    await new Promise(resolve => setTimeout(resolve, 300))

    const nodes = getNodes()
    const edges = getEdges()

    let isStartConnected = false
    let isEndConnected = false
    const nodesWithEmptyTarget: Node[] = []

    for (const node of nodes) {
      // 直接过滤，不使用 getConnectedEdges
      const outgoingEdges = edges.filter(e => e.source === node.id)
      const incomingEdges = edges.filter(e => e.target === node.id)

      // 检查开始节点是否连出
      if (node.type === BuilderNode.START) {
        if (outgoingEdges.length >= 1) {
          isStartConnected = true
        }
      }

      // 检查结束节点是否连入
      if (node.type === BuilderNode.END) {
        if (incomingEdges.length >= 1) {
          isEndConnected = true
        }
      }

      // 判断是否孤立（无入无出）
      const isLone = outgoingEdges.length === 0 && incomingEdges.length === 0
      if (isLone) {
        nodesWithEmptyTarget.push(node)
      }

      // 调试日志（可删）
      console.debug(
        `[FlowValidator] node=${node.type} id=${node.id}`,
        { outgoing: outgoingEdges.length, incoming: incomingEdges.length }
      )
    }

    const hasAnyLoneNode = nodesWithEmptyTarget.length > 0
    const isFlowComplete = isStartConnected && isEndConnected && !hasAnyLoneNode

    if (!isFlowComplete) {
      console.warn('[FlowValidator] 校验失败:', {
        isStartConnected,
        isEndConnected,
        hasAnyLoneNode,
        loneNodes: nodesWithEmptyTarget.map(n => ({ id: n.id, type: n.type })),
      })
    } else {
      console.log('[FlowValidator] ✅ 流程完整')
    }

    onValidate?.(isFlowComplete)
    setIsValidating(false)
  }, [getNodes, getEdges, onValidate])

  return [isValidating, validate]
}
