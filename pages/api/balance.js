const { getBalance } = require('../../lib/users');

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'method_not_allowed' });
  }

  const { userId } = req.query;
  if (!userId) return res.status(400).json({ error: 'missing_userId' });

  const balance = await getBalance(userId);
  return res.status(200).json({ balance });
}
