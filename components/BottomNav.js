import { Icon } from './Icons';

const TABS = [
  { id: 'games', label: 'Игры', icon: 'gamepad' },
  { id: 'market', label: 'Маркет', icon: 'shoppingBag' },
  { id: 'gifts', label: 'Мои подарки', icon: 'inbox' },
  { id: 'event', label: 'Ивент', icon: 'trophy', badge: 'NEW' },
];

export default function BottomNav({ active, onChange }) {
  return (
    <div className="bottom-nav-wrap">
      <nav className="bottom-nav">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            className={`nav-item${active === tab.id ? ' active' : ''}`}
            onClick={() => onChange(tab.id)}
            type="button"
          >
            {tab.badge && <span className="badge-new">{tab.badge}</span>}
            <Icon name={tab.icon} width={20} height={20} />
            <span>{tab.label}</span>
          </button>
        ))}
        <button
          className="nav-item"
          onClick={() => onChange('profile')}
          type="button"
          aria-label="Профиль"
        >
          <span className="nav-avatar">T</span>
        </button>
      </nav>
    </div>
  );
}
