const { listUserIds, addBalance } = require('../../../lib/users');

// Начисляет N звёзд каждому зарегистрированному пользователю.
// Это внутриигровые очки (см. README) — эндпоинт только прибавляет число
// в базе, никаких реальных платежей тут не происходит.
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'method_not_allowed' });
  }

  const password = req.headers['x-admin-password'];
  if (!process.env.ADMIN_PASSWORD || password !== process.env.ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'unauthorized' });
  }

  const amount = Number((req.body || {}).amount);
  if (!Number.isInteger(amount) || amount < 100 || amount > 500) {
    return res.status(400).json({ error: 'amount_out_of_range' });
  }

  const userIds = await listUserIds();
  await Promise.all(userIds.map((id) => addBalance(id, amount)));

  return res.status(200).json({ count: userIds.length, amount });
}
