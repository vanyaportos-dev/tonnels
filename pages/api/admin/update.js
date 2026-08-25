const { kvGet, kvSet } = require('../../../lib/kv');

const VALID_STATUSES = ['pending', 'processing', 'done'];

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'method_not_allowed' });
  }

  const password = req.headers['x-admin-password'];
  if (!process.env.ADMIN_PASSWORD || password !== process.env.ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'unauthorized' });
  }

  const { id, status } = req.body || {};
  if (!id || !VALID_STATUSES.includes(status)) {
    return res.status(400).json({ error: 'invalid_input' });
  }

  const existing = await kvGet(`request:${id}`);
  if (!existing) return res.status(404).json({ error: 'not_found' });

  const updated = { ...existing, status, updatedAt: Date.now() };
  await kvSet(`request:${id}`, updated);

  return res.status(200).json({ request: updated });
}
