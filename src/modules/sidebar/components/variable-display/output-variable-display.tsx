import { Space, Tag, Tooltip, Typography } from "antd";
import { GetInputType, type InputTypeNumer, } from "~/modules/nodes/types";

export interface OutputVariableProps {
    name: string; // 变量名称
    type: InputTypeNumer; // 变量类型
    desc: string; // 变量描述
}


const OutputVariableDisplay = ({ name, type, desc }: OutputVariableProps) => {
    const inputType = GetInputType(type);
    return (
        <div className="py-1">
            <Space orientation="vertical" size={2} className="w-full">
                {/* 名称 + 类型 */}
                <Space size={4}>
                    <Typography.Text  strong>{name}</Typography.Text>
                    {/* <Typography.Text code>{inputType.name}</Typography.Text> */}
                    <Tag color={inputType.color} style={{ fontSize: 12 }}>
                        {inputType.name}
                    </Tag>
                </Space>

                {/* 描述 */}
                {desc && (
                    <Tooltip title={desc}>
                        <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                            {desc}
                        </Typography.Text>
                    </Tooltip>
                )}
            </Space>
        </div>
    )
}

export default OutputVariableDisplay;