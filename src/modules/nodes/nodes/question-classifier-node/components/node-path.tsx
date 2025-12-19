import { Position } from '@xyflow/react'
import { Typography } from 'antd';

import CustomHandle from '~/modules/flow-builder/components/handles/custom-handle'

type NodePathProps = Readonly<{
    id: string;
    path: { id: string; name: string };
    isConnectable: boolean;
}>

export function NodePath({ id, isConnectable, path }: NodePathProps) {
    return (
        <div className="relative h-10 flex items-center gap-x-2 px-4 -mx-4">
            <Typography.Text code >
                {path.name}
            </Typography.Text>
            <CustomHandle
                type="source"
                id={id}
                position={Position.Right}
                isConnectable={isConnectable}
                className="top-5! hover:(important:ring-2 important:ring-purple-500/50)"
            />
        </div>
    )
}
