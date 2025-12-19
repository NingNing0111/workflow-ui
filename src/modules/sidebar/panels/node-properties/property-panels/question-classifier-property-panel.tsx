import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Popconfirm, Space, Typography } from "antd";
import { nanoid } from "nanoid";
import { useNodePathPreOutputData } from "~/modules/flow-builder/hooks/use-node-path";
import type { QuestionClassifierNodeData } from "~/modules/nodes/nodes/question-classifier-node/question-classifier.node";
import type { BaseNodeData, BuilderNodeType } from "~/modules/nodes/types";
import VariableInput from "~/modules/sidebar/panels/node-properties/components/variable-input";

type QuestionClassifierPropertyPanelProps = Readonly<{
    id: string;
    type: BuilderNodeType;
    data: BaseNodeData<QuestionClassifierNodeData>;
    updateData: (data: Partial<BaseNodeData<QuestionClassifierNodeData>>) => void;
}>;

const QuestionClassifierPropertyPanel = ({
    id,
    data,
    updateData,
}: QuestionClassifierPropertyPanelProps) => {
    const variableData: any = useNodePathPreOutputData(id);
    const nodeConfig = data.nodeConfig;

    /** 更新 inputText */
    const updateInputText = (value: string) => {
        updateData({
            ...data,
            nodeConfig: {
                ...nodeConfig,
                inputText: value,
            },
        });
    };

    /** 更新某个分类 */
    const updateClassifyName = (classifyId: string, value: string) => {
        const nextClassies = nodeConfig.paths.map(item =>
            item.id === classifyId
                ? { ...item, name: value }
                : item
        );

        updateData({
            ...data,
            nodeConfig: {
                ...nodeConfig,
                paths: nextClassies,
            },
        });
    };

    /** ✅ 新增分类 */
    const addClassify = () => {
        const newClassify = {
            id: nanoid(), // ✅ 唯一 id
            name: '',
        };

        updateData({
            ...data,
            nodeConfig: {
                ...nodeConfig,
                paths: [...nodeConfig.paths, newClassify],
            },
        });
    };

    /** 删除某个分类 */
    const handleDeleteClassifyName = (classifyId: string) => {
        const nextClassies = nodeConfig.paths.filter(
            item => item.id !== classifyId
        );

        updateData({
            ...data,
            nodeConfig: {
                ...nodeConfig,
                paths: nextClassies,
            },
        });
    };

    return (
        <Space orientation="vertical" size={20} style={{ width: "100%", padding: 20 }}>
            <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                唯一标识符: {id}
            </Typography.Text>

            {/* 问题描述 */}
            <Typography.Title level={5} style={{ fontSize: 12, margin: 0 }}>
                问题描述
            </Typography.Title>

            <VariableInput
                variables={variableData}
                placeholder="请输入需要分类的问题"
                type="text"
                row={3}
                value={nodeConfig.inputText}
                onRefValueChange={(refValues) => {
                    updateData({
                        ...data,
                        inputConfig: {
                            ...data.inputConfig,
                            refInputs: refValues,
                        },
                    });
                }}
                onChange={updateInputText}
            />

            {/* 问题类别 */}
            <Typography.Title level={5} style={{ fontSize: 12, margin: 0 }}>
                问题类别
            </Typography.Title>

            <Space orientation="vertical" size={12} style={{ width: "100%" }}>
                {nodeConfig.paths.map((item, index) => (
                    <div className="flex  gap-2 items-center">
                        <VariableInput
                            key={item.id}
                            variables={variableData}
                            placeholder={`类别 ${index + 1}`}
                            type="text"
                            row={1}
                            value={item.name}
                            onRefValueChange={(refValues) => {
                                updateData({
                                    ...data,
                                    inputConfig: {
                                        ...data.inputConfig,
                                        refInputs: refValues,
                                    },
                                });
                            }}
                            onChange={(value) => updateClassifyName(item.id, value)}
                        />
                        <Popconfirm
                            key="delete"
                            title="确认删除吗？"
                            onConfirm={(e) => {
                                e?.stopPropagation()
                                handleDeleteClassifyName(item.id)
                            }}
                            onCancel={(e) => e?.stopPropagation()}
                            cancelText="取消"
                            okText="确认"
                            cancelButtonProps={{
                                type: 'text',
                            }}
                            okButtonProps={{
                                type: 'text',
                                danger: true,
                                
                            }}

                        >
                            <Button
                                danger
                                type="text"
                                icon={<DeleteOutlined />}
                                onClick={(e) => e.stopPropagation()}
                            />
                        </Popconfirm>
                    </div>
                ))}

                <Button
                    type="dashed"
                    block
                    onClick={addClassify}
                    icon={<PlusOutlined />}
                >
                    新增类别
                </Button>
            </Space>
        </Space>
    );
};

export default QuestionClassifierPropertyPanel;
