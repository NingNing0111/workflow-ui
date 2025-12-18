import { Result, Typography, theme } from 'antd'
import { InfoCircleOutlined } from '@ant-design/icons'

export default function NoVariablePanel() {
  const { token } = theme.useToken()

  return (
    <Result
      icon={
        <InfoCircleOutlined
            style={{
              fontSize: 28,
              color: token.colorTextSecondary,
            }}
          />
      }
      title={
        <Typography.Text
          style={{
            fontWeight: 500,
            color: token.colorText,
          }}
        >
          无可用的变量
        </Typography.Text>
      }
      subTitle={
        <Typography.Text
          type="secondary"
          style={{
            fontSize: 12,
            lineHeight: 1.6,
            maxWidth: 260,
            display: 'inline-block',
          }}
        >
          该节点不允许使用变量，或该节点未被选中。
        </Typography.Text>
      }
      extra={
        <Typography.Text
          type="secondary"
          italic
          style={{
            fontSize: 12,
          }}
        >
          选择另一个节点以查看其变量。
        </Typography.Text>
      }
    />
  )
}
