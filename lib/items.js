// Единый список NFT-подарков. `icon` — ключ иконки из components/Icons.js,
// `weight` используется только для расчёта случайного приза в кейсе и нигде
// не показывается пользователю (по ТЗ — без процентов в интерфейсе).

const BEAR = {
  id: 'toy-bear',
  name: 'Мишка',
  link: 'https://t.me/nft/ToyBear-7922',
  icon: 'bear',
  weight: 70,
};

const NFT_ITEMS = [
  { id: 'candy-cane', name: 'Candy Cane', link: 'https://t.me/nft/CandyCane-184746', icon: 'candy', weight: 2, price: 500 },
  { id: 'swag-bag', name: 'Swag Bag', link: 'https://t.me/nft/SwagBag-163615', icon: 'bag', weight: 2, price: 500 },
  { id: 'lunar-snake', name: 'Lunar Snake', link: 'https://t.me/nft/LunarSnake-195315', icon: 'snake', weight: 2, price: 500 },
  { id: 'light-sword', name: 'Light Sword', link: 'https://t.me/nft/LightSword-111229', icon: 'sword', weight: 2, price: 500 },
  { id: 'input-key', name: 'Input Key', link: 'https://t.me/nft/InputKey-118678', icon: 'key', weight: 2, price: 500 },
  { id: 'ufc-strike', name: 'UFC Strike', link: 'https://t.me/nft/UFCStrike-55554', icon: 'glove', weight: 2, price: 500 },
  { id: 'evil-eye', name: 'Evil Eye', link: 'https://t.me/nft/EvilEye-26969', icon: 'eye', weight: 2, price: 500 },
  { id: 'spiced-wine', name: 'Spiced Wine', link: 'https://t.me/nft/SpicedWine-5839', icon: 'wine', weight: 2, price: 500 },
  { id: 'star-notepad', name: 'Star Notepad', link: 'https://t.me/nft/StarNotepad-72165', icon: 'notepad', weight: 2, price: 500 },
  { id: 'crystal-ball', name: 'Crystal Ball', link: 'https://t.me/nft/CrystalBall-18772', icon: 'orb', weight: 2, price: 500 },
  { id: 'trapped-heart', name: 'Trapped Heart', link: 'https://t.me/nft/TrappedHeart-24833', icon: 'heart', weight: 2, price: 500 },
  { id: 'vintage-cigar', name: 'Vintage Cigar', link: 'https://t.me/nft/VintageCigar-7145', icon: 'cigar', weight: 2, price: 500 },
  { id: 'swiss-watch', name: 'Swiss Watch', link: 'https://t.me/nft/SwissWatch-22512', icon: 'watch', weight: 2, price: 500 },
  { id: 'astral-shard', name: 'Astral Shard', link: 'https://t.me/nft/AstralShard-3592', icon: 'shard', weight: 2, price: 500 },
  { id: 'scared-cat', name: 'Scared Cat', link: 'https://t.me/nft/ScaredCat-2243', icon: 'cat', weight: 2, price: 500 },
];

const CASE_ITEMS = [BEAR, ...NFT_ITEMS];
const MARKET_ITEMS = NFT_ITEMS;

function pickCasePrize() {
  const total = CASE_ITEMS.reduce((sum, it) => sum + it.weight, 0);
  let roll = Math.random() * total;
  for (const item of CASE_ITEMS) {
    if (roll < item.weight) return item;
    roll -= item.weight;
  }
  return CASE_ITEMS[0];
}

function findItemById(id) {
  return CASE_ITEMS.find((it) => it.id === id) || null;
}

module.exports = { BEAR, NFT_ITEMS, CASE_ITEMS, MARKET_ITEMS, pickCasePrize, findItemById };
