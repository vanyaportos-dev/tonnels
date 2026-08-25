import { useState } from 'react';
import { Icon, itemGradient } from './Icons';

// Пытается показать настоящую картинку подарка из /public/gifts/<id>.png.
// Если файла нет (или он ещё не загружен) — тихо откатывается на векторную
// иконку, ничего не ломая. Как только вы положите PNG/WebP с таким именем
// в public/gifts/, он подхватится сам, без правок кода.
export default function ItemArt({ id, icon, size = '44%', className = '', style = {} }) {
  const [broken, setBroken] = useState(false);

  return (
    <div
      className={className}
      style={{
        background: itemGradient(id),
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
        ...style,
      }}
    >
      {!broken ? (
        <img
          src={`/gifts/${id}.png`}
          alt=""
          onError={() => setBroken(true)}
          style={{ width: size, height: size, objectFit: 'contain', position: 'relative', zIndex: 1 }}
        />
      ) : (
        <Icon name={icon} color="#f3f1ea" width="44%" height="44%" style={{ position: 'relative', zIndex: 1 }} />
      )}
    </div>
  );
}
