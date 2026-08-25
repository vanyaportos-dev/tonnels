import { useEffect, useState, useCallback } from 'react';
import { Icon } from './Icons';
import ItemArt from './ItemArt';
import UsernameStep from './UsernameStep';
import { SECTORS } from '../lib/wheel';

const SECTOR_COLORS = [
  '#2c6fd6',
  '#3f83e6',
  '#55a8ff',
  '#8fd0ff',
  '#8a6a2c',
  '#7c6cf0',
  '#f0ce7a',
  '#3fbf83',
];

const SPIN_TURNS = 6;
const SPIN_MS = 4200;
const EVENT_END = Date.now() + 30 * 24 * 60 * 60 * 1000; // месяц от первого рендера

function angleForIndex(i) {
  return i * 45 + 22.5;
}

function conicBackground() {
  const stops = SECTORS.map((_, i) => {
    const from = i * 45;
    const to = from + 45;
    return `${SECTOR_COLORS[i]} ${from}deg ${to}deg`;
  });
  return `conic-gradient(from 0deg, ${stops.join(', ')})`;
}

function formatCountdown(ms) {
  if (ms <= 0) return '00д 00ч 00м';
  const totalMin = Math.floor(ms / 60000);
  const d = Math.floor(totalMin / (60 * 24));
  const h = Math.floor((totalMin % (60 * 24)) / 60);
  const m = totalMin % 60;
  return `${d}д ${h}ч ${m}м`;
}

