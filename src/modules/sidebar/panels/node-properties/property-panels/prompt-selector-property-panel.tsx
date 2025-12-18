import { type BaseNodeData, type BuilderNodeType } from '~/modules/nodes/types'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'

import { cn } from '~@/utils/cn'
import type { PromptSelectorNodeData } from '~/modules/nodes/nodes/prompt-selector-node/prompt-selector.node';
import { useEffect, useState } from 'react';
import VariableInput from '~/modules/sidebar/panels/node-properties/components/variable-input';
import { useNodePathPreOutputData } from '~/modules/flow-builder/hooks/use-node-path';
import { Form, Input, Select, Space, Typography } from 'antd';


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
        updateData({ nodeConfig: { ...data.nodeConfig, promptMessage: newValue } })
    }

    useEffect(() => {
        if (data.nodeConfig.promptMessage) {
            handlePromptMessageChange(data.nodeConfig.promptMessage)
        } else {
            handlePromptMessageChange(selectedOption?.content ?? "")
        }
    }, [data.nodeConfig.promptCode])

    return (
        <Space orientation="vertical" size={20} style={{ width: '100%', padding: 20 }}>

            <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                唯一标识符
            </Typography.Text>
            <Input
                value={id}
                readOnly
                disabled
            />
            <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                提示词
            </Typography.Text>
            <Select
                placeholder="请选择提示词"
                style={{width: '100%'}}
                value={data.nodeConfig.promptCode}
                onChange={(value) => {
                    const option = promptOptions.find(o => o.value === value)
                    if (!option) return

                    updateData({
                        nodeConfig: {
                            promptCode: option.value,
                            promptType: option.type as any,
                            promptMessage: option.content,
                        },
                    })
                }}
                options={promptOptions.map(option => ({
                    label: `${option.type}-${option.label}`,
                    value: option.value,
                }))}
            />
            <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                提示词内容
            </Typography.Text>
            <VariableInput
                row={6}
                type="none"
                placeholder="请输入提示词内容"
                value={promptMessage}
                variables={variableData}
                onChange={handlePromptMessageChange}
                onRefValueChange={(refValues) => {
                    updateData({
                        ...data,
                        inputConfig: {
                            ...data.inputConfig,
                            refInputs: refValues,
                        },
                    })
                }}
            />
        </Space>
    )
}