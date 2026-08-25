import { Icon } from './Icons';
import ItemArt from './ItemArt';

const STATUS_LABEL = {
  pending: 'Ожидает',
  processing: 'В обработке',
  done: 'Выдано',
};

function fmtDate(ts) {
  const d = new Date(ts);
  return d.toLocaleString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function RequestList({ requests }) {
  if (!requests.length) {
    return (
      <div className="empty-state">
        <Icon name="inbox" />
        <p>
          Здесь появятся ваши заявки на подарки — из бесплатного кейса
          или маркета.
        </p>
      </div>
    );
  }

  return (
    <div className="request-list">
      {requests.map((r) => (
        <div className="request-card" key={r.id}>
          <ItemArt id={r.itemId} icon={itemIcon(r.itemId)} className="request-art" size="55%" />
          <div className="request-body">
            <p className="request-title">{r.itemName}</p>
            <p className="request-sub">
              @{r.machagramUsername} · {fmtDate(r.createdAt)}
            </p>
          </div>
          <span className={`status-chip status-${r.status}`}>{STATUS_LABEL[r.status]}</span>
        </div>
      ))}
    </div>
  );
}

// itemId -> icon name сопоставление приезжает вместе с items.js, но чтобы не
// тянуть весь список сюда, дублируем маленькую карту по префиксу id.
function itemIcon(itemId) {
  const map = {
    'toy-bear': 'bear',
    'candy-cane': 'candy',
    'swag-bag': 'bag',
    'lunar-snake': 'snake',
    'light-sword': 'sword',
    'input-key': 'key',
    'ufc-strike': 'glove',
    'evil-eye': 'eye',
    'spiced-wine': 'wine',
    'star-notepad': 'notepad',
    'crystal-ball': 'orb',
    'trapped-heart': 'heart',
    'vintage-cigar': 'cigar',
    'swiss-watch': 'watch',
    'astral-shard': 'shard',
    'scared-cat': 'cat',
  };
  return map[itemId] || 'sparkle';
}
