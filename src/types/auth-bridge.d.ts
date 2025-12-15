// src/types/auth-bridge.d.ts
export { };

declare global {
  interface Window {
    AuthBridge: AuthBridge;
  }

  const AuthBridge: AuthBridge;

  interface AuthBridge {
    init(): void;
    destroy(): void;

    requestAuth(): void;
    respondAuth(payload: AuthPayload | null): void;

    notifyLogout(): void;
    notifyAuthRequired(): void;

    onAuthChange(
      listener: (payload: AuthPayload | null) => void
    ): () => void;

    EVENTS: {
      AUTH_REQUEST: 'AUTH_REQUEST';
      AUTH_RESPONSE: 'AUTH_RESPONSE';
      AUTH_LOGOUT: 'AUTH_LOGOUT';
      AUTH_REQUIRED: 'AUTH_REQUIRED';
    };
  }

  interface AuthPayload {
    accessToken: string | null;
    refreshToken?: string | null;
    accessCodes?: string[];
  }
}
