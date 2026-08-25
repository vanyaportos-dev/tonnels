import { useState } from 'react';
import { Icon } from './Icons';
import CaseModal from './CaseModal';
import PremiumCaseModal from './PremiumCaseModal';
import { CASE_ITEMS, NFT_ITEMS } from '../lib/items';

const TILES = [
  {
    id: 'free',
    title: 'Бесплатный',
    desc: '1 открытие в сутки · случайный предмет',
    price: 'Бесплатно',
    art: 'seal',
    tone: 'gold',
  },
  {
    id: 'bogach',
    title: 'Богач',
    desc: 'Выберите любой предмет из полного набора',
    price: '500 ⭐',
    art: 'sparkle',
    tone: 'ice',
  },
  {
    id: 'durov',
    title: 'Павел Дуров',
    desc: 'Только эксклюзивные NFT, без Мишки',
    price: '1000 ⭐',
    art: 'trophy',
    tone: 'violet',
  },
];

export default function CasesPage({ userId, onBalanceChange, onRequestCreated }) {
  const [open, setOpen] = useState(null);

  return (
    <>
      <p className="section-label">Наборы</p>
      <div className="cases-grid">
        {TILES.map((t) => (
          <button key={t.id} className={`case-tile-btn tone-${t.tone}`} onClick={() => setOpen(t.id)} type="button">
            <span className="case-tile-btn-art">
              <Icon name={t.art} width={26} height={26} />
            </span>
            <span className="case-tile-btn-title">{t.title}</span>
            <span className="case-tile-btn-desc">{t.desc}</span>
            <span className="case-tile-btn-price">{t.price}</span>
          </button>
        ))}
      </div>

      {open === 'free' && (
        <CaseModal userId={userId} onClose={() => setOpen(null)} onRequestCreated={onRequestCreated} />
      )}

      {open === 'bogach' && (
        <PremiumCaseModal
          userId={userId}
          tier="bogach"
          title="Богач"
          price={500}
          pool={CASE_ITEMS}
          onClose={() => setOpen(null)}
          onBalanceChange={onBalanceChange}
          onRequestCreated={onRequestCreated}
        />
      )}

      {open === 'durov' && (
        <PremiumCaseModal
          userId={userId}
          tier="durov"
          title="Павел Дуров"
          price={1000}
          pool={NFT_ITEMS}
          onClose={() => setOpen(null)}
          onBalanceChange={onBalanceChange}
          onRequestCreated={onRequestCreated}
        />
      )}
    </>
  );
}
