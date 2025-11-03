import { Position } from '@xyflow/react'

import CustomHandle from '~/modules/flow-builder/components/handles/custom-handle'

type NodePathProps = Readonly<{
  id: string;
  type: string;
  code: string;
  isConnectable: boolean;
}>

export function TargetPrompt({ id, isConnectable, type, code }: NodePathProps) {
  return (
    <div className="relative h-10 flex items-center gap-x-2 px-4 -mx-4">
      <div className="flex flex-col gap-1">
        <label className="text-dark-50 text-[11px] uppercase">{type}</label>
        <div className="bg-dark-100/50 border border-dark-200 rounded-md px-2 py-1 text-light-900 text-[11px] leading-snug line-clamp-2 select-text">
          {code}
        </div>
      </div>

      <CustomHandle
        type="target"
        id={id}
        position={Position.Left}
        isConnectable={isConnectable}
        className="top-5! hover:(important:ring-2 important:ring-purple-500/50)"
      />
    </div>
  )
}
