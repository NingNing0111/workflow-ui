import { InputTypeEnum, type BaseNodeData, type BuilderNodeType, type NodeParamRefData } from '~/modules/nodes/types'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'

import { cn } from '~@/utils/cn'
import type { PromptSelectorNodeData } from '~/modules/nodes/nodes/prompt-selector-node/prompt-selector.node';
import { useEffect, useState } from 'react';
import VariableInput from '~/modules/sidebar/panels/node-properties/components/variable-input';
import { TextArea } from '@radix-ui/themes';
import { useNodePathPreOutputData } from '~/modules/flow-builder/hooks/use-node-path';


type PromptNodePropertyPanelProps = Readonly<{
    id: string;
    type: BuilderNodeType;
    data: BaseNodeData<PromptSelectorNodeData>;
    updateData: (data: Partial<BaseNodeData<PromptSelectorNodeData>>) => void;
}>

const promptOptions = [
    {
        label: '默认',
        value: 'default',
        icon: 'mdi:text-box-check',
        type: 'user',
        content: "默认提示词内容"
    },
    {
        label: '总结用户输入',
        value: 'summary_user_input',
        icon: 'mdi:text-box-check',
        type: 'user',
        content: "总结用户输入提示词内容"
    },
    {
        label: '生成回复内容',
        value: 'generate_reply',
        icon: 'mdi:message-reply-text',
        type: 'user',
        content: "生成回复内容提示词"
    },
    {
        label: '意图识别',
        value: 'detect_intent',
        icon: 'mdi:brain',
        type: 'user',
        content: "意图识别内容提示词"
    },
    {
        label: '提取关键词',
        value: 'extract_keywords',
        icon: 'mdi:key',
        type: 'user',
        content: "提取关键词提示词内容"
    },
    {
        label: 'AI销售角色',
        value: 'aiSales',
        icon: 'mdi:key',
        type: 'system',
        content: "你是一位专业的销售助手"
    },
]

export default function PromptSelectorNodePropertyPanel({ id, data, updateData }: PromptNodePropertyPanelProps) {
    const selectedOption = promptOptions.find(opt => opt.value === data.nodeConfig.promptCode)
    const [promptMessage, setPromptMessage] = useState(data.nodeConfig.promptMessage ?? selectedOption?.content ?? "");
    const variableData: any = useNodePathPreOutputData(id);

    const handlePromptMessageChange = (newValue: string) => {
        setPromptMessage(newValue)
        updateData({nodeConfig: {...data.nodeConfig, promptMessage: newValue}})
    }

    useEffect(() => {
        if (data.nodeConfig.promptMessage) {
            handlePromptMessageChange(data.nodeConfig.promptMessage)
        } else {
            handlePromptMessageChange(selectedOption?.content ?? "")
        }
    }, [data.nodeConfig.promptCode])

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
                                            data.nodeConfig.promptCode === option.value && "text-blue-400 bg-blue-500/10"
                                        )}
                                        onClick={() => {
                                            updateData({nodeConfig: {promptCode: option.value, promptType: option.type as any, promptMessage: option.content}})
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
            <div
                className="flex flex-col gap-2"
            >
                <label className="flex items-center gap-2 text-xs font-medium text-gray-400 uppercase tracking-wide">
                    提示词
                </label>
                <VariableInput
                    onRefValueChange={
                        (refValues) => {
                            updateData({ ...data, inputConfig: { ...data.inputConfig, refInputs: refValues } })
                        }
                    }
                    variables={variableData} placeholder='请输入提示词内容' value={promptMessage} onChange={handlePromptMessageChange} row={6} type='none' />
            </div>


        </div>
    )
}