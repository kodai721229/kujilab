// Claudeアーティファクト外(実サイト)で動かすためのwindow.storage代替。
// claude.ai内のwindow.storage APIと同じインターフェースを、
// ブラウザのlocalStorageで再現する。

function ensureStoragePolyfill() {
  if (typeof window === 'undefined') return;
  if (window.storage && window.storage.__isClaudeNative) return; // 本物のartifact環境ならそのまま使う
  if (window.storage && window.storage.__isPolyfill) return; // 既に適用済み

  const PREFIX = 'kujilab_storage:';

  window.storage = {
    __isPolyfill: true,
    async get(key) {
      const raw = localStorage.getItem(PREFIX + key);
      if (raw === null) throw new Error('key not found');
      return { key, value: raw, shared: false };
    },
    async set(key, value) {
      localStorage.setItem(PREFIX + key, value);
      return { key, value, shared: false };
    },
    async delete(key) {
      localStorage.removeItem(PREFIX + key);
      return { key, deleted: true, shared: false };
    },
    async list(prefix) {
      const keys = [];
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (k && k.startsWith(PREFIX)) {
          const shortKey = k.slice(PREFIX.length);
          if (!prefix || shortKey.startsWith(prefix)) {
            keys.push({ key: shortKey });
          }
        }
      }
      return { keys, prefix, shared: false };
    },
  };
}

ensureStoragePolyfill();

export default ensureStoragePolyfill;
