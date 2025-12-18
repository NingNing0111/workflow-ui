import type { Node, NodeProps } from '@xyflow/react'
import type { BaseNodeData, RegisterNodeMetadata } from '~/modules/nodes/types'
import { Position } from '@xyflow/react'
import { nanoid } from 'nanoid'

import { memo, useCallback, useMemo, useState } from 'react'
import { cn } from '~@/utils/cn'
import CustomHandle from '~/modules/flow-builder/components/handles/custom-handle'
import { BuilderNode } from '~/modules/nodes/types'

import { getNodeDetail } from '~/modules/nodes/utils'
import UnavailableNodePropertyPanel from '~/modules/sidebar/panels/node-properties/property-panels/unavailable-property-panel'
import { useApplicationState } from '~/stores/application-state'
import { theme, Typography } from 'antd'
import clsx from 'clsx'

export interface EndNodeData {
}

const NODE_TYPE = BuilderNode.END

type EndNodeProps = NodeProps<Node<BaseNodeData<EndNodeData>, typeof NODE_TYPE>>

export function EndNode({ id, data, selected, isConnectable }: EndNodeProps) {
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
        type="target"
        id={sourceHandleId}
        position={Position.Left}
        isConnectable={isConnectable}
      />
    </>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const metadata: RegisterNodeMetadata<BaseNodeData<EndNodeData>> = {
  type: NODE_TYPE,
  node: memo(EndNode),
  detail: {
    icon: 'i-mynaui:stop',
    title: '结束',
    description: '流程的结束',
  },
  connection: {
    inputs: 1,
    outputs: 0,
  },
  available: false,
  defaultData: {
    label: '结束',
    deletable: false,
    inputConfig: {
      refInputs: []
    },
    nodeConfig: {},
    nodeOutput: []
  },
  propertyPanel: UnavailableNodePropertyPanel,
  requiredVariable: []
}
