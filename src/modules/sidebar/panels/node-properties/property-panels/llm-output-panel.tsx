import type { BuilderNodeType } from '~/modules/nodes/types'

import { cn } from '~@/utils/cn'

import type { LLMOutputNodeData } from '~/modules/nodes/nodes/output-node/output.node'

type LLMOutputNodePropertyPanelProps = Readonly<{
    id: string;
    type: BuilderNodeType;
    data: LLMOutputNodeData;
    updateData: (data: Partial<LLMOutputNodeData>) => void;
}>


export default function LLMOutputNodePropertyPanel({ id, data, updateData }: LLMOutputNodePropertyPanelProps) {

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

            {/* 是否流式输出 */}
            <div className="flex flex-col">
                <div className="text-xs text-light-900/60 font-semibold mb-2">
                    流式输出
                </div>
                <div className="flex items-center gap-3">
                    <button
                        type="button"
                        onClick={() => updateData({ stream: !data.stream })}
                        className={cn(
                            "relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2",
                            data.stream ? "!bg-green-500" : "!bg-gray-500"
                        )}
                    >
                        <span
                            className={cn(
                                "inline-block h-5 w-5 rounded-full shadow-md transition-all duration-300",
                                data.stream
                                    ? "translate-x-5 bg-white shadow-[0_0_8px_rgba(34,197,94,0.8)]"
                                    : "translate-x-0.5 bg-gray-300 shadow-[0_0_4px_rgba(0,0,0,0.5)]"
                            )}
                        />
                    </button>
                    <span
                        className={cn(
                            "text-sm font-medium transition-colors duration-300",
                            data.stream ? "text-green-400" : "text-gray-400"
                        )}
                    >
                        {data.stream ? "已开启" : "未开启"}
                    </span>
                </div>
            </div>

        </div>
    )
}