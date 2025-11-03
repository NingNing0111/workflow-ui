import type { Node, NodeProps } from '@xyflow/react'
import type { BaseNodeData, RegisterNodeMetadata } from '~/modules/nodes/types'
import { Position } from '@xyflow/react'
import { nanoid } from 'nanoid'

import { memo, useCallback, useMemo, useState } from 'react'
import { cn } from '~@/utils/cn'
import CustomHandle from '~/modules/flow-builder/components/handles/custom-handle'
import { useDeleteNode } from '~/modules/flow-builder/hooks/use-delete-node'
import { BuilderNode, GetInputType } from '~/modules/nodes/types'
import { getNodeDetail } from '~/modules/nodes/utils'

import { useApplicationState } from '~/stores/application-state'
import UserInputNodePropertyPanel from '~/modules/sidebar/panels/node-properties/property-panels/user-input-property-panel'

const NODE_TYPE = BuilderNode.USER_INPUT

export interface UserInputNodeData {
}

type UserInputNodeProps = NodeProps<Node<BaseNodeData<UserInputNodeData>, typeof NODE_TYPE>>

export function UserInputNode({ id, isConnectable, selected, data }: UserInputNodeProps) {
    const meta = useMemo(() => getNodeDetail(NODE_TYPE), [])
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
                className=" overflow-clip border border-dark-200 rounded-xl bg-dark-300/50 shadow-sm backdrop-blur-xl transition divide-y divide-dark-200 data-[selected=true]:(border-teal-600 ring-1 ring-teal-600/50)"
                onDoubleClick={showNodeProperties}
            >
                <div className="relative bg-dark-300/50">
                    <div className="absolute inset-0">
                        <div className="absolute h-full w-3/5 from-teal-900/20 to-transparent bg-gradient-to-r" />
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
                                type="button"
                                className="size-7 flex items-center justify-center border border-transparent rounded-lg bg-transparent outline-none transition active:(border-dark-200 bg-dark-400/50) hover:(bg-dark-100)"
                                onClick={() => showNodeProperties()}
                            >
                                <div className="i-mynaui:cog size-4" />
                            </button>

                            <button
                                type="button"
                                className="size-7 flex items-center justify-center border border-transparent rounded-lg bg-transparent text-red-400 outline-none transition active:(border-dark-200 bg-dark-400/50) hover:(bg-dark-100)"
                                onClick={() => deleteNode(id)}
                            >
                                <div className="i-mynaui:trash size-4" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* 遍历userInputs进行展示 */}
                {data.inputConfig.userInputs.map((input, index) => (
                    <div
                        key={index}
                        className="flex items-center justify-between text-xs text-light-900/70 bg-dark-300/40 rounded-md px-2 py-1"
                    >
                        <div className="flex items-center gap-x-2 truncate">
                            {/* 图标，根据类型选择 */}
                            <div className="size-4 flex items-center justify-center text-light-900/50">
                                <div className={`${GetInputType(input.type).icon} size-3.5`}></div>
                            </div>

                            {/* 名称展示 */}
                            <div className="flex items-center gap-x-1 truncate">
                                <span className="font-medium text-light-900/70">{input.name || '变量'}</span>
                            </div>
                        </div>

                        {input.required && (
                            <span className="text-teal-500 text-[10px] font-medium">必填</span>
                        )}
                    </div>
                ))}

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
export const metadata: RegisterNodeMetadata<BaseNodeData<UserInputNodeData>> = {
    type: NODE_TYPE,
    node: memo(UserInputNode),
    detail: {
        icon: 'i-mynaui:chat',
        title: '输入',
        description: '程序执行时的数据入口',
    },
    connection: {
        inputs: 1,
        outputs: 1,
    },

    defaultData: {
        inputConfig: {
            // 节点输入信息
            userInputs: [
                {
                    type: 1,
                    name: "user_input",
                    label: "用户输入",
                    required: true
                },
                {
                    type: 2,
                    name: 'user_id',
                    label: '用户ID',
                    required: true
                }
            ],
            // 可引用其它节点的变量信息
            refInputs: []
        },
        nodeConfig: {
        }

    },
    propertyPanel: UserInputNodePropertyPanel,
    requiredVariable: []
}
