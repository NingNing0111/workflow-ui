import { DesktopSidebarFragment } from '~/modules/sidebar/fragments/desktop-sidebar-fragment'

import { useApplicationState } from '~/stores/application-state'

export function SidebarModule() {
  const {
    isMobileView,
    activePanel,
    showSidebar,
    setActivePanel,
    toggleSidebar,
  } = useApplicationState(s => ({
    isMobileView: s.view.mobile,
    activePanel: s.sidebar.active,
    showSidebar: s.sidebar.showSidebar,
    setActivePanel: s.actions.sidebar.setActivePanel,
    toggleSidebar: s.actions.sidebar.toggleSidebar,
  }))



  return (
    <DesktopSidebarFragment
      isMobileView={isMobileView}
      activePanel={activePanel}
      showSidebar={showSidebar}
      setActivePanel={setActivePanel}
      toggleSidebar={toggleSidebar}
    />
  )
}
