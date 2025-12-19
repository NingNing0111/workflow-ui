import { FunctionOutlined } from "@ant-design/icons";
import { Typography, Space, theme, Tooltip, Tag } from "antd";

export interface InputVariableProps {
    name: string;   // 变量名
    prefix?: string; // 前缀，来源节点
}

const InputVariableDisplay = ({ name, prefix }: InputVariableProps) => {
    const { token } = theme.useToken();

    return (
        <Tooltip title={name}>
            <div
                className="inline-flex items-center rounded-[5px] px-2 py-1 gap-1"
                style={{ backgroundColor: token.colorBgTextHover }}
            >
                <FunctionOutlined style={{ color: token.colorPrimary, fontSize: 16 }} />
                <Typography.Text
                    ellipsis
                    style={{ maxWidth: 120, fontSize: 12, color: token.colorTextSecondary, textTransform: 'capitalize' }}
                >
                    {`${prefix ? `${prefix} / ` : ''}  ${name}`}
                </Typography.Text>
            </div>
        </Tooltip>
    );
};

export default InputVariableDisplay;
