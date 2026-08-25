const { kvGet, kvSet, kvLPush, kvLRange } = require('./kv');
const { addBalance } = require('./users');
const { grantPromoSpin } = require('./wheelState');

const VALID_TYPES = ['stars', 'freeCase', 'freeWheel', 'freeBogach', 'freeDurov'];

function normalize(code) {
  return String(code || '').trim().toUpperCase();
}

async function createPromo({ code, type, amount, maxUses }) {
  const clean = normalize(code);
  if (!clean || clean.length < 3) throw new Error('invalid_code');
  if (!VALID_TYPES.includes(type)) throw new Error('invalid_type');

  const existing = await kvGet(`promo:${clean}`);
  if (existing) throw new Error('code_exists');

  const promo = {
    code: clean,
    type,
    amount: type === 'stars' ? Number(amount) || 0 : null,
    maxUses: maxUses ? Number(maxUses) : null,
    usedCount: 0,
    createdAt: Date.now(),
  };

  await kvSet(`promo:${clean}`, promo);
  await kvLPush('promo:index', clean);
  return promo;
}

async function listPromos() {
  const codes = await kvLRange('promo:index', 0, 200);
  const promos = await Promise.all((codes || []).map((c) => kvGet(`promo:${c}`)));
  return promos.filter(Boolean);
}

async function redeemPromo(userId, codeRaw) {
  const code = normalize(codeRaw);
  if (!code) throw new Error('invalid_code');

  const promo = await kvGet(`promo:${code}`);
  if (!promo) throw new Error('not_found');

  if (promo.maxUses && promo.usedCount >= promo.maxUses) {
    throw new Error('exhausted');
  }

  const usedKey = `promo:used:${code}:${userId}`;
  const alreadyUsed = await kvGet(usedKey);
  if (alreadyUsed) throw new Error('already_used');

  let resultBalance = null;
  if (promo.type === 'stars') {
    resultBalance = await addBalance(userId, promo.amount);
  } else if (promo.type === 'freeCase') {
    await kvSet(`case:last:${userId}`, 0);
  } else if (promo.type === 'freeWheel') {
    await grantPromoSpin(userId);
  }

  await kvSet(usedKey, true);
  promo.usedCount = (promo.usedCount || 0) + 1;
  await kvSet(`promo:${code}`, promo);

  return { type: promo.type, amount: promo.amount, balance: resultBalance };
}

// Вариант redeem для промокодов, жёстко привязанных к конкретному разделу
// (например, "промокод для набора Богач"). В отличие от redeemPromo,
// проверяет тип ДО того, как пометить код использованным — так код не
// сгорает впустую, если его случайно ввели не в том разделе.
async function redeemTypedPromo(userId, codeRaw, requiredType) {
  const code = normalize(codeRaw);
  if (!code) throw new Error('invalid_code');

  const promo = await kvGet(`promo:${code}`);
  if (!promo) throw new Error('not_found');
  if (promo.type !== requiredType) throw new Error('wrong_type');
  if (promo.maxUses && promo.usedCount >= promo.maxUses) throw new Error('exhausted');

  const usedKey = `promo:used:${code}:${userId}`;
  const alreadyUsed = await kvGet(usedKey);
  if (alreadyUsed) throw new Error('already_used');

  await kvSet(usedKey, true);
  promo.usedCount = (promo.usedCount || 0) + 1;
  await kvSet(`promo:${code}`, promo);

  return promo;
}

module.exports = { createPromo, listPromos, redeemPromo, redeemTypedPromo, VALID_TYPES };
