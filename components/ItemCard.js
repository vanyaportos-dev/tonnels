import { Icon, itemGradient } from './Icons';

export default function ItemCard({ item, mode = 'display', onBuy }) {
  return (
    <div className="item-card">
      <div className="item-art" style={{ background: itemGradient(item.id) }}>
        <Icon name={item.icon} color="#f3f1ea" />
      </div>
      <p className="item-name">{item.name}</p>

      {mode === 'market' ? (
        <div className="item-footer">
          <button className="price-pill" type="button" onClick={() => onBuy(item)}>
            <Icon name="star" width={13} height={13} />
            {item.price}
          </button>
        </div>
      ) : null}
    </div>
  );
}
