import { create } from 'zustand';

export interface AccessPayload {
  accessToken: string | null;
  refreshToken: string | null;
  accessCodes: string[];
  isLockScreen: boolean;
  lockScreenPassword?: string;
}

interface AuthState {
  /** 来自 Vue 的认证信息 */
  access: AccessPayload | null;

  /** 是否已登录 */
  isAuthenticated: boolean;

  isReady: boolean;

  /** 是否拥有权限 */
  hasPermission: (code: string) => boolean;

  /** Vue → React 设置认证信息 */
  setAccess: (access: AccessPayload | null) => void;

  /** 清空认证信息（logout / 401） */
  clear: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  access: null,

  isAuthenticated: false,

  hasPermission: (code) => {
    return !!get().access?.accessCodes?.includes(code);
  },
  isReady: false,
  setAccess: (access) => {
    set({
      access,
      isAuthenticated: !!access?.accessToken,
      isReady: true
    });
  },

  clear: () => {
    set({
      access: null,
      isAuthenticated: false,
      isReady: false
    });
  },
}));
