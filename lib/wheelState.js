const { kvGet, kvSet, kvLPush, kvLRange } = require('./kv');

const BONUS_CAP = 3; // максимум дополнительных вращений в сутки (за "ещё вращение")

function today() {
  return new Date().toISOString().slice(0, 10);
}

async function getState(userId) {
  const day = (await kvGet(`wheel:day:${userId}`)) || '';
  let spinsLeft = Number((await kvGet(`wheel:spinsLeft:${userId}`)) || 0);
  let bonusUsed = Number((await kvGet(`wheel:bonusUsed:${userId}`)) || 0);

  if (day !== today()) {
    spinsLeft = 1;
    bonusUsed = 0;
    await kvSet(`wheel:day:${userId}`, today());
    await kvSet(`wheel:spinsLeft:${userId}`, spinsLeft);
    await kvSet(`wheel:bonusUsed:${userId}`, bonusUsed);
  }

  return { spinsLeft, bonusUsed, bonusCap: BONUS_CAP };
}

async function consumeSpin(userId) {
  const state = await getState(userId);
  if (state.spinsLeft <= 0) return null;
  const next = state.spinsLeft - 1;
  await kvSet(`wheel:spinsLeft:${userId}`, next);
  return { ...state, spinsLeft: next };
}

async function grantBonusSpin(userId) {
  const state = await getState(userId);
  if (state.bonusUsed >= BONUS_CAP) return { ...state, granted: false };
  await kvSet(`wheel:bonusUsed:${userId}`, state.bonusUsed + 1);
  await kvSet(`wheel:spinsLeft:${userId}`, state.spinsLeft + 1);
  return { spinsLeft: state.spinsLeft + 1, bonusUsed: state.bonusUsed + 1, bonusCap: BONUS_CAP, granted: true };
}

// Промокод "бесплатное вращение" — выдаёт попытку сверх обычных лимитов,
// не расходуя дневной лимит бонусов (это отдельная награда).
async function grantPromoSpin(userId) {
  const state = await getState(userId);
  await kvSet(`wheel:spinsLeft:${userId}`, state.spinsLeft + 1);
  return { ...state, spinsLeft: state.spinsLeft + 1 };
}

async function pushRecentWin(entry) {
  await kvLPush('wheel:recent', entry);
}

async function getRecentWins(limit = 8) {
  const items = await kvLRange('wheel:recent', 0, limit - 1);
  return items || [];
}

function pseudonym(userId) {
  const tail = String(userId).slice(-4).toUpperCase();
  return `Игрок-${tail}`;
}

module.exports = {
  getState,
  consumeSpin,
  grantBonusSpin,
  grantPromoSpin,
  pushRecentWin,
  getRecentWins,
  pseudonym,
};
