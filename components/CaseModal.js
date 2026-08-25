import { useEffect, useState } from 'react';
import { Icon } from './Icons';
import ItemArt from './ItemArt';
import { CASE_ITEMS, BEAR } from '../lib/items';
import UsernameStep from './UsernameStep';
import ConfirmStep from './ConfirmStep';

function formatCountdown(ms) {
  if (ms <= 0) return '00:00:00';
  const total = Math.floor(ms / 1000);
  const h = String(Math.floor(total / 3600)).padStart(2, '0');
  const m = String(Math.floor((total % 3600) / 60)).padStart(2, '0');
  const s = String(total % 60).padStart(2, '0');
  return `${h}:${m}:${s}`;
}

export default function CaseModal({ userId, onClose, onRequestCreated }) {
  const [step, setStep] = useState('intro'); // intro | opening | reveal | username | confirm
  const [available, setAvailable] = useState(false);
  const [nextAt, setNextAt] = useState(0);
  const [now, setNow] = useState(Date.now());
  const [prize, setPrize] = useState(null);
  const [loading, setLoading] = useState(true);
  const [request, setRequest] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;
    fetch(`/api/case/status?userId=${encodeURIComponent(userId)}`)
      .then((r) => r.json())
      .then((data) => {
        if (!mounted) return;
        setAvailable(data.available);
        setNextAt(data.nextAvailableAt);
        setLoading(false);
      })
      .catch(() => setLoading(false));
    return () => {
      mounted = false;
    };
  }, [userId]);

  useEffect(() => {
    if (available) return undefined;
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, [available]);

  async function handleOpen() {
    setError('');
    setStep('opening');
    try {
      const res = await fetch('/api/case/open', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      });
      const data = await res.json();
      if (!res.ok) {
        setAvailable(false);
        setNextAt(data.nextAvailableAt || Date.now());
        setStep('intro');
        setError('Кейс уже открыт. Загляните позже.');
        return;
      }
      setPrize(data.item);
      setAvailable(false);
      setNextAt(data.nextAvailableAt);
      setTimeout(() => setStep('reveal'), 900);
    } catch {
      setStep('intro');
      setError('Не удалось открыть кейс. Попробуйте ещё раз.');
    }
  }

  async function handleUsernameSubmit(username) {
    const res = await fetch('/api/requests', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId,
        source: 'case',
        itemId: prize.id,
        machagramUsername: username,
      }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'request_failed');
    setRequest(data.request);
    onRequestCreated && onRequestCreated();
    setStep('confirm');
  }

  const remaining = formatCountdown(nextAt - now);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-sheet" onClick={(e) => e.stopPropagation()}>
        <div className="modal-head">
          <h3 className="modal-title">
            {step === 'confirm' ? 'Заявка создана' : step === 'username' ? 'Куда отправить приз' : 'Бесплатный кейс'}
          </h3>
          <button className="modal-close" onClick={onClose} type="button" aria-label="Закрыть">
            <Icon name="x" width={16} height={16} />
          </button>
        </div>

        {(step === 'intro' || step === 'opening') && (
          <>
            <div className="case-tile">
              <div className="case-tile-art">
                <Icon name="seal" />
              </div>
              <p className="case-tile-name">Бесплатный кейс</p>
              <p className="case-tile-note">
                Один бесплатный кейс каждые 24 часа. Внутри — коллекционные NFT-подарки из
                списка ниже.
              </p>

              {loading ? (
                <div className="cooldown-row">
                  <Icon name="clock" width={15} height={15} />
                  Загрузка…
                </div>
              ) : available || step === 'opening' ? (
                <button
                  className="btn-gold"
                  onClick={handleOpen}
                  disabled={step === 'opening'}
                  type="button"
                >
                  <Icon name="sparkle" width={16} height={16} />
                  {step === 'opening' ? 'Открываем…' : 'Открыть кейс'}
                </button>
              ) : (
                <>
                  <div className="cooldown-row">
                    <Icon name="clock" width={15} height={15} />
                    Следующий кейс через {remaining}
                  </div>
                  <button className="btn-gold" disabled type="button">
                    Уже открыт сегодня
                  </button>
                </>
              )}
              {error && <p className="field-error" style={{ margin: '10px 0 0' }}>{error}</p>}
            </div>

            <p className="drop-list-title">Что может выпасть</p>
            <div className="drop-list">
              {CASE_ITEMS.map((it) => (
                <div className="drop-row" key={it.id}>
                  <ItemArt id={it.id} icon={it.icon} className="drop-row-art" size="60%" />
                  <span className="drop-row-name">{it.name}</span>
                  {it.id === BEAR.id && <span className="drop-row-highlight">высокий шанс</span>}
                </div>
              ))}
            </div>
          </>
        )}

        {step === 'reveal' && prize && (
          <div className="reveal-wrap">
            <p className="reveal-eyebrow">Поздравляем</p>
            <div className="reveal-burst">
              <ItemArt id={prize.id} icon={prize.icon} className="reveal-art" size="55%" />
            </div>
            <p className="reveal-name">{prize.name}</p>
            <button className="btn-gold" onClick={() => setStep('username')} type="button">
              Забрать приз
            </button>
          </div>
        )}

        {step === 'username' && prize && (
          <UsernameStep item={prize} onSubmit={handleUsernameSubmit} />
        )}

        {step === 'confirm' && request && <ConfirmStep request={request} />}
      </div>
    </div>
  );
}
