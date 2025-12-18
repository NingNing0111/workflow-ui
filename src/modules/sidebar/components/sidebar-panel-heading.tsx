import { Typography, Flex, theme } from 'antd'

type SidebarPanelHeadingProps = {
  icon: React.ReactNode
  title: string
}

export default function SidebarPanelHeading({
  icon,
  title,
}: SidebarPanelHeadingProps) {
  const { token } = theme.useToken()

  return (
    <Flex
      align="center"
      gap={8}
      style={{
        padding: `${token.paddingSM}px ${token.padding}px`,
        borderBottom: `1px solid ${token.colorSplit}`,
      }}
    >
      <span
        style={{
          display: 'flex',
          alignItems: 'center',
          color: token.colorTextSecondary,
          fontSize: token.fontSizeLG,
        }}
      >
        {icon}
      </span>

      <Typography.Text strong>
        {title}
      </Typography.Text>
    </Flex>
  )
}
