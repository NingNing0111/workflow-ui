// app-appearance-store.ts
import type { StateCreator } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { createStoreContext, defineStoreInstance } from '~@/store'

/** ========= State ========= */
export type AppAppearanceState = {
    theme: 'light' | 'dark',
}

/** ========= Actions ========= */
export type AppAppearanceActions = {
    toggleTheme: () => void
    setTheme: (theme: 'light' | 'dark') => void
    resetAppearance: () => void
}


const createAppAppearanceStore = (
    init: AppAppearanceState
): StateCreator<
    AppAppearanceState & AppAppearanceActions,
    [],
    [['zustand/immer', never]]
> =>
    immer((set) => ({
        ...init,
        toggleTheme() {
            set(state => {
                state.theme = state.theme === 'dark' ? 'light' : 'dark'
            })
        },
        setTheme(theme) {
            set(state => {
                state.theme = theme
            })
        },
        resetAppearance() {
            set(() => init)
        },
    }))


const applicationStateInstance =
    defineStoreInstance<AppAppearanceState, AppAppearanceActions>(
        createAppAppearanceStore,
        {
            theme: 'dark',
        }
    )

export const [
    AppAppearanceProvider,
    useAppAppearanceStore,
    withAppAppearanceProvider,
] = createStoreContext<AppAppearanceState, AppAppearanceActions>(applicationStateInstance)
