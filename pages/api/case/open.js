const { kvGet, kvSet } = require('../../../lib/kv');
const { pickCasePrize } = require('../../../lib/items');

const COOLDOWN_MS = 24 * 60 * 60 * 1000; // 24 часа

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'method_not_allowed' });
  }

  const { userId } = req.body || {};
  if (!userId) return res.status(400).json({ error: 'missing_userId' });

  const lastOpen = (await kvGet(`case:last:${userId}`)) || 0;
  const nextAvailableAt = Number(lastOpen) + COOLDOWN_MS;

  if (Date.now() < nextAvailableAt) {
    return res.status(409).json({ error: 'on_cooldown', nextAvailableAt });
  }

  const prize = pickCasePrize();
  await kvSet(`case:last:${userId}`, Date.now());

  return res.status(200).json({
    item: { id: prize.id, name: prize.name, link: prize.link, icon: prize.icon },
    nextAvailableAt: Date.now() + COOLDOWN_MS,
  });
}
