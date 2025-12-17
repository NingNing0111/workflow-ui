import type { Node, NodeProps } from '@xyflow/react'
import type { BaseNodeData, NodeIOData, RegisterNodeMetadata } from '~/modules/nodes/types'
import { Position } from '@xyflow/react'
import { nanoid } from 'nanoid'

import { memo, useCallback, useMemo, useState } from 'react'
import { cn } from '~@/utils/cn'
import CustomHandle from '~/modules/flow-builder/components/handles/custom-handle'
import { BuilderNode } from '~/modules/nodes/types'

import { getNodeDetail } from '~/modules/nodes/utils'
import { useApplicationState } from '~/stores/application-state'
import StartPropertyPanel from '~/modules/sidebar/panels/node-properties/property-panels/start-property-panel'

export interface StartNodeData {
  userInputs: NodeIOData[]

}

const NODE_TYPE = BuilderNode.START

type StartNodeProps = NodeProps<Node<BaseNodeData<StartNodeData>, typeof NODE_TYPE>>

export function StartNode({ id, data, selected, isConnectable }: StartNodeProps) {
  const meta = useMemo(() => getNodeDetail(NODE_TYPE), [])
  const [showNodePropertiesOf] = useApplicationState(s => [s.actions.sidebar.showNodePropertiesOf])
  const [sourceHandleId] = useState<string>(nanoid())
  const showNodeProperties = useCallback(() => {
    showNodePropertiesOf({ id, type: NODE_TYPE })
  }, [id, showNodePropertiesOf])

  return (
    <>
      <div
        data-selected={selected}
        className="flex items-center border border-dark-100 rounded-full bg-dark-300 px-4 py-2 shadow-sm transition data-[selected=true]:(border-purple-600 ring-1 ring-purple-600/50)"
        onDoubleClick={showNodeProperties}
      >
        <div className={cn(meta.icon, 'size-4.5 shrink-0 mr-2 scale-130')} />

        <span className="mr-1">
          {data.label || meta.title}
        </span>
      </div>

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
export const metadata: RegisterNodeMetadata<BaseNodeData<StartNodeData>> = {
  type: NODE_TYPE,
  node: memo(StartNode),
  detail: {
    icon: 'i-mynaui:play',
    title: '开始',
    description: '流程的起点',
  },
  connection: {
    inputs: 0,
    outputs: 1,
  },
  available: false,
  defaultData: {
    label: '开始',
    deletable: false,
    inputConfig: {
      refInputs: []
    },
    nodeConfig: {
      userInputs: [
        {
          type: 1,
          name: "userInput",
          label: "用户输入",
          required: true
        }
      ]
    },
    nodeOutput: [
                  {
                type: 1,
                name: "userInput",
                label: "用户输入",
                required: true
            }
    ]
  },
  propertyPanel: StartPropertyPanel,
  requiredVariable: []
}
