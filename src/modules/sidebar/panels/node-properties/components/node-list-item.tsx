import type { ComponentPropsWithoutRef } from 'react'
import { isEmpty } from 'radash'
import { Flex, Typography, theme, Tag } from 'antd'

import { truncateMiddle } from '~/utils/string'

type NodeListItemProps = Readonly<
  ComponentPropsWithoutRef<'div'> & {
    icon: string
    title: string
    id?: string
    selected?: boolean
    pseudoSelected?: boolean
  }
>

export function NodeListItem({
  id,
  title,
  icon,
  selected,
  pseudoSelected,
  className,
  ...props
}: NodeListItemProps) {
  const { token } = theme.useToken()

  const background = selected
    ? token.colorPrimaryBg
    : pseudoSelected
      ? token.colorFillSecondary
      : 'transparent'

  const borderColor = selected
    ? token.colorPrimary
    : 'transparent'

  return (
    <div
      {...props}
      className={className}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        minHeight: 32,
        paddingInline: token.paddingSM,
        borderRadius: token.borderRadiusLG,
        border: `1px solid ${borderColor}`,
        background,
        cursor: 'pointer',
        userSelect: 'none',
        transition: `
          background-color .15s ease,
          border-color .15s ease,
          box-shadow .15s ease
        `,
      }}
    >
      {/* Left */}
      <Flex align="center" gap={token.marginXS}>
        <span
          className={icon}
          style={{
            fontSize: 16,
            color: selected
              ? token.colorPrimary
              : token.colorTextSecondary,
          }}
        />

        <Typography.Text
          style={{
            fontSize: token.fontSizeSM,
            fontWeight: 500,
            textTransform: 'uppercase',
            letterSpacing: '0.04em',
            color: token.colorText,
            lineHeight: 1,
          }}
        >
          {title}
        </Typography.Text>
      </Flex>

      {/* Right */}
      {(id && !isEmpty(id)) && (
        <Tag
          bordered={false}
          style={{
            background: token.colorFillTertiary,
            color: token.colorTextSecondary,
            fontSize: token.fontSizeSM - 2,
            fontWeight: 600,
            paddingInline: 6,
            marginInlineEnd: 0,
          }}
        >
          {truncateMiddle(id, 12)}
        </Tag>
      )}
    </div>
  )
}
