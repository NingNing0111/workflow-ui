import { useReactFlow } from "@xyflow/react"
import { useEffect, useRef } from "react"

type UseSelectNodeOptions = {
  append?: boolean      // 是否多选
  fitView?: boolean     // 是否自动居中
  duration?: number
}

export function useSelectNode(
  nodeId?: string,
  options?: UseSelectNodeOptions
) {
  const { setNodes, fitView } = useReactFlow()
  const prevNodeIdRef = useRef<string>()

  const {
    append = false,
    fitView: autoFit = false,
    duration = 300,
  } = options ?? {}

  useEffect(() => {
    if (!nodeId) return
    if (prevNodeIdRef.current === nodeId) return

    prevNodeIdRef.current = nodeId

    setNodes(nodes =>
      nodes.map(node => {
        if (node.id === nodeId) {
          return { ...node, selected: true }
        }
        return append ? node : { ...node, selected: false }
      })
    )

    if (autoFit) {
      fitView({
        nodes: [{ id: nodeId }],
        duration,
        padding: 0.4,
      })
    }
  }, [nodeId, append, autoFit, duration, setNodes, fitView])
}
