const { createPromo } = require('../../../../lib/promo');

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'method_not_allowed' });
  }
  const password = req.headers['x-admin-password'];
  if (!process.env.ADMIN_PASSWORD || password !== process.env.ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'unauthorized' });
  }

  const { code, type, amount, maxUses } = req.body || {};
  try {
    const promo = await createPromo({ code, type, amount, maxUses });
    return res.status(201).json({ promo });
  } catch (e) {
    return res.status(400).json({ error: e.message });
  }
}
