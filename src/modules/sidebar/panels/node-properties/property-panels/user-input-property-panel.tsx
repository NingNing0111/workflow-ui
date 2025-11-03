import { GetInputType, InputTypeOptions, type BaseNodeData, type BuilderNodeType } from '~/modules/nodes/types'

import type { UserInputNodeData } from '~/modules/nodes/nodes/user-input-node/user-input.node'
import { cn } from '~@/utils/cn';

type UserInputNodePropertyPanelProps = Readonly<{
    id: string;
    type: BuilderNodeType;
    data: BaseNodeData<UserInputNodeData>;
    updateData: (data: Partial<BaseNodeData<UserInputNodeData>>) => void;
}>

export default function UserInputNodePropertyPanel({ id, data, updateData }: UserInputNodePropertyPanelProps) {
    const userInputs = data.inputConfig.userInputs || []
    const handleAdd = () => {
        const newInput = {
            type: 1,
            name: `var_${Date.now()}`,
            label: "新变量",
            required: false,
        }
        updateData({
            inputConfig: {
                ...data.inputConfig,
                userInputs: [...userInputs, newInput],
            },
        })
    }
    // 删除某个变量
    const handleDelete = (index: number) => {
        updateData({
            inputConfig: {
                ...data.inputConfig,
                userInputs: userInputs.filter((_, i) => i !== index),
            },
        })
    }

    // 修改某个字段
    const handleChange = (index: number, key: string, value: any) => {
        const updated = userInputs.map((item, i) =>
            i === index ? { ...item, [key]: value } : item
        )
        updateData({
            inputConfig: {
                ...data.inputConfig,
                userInputs: updated,
            },
        })
    }
    return (
        <div className="flex flex-col gap-3 p-4">
            
            {userInputs.map((input, index) => {
                const typeInfo = GetInputType(input.type)
                return (
                    <div
                        key={index}
                        className="flex items-center gap-2 p-2 border border-light-700 rounded-lg bg-dark-500"
                    >
                        {/* 类型图标 */}
                        <div className={cn(typeInfo.icon, 'text-light-900/70 w-5 h-5 flex-shrink-0')} />

                        {/* 类型选择 */}
                        <select
                            value={input.type}
                            onChange={(e) => handleChange(index, 'type', Number(e.target.value))}
                            className="w-28 text-xs p-1 border border-light-500 rounded bg-dark-400 text-light-900 focus:outline-none focus:ring-1 focus:ring-primary"
                        >
                            {InputTypeOptions.map((opt: any) => (
                                <option key={opt.value} value={opt.value}>
                                    {opt.label}
                                </option>
                            ))}
                        </select>

                        {/* 标签 */}
                        <input
                            type="text"
                            value={input.label}
                            onChange={(e) => handleChange(index, 'label', e.target.value)}
                            placeholder="显示名称"
                            className="flex-1 text-xs p-1 border border-light-500 rounded bg-dark-400 text-light-900 focus:outline-none focus:ring-1 focus:ring-primary"
                        />

                        {/* 变量名 */}
                        <input
                            type="text"
                            value={input.name}
                            onChange={(e) => handleChange(index, 'name', e.target.value)}
                            placeholder="变量名"
                            className="flex-1 text-xs p-1 border border-light-500 rounded bg-dark-400 text-light-900 focus:outline-none focus:ring-1 focus:ring-primary"
                        />

                        {/* 删除按钮 */}
                        <button
                            type="button"
                            onClick={() => handleDelete(index)}
                            className="text-red-500 hover:text-red-600 p-1 rounded transition-colors duration-150"
                        >
                            <div className="i-mynaui:trash w-4 h-4" />
                        </button>
                    </div>
                )
            })}

            {/* 新增按钮 */}
            <button
                type="button"
                onClick={handleAdd}
                className="flex items-center gap-1 px-3 py-1 text-xs border border-light-700 rounded hover:bg-dark-400 transition-colors duration-150"
            >
                <div className="i-mynaui:plus w-4 h-4" /> 添加变量
            </button>
        </div>
    )
}
