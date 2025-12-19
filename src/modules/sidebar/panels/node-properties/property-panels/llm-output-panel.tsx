import { Divider, Input, InputNumber, Space, Switch, Typography } from 'antd';
import { useEffect, useState } from 'react';
import { useNodePathPreOutputData } from '~/modules/flow-builder/hooks/use-node-path';
import type { LLMOutputNodeData } from '~/modules/nodes/nodes/llm-output-node/llm-output.node';
import { type BaseNodeData, type BuilderNodeType } from '~/modules/nodes/types'
import VariableInput from '~/modules/sidebar/panels/node-properties/components/variable-input';

type LLMOutputNodePropertyPanelProps = Readonly<{
    id: string;
    type: BuilderNodeType;
    data: BaseNodeData<LLMOutputNodeData>;
    updateData: (data: Partial<BaseNodeData<LLMOutputNodeData>>) => void;
}>


export default function LLMOutputNodePropertyPanel({ id, data, updateData }: LLMOutputNodePropertyPanelProps) {
    const [llmOutputConfig, setLLMOutputConfig] = useState<LLMOutputNodeData>(data.nodeConfig);
    const variableData: any = useNodePathPreOutputData(id);

    useEffect(() => {
        setLLMOutputConfig(data.nodeConfig)
    }, [data.nodeConfig])
    return (
        <Space
            orientation="vertical"
            size="large"
            style={{ width: '100%', padding: 12 }}
        >
            {/* ===== 唯一标识符 ===== */}
            <Space orientation="vertical" size={4} style={{ width: '100%' }}>
                <Typography.Text type="secondary" strong style={{ fontSize: 12 }}>
                    唯一标识符
                </Typography.Text>
                <Input
                    value={id}
                    readOnly
                />
            </Space>

            {/* ===== 模型名称 ===== */}
            <Space orientation="vertical" size={4} style={{ width: '100%' }}>
                <Typography.Text type="secondary" strong style={{ fontSize: 12 }}>
                    模型名称
                </Typography.Text>

                <VariableInput
                    variables={variableData}
                    placeholder="请输入模型名称"
                    type="text"
                    row={2}
                    value={llmOutputConfig.modelName}
                    onRefValueChange={(refValues) => {
                        updateData({
                            ...data,
                            inputConfig: { ...data.inputConfig, refInputs: refValues },
                        })
                    }}
                    onChange={(newValue) => {
                        updateData({
                            ...data,
                            nodeConfig: { ...data.nodeConfig, modelName: newValue },
                        })
                        setLLMOutputConfig({ ...llmOutputConfig, modelName: newValue })
                    }}
                />
            </Space>

            {/* ===== 上下文长度 ===== */}
            <Space orientation="vertical" size={4} style={{ width: '100%' }}>
                <Typography.Text type="secondary" strong style={{ fontSize: 12 }}>
                    上下文长度
                </Typography.Text>

                <InputNumber
                    min={1}
                    max={64}
                    step={1}
                    value={llmOutputConfig.contextLength}
                    style={{ width: '100%' }}
                    onChange={(value) => {
                        if (typeof value !== 'number') return
                        updateData({
                            ...data,
                            nodeConfig: { ...data.nodeConfig, contextLength: value },
                        })
                    }}
                />
            </Space>

            <Divider size='small' />

            {/* ===== 用户提示词 ===== */}
            <Space orientation="vertical" size={4} style={{ width: '100%' }}>
                <Typography.Text type="secondary" strong style={{ fontSize: 12 }}>
                    用户提示词
                </Typography.Text>

                <VariableInput
                    variables={variableData}
                    placeholder="请输入用户提示词"
                    type="text"
                    row={6}
                    value={llmOutputConfig.userMessage}
                    onRefValueChange={(refValues) => {
                        updateData({
                            ...data,
                            inputConfig: { ...data.inputConfig, refInputs: refValues },
                        })
                    }}
                    onChange={(newValue) => {
                        updateData({
                            ...data,
                            nodeConfig: { ...data.nodeConfig, userMessage: newValue },
                        })
                        setLLMOutputConfig({ ...llmOutputConfig, userMessage: newValue })
                    }}
                />
            </Space>

            {/* ===== 是否开启思考 ===== */}
            <Space align="center" >
                <Typography.Text type="secondary" strong style={{ fontSize: 12 }}>
                    {llmOutputConfig.enableThinking ? '已开启思考' : '已关闭思考'}
                </Typography.Text>

                <Switch
                    checked={llmOutputConfig.enableThinking}
                    onChange={(checked) => {
                        updateData({
                            ...data,
                            nodeConfig: { ...data.nodeConfig, enableThinking: checked },
                        })
                        setLLMOutputConfig({
                            ...llmOutputConfig,
                            enableThinking: checked,
                        })
                    }}
                />
            </Space>

            {/* ===== 系统提示词 ===== */}
            <Space orientation="vertical" size={4} style={{ width: '100%' }}>
                <Typography.Text type="secondary" strong style={{ fontSize: 12 }}>
                    系统提示词
                </Typography.Text>

                <VariableInput
                    variables={variableData}
                    placeholder="请输入系统提示词"
                    type="text"
                    row={6}
                    value={llmOutputConfig.systemMessage}
                    onRefValueChange={(refValues) => {
                        updateData({
                            ...data,
                            inputConfig: { ...data.inputConfig, refInputs: refValues },
                        })
                    }}
                    onChange={(newValue) => {
                        updateData({
                            ...data,
                            nodeConfig: { ...data.nodeConfig, systemMessage: newValue },
                        })
                        setLLMOutputConfig({
                            ...llmOutputConfig,
                            systemMessage: newValue,
                        })
                    }}
                />
            </Space>

            {/* ===== 是否流式输出 ===== */}
            <Space align="center">
                <Typography.Text type="secondary" strong style={{ fontSize: 12 }}>
                    {llmOutputConfig.stream ? '非流式输出' : '流式输出'}
                </Typography.Text>

                <Switch
                    checked={llmOutputConfig.stream}
                    onChange={(checked) => {
                        updateData({
                            ...data,
                            nodeConfig: { ...data.nodeConfig, stream: checked },
                        })
                        setLLMOutputConfig({
                            ...llmOutputConfig,
                            stream: checked,
                        })
                    }}
                />

            </Space>
        </Space>
    )
}