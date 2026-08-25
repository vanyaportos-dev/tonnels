const { itemsByTier } = require('./items');

// Секторы колеса. Проценты — стартовые, легко поменять здесь же.
// type: 'stars' — начисляется на баланс сразу; 'nft' — создаёт обычную
// заявку на выдачу (как в кейсе, через юзернейм MachaGram); 'spin' —
// даёт ещё одну бесплатную попытку (с ограничением в день, см. wheel API).
const SECTORS = [
  { id: 'stars-50', type: 'stars', amount: 50, weight: 25, label: '50 ⭐' },
  { id: 'stars-100', type: 'stars', amount: 100, weight: 20, label: '100 ⭐' },
  { id: 'stars-250', type: 'stars', amount: 250, weight: 15, label: '250 ⭐' },
  { id: 'stars-500', type: 'stars', amount: 500, weight: 7, label: '500 ⭐' },
  { id: 'nft-common', type: 'nft', tier: 'common', weight: 15, label: 'Обычный NFT' },
  { id: 'nft-rare', type: 'nft', tier: 'rare', weight: 5, label: 'Редкий NFT' },
  { id: 'nft-exclusive', type: 'nft', tier: 'exclusive', weight: 1, label: 'Эксклюзивный NFT' },
  { id: 'extra-spin', type: 'spin', weight: 12, label: 'Ещё вращение' },
];

function pickSector() {
  const total = SECTORS.reduce((sum, s) => sum + s.weight, 0);
  let roll = Math.random() * total;
  for (const sector of SECTORS) {
    if (roll < sector.weight) return sector;
    roll -= sector.weight;
  }
  return SECTORS[0];
}

// Для NFT-секторов результат — конкретный предмет нужного тира.
function resolveSectorPrize(sector) {
  if (sector.type !== 'nft') return sector;
  const pool = itemsByTier(sector.tier);
  const item = pool[Math.floor(Math.random() * pool.length)] || pool[0];
  return { ...sector, item };
}

module.exports = { SECTORS, pickSector, resolveSectorPrize };
