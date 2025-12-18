import { RouterProvider } from '@tanstack/react-router'

import { Analytics } from '@vercel/analytics/react'
import { setAutoFreeze } from 'immer'
import { ClickScrollPlugin, OverlayScrollbars } from 'overlayscrollbars'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { router } from '~@/router'

import { ApplicationStateProvider } from '~/stores/application-state'

import 'virtual:uno.css'
import '~/assets/styles/global.scss'
import "@radix-ui/themes/styles.css";
import { useAuthStore } from '~/stores/authStore'
import { AppAppearanceProvider, } from '~/stores/appearanceStore'

AuthBridge.init();

// 接收 Vue 返回的认证信息
AuthBridge.onAuthChange((payload: any) => {
  console.log("接收到消息", payload);

  useAuthStore.getState().setAccess(payload);
});

// React 启动后请求认证
AuthBridge.requestAuth();

// ReactGA.initialize('G-CJM5ZGWSKN')
OverlayScrollbars.plugin(ClickScrollPlugin)
setAutoFreeze(false)

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ApplicationStateProvider>
      <AppAppearanceProvider>
        <RouterProvider router={router} />
      </AppAppearanceProvider>
    </ApplicationStateProvider>
  </React.StrictMode>,
)
