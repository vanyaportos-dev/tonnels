const { kvGet } = require('../../../lib/kv');

const COOLDOWN_MS = 24 * 60 * 60 * 1000; // 24 часа

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'method_not_allowed' });
  }

  const { userId } = req.query;
  if (!userId) return res.status(400).json({ error: 'missing_userId' });

  const lastOpen = (await kvGet(`case:last:${userId}`)) || 0;
  const nextAvailableAt = Number(lastOpen) + COOLDOWN_MS;
  const available = Date.now() >= nextAvailableAt;

  return res.status(200).json({ available, nextAvailableAt });
}
