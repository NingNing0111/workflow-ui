import type { Node, NodeProps } from '@xyflow/react'
import type { BaseNodeData, RegisterNodeMetadata } from '~/modules/nodes/types'
import { Position } from '@xyflow/react'
import { nanoid } from 'nanoid'
import { memo, useCallback, useMemo, useState } from 'react'
import { Card, Button, Space, Typography, Tag, Descriptions, Tooltip, Divider } from 'antd'
import {
  EyeOutlined,
  SettingOutlined,
  DeleteOutlined,
} from '@ant-design/icons'

import CustomHandle from '~/modules/flow-builder/components/handles/custom-handle'
import { useDeleteNode } from '~/modules/flow-builder/hooks/use-delete-node'
import { BuilderNode, InputTypeEnum } from '~/modules/nodes/types'
import { getNodeDetail } from '~/modules/nodes/utils'
import { useApplicationState } from '~/stores/application-state'
import LLMOutputNodePropertyPanel from '~/modules/sidebar/panels/node-properties/property-panels/llm-output-panel'
import { cn } from '~@/utils/cn'

const { Text } = Typography

const NODE_TYPE = BuilderNode.LLM_OUTPUT

export interface LLMOutputNodeData {
  modelName: string
  contextLength: number
  enableThinking: boolean
  systemMessage: string
  userMessage: string
  stream: boolean
}

type LLMNodeProps = NodeProps<Node<BaseNodeData<LLMOutputNodeData>, typeof NODE_TYPE>>

export function LLMNode({
  id,
  isConnectable,
  selected,
  data,
}: LLMNodeProps) {
  const meta = useMemo(() => getNodeDetail(NODE_TYPE), [])
  const [showNodePropertiesOf] = useApplicationState(s => [
    s.actions.sidebar.showNodePropertiesOf,
  ])
  const [sourceHandleId] = useState(nanoid())
  const [targetHandleId] = useState(nanoid())
  const deleteNode = useDeleteNode()

  const showNodeProperties = useCallback(() => {
    showNodePropertiesOf({ id, type: NODE_TYPE })
  }, [id, showNodePropertiesOf])

  const cfg = data.nodeConfig

  return (
    <>
      <Card
        size="small"
        onDoubleClick={showNodeProperties}
        className={cn(
          'w-xs backdrop-blur-xl transition',
          selected && 'ring-1  border-purple-600'
        )}
        styles={{
          body: { padding: 0 },
        }}
        variant='outlined'
        title={
          <Space size={6}>
            <div className="size-6 flex items-center justify-center rounded-lg">
              <div className={cn(meta.icon, 'size-4')} />
            </div>
            <Typography.Text
              type="secondary"
              className=" font-medium uppercase tracking-wide"
            >
              {meta.title}
            </Typography.Text>
          </Space>
        }
        extra={
          <Space size={4}>
            <Tooltip title="查看节点">
              <Button
                size="small"
                type="text"
                icon={<EyeOutlined />}
                onClick={showNodeProperties}
              />
            </Tooltip>

            <Tooltip title="编辑">
              <Button
                size="small"
                type="text"
                icon={<SettingOutlined />}
                onClick={showNodeProperties}
              />
            </Tooltip>

            <Tooltip title="删除">
              <Button
                size="small"
                type="text"
                danger
                icon={<DeleteOutlined />}
                onClick={() => deleteNode(id)}
              />
            </Tooltip>
          </Space>
        }
      >

        <div className="p-3 space-y-3 text-xs">
          <div className="flex gap-1 items-center">
            <Typography.Text type="secondary" className=" uppercase">
              模型名称:
            </Typography.Text>
            <Text ellipsis className="px-2 py-1 rounded-md ">{cfg.modelName}</Text>
          </div>
          <div className="flex gap-1 items-center">
            <Typography.Text type="secondary" className=" uppercase">
              上下文长度:
            </Typography.Text>
            <Tag>{cfg.contextLength}</Tag>
          </div>

          <div className='flex gap-1 items-center'>
            <Typography.Text type="secondary" className="uppercase">
              思考模式:
            </Typography.Text>
            <Tag color={cfg.enableThinking ? 'green' : 'default'}>
              {cfg.enableThinking ? '已启用' : '未启用'}
            </Tag>
          </div>

          <div className='flex gap-1 items-center'>
            <Typography.Text type="secondary" className=" uppercase">
              输出模式:
            </Typography.Text>
            <Tag color={cfg.stream ? 'green' : 'default'}>
              {cfg.stream ? '流式' : '非流式'}
            </Tag>
          </div>

          <div className='flex gap-1 items-center'>
            <Typography.Text type="secondary" className=" uppercase">
              用户提示词:
            </Typography.Text>
            <Text ellipsis>{cfg.userMessage}</Text>

          </div>

          <div className='flex gap-1 items-center'>
            <Typography.Text type="secondary" className=" uppercase">
              系统提示词:
            </Typography.Text>
            <Text ellipsis>{cfg.systemMessage}</Text>
          </div>
        </div>

        <Divider style={{ margin: 0 }} />
        {/* Footer */}
        <div className="px-4 py-2 text-xs">
          <Typography.Text type="secondary">
            Node:{' '}
            <Typography.Text type="secondary">
              #{id}
            </Typography.Text>
          </Typography.Text>
        </div>
      </Card>

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
export const metadata: RegisterNodeMetadata<BaseNodeData<LLMOutputNodeData>> = {
  type: NODE_TYPE,
  node: memo(LLMNode),
  detail: {
    icon: 'i-mynaui:chat',
    title: '大模型输出',
    description: '调用大模型时的参数配置',
  },
  connection: {
    inputs: 1,
    outputs: 1,
  },
  defaultData: {
    label: '大模型输出',
    inputConfig: {
      refInputs: []
    },
    nodeConfig: {
      modelName: 'qwen-plus',
      contextLength: 10,
      userMessage: '你好！',
      systemMessage: "You're a helpful assistant!",
      enableThinking: true,
      stream: true
    },
    nodeOutput: [
      {
        name: 'content',
        required: true,
        label: '回复内容',
        type: InputTypeEnum.TEXT
      }
    ]

  },
  propertyPanel: LLMOutputNodePropertyPanel,
  requiredVariable: [],
}