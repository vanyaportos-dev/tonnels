const { kvGet, kvSet } = require('./kv');

// Простой реестр пользователей (map userId -> true) и их баланс звёзд.
// Хранится как JSON-объект под одним ключом — этого достаточно для тестовой
// фазы; при по-настоящему большом числе пользователей лучше заменить на
// нативный SET в Redis/KV.

async function registerUser(userId) {
  const index = (await kvGet('users:index')) || {};
  if (!index[userId]) {
    index[userId] = true;
    await kvSet('users:index', index);
  }
}

async function listUserIds() {
  const index = (await kvGet('users:index')) || {};
  return Object.keys(index);
}

async function getBalance(userId) {
  const value = await kvGet(`balance:${userId}`);
  return Number(value) || 0;
}

async function addBalance(userId, amount) {
  const current = await getBalance(userId);
  const next = current + amount;
  await kvSet(`balance:${userId}`, next);
  return next;
}

module.exports = { registerUser, listUserIds, getBalance, addBalance };
