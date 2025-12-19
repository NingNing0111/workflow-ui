import type { Node, NodeProps } from '@xyflow/react'
import type { BaseNodeData, NodeIOData, RegisterNodeMetadata } from '~/modules/nodes/types'
import { Position } from '@xyflow/react'
import { nanoid } from 'nanoid'

import { memo, useCallback, useMemo, useState } from 'react'
import CustomHandle from '~/modules/flow-builder/components/handles/custom-handle'
import { BuilderNode } from '~/modules/nodes/types'

import { getNodeDetail } from '~/modules/nodes/utils'
import { useApplicationState } from '~/stores/application-state'
import StartPropertyPanel from '~/modules/sidebar/panels/node-properties/property-panels/start-property-panel'
import { theme, Typography } from 'antd'
import clsx from 'clsx'

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
  const { token } = theme.useToken()
  return (
    <>
      <div
        onDoubleClick={showNodeProperties}
        style={{
          display: 'flex',
          alignItems: 'center',
          padding: '6px 14px',
          borderRadius: 999,
          border: `1px solid ${selected ? token.colorPrimary : token.colorBorder
            }`,
          background: token.colorBgContainer,
          boxShadow: token.boxShadowSecondary,
          cursor: 'default',
          transition: 'all 0.2s',
          ...(selected
            ? {
              boxShadow: `0 0 0 2px ${token.colorPrimaryBorder}`,
            }
            : {}),
        }}
      >
        {/* 图标 */}
        <div
          className={clsx(meta.icon)}
          style={{
            width: 18,
            height: 18,
            marginRight: 8,
            transform: 'scale(1.3)',
            color: token.colorTextSecondary,
            flexShrink: 0,
          }}
        />

        {/* 标题 */}
        <Typography.Text
          ellipsis
          style={{
            fontSize: 13,
            fontWeight: 500,
            color: token.colorText,
            userSelect: 'none',
          }}
        >
          {data.label || meta.title}
        </Typography.Text>
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
