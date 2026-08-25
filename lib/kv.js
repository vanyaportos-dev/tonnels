// Обёртка над Vercel KV. Если переменные окружения KV не заданы (например,
// при локальной разработке без подключённой базы), автоматически включается
// хранилище в памяти процесса — удобно для теста, но данные пропадут при
// перезапуске сервера. Для продакшена на Vercel обязательно подключите
// интеграцию "Vercel KV" в панели проекта — тогда переменные подставятся
// автоматически и заявки будут сохраняться по-настоящему.

const hasRealKV = Boolean(
  process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN
);

let kvClient = null;
let memoryStore = null;

if (hasRealKV) {
  // eslint-disable-next-line global-require
  const { kv } = require('@vercel/kv');
  kvClient = kv;
} else {
  memoryStore = new Map();
}

async function kvGet(key) {
  if (kvClient) return kvClient.get(key);
  return memoryStore.has(key) ? memoryStore.get(key) : null;
}

async function kvSet(key, value) {
  if (kvClient) return kvClient.set(key, value);
  memoryStore.set(key, value);
  return 'OK';
}

async function kvLPush(key, value) {
  if (kvClient) return kvClient.lpush(key, value);
  const list = memoryStore.get(key) || [];
  list.unshift(value);
  memoryStore.set(key, list);
  return list.length;
}

async function kvLRange(key, start, stop) {
  if (kvClient) return kvClient.lrange(key, start, stop);
  const list = memoryStore.get(key) || [];
  const end = stop === -1 ? list.length : stop + 1;
  return list.slice(start, end);
}

async function kvLSet(key, index, value) {
  if (kvClient) return kvClient.lset(key, index, value);
  const list = memoryStore.get(key) || [];
  list[index] = value;
  memoryStore.set(key, list);
  return 'OK';
}

module.exports = {
  hasRealKV,
  kvGet,
  kvSet,
  kvLPush,
  kvLRange,
  kvLSet,
};
