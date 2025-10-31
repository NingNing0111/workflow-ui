import type { Node, NodeProps } from '@xyflow/react'
import type { BaseNodeData, RegisterNodeMetadata } from '~/modules/nodes/types'
import { Position, useReactFlow } from '@xyflow/react'
import { nanoid } from 'nanoid'
import { produce } from 'immer'
import { memo, useCallback, useMemo, useState } from 'react'
import { cn } from '~@/utils/cn'
import CustomHandle from '~/modules/flow-builder/components/handles/custom-handle'
import { useDeleteNode } from '~/modules/flow-builder/hooks/use-delete-node'
import { BuilderNode } from '~/modules/nodes/types'
import { getNodeDetail } from '~/modules/nodes/utils'
import { useApplicationState } from '~/stores/application-state'
import LLMOutputNodePropertyPanel from '~/modules/sidebar/panels/node-properties/property-panels/llm-output-panel'

const NODE_TYPE = BuilderNode.LLM_OUTPUT

export interface LLMOutputNodeData extends BaseNodeData {
  stream: boolean
}

type LLMOutputNodeProps = NodeProps<Node<LLMOutputNodeData, typeof NODE_TYPE>>

export function LLMOutputNode({ id, isConnectable, selected, data }: LLMOutputNodeProps) {
  const meta = useMemo(() => getNodeDetail(NODE_TYPE), [])
  const { setNodes } = useReactFlow()
  const [showNodePropertiesOf] = useApplicationState(s => [s.actions.sidebar.showNodePropertiesOf])
  const [targetHandleId] = useState<string>(nanoid())
  const [sourceHandleId] = useState<string>(nanoid())

  const deleteNode = useDeleteNode()

  const showNodeProperties = useCallback(() => {
    showNodePropertiesOf({ id, type: NODE_TYPE })
  }, [id, showNodePropertiesOf])


  return (
    <>
      <div
        data-selected={selected}
        className={cn(
          'overflow-clip rounded-xl border border-dark-200 bg-dark-300/50 shadow-sm backdrop-blur-xl transition divide-y divide-dark-200',
          'data-[selected=true]:(border-teal-600 ring-1 ring-teal-600/50)'
        )}
        onDoubleClick={showNodeProperties}
      >
        {/* 顶部标题栏 */}
        <div className="relative bg-dark-300/50">
          <div className="absolute inset-0">
            <div className="absolute h-full w-3/5 from-teal-900/20 to-transparent bg-gradient-to-r" />
          </div>

          <div className="relative h-9 flex items-center justify-between gap-x-4 px-1 py-0.5">
            <div className="flex grow items-center pl-1">
              <div className="size-6 flex items-center justify-center">
                <div className={cn(meta.icon, 'size-4')} />
              </div>
              <div className="ml-1 text-xs font-medium leading-none uppercase tracking-wide op-80">
                {meta.title}
              </div>
            </div>

            <div className="flex shrink-0 items-center gap-x-0.5 pr-0.5">
              <button
                title="查看节点"
                type="button"
                className="size-7 flex items-center justify-center rounded-lg transition hover:bg-dark-100 active:bg-dark-400/50"
                onClick={showNodeProperties}
              >
                <div className="i-mynaui:eye size-4 text-light-900/70" />
              </button>
              <button
                title="编辑参数"
                type="button"
                className="size-7 flex items-center justify-center rounded-lg transition hover:bg-dark-100 active:bg-dark-400/50"
                onClick={showNodeProperties}
              >
                <div className="i-mynaui:cog size-4" />
              </button>
              <button
                title="删除节点"
                type="button"
                className="size-7 flex items-center justify-center rounded-lg text-red-400 transition hover:bg-dark-100 active:bg-dark-400/50"
                onClick={() => deleteNode(id)}
              >
                <div className="i-mynaui:trash size-4" />
              </button>
            </div>
          </div>
        </div>

        {/* 节点内容 */}
        <div className="p-3 text-xs space-y-2">


          {/* 输出模式 */}
          <div className="flex flex-col gap-1">
            <label className="text-dark-50 text-[11px] uppercase">输出模式</label>
            <div
              className={cn(
                'inline-flex items-center justify-center rounded-md px-2 py-1 text-[11px] font-medium w-fit',
                data.stream ? 'bg-teal-900/30 text-teal-300' : 'bg-dark-100/50 text-light-900/50'
              )}
            >
              {data.stream ? '流式' : '阻塞'}
            </div>
          </div>

        </div>

        {/* 底部 ID 显示 */}
        <div className="bg-dark-300/30 px-4 py-2 text-xs text-light-900/50">
          Node: <span className="text-light-900/60 font-semibold">#{id}</span>
        </div>
      </div>

      {/* 端口 */}
      <CustomHandle
        type="target"
        id={targetHandleId}
        position={Position.Left}
        isConnectable={isConnectable}
      />
      <CustomHandle
        type="source"
        id={sourceHandleId}
        position={Position.Right}
        isConnectable={isConnectable}
      />
    </>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const metadata: RegisterNodeMetadata<LLMOutputNodeData> = {
  type: NODE_TYPE,
  node: memo(LLMOutputNode),
  detail: {
    icon: 'i-mynaui:corner-down-right',
    title: '大模型输出',
    description: '大模型的输出配置',
  },
  connection: {
    inputs: 1,
    outputs: 1,
  },
  defaultData: {
    stream: true
  },
  propertyPanel: LLMOutputNodePropertyPanel,
  requiredVariable: [],
}
