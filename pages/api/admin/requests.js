const { kvGet, kvLRange } = require('../../../lib/kv');

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'method_not_allowed' });
  }

  const password = req.headers['x-admin-password'];
  if (!process.env.ADMIN_PASSWORD || password !== process.env.ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'unauthorized' });
  }

  const ids = await kvLRange('requests:all', 0, 500);
  const items = await Promise.all((ids || []).map((id) => kvGet(`request:${id}`)));

  return res.status(200).json({ requests: items.filter(Boolean) });
}
