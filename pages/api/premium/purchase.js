// "Богач" и "Павел Дуров" — это НЕ случайные кейсы за звёзды (см. README:
// такую механику — платёж за шанс получить случайный ценный приз — мы
// сознательно не делаем, это по сути лутбокс-гэмблинг). Здесь пользователь
// платит фиксированную цену и получает ровно тот предмет, который сам
// выбрал из набора — как обычная покупка в Маркете, просто с более дорогим
// эксклюзивным набором. Либо активирует один такой выбор промокодом.

const { getBalance, addBalance } = require('../../../lib/users');
const { redeemTypedPromo } = require('../../../lib/promo');
const { CASE_ITEMS, NFT_ITEMS } = require('../../../lib/items');
const { genId } = require('../../../lib/id');
const { kvSet, kvLPush } = require('../../../lib/kv');

const TIER_CONFIG = {
  bogach: { price: 500, pool: CASE_ITEMS, promoType: 'freeBogach' },
  durov: { price: 1000, pool: NFT_ITEMS, promoType: 'freeDurov' },
};

const MESSAGES = {
  not_found: 'Промокод не найден',
  wrong_type: 'Этот промокод не подходит для данного набора',
  exhausted: 'У промокода закончились активации',
  already_used: 'Вы уже использовали этот промокод',
  invalid_code: 'Введите промокод',
  insufficient_balance: 'Недостаточно звёзд на балансе',
  invalid_tier: 'Неизвестный набор',
  invalid_item: 'Такого предмета нет в этом наборе',
  missing_fields: 'Заполните все поля',
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'method_not_allowed' });
  }

  const { userId, tier, itemId, machagramUsername, payment, promoCode } = req.body || {};
  if (!userId || !tier || !itemId || !machagramUsername) {
    return res.status(400).json({ error: 'missing_fields', message: MESSAGES.missing_fields });
  }

  const config = TIER_CONFIG[tier];
  if (!config) return res.status(400).json({ error: 'invalid_tier', message: MESSAGES.invalid_tier });

  const item = config.pool.find((i) => i.id === itemId);
  if (!item) return res.status(400).json({ error: 'invalid_item', message: MESSAGES.invalid_item });

  const username = String(machagramUsername).trim().replace(/^@/, '');
  if (username.length < 2) {
    return res.status(400).json({ error: 'invalid_username', message: 'Введите юзернейм' });
  }

  if (payment === 'promo') {
    try {
      await redeemTypedPromo(userId, promoCode, config.promoType);
    } catch (e) {
      const message = MESSAGES[e.message] || 'Не удалось применить промокод';
      return res.status(400).json({ error: e.message, message });
    }
  } else {
    const balance = await getBalance(userId);
    if (balance < config.price) {
      return res.status(400).json({ error: 'insufficient_balance', message: MESSAGES.insufficient_balance });
    }
    await addBalance(userId, -config.price);
  }

  const id = genId('req');
  const now = Date.now();
  const request = {
    id,
    userId,
    source: `premium-${tier}`,
    itemId: item.id,
    itemName: item.name,
    itemLink: item.link,
    machagramUsername: username,
    status: 'pending',
    createdAt: now,
    updatedAt: now,
  };

  await kvSet(`request:${id}`, request);
  await kvLPush(`requests:user:${userId}`, id);
  await kvLPush('requests:all', id);

  const balance = await getBalance(userId);
  return res.status(201).json({ request, balance });
}
