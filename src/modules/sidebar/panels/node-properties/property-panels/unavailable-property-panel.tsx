import { Result, Typography, theme } from 'antd'
import { InfoCircleOutlined } from '@ant-design/icons'

export default function UnavailableNodePropertyPanel() {
  const { token } = theme.useToken()

  return (
    <Result
      icon={
        <InfoCircleOutlined
            style={{
              fontSize: 24,
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
          不可用的属性
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
          该节点没有可用属性，或者该节点未被选中。
        </Typography.Text>
      }
      extra={
        <Typography.Text
          type="secondary"
          italic
          style={{ fontSize: 12 }}
        >
          选择另一个节点以查看其属性。
        </Typography.Text>
      }
      style={{
        height: '100%',
        padding: 16,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
      }}
    />
  )
}
