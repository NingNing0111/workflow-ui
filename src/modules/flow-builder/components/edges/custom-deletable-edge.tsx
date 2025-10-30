import type { EdgeProps } from '@xyflow/react'
import {
  BaseEdge,
  EdgeLabelRenderer,
  getBezierPath,
  useReactFlow,
} from '@xyflow/react'

export default function CustomDeletableEdge(props: EdgeProps) {
  const {
    id,
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
    style = {},
    markerEnd,
  } = props

  const { setEdges } = useReactFlow()

  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  })

  return (
    <>
      {/* 使用 BaseEdge 可以完全自定义边样式 */}
      <BaseEdge
        id={id}
        path={edgePath}
        style={{
          stroke: '#00b5ad',         // 青色箭头
          strokeWidth: 1.5,
          strokeDasharray: '6 4',    // 虚线
          ...style,
        }}
        markerEnd="url(#arrowhead)" // 添加箭头
      />

      {/* 定义箭头形状 */}
      <svg>
        <defs>
          <marker
            id="arrowhead"
            markerWidth="10"
            markerHeight="7"
            refX="9"
            refY="3.5"
            orient="auto"
            markerUnits="strokeWidth"
          >
            <path d="M0,0 L10,3.5 L0,7 Z" fill="#00b5ad" />
          </marker>
        </defs>
      </svg>

      {/* 保留原来的 label 渲染器，可恢复删除按钮 */}
      <EdgeLabelRenderer>
        <>q</>
        {/* 这里可以放删除按钮等 */}
        {/* 
        <button
          type="button"
          className="group pointer-events-auto absolute size-5 flex items-center justify-center rounded-full bg-dark-500 text-red-300 transition-colors transition-shadow hover:(bg-dark-200 ring-1 ring-dark-100)"
          style={{
            transform: `translate(${labelX}px, ${labelY}px) translate(-50%, -50%)`,
          }}
          onClick={() => setEdges(edges => edges.filter(edge => edge.id !== id))}
        >
          <div className="i-maki:cross size-3 transition group-hover:(scale-80 text-red-50)" />
        </button>
        */}
      </EdgeLabelRenderer>
    </>
  )
}
