import { useState } from 'react';
import { Icon } from './Icons';

const TABS = [
  { id: 'games', label: 'Игры', icon: 'gamepad' },
  { id: 'cases', label: 'Кейсы', icon: 'seal' },
  { id: 'market', label: 'Маркет', icon: 'shoppingBag' },
  { id: 'gifts', label: 'Подарки', icon: 'inbox' },
  { id: 'event', label: 'Ивент', icon: 'trophy', badge: 'NEW' },
];

export default function BottomNav({ active, onChange }) {
  const [avatarBroken, setAvatarBroken] = useState(false);

  return (
    <div className="bottom-nav-wrap">
      <nav className="bottom-nav">
        <div className="nav-track">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              className={`nav-item${active === tab.id ? ' active' : ''}`}
              onClick={() => onChange(tab.id)}
              type="button"
            >
              {tab.badge && <span className="badge-new">{tab.badge}</span>}
              <Icon name={tab.icon} width={19} height={19} />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
        <button
          className="nav-item nav-avatar-btn"
          onClick={() => onChange('profile')}
          type="button"
          aria-label="Профиль"
        >
          <span className="nav-avatar">
            {!avatarBroken ? (
              <img src="/image/avatar.png" alt="" onError={() => setAvatarBroken(true)} />
            ) : (
              'T'
            )}
          </span>
        </button>
      </nav>
    </div>
  );
}
