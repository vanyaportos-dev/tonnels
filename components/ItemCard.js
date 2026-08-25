import { Icon } from './Icons';
import ItemArt from './ItemArt';

export default function ItemCard({ item, mode = 'display', onBuy }) {
  return (
    <div className="item-card">
      <ItemArt id={item.id} icon={item.icon} className="item-art" />
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
