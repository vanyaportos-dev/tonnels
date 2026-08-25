import { useState } from 'react';
import { Icon } from './Icons';
import UsernameStep from './UsernameStep';
import ConfirmStep from './ConfirmStep';

export default function MarketBuyModal({ userId, item, onClose, onRequestCreated }) {
  const [step, setStep] = useState('username'); // username | confirm
  const [request, setRequest] = useState(null);

  async function handleSubmit(username) {
    const res = await fetch('/api/requests', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId,
        source: 'market',
        itemId: item.id,
        machagramUsername: username,
      }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'request_failed');
    setRequest(data.request);
    onRequestCreated && onRequestCreated();
    setStep('confirm');
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-sheet" onClick={(e) => e.stopPropagation()}>
        <div className="modal-head">
          <h3 className="modal-title">
            {step === 'confirm' ? 'Заявка создана' : 'Оформление заявки'}
          </h3>
          <button className="modal-close" onClick={onClose} type="button" aria-label="Закрыть">
            <Icon name="x" width={16} height={16} />
          </button>
        </div>

        {step === 'username' && (
          <UsernameStep item={item} price={item.price} onSubmit={handleSubmit} />
        )}
        {step === 'confirm' && request && <ConfirmStep request={request} />}
      </div>
    </div>
  );
}
