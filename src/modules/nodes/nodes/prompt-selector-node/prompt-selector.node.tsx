import type { Node, NodeProps } from '@xyflow/react'
import type { BaseNodeData, RegisterNodeMetadata } from '~/modules/nodes/types'
import { Position, useReactFlow } from '@xyflow/react'
import { nanoid } from 'nanoid'

import { memo, useCallback, useMemo, useState } from 'react'
import { cn } from '~@/utils/cn'
import CustomHandle from '~/modules/flow-builder/components/handles/custom-handle'
import { useDeleteNode } from '~/modules/flow-builder/hooks/use-delete-node'
import { BuilderNode } from '~/modules/nodes/types'
import { getNodeDetail } from '~/modules/nodes/utils'

import { useApplicationState } from '~/stores/application-state'
import { toast } from 'sonner'
import PromptSelectorNodePropertyPanel from '~/modules/sidebar/panels/node-properties/property-panels/prompt-selector-property-panel'

const NODE_TYPE = BuilderNode.PROMPT_SELECTOR

export interface PromptSelectorNodeData {
    promptCode: string;
    promptType: 'system' | 'user'
}

type PromptSelectorNodeProps = NodeProps<Node<BaseNodeData<PromptSelectorNodeData>, typeof NODE_TYPE>>

export function UserInputNode({ id, isConnectable, selected, data }: PromptSelectorNodeProps) {
    const meta = useMemo(() => getNodeDetail(NODE_TYPE), [])
    const { setNodes } = useReactFlow()
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
            <div
                data-selected={selected}
                className="w-xs border border-dark-200 rounded-xl bg-dark-300/50 shadow-sm backdrop-blur-xl transition divide-y divide-dark-200 data-[selected=true]:(border-purple-600 ring-1 ring-purple-600/50)"
                onDoubleClick={showNodeProperties}
            >
                <div className="relative bg-dark-300/50">
                    <div className="absolute inset-0">
                        <div className="absolute h-full w-3/5 from-purple-800/20 to-transparent bg-gradient-to-r" />
                    </div>

                    <div className="relative h-9 flex items-center justify-between gap-x-4 px-0.5 py-0.5">
                        <div className="flex grow items-center pl-0.5">
                            <div className="size-7 flex items-center justify-center">
                                <div className="size-6 flex items-center justify-center rounded-lg">
                                    <div className={cn(meta.icon, 'size-4')} />
                                </div>
                            </div>

                            <div className="ml-1 text-xs font-medium leading-none tracking-wide uppercase op-80">
                                <span className="translate-y-px">
                                    {meta.title}
                                </span>
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
                                title='编辑'
                                type="button"
                                className="size-7 flex items-center justify-center border border-transparent rounded-lg bg-transparent outline-none transition active:(border-dark-200 bg-dark-400/50) hover:(bg-dark-100)"
                                onClick={() => showNodeProperties()}
                            >
                                <div className="i-mynaui:cog size-4" />
                            </button>
                            <button
                                title='删除'
                                type="button"
                                className="size-7 flex items-center justify-center border border-transparent rounded-lg bg-transparent text-red-400 outline-none transition active:(border-dark-200 bg-dark-400/50) hover:(bg-dark-100)"
                                onClick={() => deleteNode(id)}
                            >
                                <div className="i-mynaui:trash size-4" />
                            </button>
                        </div>
                    </div>
                </div>

                <div className="p-3 text-xs space-y-2">
                    {/* 类型使用tag展示 编码提供复制按钮 */}
                    <div className="flex flex-col gap-1">
                        <label className="text-dark-50 text-[11px] uppercase">提示词类型</label>
                        <div className={cn(
                            'inline-flex items-center justify-center rounded-md px-2 py-1 text-[11px] font-medium w-fit',
                            data.nodeConfig.promptType === 'system' ? 'bg-blue-900/30 text-blue-300' : 'bg-amber-900/30 text-amber-300'
                        )}>
                            {data.nodeConfig.promptType}
                        </div>
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="text-dark-50 text-[11px] uppercase">提示词编码</label>
                        <div className="flex items-center gap-1">
                            <div className="flex-1 truncate bg-dark-100/50 border border-dark-200 rounded-md px-2 py-1 text-light-900 text-xs select-text">
                                {data.nodeConfig.promptCode}
                            </div>
                            <button
                                title="复制编码"
                                type="button"
                                onClick={handleCopy}
                                className="size-6 flex items-center justify-center rounded-md border border-dark-200 bg-dark-200/20 hover:bg-dark-200/40 transition"
                            >
                                <div className="i-mynaui:copy size-3 text-light-900/70" />
                            </button>
                        </div>
                    </div>
                </div>
                <div className="bg-dark-300/30 px-4 py-2 text-xs text-light-900/50">
                    Node:
                    {' '}
                    <span className="text-light-900/60 font-semibold">
                        #
                        {id}
                    </span>
                </div>
            </div>

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
            userInputs: [],
            refInputs: []
        },
        nodeConfig: {
            promptCode: 'default',
            promptType: 'user'
        },
        nodeOutput: [
            
        ]
    },
    propertyPanel: PromptSelectorNodePropertyPanel,
    requiredVariable: []
}
