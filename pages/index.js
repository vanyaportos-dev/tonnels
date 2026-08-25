import Head from 'next/head';
import { useEffect, useState, useCallback } from 'react';
import { Icon } from '../components/Icons';
import BottomNav from '../components/BottomNav';
import ItemCard from '../components/ItemCard';
import CaseModal from '../components/CaseModal';
import MarketBuyModal from '../components/MarketBuyModal';
import RequestList from '../components/RequestList';
import { CASE_ITEMS, MARKET_ITEMS } from '../lib/items';
import { genId } from '../lib/id';

const UID_KEY = 'tonnel_uid';

export default function Home() {
  const [tab, setTab] = useState('cases');
  const [userId, setUserId] = useState(null);
  const [caseOpen, setCaseOpen] = useState(false);
  const [buyItem, setBuyItem] = useState(null);
  const [requests, setRequests] = useState([]);
  const [requestsLoading, setRequestsLoading] = useState(true);

  useEffect(() => {
    let uid = window.localStorage.getItem(UID_KEY);
    if (!uid) {
      uid = genId('u');
      window.localStorage.setItem(UID_KEY, uid);
    }
    setUserId(uid);
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

  if (!userId) return null;

  return (
    <div className="app-backdrop">
      <Head>
        <title>Tonnel — Кейсы и Маркет</title>
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
      </Head>

      <div className="app-shell">
        <div className="app-scroll">
          <header className="topbar">
            <div className="brand">
              <span className="brand-mark">
                <Icon name="seal" width={15} height={15} />
              </span>
              Tonnel
            </div>
            <div className="balance-pill">
              <Icon name="star" width={13} height={13} />
              0
            </div>
          </header>

          <div className="top-tabs">
            <button
              className={`top-tab${tab === 'cases' ? ' active' : ''}`}
              onClick={() => setTab('cases')}
              type="button"
            >
              Кейсы
            </button>
            <button
              className={`top-tab${tab === 'market' ? ' active' : ''}`}
              onClick={() => setTab('market')}
              type="button"
            >
              Маркет
            </button>
            <button
              className={`top-tab${tab === 'gifts' ? ' active' : ''}`}
              onClick={() => setTab('gifts')}
              type="button"
            >
              Мои подарки
            </button>
          </div>

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

          {tab === 'cases' && (
            <>
              <button
                className="case-banner"
                onClick={() => setCaseOpen(true)}
                type="button"
              >
                <div className="case-banner-content">
                  <p className="case-banner-eyebrow">Каждые 24 часа · бесплатно</p>
                  <h2 className="case-banner-title">Кейсы</h2>
                  <p className="case-banner-sub">Откройте кейс и заберите NFT-подарок</p>
                </div>
                <span className="case-banner-seal">
                  <Icon name="seal" width={26} height={26} />
                </span>
              </button>

              <p className="section-label">Все подарки</p>
              <div className="item-grid">
                {CASE_ITEMS.map((item) => (
                  <ItemCard key={item.id} item={item} mode="display" />
                ))}
              </div>
            </>
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
            <div className="soon-wrap">
              <Icon name="trophy" />
              <h3>Ивент скоро стартует</h3>
              <p>Первое сезонное событие уже готовится.</p>
            </div>
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
              </div>
              <p className="section-label">История заявок</p>
              <RequestList requests={requests} />
            </>
          )}
        </div>

        <BottomNav active={tab} onChange={setTab} />
      </div>

      {caseOpen && (
        <CaseModal
          userId={userId}
          onClose={() => setCaseOpen(false)}
          onRequestCreated={loadRequests}
        />
      )}

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
