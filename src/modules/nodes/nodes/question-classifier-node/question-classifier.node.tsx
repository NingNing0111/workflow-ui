import { Position, useReactFlow, type Node, type NodeProps } from "@xyflow/react";
import { Divider, Typography } from "antd";
import { produce } from "immer";
import { nanoid } from "nanoid";
import { memo, useCallback, useState, } from "react";
import CustomHandle from "~/modules/flow-builder/components/handles/custom-handle";
import NodeCardWrapper from "~/modules/nodes/components/node-card-wrapper";
import { NodePath } from "~/modules/nodes/nodes/question-classifier-node/components/node-path";
import { BuilderNode, InputTypeEnum, type BaseNodeData, type RegisterNodeMetadata } from "~/modules/nodes/types";
import QuestionClassifierPropertyPanel from "~/modules/sidebar/panels/node-properties/property-panels/question-classifier-property-panel";

export interface QuestionClassifierNodeData {
    inputText: string; // 输入文本
    paths: {
        id: string;
        name: string;
    }[]
}

const NODE_TYPE = BuilderNode.QUESTION_CLASSIFIER;

type QuestionClassifierNodeProps = NodeProps<Node<BaseNodeData<QuestionClassifierNodeData>, typeof NODE_TYPE>>


export function QuestionClassifierNode({ id, data, selected, isConnectable }: QuestionClassifierNodeProps) {

    const cfg = data.nodeConfig
    const [sourceHandleId] = useState<string>(nanoid())
    return (
        <NodeCardWrapper type={NODE_TYPE} id={id} selected={selected} >
            <div className="p-3 space-y-3 text-xs">
                <div className='flex flex-col gap-1'>
                    <Typography.Text type="secondary" className="uppercase">
                        问题:
                    </Typography.Text>
                    <Typography.Text ellipsis >{cfg.inputText}</Typography.Text>

                    <CustomHandle
                        type="target"
                        id={sourceHandleId}
                        position={Position.Left}
                        isConnectable={isConnectable}
                        className="top-15! hover:(important:ring-2 important:ring-purple-500/50)"
                    />
                </div>
                <Divider />
                <div className='flex flex-col gap-1'>
                    <Typography.Text type="secondary" className="uppercase">
                        类别:
                    </Typography.Text>

                    {cfg.paths.length > 0 && (
                        <div className="mt-2 flex flex-col">
                            {cfg.paths.map((path: any) => (
                                <NodePath
                                    key={path.id}
                                    id={path.id}
                                    path={path}
                                    isConnectable={isConnectable}
                                />
                            ))}
                        </div>
                    )}
                </div>

            </div>
        </NodeCardWrapper>
    )
}

export const metadata: RegisterNodeMetadata<BaseNodeData<QuestionClassifierNodeData>> = {
    type: NODE_TYPE,
    node: memo(QuestionClassifierNode),
    detail: {
        icon: 'i-mynaui:git-branch',
        title: '问题分类器',
        description: 'AI识别问题类别 执行对应的路由进行处理',
    },
    connection: {
        inputs: 1,
        outputs: 0,
    },
    defaultData: {
        label: '问题分类器',
        inputConfig: {
            refInputs: []
        },
        nodeConfig: {
            inputText: '问题描述',
            paths: []
        },
        nodeOutput: [
            {
                name: 'className',
                required: true,
                label: '分类名称',
                type: InputTypeEnum.TEXT
            }
        ]
    },
    requiredVariable: [],
    propertyPanel: QuestionClassifierPropertyPanel
}