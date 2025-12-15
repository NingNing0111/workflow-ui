import { produce } from "immer";
import {  useEffect, useState } from "react";
import {
    BuilderNode,
    GetInputType,
    type BuilderNodeType,
    type NodeParamRefData,
} from "~/modules/nodes/types";
import { useNodePathPreOutputData } from "~/modules/flow-builder/hooks/use-node-path";
import { InfoCircledIcon } from "@radix-ui/react-icons";
import { Tooltip } from "radix-ui";


type NodeVariablePanelProps = Readonly<{
    id: string;
    type: BuilderNodeType;
    data: any;
}>;

const NodeVariablePropertiesPanel = ({ id, type, data }: NodeVariablePanelProps) => {
    const nodeData: any = produce(data, () => { });
    const preVariable = useNodePathPreOutputData(id);

    const [refInputs, setRefInputs] = useState<NodeParamRefData[]>([]);

    useEffect(() => {
        setRefInputs(data.inputConfig.refInputs)
    }, [data.inputConfig.refInputs])

    return (
        <div className="flex flex-col gap-6 p-4 ">
            {/* ===== 提示信息 ===== */}
            <div className="bg-gray-600/20 p-1 flex item-start rounded gap-2">
                <InfoCircledIcon className="text-orange-400 text-sm" />
                <span className="text-xs text-blue-100">
                    在编辑节点属性时，可通过 <code className="px-1 rounded text-blue-500">{'{变量名}'}</code> 来引用各输入节点的变量。
                </span>
            </div>


            {/* ===== 上游节点变量 ===== */}
            <div >
                <h3 className="text-sm font-semibold text-gray-300 mb-2">可用变量</h3>
                <div className="flex flex-col gap-3 bg-gray-600/20 p-2 rounded">
                    <Tooltip.Provider>
                        {preVariable && preVariable.length > 0 ? (
                            preVariable.map((item: any) => (
                                <div
                                    key={item.nodeId}
                                    className="border border-gray-700 rounded-lg p-3 bg-gray-800/50"
                                >
                                    <div className="text-xs text-gray-400 mb-2">来自节点：{item.nodeId}</div>
                                    <div className="flex flex-wrap gap-2">
                                        {item.data.map((v: any, index: number) => (
                                            <Tooltip.Root key={`${item.nodeId}-${v.name}-${index}`}>
                                                <Tooltip.Trigger asChild>
                                                    <span className="px-2 py-1 text-xs rounded-lg border border-gray-700 text-blue-500 flex items-center gap-1 cursor-pointer hover:bg-gray-700/70 transition">
                                                        {v.name}
                                                    </span>
                                                </Tooltip.Trigger>

                                                <Tooltip.Portal>
                                                    <Tooltip.Content
                                                        className="bg-gray-900 text-gray-100 text-xs rounded px-2 py-1 shadow-lg select-none"
                                                        side="top"
                                                        align="center"
                                                    >
                                                        {v.label} - {GetInputType(v.type).label}类型
                                                        <Tooltip.Arrow className="fill-gray-900" />
                                                    </Tooltip.Content>
                                                </Tooltip.Portal>
                                            </Tooltip.Root>
                                        ))}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-xs text-gray-400">暂无可用变量</p>
                        )}
                    </Tooltip.Provider>
                </div>
            </div>
            {/* ===== 引用输入变量 ===== */}
            {type !== "userInput" && (
                <div>
                    <h3 className="text-sm font-semibold text-gray-300 mb-2">引用节点变量</h3>

                    <div className="flex flex-col gap-3 bg-gray-600/20 p-2 rounded">
                        <Tooltip.Provider>

                            {refInputs && refInputs.length > 0 ? (
                                refInputs.map((item: any) => (
                                    <Tooltip.Root key={`${item.nodeId}-${item.nodeParamName}`}>

                                        <Tooltip.Trigger asChild>
                                            <span key={`${item.nodeId}-${item.nodeParamName}`} className="px-2 py-1 text-xs rounded-lg border border-gray-700 text-blue-500 flex items-center gap-1 cursor-pointer hover:bg-gray-700/70 transition">
                                                <code>{`{${item.nodeParamName}}`}</code>

                                            </span>

                                        </Tooltip.Trigger>

                                        <Tooltip.Portal>
                                            <Tooltip.Content
                                                className="bg-gray-900 text-gray-100 text-xs rounded px-2 py-1 shadow-lg select-none"
                                                side="top"
                                                align="center"
                                            >
                                                来自节点:{item.nodeId}
                                                <Tooltip.Arrow className="fill-gray-900" />
                                            </Tooltip.Content>
                                        </Tooltip.Portal>
                                    </Tooltip.Root>
                                ))
                            ) : (
                                <p className="text-xs text-gray-400">暂无可用变量</p>
                            )}
                        </Tooltip.Provider>

                    </div>
                </div>
            )}

            {/* ===== 输出变量 ===== */}
            {type !== BuilderNode.END && (
                <div>
                    <h3 className="text-sm font-semibold text-gray-300 mb-2">输出变量</h3>
                    <div className="flex flex-col gap-2 bg-gray-600/20 p-2 rounded">
                        {nodeData.nodeOutput.length > 0 ? <>
                            {nodeData.nodeOutput.map((ref: any) => (
                                <div
                                    key={ref.id + ref.name}
                                    className="flex justify-between items-center p-2 bg-gray-800 border border-gray-600 rounded-lg"
                                >
                                    <span className="text-xs text-gray-400"> {ref.label}</span>
                                    <span className="text-sm text-blue-500">{ref.name}</span>
                                </div>
                            ))}
                        </> : <p className="text-xs text-gray-400">该节点无输出变量</p>}
                    </div>

                </div>
            )}




        </div>
    );
};

export default NodeVariablePropertiesPanel;
