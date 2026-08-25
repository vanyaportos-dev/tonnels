const { redeemPromo } = require('../../../lib/promo');

const MESSAGES = {
  not_found: 'Такой промокод не найден',
  exhausted: 'У промокода закончились активации',
  already_used: 'Вы уже использовали этот промокод',
  invalid_code: 'Введите промокод',
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'method_not_allowed' });
  }
  const { userId, code } = req.body || {};
  if (!userId) return res.status(400).json({ error: 'missing_userId' });

  try {
    const result = await redeemPromo(userId, code);
    return res.status(200).json({ result });
  } catch (e) {
    const message = MESSAGES[e.message] || 'Не удалось применить промокод';
    return res.status(400).json({ error: e.message, message });
  }
}
