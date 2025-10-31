import type { BuilderNodeType } from '~/modules/nodes/types'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'

import { cn } from '~@/utils/cn'

import type { PromptNodeData } from '~/modules/nodes/nodes/prompt-node/prompt.node'
import type { LLMNodeData } from '~/modules/nodes/nodes/llm-node/llm.node'
import { useState } from 'react'

type LLMNodePropertyPanelProps = Readonly<{
    id: string;
    type: BuilderNodeType;
    data: LLMNodeData;
    updateData: (data: Partial<LLMNodeData>) => void;
}>


export default function LLMNodePropertyPanel({ id, data, updateData }: LLMNodePropertyPanelProps) {
    const [enableSystemMessage, setEnableSystemMessage] = useState<boolean>(
        !!data.systemMessage && data.systemMessage.length > 0
    )
    return (
        <div className="flex flex-col gap-5 p-5">
            {/* 唯一标识符 */}
            <div className="flex flex-col gap-2">
                <label className="flex items-center gap-2 text-xs font-medium text-gray-400 uppercase tracking-wide">
                    唯一标识符
                </label>
                <div className="flex">
                    <input
                        type="text"
                        value={id}
                        readOnly
                        className="h-9 w-full border border-gray-600 rounded-lg bg-gray-700/50 px-3 text-sm font-medium shadow-sm outline-none transition-all duration-200 hover:bg-gray-600/50 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 read-only:text-gray-400 read-only:cursor-not-allowed read-only:hover:bg-gray-700/50"
                    />
                </div>
            </div>
            {/* 模型名称 */}
            <div className="flex flex-col">
                <div className="text-xs text-light-900/60 font-semibold">
                    模型名称
                </div>
                <div className="mt-2 flex">
                    <input type="text" placeholder='请输入模型名称' value={data.modelName} onChange={e => updateData({ modelName: e.target.value })} className="h-8 w-full border border-dark-200 rounded-md bg-dark-400 px-2.5 text-sm font-medium shadow-sm outline-none transition hover:(bg-dark-300/60) read-only:(text-light-900/80 op-80 hover:bg-dark-300/30)" />
                </div>
            </div>

            {/* 上下文长度 */}
            <div className="flex flex-col">
                <div className="text-xs text-light-900/60 font-semibold">
                    上下文长度
                </div>
                <div className="mt-2 flex">
                    <input
                        type="number"
                        placeholder="请输入上下文长度"
                        value={data.contextLength}
                        onChange={e => {
                            const value = Number(e.target.value)
                            // 限制输入范围
                            if (isNaN(value)) return
                            const clamped = Math.max(1, Math.min(64, value))
                            updateData({ contextLength: clamped })
                        }}
                        min={1}
                        max={64}
                        step={1}
                        className="h-8 w-full border border-dark-200 rounded-md bg-dark-400 px-2.5 text-sm font-medium shadow-sm outline-none transition hover:(bg-dark-300/60) read-only:(text-light-900/80 op-80 hover:bg-dark-300/30) [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                </div>
            </div>
            {/* 用户提示词 */}
            <div className="flex flex-col gap-2">
                <label className="flex items-center gap-2 text-xs font-medium text-gray-400 uppercase tracking-wide">
                    用户提示词
                </label>
                <div className="flex">
                    <input
                        type="text"
                        value={data.userMessage}
                        readOnly
                        className="h-9 w-full border border-gray-600 rounded-lg bg-gray-700/50 px-3 text-sm font-medium shadow-sm outline-none transition-all duration-200 hover:bg-gray-600/50 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 read-only:text-gray-400 read-only:cursor-not-allowed read-only:hover:bg-gray-700/50"
                    />
                </div>
            </div>

            {/* 是否开启思考 */}
            <div className="flex flex-col">
                <div className="text-xs text-light-900/60 font-semibold mb-2">
                    是否开启思考
                </div>
                <div className="flex items-center gap-3">
                    <button
                        type="button"
                        onClick={() => updateData({ enableThinking: !data.enableThinking })}
                        className={cn(
                            "relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2",
                            data.enableThinking ? "!bg-green-500" : "!bg-gray-500"
                        )}
                    >
                        <span
                            className={cn(
                                "inline-block h-5 w-5 rounded-full shadow-md transition-all duration-300",
                                data.enableThinking
                                    ? "translate-x-5 bg-white shadow-[0_0_8px_rgba(34,197,94,0.8)]"
                                    : "translate-x-0.5 bg-gray-300 shadow-[0_0_4px_rgba(0,0,0,0.5)]"
                            )}
                        />
                    </button>
                    <span
                        className={cn(
                            "text-sm font-medium transition-colors duration-300",
                            data.enableThinking ? "text-green-400" : "text-gray-400"
                        )}
                    >
                        {data.enableThinking ? "已开启" : "未开启"}
                    </span>
                </div>
            </div>

            {/* 是否配置系统提示词 */}
            <div className="flex flex-col">
                <div className="text-xs text-light-900/60 font-semibold mb-2">
                    配置系统提示词
                </div>
                <div className="flex items-center gap-3">
                    <button
                        type="button"
                        onClick={() => {
                            setEnableSystemMessage(!enableSystemMessage);
                            updateData({ systemMessage: '请选择系统提示词' })
                        }}
                        className={cn(
                            "relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2",
                            enableSystemMessage ? "!bg-green-500" : "!bg-gray-500"
                        )}
                    >
                        <span
                            className={cn(
                                "inline-block h-5 w-5 rounded-full shadow-md transition-all duration-300",
                                enableSystemMessage
                                    ? "translate-x-5 bg-white shadow-[0_0_8px_rgba(34,197,94,0.8)]"
                                    : "translate-x-0.5 bg-gray-300 shadow-[0_0_4px_rgba(0,0,0,0.5)]"
                            )}
                        />
                    </button>
                    <span
                        className={cn(
                            "text-sm font-medium transition-colors duration-300",
                            enableSystemMessage ? "text-green-400" : "text-gray-400"
                        )}
                    >
                        {enableSystemMessage ? "配置" : "不配置"}
                    </span>
                </div>
            </div>

            {/* 系统提示词 */}
            {enableSystemMessage && <div className="flex flex-col gap-2">
                <label className="flex items-center gap-2 text-xs font-medium text-gray-400 uppercase tracking-wide">
                    系统提示词
                </label>
                <div className="flex">
                    <input
                        type="text"
                        value={data.systemMessage}
                        readOnly
                        className="h-9 w-full border border-gray-600 rounded-lg bg-gray-700/50 px-3 text-sm font-medium shadow-sm outline-none transition-all duration-200 hover:bg-gray-600/50 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 read-only:text-gray-400 read-only:cursor-not-allowed read-only:hover:bg-gray-700/50"
                    />
                </div>
            </div>}

        </div>
    )
}