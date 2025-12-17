import type { BuilderNodeType } from '~/modules/nodes/types'

import { immer } from 'zustand/middleware/immer'

import { createStoreContext, defineStoreInstance } from '~@/store'
export type ActiveType = "available-nodes" | "node-properties" | "exist-nodes" | "online-debug" | "none";

interface State {
  view: {
    mobile: boolean;
  };
  builder: {
    blurred: boolean;
  };
  sidebar: {
    showSidebar: boolean;
    active: ActiveType;
    panels: {
      nodeProperties: {
        selectedNode: { id: string; type: BuilderNodeType } | null | undefined;
        paneSizes: (string | number)[];
      };
    };
  };
}

interface Actions {
  actions: {
    view: {
      setMobileView: (isMobile: boolean) => void;
    };
    builder: {
      setBlur: (blur: boolean) => void;
    };
    sidebar: {
      setShowSidebar: (show: boolean) => void;
      toggleSidebar: () => void;
      setActivePanel: (panel: ActiveType) => void;
      showNodePropertiesOf: (node: { id: string; type: BuilderNodeType }) => void;
      panels: {
        nodeProperties: {
          setSelectedNode: (node: { id: string; type: BuilderNodeType } | undefined | null) => void;
          setPaneSizes: (sizes: (string | number)[]) => void;
        };
      };
    };
  };
}

const applicationStateInstance = defineStoreInstance<State, Actions>((init) => {
  return immer(set => ({
    ...init,
    actions: {
      view: {
        setMobileView: isMobile => set((state) => {
          state.view.mobile = isMobile
        }),
      },
      builder: {
        setBlur: blur => set((state) => {
          state.builder.blurred = blur
        }),
      },
      sidebar: {
        setShowSidebar: show => set((state) => {
          state.sidebar.showSidebar = show
        }),
        toggleSidebar: () => set((state) => {
          state.sidebar.showSidebar = !state.sidebar.showSidebar
        }),
        setActivePanel: panel => set((state) => {
          state.sidebar.active = panel
        }),
        showNodePropertiesOf: node => set((state) => {
          state.sidebar.showSidebar = true
          state.sidebar.active = 'node-properties'
          state.sidebar.panels.nodeProperties.selectedNode = node
        }),
        panels: {
          nodeProperties: {
            setSelectedNode: node => set((state) => {
              state.sidebar.panels.nodeProperties.selectedNode = node
            }),
            setPaneSizes: sizes => set((state) => {
              state.sidebar.panels.nodeProperties.paneSizes = sizes
            }),
          },
        },
      },
    },
  }))
}, {
  view: {
    mobile: false,
  },
  builder: {
    blurred: false,
  },
  sidebar: {
    showSidebar: false,
    active: 'none',
    panels: {
      nodeProperties: {
        selectedNode: null,
        paneSizes: ['40%', 'auto'],
      },
    },
  },
})

export const [ApplicationStateProvider, useApplicationState] = createStoreContext<State, Actions>(applicationStateInstance)

export type ApplicationState = State
