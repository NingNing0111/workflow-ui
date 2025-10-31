import type { BuilderNodeType } from '~/modules/nodes/types'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'

import { listify } from 'radash'
import { useMemo } from 'react'

import { cn } from '~@/utils/cn'

import { MessageChannelDetails } from '~/modules/nodes/nodes/text-message-node/constants/channels'
import type { UserInputNodeData } from '~/modules/nodes/nodes/user-input-node/user-input.node'

type UserInputNodePropertyPanelProps = Readonly<{
    id: string;
    type: BuilderNodeType;
    data: UserInputNodeData;
    updateData: (data: Partial<UserInputNodeData>) => void;
}>

export default function UserInputNodePropertyPanel({ id, data, updateData }: UserInputNodePropertyPanelProps) {


    return (
        <div className="flex flex-col gap-4.5 p-4">
            <div className="flex flex-col">
                <div className="text-xs text-light-900/60 font-semibold">
                    唯一标识符
                </div>

                <div className="mt-2 flex">
                    <input type="text" value={id} readOnly className="h-8 w-full border border-dark-200 rounded-md bg-dark-400 px-2.5 text-sm font-medium shadow-sm outline-none transition hover:(bg-dark-300/60) read-only:(text-light-900/80 op-80 hover:bg-dark-300/30)" />
                </div>
            </div>

            <div className="flex flex-col">
                <div className="text-xs text-light-900/60 font-semibold">
                    变量名
                </div>
                <div className="mt-2 flex">
                    <input type="text" placeholder='请输入变量名' value={data.variableName} onChange={e => updateData({ variableName: e.target.value })} className="h-8 w-full border border-dark-200 rounded-md bg-dark-400 px-2.5 text-sm font-medium shadow-sm outline-none transition hover:(bg-dark-300/60) read-only:(text-light-900/80 op-80 hover:bg-dark-300/30)" />
                </div>
            </div>

            <div className="flex flex-col">
                <div className="text-xs text-light-900/60 font-semibold">
                    默认值
                </div>
                <div className="mt-2 flex">
                    <input type="text" value={data.defaultValue} placeholder='请输入默认值' onChange={e => updateData({ defaultValue: e.target.value })} className="h-8 w-full border border-dark-200 rounded-md bg-dark-400 px-2.5 text-sm font-medium shadow-sm outline-none transition hover:(bg-dark-300/60) read-only:(text-light-900/80 op-80 hover:bg-dark-300/30)" />
                </div>

            </div>


        </div>
    )
}
