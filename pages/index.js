import Head from 'next/head';
import { useEffect, useState, useCallback } from 'react';
import { Icon } from '../components/Icons';
import BottomNav from '../components/BottomNav';
import ItemCard from '../components/ItemCard';
import MarketBuyModal from '../components/MarketBuyModal';
import RequestList from '../components/RequestList';
import CasesPage from '../components/CasesPage';
import WheelPage from '../components/WheelPage';
import LoadingScreen from '../components/LoadingScreen';
import { MARKET_ITEMS } from '../lib/items';
import { genId } from '../lib/id';

const UID_KEY = 'tonnel_uid';

export default function Home() {
  const [tab, setTab] = useState('cases');
  const [userId, setUserId] = useState(null);
  const [buyItem, setBuyItem] = useState(null);
  const [requests, setRequests] = useState([]);
  const [requestsLoading, setRequestsLoading] = useState(true);
  const [balance, setBalance] = useState(0);
  const [avatarBroken, setAvatarBroken] = useState(false);
  const [booting, setBooting] = useState(true);

  const [promoCode, setPromoCode] = useState('');
  const [promoBusy, setPromoBusy] = useState(false);
  const [promoMsg, setPromoMsg] = useState('');

  useEffect(() => {
    let uid = window.localStorage.getItem(UID_KEY);
    if (!uid) {
      uid = genId('u');
      window.localStorage.setItem(UID_KEY, uid);
    }
    setUserId(uid);

    fetch('/api/user/touch', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: uid }),
    })
      .then((r) => r.json())
      .then((data) => setBalance(data.balance || 0))
      .catch(() => {});

    const t = setTimeout(() => setBooting(false), 1500);
    return () => clearTimeout(t);
  }, []);

  const loadRequests = useCallback(() => {
    if (!userId) return;
    setRequestsLoading(true);
    fetch(`/api/requests?userId=${encodeURIComponent(userId)}`)
      .then((r) => r.json())
      .then((data) => setRequests(data.requests || []))
      .finally(() => setRequestsLoading(false));
  }, [userId]);

  useEffect(() => {
    if (userId) loadRequests();
  }, [userId, loadRequests]);

  async function handleRedeemPromo() {
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
      if (data.result?.balance !== null && data.result?.balance !== undefined) {
        setBalance(data.result.balance);
      }
    } catch {
      setPromoMsg('Ошибка сети');
    } finally {
      setPromoBusy(false);
    }
  }

  if (!userId) return null;

  return (
    <div className="app-backdrop">
      <Head>
        <title>Tonnel — Кейсы и Маркет</title>
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
      </Head>

      {booting && <LoadingScreen />}

      <div className="app-shell">
        <div className="app-scroll">
          <header className="topbar">
            <div className="brand">
              <span className="brand-mark">
                {!avatarBroken ? (
                  <img src="/image/favico.png" alt="" onError={() => setAvatarBroken(true)} />
                ) : (
                  <Icon name="seal" width={15} height={15} />
                )}
              </span>
              Tonnel
              <span className="verified-badge">
                <Icon name="verified" width={15} height={15} />
              </span>
            </div>
            <div className="balance-pill">
              <Icon name="star" width={13} height={13} />
              {balance}
            </div>
          </header>

          {tab === 'market' && (
            <div className="toolbar">
              <div className="search-field">
                <Icon name="search" width={16} height={16} />
                Быстрый поиск
              </div>
              <button className="icon-btn" type="button">
                <Icon name="filter" width={16} height={16} />
              </button>
              <button className="icon-btn" type="button">
                <Icon name="sort" width={16} height={16} />
              </button>
            </div>
          )}

          {tab === 'cases' && (
            <CasesPage userId={userId} onBalanceChange={setBalance} onRequestCreated={loadRequests} />
          )}

          {tab === 'market' && (
            <>
              <p className="section-label">Маркет</p>
              <div className="item-grid">
                {MARKET_ITEMS.map((item) => (
                  <ItemCard key={item.id} item={item} mode="market" onBuy={setBuyItem} />
                ))}
              </div>
            </>
          )}

          {tab === 'gifts' && (
            <>
              <p className="section-label">Мои заявки</p>
              {requestsLoading ? (
                <div className="empty-state">
                  <Icon name="clock" />
                  <p>Загружаем ваши заявки…</p>
                </div>
              ) : (
                <RequestList requests={requests} />
              )}
            </>
          )}

          {tab === 'games' && (
            <div className="soon-wrap">
              <Icon name="gamepad" />
              <h3>Игры скоро появятся</h3>
              <p>Мы готовим раздел с играми — следите за обновлениями.</p>
            </div>
          )}

          {tab === 'event' && (
            <WheelPage userId={userId} onBalanceChange={setBalance} onRequestCreated={loadRequests} />
          )}

          {tab === 'profile' && (
            <>
              <p className="section-label">Профиль</p>
              <div style={{ padding: '0 16px' }}>
                <div className="claim-summary" style={{ marginBottom: 16 }}>
                  <div
                    className="claim-summary-art"
                    style={{ background: 'linear-gradient(135deg,#9d90ff,#7c6cf0)' }}
                  >
                    <Icon name="user" color="#0a0a0d" />
                  </div>
                  <div>
                    <p className="claim-summary-title">Ваш ID</p>
                    <p className="claim-summary-sub" style={{ fontFamily: 'var(--font-mono)' }}>
                      {userId}
                    </p>
                  </div>
                </div>

                <span className="field-label">Промокод</span>
                <div className="field-input-row">
                  <input
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    placeholder="Введите промокод"
                  />
                </div>
                <button
                  className="btn-ghost"
                  style={{ marginBottom: 8 }}
                  onClick={handleRedeemPromo}
                  disabled={promoBusy}
                  type="button"
                >
                  {promoBusy ? 'Применяем…' : 'Активировать'}
                </button>
                {promoMsg && <p className="field-hint">{promoMsg}</p>}
              </div>
              <p className="section-label">История заявок</p>
              <RequestList requests={requests} />
            </>
          )}
        </div>

        <BottomNav active={tab} onChange={setTab} />
      </div>

      {buyItem && (
        <MarketBuyModal
          userId={userId}
          item={buyItem}
          onClose={() => setBuyItem(null)}
          onRequestCreated={loadRequests}
        />
      )}
    </div>
  );
}
