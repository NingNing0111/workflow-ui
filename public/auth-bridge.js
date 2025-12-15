/**
 * auth-bridge.js
 *
 * Vue / React 共享的认证通信桥
 * - 不依赖任何框架
 * - 只做 postMessage 通信
 * - Vue 是 Auth Owner
 * - React 是 Auth Consumer
 */

(function (global) {
  const ORIGIN = window.location.origin;

  const EVENTS = {
    AUTH_REQUEST: 'AUTH_REQUEST',
    AUTH_RESPONSE: 'AUTH_RESPONSE',
    AUTH_LOGOUT: 'AUTH_LOGOUT',
    AUTH_REQUIRED: 'AUTH_REQUIRED',
  };

  let listeners = [];
  let inited = false;

  function init() {
    if (inited) return;
    inited = true;

    window.addEventListener('message', handleMessage);
  }

  function destroy() {
    window.removeEventListener('message', handleMessage);
    inited = false;
  }

  function handleMessage(e) {
    if (e.origin !== ORIGIN) return;
    const { type, payload } = e.data || {};

    if (type === EVENTS.AUTH_RESPONSE) {
      listeners.forEach((fn) => fn(payload || null));
    }

    if (type === EVENTS.AUTH_LOGOUT) {
      listeners.forEach((fn) => fn(null));
    }
  }

  /**
   * React → Vue
   * 请求认证信息
   */
  function requestAuth() {
    if (window.parent && window.parent !== window) {
      window.parent.postMessage({ type: EVENTS.AUTH_REQUEST }, ORIGIN);
    }
  }

  /**
   * Vue → React
   * 返回认证信息
   */
  function respondAuth(payload) {
    window.postMessage(
      {
        type: EVENTS.AUTH_RESPONSE,
        payload: payload || null,
      },
      ORIGIN
    );
  }

  /**
   * Vue → React
   * 通知登出
   */
  function notifyLogout() {
    window.postMessage({ type: EVENTS.AUTH_LOGOUT }, ORIGIN);
  }

  /**
   * React → Vue
   * 通知需要登录
   */
  function notifyAuthRequired() {
    if (window.parent && window.parent !== window) {
      window.parent.postMessage({ type: EVENTS.AUTH_REQUIRED }, ORIGIN);
    }
  }

  /**
   * React 侧监听认证变化
   */
  function onAuthChange(fn) {
    if (typeof fn !== 'function') return () => {};
    listeners.push(fn);
    return () => {
      listeners = listeners.filter((l) => l !== fn);
    };
  }

  global.AuthBridge = {
    init,
    destroy,
    requestAuth,
    respondAuth,
    notifyLogout,
    notifyAuthRequired,
    onAuthChange,
    EVENTS,
  };
})(window);
