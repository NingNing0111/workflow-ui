import { useState } from "react";
import type { UserInputNodeData } from "~/modules/nodes/nodes/user-input-node/user-input.node";
import { type NodeIOData, type BaseNodeData, type BuilderNodeType, InputTypeOptions } from "~/modules/nodes/types";
import UnavailableNodePropertyPanel from "~/modules/sidebar/panels/node-properties/property-panels/unavailable-property-panel";
import * as Dialog from "@radix-ui/react-dialog";
type UserInputNodePropertyPanelProps = Readonly<{
    id: string;
    type: BuilderNodeType;
    data: BaseNodeData<UserInputNodeData>;
    updateData: (data: Partial<BaseNodeData<UserInputNodeData>>) => void;
}>

const UserInputPropertyPanel = ({ id, data, updateData }: UserInputNodePropertyPanelProps) => {

    const [userInputs, setUserInputs] = useState<NodeIOData[]>(data.nodeConfig.userInputs)
    const [editingVar, setEditingVar] = useState<NodeIOData | null>(null);
    const [editingIndex, setEditingIndex] = useState<number | null>(null);


    // ===== 用户输入变量操作 =====
    const handleAddVariable = () => {
        const newVar: NodeIOData = {
            type: 1,
            name: `var_${userInputs.length + 1}`,
            label: `新变量`,
            required: false,
        };
        const newConfig = [...userInputs, newVar];
        setUserInputs(newConfig);
        updateData({ nodeConfig: { userInputs: newConfig }, nodeOutput: newConfig });
    };

    const handleDeleteVariable = (index: number) => {
        const newConfig = userInputs.filter((_, i) => i !== index);
        setUserInputs(newConfig);
        updateData({ nodeConfig: { userInputs: newConfig }, nodeOutput: newConfig });
    };

    const openEditDialog = (index: number) => {
        setEditingVar({ ...userInputs[index] });
        setEditingIndex(index);
    };

    const saveEdit = () => {
        if (editingIndex === null || !editingVar) return;
        const newConfig = userInputs.map((v, i) => (i === editingIndex ? editingVar : v));
        setUserInputs(newConfig);
        updateData({ nodeConfig: { userInputs: newConfig }, nodeOutput: newConfig });
        setEditingVar(null);
        setEditingIndex(null);
    };

    if (!userInputs) return <UnavailableNodePropertyPanel />;

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

            <div >
                <h3 className="text-sm font-semibold text-gray-300 mb-2">流程输入数据</h3>
                <div className="flex flex-col gap-2 bg-gray-600/20 p-2 rounded">
                    {userInputs.length > 0 ? <>
                        {userInputs.map((v, index) => (
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
    )
}


export default UserInputPropertyPanel