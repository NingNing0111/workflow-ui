import { useReactFlow } from "@xyflow/react";
import { produce } from "immer";
import { useCallback, useEffect, useState } from "react";
import {
    BuilderNode,
    GetInputType,
    InputTypeOptions,
    type BuilderNodeType,
    type NodeIOData,
    type NodeParamRefData,
} from "~/modules/nodes/types";
import { trackSomethingInNodeProperties } from "~/utils/ga4";
import * as Dialog from "@radix-ui/react-dialog";
import UnavailableNodePropertyPanel from "~/modules/sidebar/panels/node-properties/property-panels/unavailable-property-panel";
import { useNodePathPreOutputData } from "~/modules/flow-builder/hooks/use-node-path";
import { InfoCircledIcon } from "@radix-ui/react-icons";
import { Label, Tooltip } from "radix-ui";


type NodeVariablePanelProps = Readonly<{
    id: string;
    type: BuilderNodeType;
    data: any;
}>;

const NodeVariablePropertiesPanel = ({ id, type, data }: NodeVariablePanelProps) => {
    const nodeData: any = produce(data, () => { });
    const { setNodes } = useReactFlow();
    const preVariable = useNodePathPreOutputData(id);

    const [inputConfig, setInputConfig] = useState<{
        userInputs: NodeIOData[];
        refInputs: NodeParamRefData[];
    }>({ userInputs: [], refInputs: [] });

    const [editingVar, setEditingVar] = useState<NodeIOData | null>(null);
    const [editingIndex, setEditingIndex] = useState<number | null>(null);

    const updateData = useCallback(
        (newData: Partial<any>) => {
            setNodes((nds) =>
                produce(nds, (draft) => {
                    const node = draft.find((n) => n.id === id);
                    if (node) node.data = { ...node.data, ...newData };
                })
            );
            trackSomethingInNodeProperties(`update-node-variable-properties-of-${type}`);
        },
        [id]
    );

    useEffect(() => {
        setInputConfig(nodeData.inputConfig);
    }, [data]);

    // ===== 用户输入变量操作 =====
    const handleAddVariable = () => {
        const newVar: NodeIOData = {
            type: 1,
            name: `var_${inputConfig.userInputs.length + 1}`,
            label: `新变量`,
            required: false,
        };
        const newConfig = {
            ...inputConfig,
            userInputs: [...inputConfig.userInputs, newVar],
        };
        setInputConfig(newConfig);
        updateData({ inputConfig: newConfig });
    };

    const handleDeleteVariable = (index: number) => {
        const newConfig = {
            ...inputConfig,
            userInputs: inputConfig.userInputs.filter((_, i) => i !== index),
        };
        setInputConfig(newConfig);
        updateData({ inputConfig: newConfig });
    };

    const openEditDialog = (index: number) => {
        setEditingVar({ ...inputConfig.userInputs[index] });
        setEditingIndex(index);
    };

    const saveEdit = () => {
        if (editingIndex === null || !editingVar) return;
        const newConfig = {
            ...inputConfig,
            userInputs: inputConfig.userInputs.map((v, i) => (i === editingIndex ? editingVar : v)),
        };
        setInputConfig(newConfig);
        updateData({ inputConfig: newConfig });
        setEditingVar(null);
        setEditingIndex(null);
    };

    if (!inputConfig) return <UnavailableNodePropertyPanel />;

    return (
        <div className="flex flex-col gap-6 p-4 ">
            {/* ===== 提示信息 ===== */}
            <div className="bg-gray-600/20 p-1 flex item-start rounded gap-2">
                <InfoCircledIcon className="text-orange-400 text-sm" />
                <span className="text-xs text-blue-100">
                    在编辑节点的属性时，可通过 <code className="px-1 rounded text-blue-500">{'{变量名}'}</code> 来引用变量。
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

            {/* ===== 输入变量 ===== */}
            {type === "user-input" && (
                <div >
                    <h3 className="text-sm font-semibold text-gray-300 mb-2">输入变量</h3>
                    <div className="flex flex-col gap-2 bg-gray-600/20 p-2 rounded">
                        {inputConfig.userInputs.length > 0 ? <>
                            {inputConfig.userInputs.map((v, index) => (
                                <div
                                    key={v.name}
                                    className="flex justify-between items-center p-2 bg-gray-800 border border-gray-600 rounded-lg cursor-pointer hover:bg-gray-700/80"
                                    onClick={() => openEditDialog(index)}
                                >
                                    <span className="text-sm text-blue-500">{v.name}</span>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleDeleteVariable(index);
                                        }}
                                        className="px-2 py-1 bg-red-600/50 text-red-100 rounded text-xs hover:bg-red-600/70"
                                    >
                                        <div className="i-mynaui:trash size-4" />
                                    </button>
                                </div>
                            ))}
                        </> :
                            <p className="text-xs text-gray-400">输入变量</p>
                        }
                    </div>


                    <button
                        onClick={handleAddVariable}
                        className="mt-2 h-9 w-full rounded-lg bg-blue-500/50 text-blue-100 text-sm font-medium hover:bg-blue-500/70"
                    >
                        + 添加变量
                    </button>
                </div>
            )}

            {/* ===== 引用输入变量 ===== */}
            {type !== "user-input" && (
                <div>
                    <h3 className="text-sm font-semibold text-gray-300 mb-2">引用节点变量</h3>

                    <div className="flex flex-col gap-3 bg-gray-600/20 p-2 rounded">
                        <Tooltip.Provider>
                            {inputConfig.refInputs && inputConfig.refInputs.length > 0 ? (
                                inputConfig.refInputs.map((item: any) => (
                                    <div
                                        key={item.nodeId}
                                        className="border border-gray-700 rounded-lg p-3 bg-gray-800/50"
                                    >
                                        <div className="text-xs text-gray-400 mb-2">来自节点：{item.nodeId}</div>
                                        <div className="text-xs text-gray-400 mb-2 flex items-center gap-2">
                                            变量名：
                                            <span className="px-2 py-1 text-xs rounded-lg border border-gray-700 text-blue-500 flex items-center gap-1 cursor-pointer hover:bg-gray-700/70 transition">
                                                {item.nodeParamName}
                                            </span>
                                        </div>

                                    </div>
                                ))
                            ) : (
                                <p className="text-xs text-gray-400">暂无可用变量</p>
                            )}
                        </Tooltip.Provider>
                    </div>
                </div>
            )}

            {/* ===== 输出变量 ===== */}
            {type !== BuilderNode.END && type !== BuilderNode.USER_INPUT && (
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

            {type === BuilderNode.USER_INPUT && (
                <div>
                    <h3 className="text-sm font-semibold text-gray-300 mb-2">输出变量</h3>
                    <div className="flex flex-col gap-2 bg-gray-600/20 p-2 rounded">
                        {inputConfig.userInputs.length > 0 ? <>
                            {inputConfig.userInputs.map((ref: any) => (
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

            {/* ===== 编辑变量弹窗 (Radix Dialog) ===== */}
            <Dialog.Root open={!!editingVar} onOpenChange={() => setEditingVar(null)}>
                <Dialog.Portal>
                    <Dialog.Overlay className="fixed inset-0 bg-black/50" />
                    <Dialog.Content className="fixed top-1/2 left-1/2 w-80 p-4 bg-gray-800 border border-gray-600 rounded-lg -translate-x-1/2 -translate-y-1/2">
                        <h3 className="text-sm font-medium text-gray-200 mb-2">编辑变量</h3>
                        {editingVar && (
                            <>
                                <input
                                    type="text"
                                    className="w-full p-2 mb-2 rounded bg-gray-700 text-sm text-gray-100 border border-gray-600"
                                    value={editingVar.label}
                                    onChange={(e) =>
                                        setEditingVar({ ...editingVar, label: e.target.value })
                                    }
                                    placeholder="变量标签"
                                />
                                <input
                                    type="text"
                                    className="w-full p-2 mb-2 rounded bg-gray-700 text-sm text-gray-100 border border-gray-600"
                                    value={editingVar.name}
                                    onChange={(e) =>
                                        setEditingVar({ ...editingVar, name: e.target.value })
                                    }
                                    placeholder="变量名称"
                                />
                                <select
                                    className="w-full p-2 mb-2 rounded bg-gray-700 text-sm text-gray-100 border border-gray-600"
                                    value={editingVar.type}
                                    onChange={(e) =>
                                        setEditingVar({ ...editingVar, type: Number(e.target.value) })
                                    }
                                >
                                    {InputTypeOptions.map((item) => (
                                        <option key={item.value} value={item.value}>
                                            {item.label}
                                        </option>
                                    ))}
                                </select>
                                <div className="flex justify-end gap-2 mt-2">
                                    <Dialog.Close className="px-3 py-1 bg-gray-600 rounded hover:bg-gray-500 text-xs text-gray-100">
                                        取消
                                    </Dialog.Close>
                                    <button
                                        onClick={saveEdit}
                                        className="px-3 py-1 bg-blue-500 rounded hover:bg-blue-600 text-xs text-white"
                                    >
                                        保存
                                    </button>
                                </div>
                            </>
                        )}
                    </Dialog.Content>
                </Dialog.Portal>
            </Dialog.Root>
        </div>
    );
};

export default NodeVariablePropertiesPanel;