export default function WheelPage({ userId, onBalanceChange, onRequestCreated }) {
  const [state, setState] = useState({ spinsLeft: 0, bonusUsed: 0, bonusCap: 3 });
  const [recent, setRecent] = useState([]);
  const [rotation, setRotation] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [reveal, setReveal] = useState(null); // { prize } после завершения анимации
  const [claimStep, setClaimStep] = useState(null); // null | 'username' | 'done'
  const [request, setRequest] = useState(null);
  const [error, setError] = useState('');
  const [promoCode, setPromoCode] = useState('');
  const [promoBusy, setPromoBusy] = useState(false);
  const [promoMsg, setPromoMsg] = useState('');
  const [now] = useState(EVENT_END);

  const loadStatus = useCallback(() => {
    fetch(`/api/wheel/status?userId=${encodeURIComponent(userId)}`)
      .then((r) => r.json())
      .then((data) => {
        setState({ spinsLeft: data.spinsLeft, bonusUsed: data.bonusUsed, bonusCap: data.bonusCap });
        setRecent(data.recent || []);
      })
      .catch(() => {});
  }, [userId]);

  useEffect(() => {
    loadStatus();
  }, [loadStatus]);

  async function handleSpin() {
    if (spinning || state.spinsLeft <= 0) return;
    setError('');
    setSpinning(true);
    setReveal(null);

    try {
      const res = await fetch('/api/wheel/spin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      });
      const data = await res.json();
      if (!res.ok) {
        setSpinning(false);
        setError('Не удалось крутить колесо. Попробуйте ещё раз.');
        return;
      }

      const idx = SECTORS.findIndex((s) => s.id === data.prize.id);
      const offset = (360 - angleForIndex(idx < 0 ? 0 : idx)) % 360;
      setRotation((prev) => {
        const base = prev - (prev % 360);
        return base + SPIN_TURNS * 360 + offset;
      });

      setTimeout(() => {
        setSpinning(false);
        setReveal(data.prize);
        setState(data.state);
        if (data.balance !== null && data.balance !== undefined) {
          onBalanceChange && onBalanceChange(data.balance);
        }
        loadStatus();
      }, SPIN_MS);
    } catch {
      setSpinning(false);
      setError('Не удалось крутить колесо. Попробуйте ещё раз.');
    }
  }

  async function handleClaimUsername(username) {
    const res = await fetch('/api/requests', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId,
        source: 'wheel',
        itemId: reveal.item.id,
        machagramUsername: username,
      }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'request_failed');
    setRequest(data.request);
    onRequestCreated && onRequestCreated();
    setClaimStep('done');
  }

  async function handlePromo() {
    if (!promoCode.trim()) return;
    setPromoBusy(true);
    setPromoMsg('');
    try {
      const res = await fetch('/api/promo/redeem', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, code: promoCode }),
      });
      const data = await res.json();
      if (!res.ok) {
        setPromoMsg(data.message || 'Не удалось применить промокод');
        return;
      }
      setPromoMsg('Промокод применён!');
      setPromoCode('');
      loadStatus();
      if (data.result?.balance !== null && data.result?.balance !== undefined) {
        onBalanceChange && onBalanceChange(data.result.balance);
      }
    } catch {
      setPromoMsg('Ошибка сети');
    } finally {
      setPromoBusy(false);
    }
  }

  return (
    <div className="wheel-page">
      <div className="wheel-header">
        <p className="wheel-eyebrow">
          <Icon name="sparkle" width={13} height={13} /> Колесо удачи
        </p>
        <p className="wheel-countdown">До окончания ивента: {formatCountdown(now - Date.now())}</p>
      </div>

      <div className="wheel-stage">
        <div className="wheel-pointer">
          <Icon name="chevronDown" width={20} height={20} />
        </div>
        <div
          className="wheel-disc"
          style={{
            background: conicBackground(),
            transform: `rotate(${rotation}deg)`,
            transitionDuration: spinning ? `${SPIN_MS}ms` : '0ms',
          }}
        >
          {SECTORS.map((s, i) => (
            <div
              key={s.id}
              className="wheel-sector-label"
              style={{ transform: `rotate(${angleForIndex(i)}deg) translateY(-108px)` }}
            >
              <span>{s.label}</span>
            </div>
          ))}
        </div>
        <div className="wheel-hub">
          <Icon name="seal" width={22} height={22} />
        </div>
      </div>

      <p className="wheel-spins-left">Бесплатных вращений: {state.spinsLeft}</p>

      <button className="btn-gold wheel-spin-btn" onClick={handleSpin} disabled={spinning || state.spinsLeft <= 0} type="button">
        <Icon name="sparkle" width={16} height={16} />
        {spinning ? 'Крутим…' : state.spinsLeft > 0 ? 'Крутить' : 'Вращений не осталось'}
      </button>
      {error && <p className="field-error" style={{ textAlign: 'center' }}>{error}</p>}

      <p className="wheel-bonus-note">
        Бонусных вращений сегодня: {state.bonusUsed}/{state.bonusCap} (выпадают на колесе)
      </p>

      <div className="wheel-promo-row">
        <input
          className="wheel-promo-input"
          placeholder="Промокод"
          value={promoCode}
          onChange={(e) => setPromoCode(e.target.value)}
        />
        <button className="btn-ghost" style={{ width: 'auto', padding: '13px 18px' }} onClick={handlePromo} disabled={promoBusy} type="button">
          Применить
        </button>
      </div>
      {promoMsg && <p className="field-hint" style={{ textAlign: 'center' }}>{promoMsg}</p>}

      <p className="drop-list-title">Последние выигрыши</p>
      <div className="drop-list">
        {recent.length === 0 && <p className="field-hint">Пока никто не выигрывал — будьте первым.</p>}
        {recent.map((r, i) => (
          <div className="drop-row" key={i}>
            <div className="drop-row-art" style={{ background: 'linear-gradient(150deg,#3a3a44,#17171d)' }}>
              <Icon name="star" width={16} height={16} color="#f0ce7a" />
            </div>
            <span className="drop-row-name">{r.name}</span>
            <span className="drop-row-highlight">{r.label}</span>
          </div>
        ))}
      </div>

      {reveal && (
        <div className="modal-overlay" onClick={() => !claimStep && setReveal(null)}>
          <div className="modal-sheet" onClick={(e) => e.stopPropagation()}>
            {!claimStep && (
              <div className="reveal-wrap">
                <p className="reveal-eyebrow">
                  {reveal.type === 'stars' ? 'Звёзды начислены' : reveal.type === 'spin' ? 'Бонус' : 'Поздравляем'}
                </p>

                {reveal.type === 'nft' && (
                  <div className="reveal-burst">
                    <ItemArt id={reveal.item.id} icon={reveal.item.icon} className="reveal-art" size="55%" />
                  </div>
                )}
                {reveal.type === 'stars' && (
                  <div className="reveal-burst">
                    <div className="reveal-art" style={{ background: 'linear-gradient(150deg,#f0ce7a,#8a6a2c)' }}>
                      <Icon name="star" color="#201703" />
                    </div>
                  </div>
                )}
                {reveal.type === 'spin' && (
                  <div className="reveal-burst">
                    <div className="reveal-art" style={{ background: 'linear-gradient(150deg,#3fbf83,#1f8358)' }}>
                      <Icon name="sparkle" color="#06170f" />
                    </div>
                  </div>
                )}

                <p className="reveal-name">
                  {reveal.type === 'nft' ? reveal.item.name : reveal.label}
                </p>

                {reveal.type === 'nft' ? (
                  <button className="btn-gold" onClick={() => setClaimStep('username')} type="button">
                    Забрать приз
                  </button>
                ) : (
                  <button className="btn-gold" onClick={() => setReveal(null)} type="button">
                    Отлично
                  </button>
                )}
              </div>
            )}

            {claimStep === 'username' && reveal.item && (
              <UsernameStep item={reveal.item} onSubmit={handleClaimUsername} />
            )}

            {claimStep === 'done' && request && (
              <div className="confirm-wrap">
                <div className="confirm-check">
                  <Icon name="check" />
                </div>
                <p className="confirm-title">Заявка на {request.itemName} создана</p>
                <p className="confirm-text">
                  Сделайте скриншот этого экрана и отправьте его в MachaGram <b>@lowday</b>.
                </p>
                <button
                  className="btn-gold"
                  onClick={() => {
                    setReveal(null);
                    setClaimStep(null);
                    setRequest(null);
                  }}
                  type="button"
                >
                  Готово
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
