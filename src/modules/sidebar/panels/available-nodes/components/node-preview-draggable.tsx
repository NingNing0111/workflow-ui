import type { DragEvent, ReactNode } from 'react'
import type { BuilderNodeType } from '~/modules/nodes/types'
import type { ApplicationState } from '~/stores/application-state'
import type { useInsertNode } from '~/modules/flow-builder/hooks/use-insert-node'

import { useCallback } from 'react'
import { Card, Flex, Typography, theme } from 'antd'

import { NODE_TYPE_DRAG_DATA_FORMAT } from '~/constants/symbols'

type NodePreviewDraggableProps = Readonly<{
  icon: string | ReactNode
  title: string
  description: string
  type: string
  isMobileView: boolean
  setActivePanel: (panel: ApplicationState['sidebar']['active']) => void
  insertNode: ReturnType<typeof useInsertNode>
}>

export function NodePreviewDraggable({
  icon,
  title,
  description,
  type,
  isMobileView,
  setActivePanel,
  insertNode,
}: NodePreviewDraggableProps) {
  const { token } = theme.useToken()

  const onDragStart = useCallback(
    (e: DragEvent) => {
      if (isMobileView) return

      e.dataTransfer.setData(NODE_TYPE_DRAG_DATA_FORMAT, type)
      e.dataTransfer.effectAllowed = 'move'
    },
    [isMobileView, type],
  )

  const onClick = useCallback(() => {
    if (!isMobileView) return

    insertNode(type as BuilderNodeType)
    setActivePanel('none')
  }, [insertNode, isMobileView, setActivePanel, type])

  return (
    <Card
      hoverable
      size="small"
      draggable
      onClick={onClick}
      onDragStart={onDragStart}
      data-vaul-no-drag
      styles={{
        body: {
          padding: token.paddingSM,
        },
      }}
      style={{
        cursor: isMobileView ? 'pointer' : 'grab',
        borderRadius: token.borderRadiusLG,
        boxShadow: token.boxShadowTertiary,
        transition: 'transform .15s ease, box-shadow .15s ease',
      }}
      onMouseDown={e => {
        if (!isMobileView) return
        e.currentTarget.style.transform = 'scale(.98)'
      }}
      onMouseUp={e => {
        e.currentTarget.style.transform = 'scale(1)'
      }}
    >
      <Flex gap={token.marginSM} align="flex-start">
        {/* Icon */}
        <Flex
          align="center"
          justify="center"
          style={{
            width: 40,
            height: 40,
            borderRadius: token.borderRadiusLG,
            background: token.colorFillSecondary,
            border: `1px solid ${token.colorBorderSecondary}`,
            flexShrink: 0,
          }}
        >
          {typeof icon === 'string'
            ? <span className={icon} style={{ fontSize: 20, color: token.colorText }} />
            : icon}
        </Flex>

        {/* Text */}
        <Flex vertical style={{ flex: 1 }}>
          <Typography.Text strong>
            {title}
          </Typography.Text>

          <Typography.Text
            type="secondary"
            style={{
              fontSize: token.fontSizeSM,
              marginTop: 4,
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {description}
          </Typography.Text>
        </Flex>
      </Flex>
    </Card>
  )
}
