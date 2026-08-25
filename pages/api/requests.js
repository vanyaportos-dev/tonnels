const { kvGet, kvSet, kvLPush, kvLRange } = require('../../lib/kv');
const { genId } = require('../../lib/id');
const { findItemById } = require('../../lib/items');

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { userId } = req.query;
    if (!userId) return res.status(400).json({ error: 'missing_userId' });

    const ids = await kvLRange(`requests:user:${userId}`, 0, -1);
    const items = await Promise.all((ids || []).map((id) => kvGet(`request:${id}`)));
    return res.status(200).json({ requests: items.filter(Boolean) });
  }

  if (req.method === 'POST') {
    const { userId, source, itemId, machagramUsername } = req.body || {};

    if (!userId || !source || !itemId || !machagramUsername) {
      return res.status(400).json({ error: 'missing_fields' });
    }
    if (!['case', 'market'].includes(source)) {
      return res.status(400).json({ error: 'invalid_source' });
    }
    const username = String(machagramUsername).trim().replace(/^@/, '');
    if (username.length < 2 || username.length > 40) {
      return res.status(400).json({ error: 'invalid_username' });
    }

    const item = findItemById(itemId);
    if (!item) return res.status(400).json({ error: 'invalid_item' });

    const id = genId('req');
    const now = Date.now();
    const request = {
      id,
      userId,
      source,
      itemId: item.id,
      itemName: item.name,
      itemLink: item.link,
      machagramUsername: username,
      status: 'pending', // pending -> processing -> done
      createdAt: now,
      updatedAt: now,
    };

    await kvSet(`request:${id}`, request);
    await kvLPush(`requests:user:${userId}`, id);
    await kvLPush('requests:all', id);

    return res.status(201).json({ request });
  }

  res.setHeader('Allow', 'GET, POST');
  return res.status(405).json({ error: 'method_not_allowed' });
}
