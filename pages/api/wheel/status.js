const { getState, getRecentWins } = require('../../../lib/wheelState');

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'method_not_allowed' });
  }
  const { userId } = req.query;
  if (!userId) return res.status(400).json({ error: 'missing_userId' });

  const state = await getState(userId);
  const recent = await getRecentWins(8);

  return res.status(200).json({ ...state, recent });
}
