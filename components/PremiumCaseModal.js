import { useState } from 'react';
import { Icon } from './Icons';
import ItemArt from './ItemArt';
import ConfirmStep from './ConfirmStep';

export default function PremiumCaseModal({ userId, tier, title, price, pool, onClose, onBalanceChange, onRequestCreated }) {
  const [step, setStep] = useState('pick'); // pick | username | confirm
  const [selected, setSelected] = useState(null);
  const [payMethod, setPayMethod] = useState('stars'); // stars | promo
  const [promoCode, setPromoCode] = useState('');
  const [username, setUsername] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [request, setRequest] = useState(null);

  async function handleConfirm() {
    if (!selected) return;
    const cleanUsername = username.trim().replace(/^@/, '');
    if (cleanUsername.length < 2) {
      setError('Введите юзернейм в MachaGram');
      return;
    }
    if (payMethod === 'promo' && !promoCode.trim()) {
      setError('Введите промокод');
      return;
    }

    setBusy(true);
    setError('');
    try {
      const res = await fetch('/api/premium/purchase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          tier,
          itemId: selected.id,
          machagramUsername: cleanUsername,
          payment: payMethod,
          promoCode: payMethod === 'promo' ? promoCode : undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message || 'Не удалось оформить покупку');
        setBusy(false);
        return;
      }
      setRequest(data.request);
      if (data.balance !== null && data.balance !== undefined) {
        onBalanceChange && onBalanceChange(data.balance);
      }
      onRequestCreated && onRequestCreated();
      setStep('confirm');
    } catch {
      setError('Ошибка сети. Попробуйте ещё раз.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-sheet" onClick={(e) => e.stopPropagation()}>
        <div className="modal-head">
          <h3 className="modal-title">{step === 'confirm' ? 'Заявка создана' : title}</h3>
          <button className="modal-close" onClick={onClose} type="button" aria-label="Закрыть">
            <Icon name="x" width={16} height={16} />
          </button>
        </div>

        {step === 'pick' && (
          <>
            <p className="field-hint" style={{ marginBottom: 14 }}>
              Выберите, какой предмет хотите получить из набора «{title}».
            </p>
            <div className="premium-pick-grid">
              {pool.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className={`premium-pick-tile${selected?.id === item.id ? ' selected' : ''}`}
                  onClick={() => setSelected(item)}
                >
                  <ItemArt id={item.id} icon={item.icon} className="premium-pick-art" size="55%" />
                  <span>{item.name}</span>
                  {selected?.id === item.id && (
                    <span className="premium-pick-check">
                      <Icon name="check" width={12} height={12} />
                    </span>
                  )}
                </button>
              ))}
            </div>

            <span className="field-label" style={{ marginTop: 18, display: 'block' }}>
              Ваш юзернейм в MachaGram
            </span>
            <div className="field-input-row">
              <span className="field-prefix">@</span>
              <input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="username" maxLength={40} />
            </div>

            <div className="pay-method-row">
              <button
                type="button"
                className={`pay-method-btn${payMethod === 'stars' ? ' active' : ''}`}
                onClick={() => setPayMethod('stars')}
              >
                <Icon name="star" width={14} height={14} />
                {price} ⭐
              </button>
              <button
                type="button"
                className={`pay-method-btn${payMethod === 'promo' ? ' active' : ''}`}
                onClick={() => setPayMethod('promo')}
              >
                Промокод
              </button>
            </div>

            {payMethod === 'promo' && (
              <div className="field-input-row" style={{ marginTop: 8 }}>
                <input
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  placeholder="Введите промокод"
                />
              </div>
            )}

            {error && <p className="field-error">{error}</p>}

            <button className="btn-gold" onClick={handleConfirm} disabled={!selected || busy} type="button">
              {busy ? 'Оформляем…' : payMethod === 'promo' ? 'Активировать промокод' : `Купить за ${price} ⭐`}
            </button>
          </>
        )}

        {step === 'confirm' && request && <ConfirmStep request={request} />}
      </div>
    </div>
  );
}
