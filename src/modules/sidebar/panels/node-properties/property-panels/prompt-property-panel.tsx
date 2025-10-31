import type { BuilderNodeType } from '~/modules/nodes/types'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'

import { cn } from '~@/utils/cn'

import type { PromptNodeData } from '~/modules/nodes/nodes/prompt-node/prompt.node'

type PromptNodePropertyPanelProps = Readonly<{
    id: string;
    type: BuilderNodeType;
    data: PromptNodeData;
    updateData: (data: Partial<PromptNodeData>) => void;
}>

const promptOptions = [
    {
        label: '默认',
        value: 'default',
        icon: 'mdi:text-box-check',
        type: 'user'
    },
    { 
        label: '总结用户输入', 
        value: 'summary_user_input',
        icon: 'mdi:text-box-check',
        type: 'user'
    },
    { 
        label: '生成回复内容', 
        value: 'generate_reply',
        icon: 'mdi:message-reply-text',
        type: 'user'
    },
    { 
        label: '意图识别', 
        value: 'detect_intent',
        icon: 'mdi:brain',
        type: 'user'
    },
    { 
        label: '提取关键词', 
        value: 'extract_keywords',
        icon: 'mdi:key',
        type: 'user'
    },
        { 
        label: 'AI销售角色', 
        value: 'aiSales',
        icon: 'mdi:key',
        type: 'system'
    },
]

export default function PromptNodePropertyPanel({ id, data, updateData }: PromptNodePropertyPanelProps) {
    const selectedOption = promptOptions.find(opt => opt.value === data.promptCode)

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

            {/* 提示词选择 */}
            <div className="flex flex-col gap-2">
                <label className="flex items-center gap-2 text-xs font-medium text-gray-400 uppercase tracking-wide">
                    提示词
                </label>
                <div className="flex">
                    <DropdownMenu.Root>
                        <DropdownMenu.Trigger asChild>
                            <button className="h-9 w-full flex items-center justify-between border border-gray-600 rounded-lg bg-gray-700/50 px-3 text-sm font-medium shadow-sm outline-none transition-all duration-200 hover:bg-gray-600/50 hover:border-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500">
                                <div className="flex items-center gap-2 truncate">
                                    {selectedOption ? (
                                        <>
                                            <span>{selectedOption.label}</span>
                                        </>
                                    ) : (
                                        <span className="text-gray-500">请选择提示词</span>
                                    )}
                                </div>
                            </button>
                        </DropdownMenu.Trigger>

                        <DropdownMenu.Portal>
                            <DropdownMenu.Content 
                                className="min-w-[var(--radix-dropdown-menu-trigger-width)] bg-gray-800 border border-gray-600 rounded-lg shadow-lg py-2 z-50 animate-in fade-in-80 zoom-in-95"
                                sideOffset={5}
                                align="start"
                            >
                                {promptOptions.map((option) => (
                                    <DropdownMenu.Item
                                        key={option.value}
                                        className={cn(
                                            "flex items-center justify-between px-3 py-2 text-sm cursor-pointer outline-none transition-colors",
                                            "hover:bg-gray-700 focus:bg-gray-700",
                                            data.promptCode === option.value && "text-blue-400 bg-blue-500/10"
                                        )}
                                        onClick={() => {
                                            updateData({ promptCode: option.value, promptType: option.type as any })
                                        }}
                                    >
                                        <div className="flex items-center gap-2">
                                            <span>{option.type}-{option.label}</span>
                                        </div>
                                        
                                    </DropdownMenu.Item>
                                ))}
                            </DropdownMenu.Content>
                        </DropdownMenu.Portal>
                    </DropdownMenu.Root>
                </div>
            </div>

            {/* 当前选择显示 */}
            {selectedOption && (
                <div className="flex flex-col gap-2 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                    <div className="flex items-center gap-2 text-xs font-medium text-blue-400 uppercase tracking-wide">
                        当前选择
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-200 ml-5.5">
                        {selectedOption.label}
                    </div>
                </div>
            )}
        </div>
    )
}