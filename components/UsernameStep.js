import { useState } from 'react';
import ItemArt from './ItemArt';

export default function UsernameStep({ item, price, onSubmit }) {
  const [value, setValue] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    const clean = value.trim().replace(/^@/, '');
    if (clean.length < 2) {
      setError('Введите корректный юзернейм');
      return;
    }
    setBusy(true);
    setError('');
    try {
      await onSubmit(clean);
    } catch {
      setError('Не получилось отправить заявку. Попробуйте ещё раз.');
      setBusy(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="claim-summary">
        <ItemArt id={item.id} icon={item.icon} className="claim-summary-art" size="55%" />
        <div>
          <p className="claim-summary-title">{item.name}</p>
          <p className="claim-summary-sub">
            {price ? `${price} ⭐ · будет отправлен вам лично` : 'Выигрыш из кейса'}
          </p>
        </div>
      </div>

      <span className="field-label">Ваш юзернейм в MachaGram</span>
      <div className={`field-input-row${error ? ' error' : ''}`}>
        <span className="field-prefix">@</span>
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="username"
          autoFocus
          maxLength={40}
        />
      </div>
      {error ? (
        <p className="field-error">{error}</p>
      ) : (
        <p className="field-hint">По этому юзернейму мы отправим вам подарок в MachaGram.</p>
      )}

      <button className="btn-gold" type="submit" disabled={busy}>
        {busy ? 'Отправляем…' : 'Подтвердить'}
      </button>
    </form>
  );
}
