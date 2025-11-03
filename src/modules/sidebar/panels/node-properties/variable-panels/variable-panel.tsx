import { useReactFlow } from "@xyflow/react";
import { produce } from "immer";
import { useCallback, useEffect, useState } from "react";
import type { BaseNodeData, BuilderNodeType, NodeIOData } from "~/modules/nodes/types";
import { trackSomethingInNodeProperties } from "~/utils/ga4";
import { cn } from "~@/utils/cn";
import * as Dialog from "@radix-ui/react-dialog";
import UnavailableNodePropertyPanel from "~/modules/sidebar/panels/node-properties/property-panels/unavailable-property-panel";


type NodeVariablePanelProps = Readonly<{ id: string; type: BuilderNodeType; data: any }>


const NodeVariablePropertiesPanel = ({ id, type, data }: NodeVariablePanelProps) => {
    useEffect(()=>{
        const nodeData:any = produce(data, () => {}) 
        setVariables(nodeData)
    },[data])
    const { setNodes } = useReactFlow();
    const [variables, setVariables] = useState<NodeIOData[]>([]);

    const [editingVar, setEditingVar] = useState<NodeIOData | null>(null);
    const [editingIndex, setEditingIndex] = useState<number | null>(null);

    const updateData = useCallback((newData: Partial<any>) => {
        setNodes(nds => produce(nds, draft => {
            const node = draft.find(n => n.id === id);
            if (node) node.data = { ...node.data, ...newData };
        }));
        trackSomethingInNodeProperties(`update-node-variable-properties-of-${type}`);
    }, [id, setNodes, type]);

    const handleAddVariable = () => {
        const newVar: NodeIOData = { type: 1, name: `var_${variables.length + 1}`, label: `新变量`, required: false };
        const newVars = [...variables, newVar];
        setVariables(newVars);
        updateData({ inputConfig: { userInputs: newVars } });
    };

    const handleDeleteVariable = (index: number) => {
        const newVars = variables.filter((_, i) => i !== index);
        setVariables(newVars);
        updateData({ inputConfig: { userInputs: newVars } });
    };

    const openEditDialog = (index: number) => {
        setEditingVar({ ...variables[index] });
        setEditingIndex(index);
    };

    const saveEdit = () => {
        if (editingIndex === null || !editingVar) return;
        const newVars = [...variables];
        newVars[editingIndex] = editingVar;
        setVariables(newVars);
        updateData({ inputConfig: { userInputs: newVars } });
        setEditingVar(null);
        setEditingIndex(null);
    };

    return  variables && variables.length > 0 ? <div className="flex flex-col gap-4 p-4">
            <div className="flex flex-col gap-2">
                {variables.map((v, index) => (
                    <div
                        key={v.name}
                        className="flex justify-between items-center p-2 bg-gray-800 border border-gray-600 rounded-lg cursor-pointer"
                        onClick={() => openEditDialog(index)}
                    >
                        <span className="text-sm text-gray-100">{v.name}</span>
                        <button
                            onClick={(e) => { e.stopPropagation(); handleDeleteVariable(index); }}
                            className="px-2 py-1 bg-red-600/50 text-red-100 rounded text-xs hover:bg-red-600/70"
                        >
                            删除
                        </button>
                    </div>
                ))}

                <button
                    onClick={handleAddVariable}
                    className="h-9 px-3 rounded-lg bg-blue-500/50 text-blue-100 text-sm font-medium hover:bg-blue-500/70"
                >
                    新增变量
                </button>
            </div>

            {/* 编辑弹窗 */}
            <Dialog.Root open={!!editingVar} onOpenChange={() => setEditingVar(null)}>
                <Dialog.Overlay className="fixed inset-0 bg-black/50" />
                <Dialog.Content className="fixed top-1/2 left-1/2 w-80 p-4 bg-gray-800 border border-gray-600 rounded-lg -translate-x-1/2 -translate-y-1/2">
                    <h3 className="text-sm font-medium text-gray-200 mb-2">编辑变量</h3>
                    {editingVar && (
                        <>
                            <input
                                type="text"
                                className="w-full p-2 mb-2 rounded bg-gray-700 text-sm text-gray-100 border border-gray-600"
                                value={editingVar.label}
                                onChange={(e) => setEditingVar({ ...editingVar, label: e.target.value })}
                                placeholder="变量标签"
                            />
                            <input
                                type="text"
                                className="w-full p-2 mb-2 rounded bg-gray-700 text-sm text-gray-100 border border-gray-600"
                                value={editingVar.name}
                                onChange={(e) => setEditingVar({ ...editingVar, name: e.target.value })}
                                placeholder="变量名称"
                            />
                            <select
                                className="w-full p-2 mb-2 rounded bg-gray-700 text-sm text-gray-100 border border-gray-600"
                                value={editingVar.type}
                                onChange={(e) => setEditingVar({ ...editingVar, type: Number(e.target.value) })}
                            >
                                <option value={1}>用户输入</option>
                                <option value={2}>系统变量</option>
                            </select>
                            <div className="flex justify-end gap-2 mt-2">
                                <Dialog.Close className="px-3 py-1 bg-gray-600 rounded hover:bg-gray-500 text-xs text-gray-100">取消</Dialog.Close>
                                <button onClick={saveEdit} className="px-3 py-1 bg-blue-500 rounded hover:bg-blue-600 text-xs text-white">保存</button>
                            </div>
                        </>
                    )}
                </Dialog.Content>
            </Dialog.Root>
        </div> : <>
        <UnavailableNodePropertyPanel />
        </>
    
};

export default NodeVariablePropertiesPanel;
