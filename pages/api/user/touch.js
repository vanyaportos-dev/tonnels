const { registerUser, getBalance } = require('../../../lib/users');

// Вызывается один раз при заходе в приложение: регистрирует userId в общем
// реестре (чтобы админ мог начислить звёзды "всем") и возвращает баланс.
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'method_not_allowed' });
  }

  const { userId } = req.body || {};
  if (!userId) return res.status(400).json({ error: 'missing_userId' });

  await registerUser(userId);
  const balance = await getBalance(userId);

  return res.status(200).json({ balance });
}
