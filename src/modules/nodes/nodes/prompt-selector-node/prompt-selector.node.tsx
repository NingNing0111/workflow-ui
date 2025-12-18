import type { Node, NodeProps } from '@xyflow/react'
import type { BaseNodeData, RegisterNodeMetadata } from '~/modules/nodes/types'
import { Position } from '@xyflow/react'
import { nanoid } from 'nanoid'

import { memo, useCallback, useMemo, useState } from 'react'
import { cn } from '~@/utils/cn'
import CustomHandle from '~/modules/flow-builder/components/handles/custom-handle'
import { useDeleteNode } from '~/modules/flow-builder/hooks/use-delete-node'
import { BuilderNode, InputTypeEnum } from '~/modules/nodes/types'
import { getNodeDetail } from '~/modules/nodes/utils'

import { useApplicationState } from '~/stores/application-state'
import { toast } from 'sonner'
import PromptSelectorNodePropertyPanel from '~/modules/sidebar/panels/node-properties/property-panels/prompt-selector-property-panel'
import { Button, Card, Divider, Space, Tag, Tooltip, Typography } from 'antd'
import { CopyOutlined, DeleteOutlined, EyeOutlined, SettingOutlined } from '@ant-design/icons'

const NODE_TYPE = BuilderNode.PROMPT_SELECTOR

export interface PromptSelectorNodeData {
    promptCode: string;
    promptType: 'system' | 'user',
    promptMessage?: string
}

type PromptSelectorNodeProps = NodeProps<Node<BaseNodeData<PromptSelectorNodeData>, typeof NODE_TYPE>>

export function UserInputNode({ id, isConnectable, selected, data }: PromptSelectorNodeProps) {
    const meta = useMemo(() => getNodeDetail(NODE_TYPE), [])
    const [showNodePropertiesOf] = useApplicationState(s => [s.actions.sidebar.showNodePropertiesOf])
    const [targetHandleId] = useState<string>(nanoid())
    const [sourceHandleId] = useState<string>(nanoid())

    const deleteNode = useDeleteNode()

    const showNodeProperties = useCallback(() => {
        showNodePropertiesOf({ id, type: NODE_TYPE })
    }, [id, showNodePropertiesOf])

    const handleCopy = useCallback(() => {
        navigator.clipboard.writeText(data.promptCode)
        toast.success('复制成功')
    }, [data.promptCode])

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
                {/* Content */}
                <div className="p-3 space-y-3 text-xs">
                    {/* Prompt Type */}
                    <div className="flex gap-1 items-center">
                        <Typography.Text type="secondary" className=" uppercase">
                            提示词类型:
                        </Typography.Text>
                        <Tag
                            color={data.nodeConfig.promptType === 'system' ? 'blue' : 'gold'}
                        >
                            {data.nodeConfig.promptType}
                        </Tag>
                    </div>

                    {/* Prompt Code */}
                    <div className="flex   gap-1 items-center">
                        <Typography.Text type="secondary" className=" uppercase">
                            提示词编码:
                        </Typography.Text>
                        <Typography.Text
                            ellipsis
                            className="px-2 py-1 rounded-md "
                        >
                            {data.nodeConfig.promptCode}
                        </Typography.Text>
                        <CopyOutlined
                            onClick={handleCopy}
                            className='cursor-pointer mx-2'
                        />
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

// eslint-disable-next-line react-refresh/only-export-components
export const metadata: RegisterNodeMetadata<BaseNodeData<PromptSelectorNodeData>> = {
    type: NODE_TYPE,
    node: memo(UserInputNode),
    detail: {
        icon: 'i-mynaui:chat',
        title: '提示词选择器',
        description: '构造对话所需的提示词',
    },
    connection: {
        inputs: 1,
        outputs: 1,
    },
    defaultData: {
        label: '提示词选择器',
        inputConfig: {
            refInputs: []
        },
        nodeConfig: {
            promptCode: 'default',
            promptType: 'user'
        },
        nodeOutput: [
            {
                name: 'promptMessage',
                type: InputTypeEnum.TEXT,
                required: true,
                label: "提示词内容"
            }
        ]
    },
    propertyPanel: PromptSelectorNodePropertyPanel,
    requiredVariable: []
}
