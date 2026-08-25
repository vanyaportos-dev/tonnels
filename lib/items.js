// Единый список NFT-подарков. `avatar` — путь к картинке из public/gifts,
// `weight` используется только для расчёта случайного приза в кейсе.

const BEAR = {
  id: 'toy-bear',
  name: 'Мишка',
  link: 'https://t.me/nft/ToyBear-7922',
  avatar: '/gifts/bear.png',
  weight: 70,
};

const NFT_ITEMS = [
  { id: 'candy-cane', name: 'Candy Cane', link: 'https://t.me/nft/CandyCane-184746', avatar: '/gifts/candy.png', weight: 2, price: 500 },
  { id: 'swag-bag', name: 'Swag Bag', link: 'https://t.me/nft/SwagBag-163615', avatar: '/gifts/swag.png', weight: 2, price: 500 },
  { id: 'lunar-snake', name: 'Lunar Snake', link: 'https://t.me/nft/LunarSnake-195315', avatar: '/gifts/lunar.png', weight: 2, price: 500 },
  { id: 'light-sword', name: 'Light Sword', link: 'https://t.me/nft/LightSword-111229', avatar: '/gifts/light.png', weight: 2, price: 500 },
  { id: 'input-key', name: 'Input Key', link: 'https://t.me/nft/InputKey-118678', avatar: '/gifts/input.png', weight: 2, price: 500 },
  { id: 'ufc-strike', name: 'UFC Strike', link: 'https://t.me/nft/UFCStrike-55554', avatar: '/gifts/ufc.png', weight: 2, price: 500 },
  { id: 'evil-eye', name: 'Evil Eye', link: 'https://t.me/nft/EvilEye-26969', avatar: '/gifts/evil.png', weight: 2, price: 500 },
  { id: 'spiced-wine', name: 'Spiced Wine', link: 'https://t.me/nft/SpicedWine-5839', avatar: '/gifts/spiced.png', weight: 2, price: 500 },
  { id: 'star-notepad', name: 'Star Notepad', link: 'https://t.me/nft/StarNotepad-72165', avatar: '/gifts/star.png', weight: 2, price: 500 },
  { id: 'crystal-ball', name: 'Crystal Ball', link: 'https://t.me/nft/CrystalBall-18772', avatar: '/gifts/crystal.png', weight: 2, price: 500 },
  { id: 'trapped-heart', name: 'Trapped Heart', link: 'https://t.me/nft/TrappedHeart-24833', avatar: '/gifts/trapped.png', weight: 2, price: 500 },
  { id: 'vintage-cigar', name: 'Vintage Cigar', link: 'https://t.me/nft/VintageCigar-7145', avatar: '/gifts/vintage.png', weight: 2, price: 500 },
  { id: 'swiss-watch', name: 'Swiss Watch', link: 'https://t.me/nft/SwissWatch-22512', avatar: '/gifts/swiss.png', weight: 2, price: 500 },
  { id: 'astral-shard', name: 'Astral Shard', link: 'https://t.me/nft/AstralShard-3592', avatar: '/gifts/astral.png', weight: 2, price: 500 },
  { id: 'scared-cat', name: 'Scared Cat', link: 'https://t.me/nft/ScaredCat-2243', avatar: '/gifts/scared.png', weight: 2, price: 500 },
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

module.exports = {
  BEAR,
  NFT_ITEMS,
  CASE_ITEMS,
  MARKET_ITEMS,
  pickCasePrize,
  findItemById
};
