const { addBalance } = require('../../../lib/users');
const { pickSector, resolveSectorPrize } = require('../../../lib/wheel');
const {
  consumeSpin,
  grantBonusSpin,
  pushRecentWin,
  pseudonym,
} = require('../../../lib/wheelState');

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'method_not_allowed' });
  }
  const { userId } = req.body || {};
  if (!userId) return res.status(400).json({ error: 'missing_userId' });

  const afterConsume = await consumeSpin(userId);
  if (!afterConsume) {
    return res.status(409).json({ error: 'no_spins_left' });
  }

  const sector = pickSector();
  const prize = resolveSectorPrize(sector);

  let state = afterConsume;
  let balance = null;

  if (prize.type === 'stars') {
    balance = await addBalance(userId, prize.amount);
    await pushRecentWin({
      name: pseudonym(userId),
      label: prize.label,
      ts: Date.now(),
    });
  } else if (prize.type === 'nft') {
    await pushRecentWin({
      name: pseudonym(userId),
      label: `${prize.label}: ${prize.item.name}`,
      ts: Date.now(),
    });
  } else if (prize.type === 'spin') {
    state = await grantBonusSpin(userId);
  }

  return res.status(200).json({ prize, state, balance });
}
